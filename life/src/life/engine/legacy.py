import asyncio
import base64
import glob
import hashlib
import json
import os
import random
import re
import threading
import uuid
from contextvars import ContextVar
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta
from pathlib import Path

from .. import diary

from ..emotion import lexicon
from ..emotion.emotion import EmotionEngine, EmotionState
from ..circadian.circadian import CircadianSystem
from ..memory.memory import MemorySystem
from ..environment import EnvironmentSystem
from ..content import ContentSystem
from ..media import MediaPipeline, media_capability_block
from ..usage import UsageLedger
from .. import prompt as prompt_sections
from ..extensions import ExtensionRegistry
from ..think.think import ThinkStage, ThinkResult
from ..output.output import OutputStage
from ..tools.tools import RuntimeToolConfig, create_default_registry, PluginTool
from ..skills import get_skill_registry
from ..core_client import get_core_client
from ..companion import CompanionSystem
from ..adapters.platforms import AdapterRegistry, AdapterRuntime
from ..adapters.onebot import _cq_escape
from ..logging_setup import get_logger
from ..model_client import MocrClient
from ..soul import SoulState
from ..task_records import TaskRecorder, task_context
from ..config import LIFE_EVENTS as _LIFE_EVENTS
from ..timeutil import now_utc, parse_utc

_PLUGIN_ROOT = Path(__file__).resolve().parents[3]
_adapter_context = ContextVar("life_adapter_context", default=None)


def _plugin_path(name: str, fallback: str) -> str:
    candidate = _PLUGIN_ROOT / name
    return str(candidate) if candidate.is_dir() else fallback


def _coerce(value, default: float) -> float:
    return default if value is None else float(value)


def _load_json_object(text: str) -> dict:
    cleaned = str(text or "").strip()
    if cleaned.startswith("```"):
        cleaned = cleaned[3:]
        if cleaned[:4].lower() == "json":
            cleaned = cleaned[4:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()
    if not cleaned.startswith("{"):
        start, end = cleaned.find("{"), cleaned.rfind("}")
        if start != -1 and end > start:
            cleaned = cleaned[start:end + 1]
    return json.loads(cleaned)


try:
    from ..cognition import (
        AffectConfig,
        AffectSystem,
        CognitionConfig,
        CognitionEngine,
        LanguageConfig,
        LanguageSystem,
        PERSONA_JSON_CONTRACT,
        AttachmentSystem,
        attachment_type_for_persona,
        TsundereSystem,
        tsundere_type_for_persona,
        tsundere_initial_state_for_persona,
        PersonaDynamicsSystem,
        persona_dynamics_type_for_persona,
        persona_dynamics_gender_for_persona,
        persona_dynamics_initial_state_for_persona,
        character_options,
        character_spec,
        classify_character,
        classify_relationship,
        initial_state_for_persona,
        relationship_options,
        relationship_spec,
        PersonaTraits,
        RelatingSystem,
        relationship_attachment_type,
        relationship_is_pathological,
        SelfhoodConfig,
        SelfhoodSystem,
        SocialConfig,
        SocialSystem,
        context_factors,
        signals_from_message,
        merge_persona_llm_json,
        parse_persona,
        persona_summary,
        reward_from_signals,
        SomaticSymptomSystem,
        state_index,
    )
    _COGNITION_AVAILABLE = True
except Exception:  # pragma: no cover - cognition core is optional
    _COGNITION_AVAILABLE = False

from .resident import ResidentThinker

logger = get_logger("engine")

COMPACTION_HEADINGS = ("Objective", "Important Details", "Work State", "Next Move", "Relevant Files")
_HEADING_RE = re.compile(r"^\s{0,3}#{0,6}\s*([A-Za-z][A-Za-z /]*?)\s*:?\s*$")

ATTACHMENT_MARKER = re.compile(r"\n*<attachments>(.*?)</attachments>", re.S)
_IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp"}
_TEXT_EXTS = {
    ".txt", ".md", ".markdown", ".json", ".yaml", ".yml", ".toml", ".csv", ".tsv", ".log",
    ".py", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".vue", ".go", ".rs", ".java", ".kt",
    ".c", ".h", ".cc", ".cpp", ".hpp", ".cs", ".rb", ".php", ".sh", ".ps1", ".bat", ".cmd",
    ".html", ".htm", ".css", ".scss", ".xml", ".ini", ".cfg", ".conf", ".sql", ".env",
}
_TEXT_MIMES = {"application/json", "application/xml", "application/javascript", "application/x-yaml",
               "application/yaml", "application/toml", "application/x-sh", "application/sql"}


def _attachment_is_image(name: str, mime: str) -> bool:
    return mime.startswith("image/") or Path(name).suffix.lower() in _IMAGE_EXTS


def _attachment_is_text(name: str, mime: str) -> bool:
    if mime.startswith("text/") or mime in _TEXT_MIMES:
        return True
    return Path(name).suffix.lower() in _TEXT_EXTS


_VISION_ERROR_HINTS = ("image", "vision", "multimodal", "modality", "unsupported content",
                       "invalid content", "content type", "不支持", "图片")


def _looks_vision_error(error) -> bool:
    text = str(error).lower()
    return any(hint in text for hint in _VISION_ERROR_HINTS)


def _compaction_prompt(persona=None) -> str:
    label = str(persona.get("name") or "").strip() if isinstance(persona, dict) else ""
    persona_line = f"\n- 你正在为角色「{label}」维护这段对话的交接摘要。" if label else ""
    headings = "\n".join(f"## {heading}" for heading in COMPACTION_HEADINGS)
    return (
        "You maintain a structured handoff summary of an ongoing conversation so it can continue "
        "after the raw transcript is dropped. Rewrite it using EXACTLY these Markdown sections, in "
        f"this order, and keep every section:{persona_line}\n\n{headings}\n\n"
        "Rules:\n"
        "- Objective: the current goal and what done means.\n"
        "- Important Details: durable facts, decisions, constraints, file paths, IDs, environment quirks, "
        "and questions already answered. Never include secrets.\n"
        "- Work State: grouped as Completed / Active / Blocked. Report only observed results; never invent success.\n"
        "- Next Move: the concrete immediate next step(s).\n"
        "- Relevant Files: file_path:line references needed to continue.\n"
        "- If a section has nothing, write 无.\n"
        "- Carry the prior summary forward and never drop early facts.\n"
        "- Start directly with ## Objective: no preamble, and never restate these instructions.\n"
        "- Be terse and factual, no process narration. Write the content in the conversation's language (default Chinese)."
    )


def _normalize_compaction_summary(text: str) -> str:
    text = (text or "").strip()
    if not text:
        return text
    canonical = {heading.lower(): heading for heading in COMPACTION_HEADINGS}
    sections: dict[str, list[str]] = {}
    loose: list[str] = []
    current = None
    for line in text.splitlines():
        match = _HEADING_RE.match(line)
        heading = canonical.get(match.group(1).strip().lower()) if match else None
        if heading:
            current = heading
            sections.setdefault(heading, [])
            continue
        if current:
            sections[current].append(line)
        else:
            loose.append(line)
    if not sections:
        sections = {COMPACTION_HEADINGS[0]: text.splitlines()}
    elif any(line.strip() for line in loose):
        sections[COMPACTION_HEADINGS[0]] = loose + sections.get(COMPACTION_HEADINGS[0], [])
    blocks = []
    for heading in COMPACTION_HEADINGS:
        body = "\n".join(sections.get(heading, [])).strip() or "无"
        blocks.append(f"## {heading}\n{body}")
    return "\n\n".join(blocks)


@dataclass
class TurnContext:
    session_id: str
    user_id: str
    adapter_type: str
    persona_context: str
    history: list[dict] = field(default_factory=list)
    custom_prompt: str = ""
    config_id: str = "default"


def _adapter_session_id(data: dict) -> str:
    if data.get("group_id"):
        return f"qq_group_{data.get('group_id')}"
    return f"qq_{data.get('user_id')}"


class LifeEngine:
    MAX_SESSIONS = 200

    def __init__(self, data_dir=None, mocr_address=None):
        self.data_dir = data_dir or os.getenv("LIFE_DATA_DIR", "./data/life")
        self.emotion = EmotionEngine()
        self.circadian = CircadianSystem()
        self.soul = SoulState()
        self.memory = MemorySystem(f"{self.data_dir}/memory")
        self.companion = CompanionSystem(self.data_dir)
        self.environment = EnvironmentSystem(self.data_dir, settings_getter=self.companion.get_settings)
        self.content = ContentSystem(settings_getter=self.companion.get_settings)
        self.media = MediaPipeline(settings_getter=self.companion.get_settings)
        self.usage = UsageLedger(self.data_dir)
        self.model_routes: dict[str, str] = {}
        self.extensions = ExtensionRegistry()
        self._register_extensions()
        self.think = ThinkStage()
        self.output = OutputStage()
        self.mocr = MocrClient(mocr_address)
        self.task_records = TaskRecorder(self.data_dir)
        self.mocr.recorder = self.task_records
        self.think_model = os.getenv("LIFE_THINK_MODEL", "")
        self.output_model = os.getenv("LIFE_OUTPUT_MODEL", "")
        self.default_model = os.getenv("LIFE_DEFAULT_MODEL", "auto")
        self.core = get_core_client()
        self.online_agents = []
        self.online_agent_count = 0
        self.tool_config = RuntimeToolConfig()
        self.adapters = AdapterRegistry(self.data_dir)
        self.adapter_runtime = AdapterRuntime(self.adapters, self._on_adapter_event)
        self._inbound_bridges: dict = {}
        self._active_bot_self_id = None
        self._active_session_id = ""
        self._active_adapter_id = ""
        self._active_config_id = "default"
        self.tool_config.adapter_runtime = self.adapter_runtime
        self.tools = create_default_registry(core_client=self.core, config=self.tool_config, memory=self.memory,
                                             companion=self.companion, world_action=self._world_action)
        self._plugin_tool_names: set = set()
        self.tools.recorder = self.task_records
        self.tools.approver = self._approve_tool
        self.tools.approval_tools = {"getmail", "sendmail"}
        self._approvals: dict[str, dict] = {}
        self.skills = get_skill_registry()
        self.active_tasks = {}
        self.minecraft_cursor = 0
        self.minecraft_host = ""
        self._minecraft_learned_at = None
        self._notifications = []
        self._completed_tasks = []
        self._histories = {}
        self._last_persona_context = ""
        self._session_locks = {}
        self._dispatch_lock = asyncio.Lock()
        self._state_lock = threading.Lock()
        self._state_timer_lock = threading.Lock()
        self._state_timer = None
        self._state_dirty = False
        try:
            self._state_debounce = max(0.0, float(os.getenv("LIFE_STATE_DEBOUNCE", "2") or 2))
        except (TypeError, ValueError):
            self._state_debounce = 2.0
        self._affect_lock = threading.Lock()
        self._background_tasks = set()
        self._plugin_refresh_task: asyncio.Task | None = None
        self._reflection_limit = asyncio.Semaphore(2)
        self._last_plan = datetime.min
        self._last_dream_date = ""
        self._last_dream_key = ""
        self._last_replay_key = ""
        self._last_stabilize_key = ""
        self._last_agenda_date = ""
        self._last_review_date = ""
        self._last_shadow_date = ""
        self._last_interaction_at = ""
        self._state_path = Path(self.data_dir) / "state.json"
        if _COGNITION_AVAILABLE:
            self.cognition = CognitionEngine(self.data_dir)
            self.affect = AffectSystem()
            self.language = LanguageSystem()
            self.social = SocialSystem()
            self.selfhood = SelfhoodSystem()
            self.relating = RelatingSystem()
            self.attachment = AttachmentSystem()
            self.tsundere = TsundereSystem()
            self.personadyn = PersonaDynamicsSystem()
        else:
            self.cognition = self.affect = self.language = self.social = self.selfhood = None
            self.relating = None
            self.attachment = None
            self.tsundere = None
            self.personadyn = None
        self._persona_traits = None
        self._persona_digest = None
        self._persona_traits_override: dict = {}
        self._attachment_override: dict = {}
        self._cognition_enabled = True
        self._affect_modulates = True
        self._language_modulates = True
        self._social_modulates = True
        self._selfhood_modulates = True
        self._attachment_enabled = False
        self._attachment_restored_enabled = False
        self._tsundere_enabled = False
        self._tsundere_restored_enabled = False
        self._tsundere_override: dict = {}
        self._personadyn_enabled = False
        self._personadyn_restored_enabled = False
        self._personadyn_override: dict = {}
        self._memory_encode = False
        self._sleep_replay = False
        self._memory_reconsolidate = False
        self._cls_interleave = False
        self._last_affect_at = datetime.now()
        self._last_emotion_at = datetime.now()
        self._last_control: dict = {}
        self._last_context: dict = {}
        self._last_wave_context: str = ""
        self._last_self_statement: str = ""
        self._last_self_statement_at: "datetime | None" = None
        self._last_inner_thread: str = ""
        self._session_cognition: dict = {}
        self._awaiting_feedback: dict = {}
        self._feedback_stats: dict = {}
        self._last_event_date = ""
        self._worldsim = None
        self._load_state()
        self.resident = ResidentThinker(self)
        self._life_state = self._load_life_state()
        self.apply_cognition_settings()

    def _register_extensions(self) -> None:
        settings = self.companion.get_settings
        self.extensions.register("tts", probe=lambda: bool(os.getenv("TTS_ENDPOINT")), detail="TTS_ENDPOINT 未配置")
        self.extensions.register("image", probe=lambda: bool(os.getenv("IMAGE_ENDPOINT")), detail="IMAGE_ENDPOINT 未配置")
        self.extensions.register("comfyui", probe=lambda: bool(os.getenv("COMFYUI_URL")), detail="COMFYUI_URL 未配置")
        self.extensions.register("content", probe=lambda: str(settings().get("enable_content_fetch", "0")) == "1", detail="内容抓取未开启")
        self.extensions.register("vision", probe=lambda: bool(os.getenv("VISION_MODEL")), detail="视觉模型未配置")

    def extension_status(self) -> dict:
        return self.extensions.status()

    SWS_FRACTION = 0.6

    _COG_ENV = {
        "cog_enabled": "LIFE_COG_ENABLED",
        "cog_plan_depth": "LIFE_COG_PLAN_DEPTH",
        "cog_wm_capacity": "LIFE_COG_WM_CAPACITY",
        "cog_tau": "LIFE_COG_TAU",
        "cog_theta_pe": "LIFE_COG_THETA_PE",
        "cog_theta_n": "LIFE_COG_THETA_N",
        "cog_modulate_affect": "LIFE_COG_MODULATE_AFFECT",
        "cog_modulate_language": "LIFE_COG_MODULATE_LANGUAGE",
        "cog_modulate_social": "LIFE_COG_MODULATE_SOCIAL",
        "cog_modulate_selfhood": "LIFE_COG_MODULATE_SELFHOOD",
        "cog_affect_enabled": "LIFE_COG_AFFECT_ENABLED",
        "cog_affect_profile": "LIFE_COG_AFFECT_PROFILE",
        "cog_affect_somatic": "LIFE_COG_AFFECT_SOMATIC",
        "cog_affect_persona_llm": "LIFE_COG_AFFECT_PERSONA_LLM",
        "cog_language_enabled": "LIFE_COG_LANGUAGE_ENABLED",
        "cog_language_framing": "LIFE_COG_LANGUAGE_FRAMING",
        "cog_social_enabled": "LIFE_COG_SOCIAL_ENABLED",
        "cog_selfhood_enabled": "LIFE_COG_SELFHOOD_ENABLED",
        "cog_attachment_enabled": "LIFE_COG_ATTACHMENT",
        "cog_attachment_type": "LIFE_COG_ATTACHMENT_TYPE",
        "cog_tsundere_enabled": "LIFE_COG_TSUNDERE",
        "cog_tsundere_type": "LIFE_COG_TSUNDERE_TYPE",
        "cog_personadyn_enabled": "LIFE_COG_PERSONADYN",
        "cog_personadyn_type": "LIFE_COG_PERSONADYN_TYPE",
        "cog_personadyn_gender": "LIFE_COG_PERSONADYN_GENDER",
    }

    @staticmethod
    def _cog_bool(value, default: bool = True) -> bool:
        text = str(value).strip().lower()
        if text in ("1", "true", "yes", "on"):
            return True
        if text in ("0", "false", "no", "off"):
            return False
        return default

    @staticmethod
    def _cog_num(value, default: float) -> float:
        try:
            return float(value)
        except (TypeError, ValueError):
            return default

    def _cog_value(self, key: str, saved: dict) -> str:
        if key in saved:
            return str(saved[key])
        env_name = self._COG_ENV.get(key)
        if env_name:
            from_env = os.getenv(env_name)
            if from_env not in (None, ""):
                return str(from_env)
        return str(self.companion.SETTING_DEFAULTS.get(key, ""))

    def apply_cognition_settings(self, values: dict | None = None) -> dict:
        if self.cognition is None:
            return self.cognition_status()
        saved = self.companion.stored_settings() if values is None else dict(values or {})
        get = lambda key: self._cog_value(key, saved)  # noqa: E731 - local resolver

        self._cognition_enabled = self._cog_bool(get("cog_enabled"), True)
        self._lite_mode = self._cognition_enabled and self._cog_bool(get("cog_lite_mode"), False)
        self._affect_modulates = self._cognition_enabled and self._cog_bool(get("cog_modulate_affect"), True)
        self._language_modulates = self._cognition_enabled and self._cog_bool(get("cog_modulate_language"), True)
        self._social_modulates = self._cognition_enabled and self._cog_bool(get("cog_modulate_social"), True)
        self._selfhood_modulates = self._cognition_enabled and self._cog_bool(get("cog_modulate_selfhood"), True)

        self._memory_encode = self._cognition_enabled and self._cog_bool(get("cog_memory_encode"), True)
        self._sleep_replay = self._cognition_enabled and self._cog_bool(get("cog_sleep_replay"), True)
        self._memory_reconsolidate = self._cognition_enabled and self._cog_bool(get("cog_memory_reconsolidate"), True)
        self._cls_interleave = self._cognition_enabled and self._cog_bool(get("cog_cls_interleave"), True)

        config = CognitionConfig()
        config.plan_depth = int(self._cog_num(get("cog_plan_depth"), config.plan_depth))
        config.wm_capacity = int(self._cog_num(get("cog_wm_capacity"), config.wm_capacity))
        config.tau = self._cog_num(get("cog_tau"), config.tau)
        config.gamma = self._cog_num(get("cog_gamma"), config.gamma)
        config.alpha_habit = self._cog_num(get("cog_alpha_habit"), config.alpha_habit)
        config.alpha_mf = self._cog_num(get("cog_alpha_mf"), config.alpha_mf)
        config.theta_pe = self._cog_num(get("cog_theta_pe"), config.theta_pe)
        config.theta_n = self._cog_num(get("cog_theta_n"), config.theta_n)
        config.prospection_horizon = int(self._cog_num(get("cog_prospection_horizon"), config.prospection_horizon))
        for key, field_name in (("cog_use_cerebellum", "use_cerebellum"),
                                ("cog_use_thalamic_gate", "use_thalamic_gate"),
                                ("cog_use_ofc_map", "use_ofc_map"),
                                ("cog_use_prospection", "use_prospection"),
                                ("cog_use_limbic_bias", "use_limbic_bias")):
            setattr(config, field_name, self._cog_bool(get(key), True))
        config.use_interleaved_replay = self._cls_interleave
        config.use_consistency_gating = self._cls_interleave
        self.cognition.reconfigure(config)
        try:
            self.memory.set_engram_config(self.cognition.config)
        except Exception as _exc:
            logger.debug("suppressed error: %s", _exc)

        affect = AffectConfig()
        affect.enabled = self._cognition_enabled and self._cog_bool(get("cog_affect_enabled"), True)
        affect.erq_profile = get("cog_affect_profile") or affect.erq_profile
        affect.baseline_vagal = self._cog_num(get("cog_affect_vagal"), affect.baseline_vagal)
        affect.threat_baseline = self._cog_num(get("cog_affect_threat"), affect.threat_baseline)
        affect.reward_baseline = self._cog_num(get("cog_affect_reward"), affect.reward_baseline)
        somatic_on = self._cog_bool(get("cog_affect_somatic"), False)
        persona = None
        persona_text = str(get("persona_text") or "").strip()
        if persona_text:
            persona = parse_persona(persona_text)
            if persona.use_somatic:
                somatic_on = True
        self._persona_traits_override = self._json_setting(saved, "persona_traits_override")
        if self._persona_traits_override:
            persona = self._merge_persona_traits(persona or PersonaTraits(),
                                                 self._persona_traits_override)
            if persona.use_somatic:
                somatic_on = True
        affect.use_somatic = somatic_on
        self.affect.somatic.reset_traits()
        if persona is not None:
            persona.apply(affect, self.affect.somatic, self.circadian)
        self.affect.reconfigure(affect)
        self._persona_traits = persona
        self._persona_digest = None

        language = LanguageConfig()
        language.enabled = self._cognition_enabled and self._cog_bool(get("cog_language_enabled"), True)
        language.framing_mode = get("cog_language_framing") or language.framing_mode
        language.boundary_threshold = self._cog_num(get("cog_language_boundary"), language.boundary_threshold)
        self.language.reconfigure(language)

        social = SocialConfig()
        social.enabled = self._cognition_enabled and self._cog_bool(get("cog_social_enabled"), True)
        social.empathy_weight = self._cog_num(get("cog_social_empathy"), social.empathy_weight)
        social.perspective_stage = int(self._cog_num(get("cog_social_stage"), social.perspective_stage))
        self.social.reconfigure(social)

        selfhood = SelfhoodConfig()
        selfhood.enabled = self._cognition_enabled and self._cog_bool(get("cog_selfhood_enabled"), True)
        selfhood.discount_rate = self._cog_num(get("cog_selfhood_discount"), selfhood.discount_rate)
        selfhood.detail_scale = self._cog_num(get("cog_selfhood_detail"), selfhood.detail_scale)
        self.selfhood.reconfigure(selfhood)

        restored = bool(getattr(self, "_attachment_restored_enabled", False))
        self._attachment_restored_enabled = False
        explicit = ("cog_attachment_enabled" in (saved or {})) or bool(os.getenv("LIFE_COG_ATTACHMENT"))
        if explicit:
            attachment_enabled = self._cognition_enabled and self._cog_bool(get("cog_attachment_enabled"), False)
        else:
            attachment_enabled = self._cognition_enabled and restored
        attachment_type = str(get("cog_attachment_type") or "").strip()
        persona_type = self._persona_attachment_type(persona_text) if persona_text else ""
        if persona_type:
            attachment_enabled = self._cognition_enabled
            attachment_type = attachment_type or persona_type
        self._attachment_override = self._json_setting(saved, "attachment_override")
        if self._attachment_override.get("type"):
            attachment_enabled = self._cognition_enabled
            attachment_type = str(self._attachment_override["type"])
        self._attachment_enabled = attachment_enabled
        if self.attachment is not None:
            self.attachment.configure(enabled=attachment_enabled, type_key=attachment_type or "依存型")
            if isinstance(self._attachment_override.get("initial"), dict):
                self.attachment.seed_state(self._attachment_override["initial"])

        tsundere_restored = bool(getattr(self, "_tsundere_restored_enabled", False))
        self._tsundere_restored_enabled = False
        tsundere_explicit = (("cog_tsundere_enabled" in (saved or {}))
                             or bool(os.getenv("LIFE_COG_TSUNDERE")))
        if tsundere_explicit:
            tsundere_enabled = self._cognition_enabled and self._cog_bool(get("cog_tsundere_enabled"), False)
        else:
            tsundere_enabled = self._cognition_enabled and tsundere_restored
        tsundere_type = str(get("cog_tsundere_type") or "").strip()
        persona_tsundere = tsundere_type_for_persona(persona_text) if persona_text else ""
        if persona_tsundere:
            tsundere_enabled = self._cognition_enabled
            tsundere_type = tsundere_type or persona_tsundere
        self._tsundere_override = self._json_setting(saved, "tsundere_override")
        if self._tsundere_override.get("type"):
            tsundere_enabled = self._cognition_enabled
            tsundere_type = str(self._tsundere_override["type"])
        self._tsundere_enabled = tsundere_enabled
        if self.tsundere is not None:
            self.tsundere.configure(enabled=tsundere_enabled, type_key=tsundere_type or "经典傲娇")
            if isinstance(self._tsundere_override.get("initial"), dict):
                self.tsundere.seed_state(self._tsundere_override["initial"])

        pdy_restored = bool(getattr(self, "_personadyn_restored_enabled", False))
        self._personadyn_restored_enabled = False
        pdy_explicit = (("cog_personadyn_enabled" in (saved or {}))
                        or bool(os.getenv("LIFE_COG_PERSONADYN")))
        if pdy_explicit:
            pdy_enabled = self._cognition_enabled and self._cog_bool(get("cog_personadyn_enabled"), False)
        else:
            pdy_enabled = self._cognition_enabled and pdy_restored
        pdy_type = str(get("cog_personadyn_type") or "").strip()
        persona_pdy = persona_dynamics_type_for_persona(persona_text) if persona_text else ""
        if persona_pdy:
            pdy_enabled = self._cognition_enabled
            pdy_type = pdy_type or persona_pdy
        pdy_gender = str(get("cog_personadyn_gender") or "").strip()
        self._personadyn_override = self._json_setting(saved, "personadyn_override")
        if self._personadyn_override.get("type"):
            pdy_enabled = self._cognition_enabled
            pdy_type = str(self._personadyn_override["type"])
        if self._personadyn_override.get("gender"):
            pdy_gender = str(self._personadyn_override["gender"])
        self._personadyn_enabled = pdy_enabled
        if self.personadyn is not None:
            gkey = pdy_gender if pdy_gender and pdy_gender != "未指定" else ""
            if gkey:
                self.personadyn.configure(enabled=pdy_enabled, type_key=pdy_type or "正常/安全型",
                                          gender_key=gkey)
            else:
                self.personadyn.configure(enabled=pdy_enabled,
                                          type_key=pdy_type or "正常/安全型")
                self.personadyn.dynamics.gender_key = (
                    self.personadyn.dynamics.gender_key or "未指定")
            if isinstance(self._personadyn_override.get("initial"), dict):
                self.personadyn.seed_state(self._personadyn_override["initial"])
        return self.cognition_status()

    def cognition_status(self) -> dict:
        if self.cognition is None:
            return {"available": False, "enabled": False}
        return {
            "available": True,
            "enabled": self._cognition_enabled,
            "modulate": {"affect": self._affect_modulates, "language": self._language_modulates,
                         "social": self._social_modulates, "selfhood": self._selfhood_modulates},
            "last_control": dict(self._last_control),
            "wave1": self.cognition.stats(),
            "wave2": self.affect.context(),
            "wave3": self.language.context(),
            "wave4a": self.social.context(),
            "wave4b": self.selfhood.context(),
            "attachment": self.attachment.context() if self.attachment is not None else {"enabled": False},
            "tsundere": self.tsundere.context() if self.tsundere is not None else {"enabled": False},
            "personadyn": self.personadyn.context() if self.personadyn is not None else {"enabled": False},
            "persona": persona_summary(getattr(self, "_persona_traits", None)),
            "life": self.life_status(),
        }

    def _life_state_path(self) -> Path:
        return Path(self.data_dir) / "life_state.json"

    def _load_life_state(self) -> dict:
        try:
            data = json.loads(self._life_state_path().read_text(encoding="utf-8"))
            return data if isinstance(data, dict) else {}
        except (FileNotFoundError, ValueError, OSError):
            return {}

    def _save_life_state(self) -> None:
        try:
            path = self._life_state_path()
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(json.dumps(self._life_state, ensure_ascii=False), encoding="utf-8")
        except OSError as error:  # pragma: no cover - best effort
            logger.debug("life state save failed: %s", error)

    def life_is_alive(self) -> bool:
        return bool(self._life_state.get("alive"))

    def life_status(self) -> dict:
        resident = getattr(self, "resident", None)
        state = getattr(resident, "state", None)
        try:
            proactive = str(self.companion.get_settings().get("enable_proactive", "1")) == "1"
        except Exception:
            proactive = False
        return {
            "alive": self.life_is_alive(),
            "born_at": str(self._life_state.get("born_at") or ""),
            "last_started_at": str(self._life_state.get("last_started_at") or ""),
            "resident_running": bool(resident is not None and resident.running),
            "resident_enabled": bool(resident is not None and resident.enabled),
            "cognition_enabled": bool(getattr(self, "_cognition_enabled", False)),
            "proactive_enabled": proactive,
            "ticks": int(getattr(state, "ticks", 0) or 0),
            "last_thought": str(getattr(state, "last_thought", "") or ""),
            "focus": str(getattr(state, "focus", "") or ""),
            "active_goal": str(getattr(state, "active_goal", "") or ""),
            "last_tick": str(getattr(state, "last_tick", "") or ""),
            "scratchpad": list(getattr(state, "scratchpad", []) or [])[-5:],
        }

    async def start_life(self, greet: bool = False, session_id: str = "") -> dict:
        self.companion.set_settings({"cog_enabled": "1", "enable_proactive": "1", "enable_dream": "1"})
        self.apply_cognition_settings()
        now = datetime.now().isoformat()
        self._life_state["alive"] = True
        self._life_state["last_started_at"] = now
        if not self._life_state.get("born_at"):
            self._life_state["born_at"] = now
        self._save_life_state()
        resident = getattr(self, "resident", None)
        if resident is not None:
            resident.enabled = True
            try:
                resident.start()
            except Exception as error:  # pragma: no cover - defensive
                logger.warning("could not start resident thinker: %s", error)
            try:
                await resident.think_now()
            except Exception as error:
                logger.debug("first life thought failed: %s", error)
        greeting = ""
        if greet:
            greeting = await self._life_first_message(session_id)
        status = self.life_status()
        if greeting:
            status["greeting"] = greeting
        return status

    async def stop_life(self) -> dict:
        self._life_state["alive"] = False
        self._save_life_state()
        try:
            self.companion.set_settings({"enable_proactive": "0"})
        except Exception:
            pass
        resident = getattr(self, "resident", None)
        if resident is not None:
            await resident.stop()
        return self.life_status()

    async def _life_first_message(self, session_id: str = "") -> str:
        try:
            text = str(await self.generate_companion_text(
                "proactive", hint="你刚刚开始拥有自己的生活，第一次主动开口，向对方打个招呼") or "").strip().strip('"')
        except Exception as error:
            logger.debug("first life message failed: %s", error)
            text = ""
        if not text:
            resident = getattr(self, "resident", None)
            text = str(getattr(getattr(resident, "state", None), "last_thought", "") or "").strip()
        if text:
            try:
                await asyncio.to_thread(self.push_notification, session_id or "", text)
            except Exception as error:
                logger.debug("first life notification failed: %s", error)
        return text

    PERSONA_TRAIT_KEYS = ("description", "personality")

    def _persona_text(self, persona: dict | None) -> str:
        return " ".join(str((persona or {}).get(key) or "").strip()
                        for key in self.PERSONA_TRAIT_KEYS).strip()

    def _layer_persona_traits(self, traits) -> None:
        if traits.use_somatic:
            self.affect.config.use_somatic = True
        for name in ("threat_baseline", "reward_baseline", "baseline_vagal"):
            value = getattr(traits, name)
            if value is not None:
                setattr(self.affect.config, name, value)
        if traits.erq_profile:
            self.affect.config.erq_profile = traits.erq_profile
        self.affect.somatic.reset_traits()
        traits.apply(self.affect.config, self.affect.somatic, self.circadian)
        self._persona_traits = traits

    @staticmethod
    def _persona_attachment_type(text: str) -> str:
        rel = classify_relationship(text)
        if rel.get("pathological"):
            return relationship_attachment_type(rel["key"]) or attachment_type_for_persona(text)
        if rel.get("key"):
            return ""
        return attachment_type_for_persona(text)

    def _enable_attachment_from_persona(self, text: str) -> None:
        if self.attachment is None:
            return
        if self._attachment_override.get("type"):
            type_key = str(self._attachment_override["type"])
        else:
            type_key = self._persona_attachment_type(text)
        if not type_key:
            return
        self._attachment_enabled = self._cognition_enabled
        self.attachment.configure(enabled=self._cognition_enabled, type_key=type_key)
        if isinstance(self._attachment_override.get("initial"), dict):
            self.attachment.seed_state(self._attachment_override["initial"])
        else:
            self.attachment.seed_from_persona(text)

    def _persona_tsundere_type(self, text: str) -> str:
        return tsundere_type_for_persona(text)

    def _enable_tsundere_from_persona(self, text: str) -> None:
        if self.tsundere is None:
            return
        if self._tsundere_override.get("type"):
            type_key = str(self._tsundere_override["type"])
        else:
            type_key = self._persona_tsundere_type(text)
        if not type_key:
            return
        self._tsundere_enabled = self._cognition_enabled
        self.tsundere.configure(enabled=self._cognition_enabled, type_key=type_key)
        if isinstance(self._tsundere_override.get("initial"), dict):
            self.tsundere.seed_state(self._tsundere_override["initial"])
        else:
            self.tsundere.seed_from_persona(text)

    def _personadyn_type(self, text: str) -> str:
        return persona_dynamics_type_for_persona(text)

    def _personadyn_gender(self, text: str) -> str:
        return persona_dynamics_gender_for_persona(text)

    def _enable_personadyn_from_persona(self, text: str) -> None:
        if self.personadyn is None:
            return
        if self._personadyn_override.get("type"):
            type_key = str(self._personadyn_override["type"])
        else:
            type_key = self._personadyn_type(text)
        if not type_key:
            return
        if self._personadyn_override.get("gender"):
            gender_key = str(self._personadyn_override["gender"])
        else:
            gender_key = self._personadyn_gender(text) or "未指定"
        self._personadyn_enabled = self._cognition_enabled
        self.personadyn.configure(enabled=self._cognition_enabled, type_key=type_key,
                                  gender_key=gender_key)
        if isinstance(self._personadyn_override.get("initial"), dict):
            self.personadyn.seed_state(self._personadyn_override["initial"])
        else:
            self.personadyn.seed_from_persona(text)

    @staticmethod
    def _json_setting(saved, key: str) -> dict:
        raw = (saved or {}).get(key)
        if isinstance(raw, dict):
            return raw
        try:
            value = json.loads(raw or "{}")
        except (TypeError, ValueError):
            return {}
        return value if isinstance(value, dict) else {}

    @staticmethod
    def _merge_persona_traits(base, override: dict):
        if not override:
            return base
        merged = merge_persona_llm_json(base, json.dumps(override, ensure_ascii=False))
        if merged is None:
            return base
        merged.source = "override"
        return merged

    def _persona_llm_enabled(self) -> bool:
        return self._cog_bool(
            self._cog_value("cog_affect_persona_llm", self.companion.stored_settings()), True)

    def _persona_llm_cache_load(self) -> dict:
        cache = getattr(self, "_persona_llm_cache_data", None)
        if cache is None:
            path = Path(self.data_dir) / "persona_traits_cache.json"
            try:
                cache = json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}
            except Exception:
                cache = {}
            self._persona_llm_cache_data = cache
        return cache

    def _persona_llm_cache_store(self, digest: str, traits) -> None:
        cache = self._persona_llm_cache_load()
        cache[digest] = traits.to_dict()
        self._persona_llm_cache_data = cache
        try:
            target = Path(self.data_dir) / "persona_traits_cache.json"
            temporary = target.with_suffix(".json.tmp")
            temporary.write_text(json.dumps(cache, ensure_ascii=False, indent=1), encoding="utf-8")
            temporary.replace(target)
        except Exception as _exc:
            logger.debug("suppressed error: %s", _exc)

    async def _refine_persona_with_model(self, text: str, baseline):
        prompt = PERSONA_JSON_CONTRACT + text
        try:
            chunks = [chunk async for chunk in self.mocr.generate(
                self._model_for("reflect"), [{"role": "user", "content": prompt}],
                "你是人设特质解析器。严格只输出一个 JSON 对象，不要解释。",
                thinking=False, max_tokens=700)]
        except Exception as error:
            logger.info("persona LLM refinement unavailable: %s", error)
            return None
        return merge_persona_llm_json(baseline, "".join(chunks))

    async def apply_persona_object_async(self, persona: dict | None) -> dict:
        if self.cognition is None:
            return {"applied": False}
        text = self._persona_text(persona)
        digest = hashlib.sha256(text.encode("utf-8")).hexdigest() if text else ""
        if digest == getattr(self, "_persona_digest", None):
            return persona_summary(getattr(self, "_persona_traits", None))
        if not text:
            self.apply_cognition_settings()
            self._persona_digest = digest
            return persona_summary(getattr(self, "_persona_traits", None))
        self.apply_cognition_settings()
        traits = parse_persona(text)
        cached = self._persona_llm_cache_load().get(digest)
        if cached is not None:
            traits = PersonaTraits.from_dict(cached)
        elif self._persona_llm_enabled():
            refined = await self._refine_persona_with_model(text, traits)
            if refined is not None:
                traits = refined
                self._persona_llm_cache_store(digest, refined)
        if self._persona_traits_override:
            traits = self._merge_persona_traits(traits, self._persona_traits_override)
        self._layer_persona_traits(traits)
        self._enable_attachment_from_persona(text)
        self._enable_tsundere_from_persona(text)
        self._enable_personadyn_from_persona(text)
        self._persona_digest = digest
        return persona_summary(self._persona_traits)

    def apply_persona_object(self, persona: dict | None) -> dict:
        if self.cognition is None:
            return {"applied": False}
        text = self._persona_text(persona)
        digest = hashlib.sha256(text.encode("utf-8")).hexdigest() if text else ""
        if digest == getattr(self, "_persona_digest", None):
            return persona_summary(getattr(self, "_persona_traits", None))
        if not text:
            self.apply_cognition_settings()
            self._persona_digest = digest
            return persona_summary(getattr(self, "_persona_traits", None))
        self.apply_cognition_settings()
        traits = parse_persona(text)
        if self._persona_traits_override:
            traits = self._merge_persona_traits(traits, self._persona_traits_override)
        self._layer_persona_traits(traits)
        self._enable_attachment_from_persona(text)
        self._enable_tsundere_from_persona(text)
        self._enable_personadyn_from_persona(text)
        self._persona_digest = digest
        return persona_summary(getattr(self, "_persona_traits", None))

    async def persona_analyze(self, text: str, gender_hint: str = "") -> dict:
        text = str(text or "").strip()
        traits = parse_persona(text, gender_hint)
        source = "lexicon"
        if text and self._persona_llm_enabled():
            try:
                refined = await self._refine_persona_with_model(text, traits)
                if refined is not None:
                    traits, source = refined, "llm"
            except Exception as error:
                logger.debug("persona analyze llm failed: %s", error)
        character = classify_character(text)
        relationship = classify_relationship(text)
        char_key = traits.character or character.get("key", "")
        rel_key = traits.relationship or relationship.get("key", "")
        char_spec = character_spec(char_key) if char_key else {}
        rel_spec = relationship_spec(rel_key) if rel_key else {}
        if rel_key:
            att_type = relationship_attachment_type(rel_key)
        else:
            att_type = self._persona_attachment_type(text)
        tsun_type = self._persona_tsundere_type(text)
        pdy_type = self._personadyn_type(text)
        pdy_gender = self._personadyn_gender(text)
        return {
            "source": source,
            "gender": traits.gender or "",
            "traits": traits.to_dict(),
            "character": {"key": char_key,
                          "label": char_spec.get("label", character.get("label", "")),
                          "evidence": character.get("evidence", []),
                          "expression": traits.expression or ""},
            "relationship": {"key": rel_key,
                             "label": rel_spec.get("label", relationship.get("label", "")),
                             "family": rel_spec.get("family", relationship.get("family", "")),
                             "pathological": bool(rel_spec.get("pathological")),
                             "attachment_type": att_type,
                             "evidence": relationship.get("evidence", [])},
            "attachment": {"type": att_type,
                           "initial": initial_state_for_persona(text) if att_type else {}},
            "tsundere": {"type": tsun_type,
                         "initial": tsundere_initial_state_for_persona(text) if tsun_type else {}},
            "personadyn": {"type": pdy_type,
                           "gender": pdy_gender,
                           "initial": persona_dynamics_initial_state_for_persona(text) if pdy_type else {}},
            "options": {"character": character_options(),
                        "relationship": relationship_options()},
            "applied": traits.present,
        }

    def persona_apply(self, payload: dict) -> dict:
        payload = payload or {}
        attachment = payload.get("attachment") or {}
        tsundere = payload.get("tsundere") or {}
        personadyn = payload.get("personadyn") or {}
        settings = {
            "persona_text": str(payload.get("text") or ""),
            "persona_traits_override": json.dumps(payload.get("traits") or {}, ensure_ascii=False),
            "attachment_override": json.dumps(attachment, ensure_ascii=False),
            "tsundere_override": json.dumps(tsundere, ensure_ascii=False),
            "personadyn_override": json.dumps(personadyn, ensure_ascii=False),
        }
        if "attachment" in payload:
            if attachment.get("type"):
                settings["cog_attachment_enabled"] = "1"
                settings["cog_attachment_type"] = str(attachment["type"])
            else:
                settings["cog_attachment_enabled"] = "0"
        if "tsundere" in payload:
            if tsundere.get("type"):
                settings["cog_tsundere_enabled"] = "1"
                settings["cog_tsundere_type"] = str(tsundere["type"])
            else:
                settings["cog_tsundere_enabled"] = "0"
        if "personadyn" in payload:
            if personadyn.get("type"):
                settings["cog_personadyn_enabled"] = "1"
                settings["cog_personadyn_type"] = str(personadyn["type"])
                if personadyn.get("gender"):
                    settings["cog_personadyn_gender"] = str(personadyn["gender"])
            else:
                settings["cog_personadyn_enabled"] = "0"
        result = self.companion.set_settings(settings)
        self.apply_cognition_settings()
        return {"saved": True, "rejected": result.get("rejected", [])}

    def sync_agents(self):
        info = self.core.list_agents(include_unhealthy=False)
        self.online_agents = info.get("agents", [])
        self.online_agent_count = info.get("online_count", 0)
        return self.online_agent_count

    def _load_state(self):
        try:
            data = json.loads(self._state_path.read_text(encoding="utf-8"))
        except FileNotFoundError:
            return
        if "emotion" in data:
            self.emotion.state = EmotionState.from_dict(data["emotion"])
        self.circadian.restore(data.get("circadian", {}))
        self.soul.load(data.get("soul", {}))
        self._awaiting_feedback = data.get("awaiting_feedback", {}) or {}
        self._feedback_stats = data.get("feedback_stats", {}) or {}
        self._last_event_date = data.get("last_event_date", "")
        try:
            self.minecraft_cursor = int(data.get("minecraft_cursor", 0) or 0)
        except (TypeError, ValueError):
            self.minecraft_cursor = 0
        self.active_tasks = data.get("active_tasks", {})
        self._notifications = data.get("notifications", [])
        self._completed_tasks = data.get("completed_tasks", [])
        self._histories = data.get("histories", {})
        self._last_dream_date = data.get("last_dream_date", "")
        self._last_dream_key = data.get("last_dream_key", "")
        self._last_replay_key = data.get("last_replay_key", "")
        self._last_stabilize_key = data.get("last_stabilize_key", "")
        self._last_agenda_date = data.get("last_agenda_date", "")
        self._last_review_date = data.get("last_review_date", "")
        self._last_shadow_date = data.get("last_shadow_date", "")
        self._last_interaction_at = data.get("last_interaction_at", "")
        if self.affect is not None:
            for key, system, factory in (("affect", self.affect, AffectSystem),
                                         ("language", self.language, LanguageSystem),
                                         ("social", self.social, SocialSystem),
                                         ("selfhood", self.selfhood, SelfhoodSystem),
                                         ("relating", self.relating, RelatingSystem),
                                         ("attachment", self.attachment, AttachmentSystem),
                                         ("tsundere", self.tsundere, TsundereSystem),
                                         ("personadyn", self.personadyn, PersonaDynamicsSystem)):
                saved = data.get(key)
                if isinstance(saved, dict) and saved:
                    try:
                        setattr(self, key, factory.from_dict(saved))
                    except Exception as error:
                        logger.warning("could not restore cognition wave %s: %s", key, error)
            if self.attachment is not None:
                self._attachment_restored_enabled = bool(self.attachment.enabled)
            if self.tsundere is not None:
                self._tsundere_restored_enabled = bool(self.tsundere.enabled)
            if self.personadyn is not None:
                self._personadyn_restored_enabled = bool(self.personadyn.enabled)

    def _save_state(self):
        window = getattr(self, "_state_debounce", 0.0)
        if window <= 0:
            with self._state_lock:
                if not self._safe_save_locked():
                    logger.warning("state snapshot failed; kept dirty")
            return
        with self._state_timer_lock:
            self._state_dirty = True
            if self._state_timer is not None:
                return
            timer = threading.Timer(window, self._flush_state_timer)
            timer.daemon = True
            self._state_timer = timer
            timer.start()

    def _flush_state_timer(self):
        with self._state_timer_lock:
            self._state_timer = None
            dirty, self._state_dirty = self._state_dirty, False
        if dirty:
            with self._state_lock:
                ok = self._safe_save_locked()
            if not ok:
                self._save_state()

    def flush_state(self):
        with self._state_timer_lock:
            timer, self._state_timer = self._state_timer, None
            self._state_dirty = False
        if timer is not None:
            timer.cancel()
        with self._state_lock:
            self._safe_save_locked()

    def _safe_save_locked(self) -> bool:
        try:
            self._save_state_locked()
            return True
        except Exception as error:  # noqa: BLE001 - never lose state on a bad snapshot
            logger.warning("state snapshot failed: %s", error)
            with self._state_timer_lock:
                self._state_dirty = True
            return False

    def _save_state_locked(self):
        self._state_path.parent.mkdir(parents=True, exist_ok=True)
        temporary = self._state_path.with_suffix(".tmp")
        payload = {"emotion": self.emotion.state.to_dict(), "circadian": self.circadian.to_dict(),
            "soul": self.soul.to_dict(),
            "awaiting_feedback": self._awaiting_feedback, "feedback_stats": self._feedback_stats,
            "last_event_date": self._last_event_date,
            "minecraft_cursor": self.minecraft_cursor,
            "active_tasks": dict(self.active_tasks), "notifications": list(self._notifications),
            "completed_tasks": list(self._completed_tasks),
            "histories": {key: list(value) for key, value in list(self._histories.items())},
            "last_dream_date": self._last_dream_date,
            "last_dream_key": self._last_dream_key, "last_replay_key": self._last_replay_key,
            "last_stabilize_key": self._last_stabilize_key,
            "last_agenda_date": self._last_agenda_date,
            "last_review_date": self._last_review_date,
            "last_shadow_date": self._last_shadow_date,
            "last_interaction_at": self._last_interaction_at}
        for key, system in (("affect", self.affect), ("language", self.language),
                            ("social", self.social), ("selfhood", self.selfhood),
                            ("relating", self.relating), ("attachment", self.attachment),
                            ("tsundere", self.tsundere),
                            ("personadyn", self.personadyn)):
            if system is not None:
                try:
                    payload[key] = system.to_dict()
                except Exception as error:
                    logger.warning("could not persist cognition wave %s: %s", key, error)
        if self.cognition is not None:
            try:
                self.cognition.save()
            except Exception as error:
                logger.warning("could not persist cognition core: %s", error)
        temporary.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
        temporary.replace(self._state_path)

    @staticmethod
    def _persona(persona):
        parts = [f"{key}: {persona[key]}" for key in ("name", "birthDate", "description", "personality", "greeting") if persona.get(key)]
        try:
            birth = datetime.strptime(persona.get("birthDate", ""), "%Y-%m-%d").date()
            today = datetime.now().date()
            age = today.year-birth.year-((today.month,today.day)<(birth.month,birth.day))
            if age >= 0: parts.append(f"Current age: {age}")
        except ValueError:
            pass
        parts.append(f"Current local time: {datetime.now().astimezone().isoformat()}")
        return "\n".join(parts)

    @staticmethod
    def _parse_intensity(message):
        for intensity, words in (("max", ("最高强度", "全力", "maximum")), ("high", ("深度思考", "深入", "high")), ("low", ("快速", "轻量", "low"))):
            if any(word in message.lower() for word in words):
                return intensity
        return "medium"

    async def _ingest_attachments(self, message: str):
        match = ATTACHMENT_MARKER.search(message or "")
        if not match:
            return message, []
        cleaned = ATTACHMENT_MARKER.sub("", message or "").strip()
        try:
            items = json.loads(match.group(1))
        except ValueError:
            return cleaned, []
        if not isinstance(items, list):
            return cleaned, []
        parts = []
        for item in items[:10]:
            if not isinstance(item, dict):
                continue
            name = str(item.get("name") or "file")
            url = str(item.get("url") or "")
            mime = str(item.get("mime") or "")
            if not url:
                continue
            try:
                data = await self.mocr.fetch_file(url)
            except Exception as error:
                parts.append({"type": "text", "text": f"[附件 {name}] 无法读取：{error}"})
                continue
            if _attachment_is_image(name, mime):
                media = mime or "image/png"
                parts.append({"type": "image", "imageUrl": f"data:{media};base64,{base64.b64encode(data).decode()}", "mime": media})
            elif _attachment_is_text(name, mime) and len(data) <= 1_000_000:
                text = data.decode("utf-8", "replace")
                if len(text) > 20000:
                    text = text[:20000] + "\n…（内容过长已截断）"
                parts.append({"type": "text", "text": f"[文本附件 {name}]\n```\n{text}\n```"})
            else:
                parts.append({"type": "text", "text": f"[附件 {name}（{mime or '未知类型'}，{len(data)} 字节）] 二进制内容，无法直接查看。"})
        return cleaned, parts

    @staticmethod
    def _has_image_parts(messages) -> bool:
        return any(str(part.get("type")) == "image" for m in messages for part in (m.get("parts") or []))

    @staticmethod
    def _history_text_only(messages):
        out = []
        for m in messages:
            entry = {"role": m.get("role", "user"), "content": m.get("content", "")}
            parts = m.get("parts") or []
            if parts:
                extra = "\n".join(str(p.get("text") or "") for p in parts if str(p.get("type")) != "image")
                images = sum(1 for p in parts if str(p.get("type")) == "image")
                if images:
                    extra = (extra + f"\n[{images} 张图片已在思考阶段查看]").strip()
                entry["content"] = (entry["content"] + "\n" + extra).strip()
            out.append(entry)
        return out

    async def _think_generate(self, messages, system, usage_info=None):
        model_id = self._model_for("think")
        try:
            return "".join([chunk async for chunk in self.mocr.generate(model_id, messages, system, thinking=True, usage=usage_info)])
        except Exception as error:
            vision = self._model_for("vision")
            if vision and vision != model_id and self._has_image_parts(messages) and _looks_vision_error(error):
                await asyncio.to_thread(self.companion.audit, "vision_fallback", f"{model_id} -> {vision}: {error}", "", "failed")
                return "".join([chunk async for chunk in self.mocr.generate(vision, messages, system, thinking=True, usage=usage_info)])
            raise

    async def process_message(self, session_id, user_id, message, adapter_type="webui", persona=None, history=None):
        session_id = session_id or f"{adapter_type}:{user_id or 'default'}"
        sid_reply = self._session_id_probe(session_id, adapter_type, message)
        if sid_reply is not None:
            yield {"type": "chunk", "chunk": sid_reply, "done": True}
            return
        active_config_id = self._config_id_for_session(session_id)
        self._active_config_id = active_config_id
        message = self._strip_page_chrome(message)
        try:
            self.resident.notify_user_message(session_id, user_id, message)
        except Exception:
            pass
        await self.apply_persona_object_async(persona if isinstance(persona, dict) else None)
        lock = self._session_locks.get(session_id)
        if lock is None:
            lock = asyncio.Lock()
        self._session_locks.pop(session_id, None)
        self._session_locks[session_id] = lock
        async with lock:
            previous = list(self._histories.get(session_id, []))
            if history is not None:
                client_hist = [{"role": item["role"], "content": str(item["content"])[:16000]} for item in history[-21:]
                               if isinstance(item, dict) and item.get("role") in ("user", "assistant", "system") and item.get("content")]
                if len(client_hist) >= len(previous):
                    previous = client_hist
                else:
                    seen = {(item["role"], item["content"]) for item in previous}
                    for item in client_hist:
                        if (item["role"], item["content"]) not in seen:
                            previous.append(item)
                            seen.add((item["role"], item["content"]))
                if previous and previous[-1] == {"role": "user", "content": message}:
                    previous.pop()
            turn = TurnContext(session_id, user_id, adapter_type, self._persona(persona or {}), previous,
                               config_id=active_config_id)
            turn.custom_prompt = str((persona or {}).get("customPrompt") or "").strip()
            learned = await asyncio.to_thread(self.companion.persona_evolution_context)
            if learned:
                turn.persona_context += "\nStable learned traits:\n" + learned
            world = await asyncio.to_thread(self.companion.world_context)
            if world:
                turn.persona_context += "\nWorld & persona knowledge:\n" + world
            if adapter_type == "onebot_group":
                try:
                    message = await asyncio.to_thread(
                        self.companion.annotate_group_mentions, str(session_id).rsplit("_", 1)[-1], message)
                except Exception:
                    pass
            message, attachment_parts = await self._ingest_attachments(message)
            user_turn = {"role": "user", "content": message}
            if attachment_parts:
                user_turn["parts"] = [{"type": "text", "text": message}] + attachment_parts
            turn.history.append(user_turn)
            token = task_context.set({"session_id": session_id})
            record = await self.task_records.start("conversation", message)
            task_context.set({"session_id": session_id, "task_id": record["task_id"]})
            response = ""
            completed = False
            try:
                async for event in self._process_turn(turn, message):
                    if event.get("type") == "chunk":
                        response += event.get("chunk", "")
                    if event.get("done"):
                        await self.task_records.finish(record, response)
                        completed = True
                    yield event
            except (asyncio.CancelledError, GeneratorExit):
                if not completed:
                    await self.task_records.finish(record, response, cancelled=True)
                raise
            except Exception as error:
                await self.task_records.finish(record, response, str(error))
                raise
            finally:
                task_context.reset(token)

    def _interoceptive_fatigue(self) -> float:
        state = getattr(getattr(self, "circadian", None), "state", None)
        if state is None:
            return 0.0

        def _num(value, default: float) -> float:
            try:
                return float(value)
            except (TypeError, ValueError):
                return default

        energy = _num(getattr(state, "mental_energy", 100.0), 100.0)
        hunger = _num(getattr(state, "hunger", 0.0), 0.0)
        health = _num(getattr(state, "health", 100.0), 100.0)
        exhaustion = min(1.0, max(0.0, (100.0 - energy) / 100.0))
        starving = min(1.0, max(0.0, hunger / 100.0))
        unwell = min(1.0, max(0.0, (100.0 - health) / 100.0))
        return min(1.0, 0.6 * exhaustion + 0.25 * starving + 0.15 * unwell)

    def _tick_affect(self) -> None:
        if self.affect is None:
            return
        with self._affect_lock:
            moment = datetime.now()
            elapsed = max(0.0, (moment - self._last_affect_at).total_seconds())
            self._last_affect_at = moment
            self.affect.tick(elapsed, hour=moment.hour,
                             sleeping=bool(getattr(self.circadian.state, "is_sleeping", False)),
                             fatigue=self._interoceptive_fatigue())
            if self._attachment_enabled and self.attachment is not None:
                try:
                    friends = len(self.social.ties.friends(0.4)) if self.social is not None else 0
                    depression = {
                        "mood": float(getattr(self.affect.mood, "mood", 0.0) or 0.0),
                        "anhedonia": 1.0 - float(getattr(self.affect.reward, "availability", 1.0) or 1.0),
                        "load": float(getattr(self.affect.hpa, "allostatic_load", 0.0) or 0.0),
                        "rumination": float(getattr(self.affect.mood, "rumination", 0.0) or 0.0),
                    }
                    self.attachment.tick(
                        elapsed / 86400.0,
                        sleeping=bool(getattr(self.circadian.state, "is_sleeping", False)),
                        friends=friends, neglect_days=self.neglect_days(),
                        depression=depression)
                    distress = self.attachment.distress()
                    if distress > 0.5:
                        self.affect.observe_outcome(success=False, reward=-0.1,
                                                    stressor=0.2 * distress)
                except Exception as error:
                    logger.debug("attachment tick failed: %s", error)
            if self._tsundere_enabled and self.tsundere is not None:
                try:
                    friends = len(self.social.ties.friends(0.4)) if self.social is not None else 0
                    self.tsundere.tick(
                        elapsed / 86400.0,
                        neglect_days=self.neglect_days(), friends=friends,
                        sleeping=bool(getattr(self.circadian.state, "is_sleeping", False)),
                        mood=float(getattr(self.affect.mood, "mood", 0.0) or 0.0),
                        load=float(getattr(self.affect.hpa, "allostatic_load", 0.0) or 0.0))
                    tsundere_distress = self.tsundere.distress()
                    if tsundere_distress > 0.5:
                        self.affect.observe_outcome(success=False, reward=-0.1,
                                                    stressor=0.2 * tsundere_distress)
                except Exception as error:
                    logger.debug("tsundere tick failed: %s", error)
            if self._personadyn_enabled and self.personadyn is not None:
                try:
                    friends = len(self.social.ties.friends(0.4)) if self.social is not None else 0
                    self.personadyn.tick(
                        elapsed / 86400.0,
                        neglect_days=self.neglect_days(), friends=friends,
                        sleeping=bool(getattr(self.circadian.state, "is_sleeping", False)),
                        mood=float(getattr(self.affect.mood, "mood", 0.0) or 0.0),
                        load=float(getattr(self.affect.hpa, "allostatic_load", 0.0) or 0.0),
                        partner_trust=self._partner_trust_reading())
                    pdy_distress = self.personadyn.distress()
                    if pdy_distress > 0.5:
                        self.affect.observe_outcome(success=False, reward=-0.1,
                                                    stressor=0.2 * pdy_distress)
                except Exception as error:
                    logger.debug("persona dynamics tick failed: %s", error)

    def _partner_trust_reading(self) -> float:
        trust = 0.7
        try:
            if self.relating is not None:
                axes_by_user = getattr(self.relating, "partner_axes", None)
                if isinstance(axes_by_user, dict) and axes_by_user:
                    readings = [float(v.get("warmth", 0.5))
                                for v in axes_by_user.values() if isinstance(v, dict)]
                    if readings:
                        trust = sum(readings) / len(readings)
            if self.attachment is not None and getattr(self.attachment, "enabled", False):
                trust -= 0.4 * float(self.attachment.severity() or 0.0)
        except Exception:
            pass
        return 0.0 if trust < 0.0 else (1.0 if trust > 1.0 else trust)

    @staticmethod
    def _cognition_urgency(turn) -> float:
        base = {"请求": 0.62, "情绪": 0.52, "抱怨": 0.46, "提问": 0.40,
                "分享": 0.26, "闲聊": 0.15}.get(getattr(turn, "intent", ""), 0.3)
        if getattr(turn, "adapter_type", "") == "onebot_group":
            base = min(1.0, base + 0.08)
        return base

    def _cognition_context(self, message: str, turn, memory_context: str) -> dict:
        try:
            role = str(self.companion.user_role(getattr(turn, "user_id", "") or ""))
        except Exception:
            role = "other"
        return {"intent": getattr(turn, "intent", "") or "闲聊",
                "role": role if role in ("owner", "secondary") else "other",
                "urgency": self._cognition_urgency(turn),
                "memory_hits": 1 if (memory_context or "").strip() and "No relevant memories" not in memory_context else 0,
                "sleeping": bool(getattr(self.circadian.state, "is_sleeping", False)),
                "message": message}

    def _cognition_arbitrate(self, message: str, turn, memory_context: str, emotion_delta: dict) -> dict:
        self._last_control = {}
        if self.cognition is None or not self._cognition_enabled:
            self._last_wave_context = ""
            return {}
        self._tick_affect()
        self.affect.observe_message(message, intent=getattr(turn, "intent", ""), emotion_delta=emotion_delta)
        self.language.observe_text(message)
        self.selfhood.load.observe(min(1.0, len(message) / 600.0))
        self.social.prosocial.infer_state({
            "intent": getattr(turn, "intent", ""),
            "emotion": float(getattr(self.emotion.state, "valence", 0.0) or 0.0),
            "need": 0.6 if getattr(turn, "intent", "") in ("请求", "情绪", "抱怨") else 0.2})
        energy = float(getattr(self.circadian.state, "mental_energy", 100.0) or 0.0)
        load = 1.0 - float(getattr(self.selfhood.load, "capacity_factor", 1.0))
        context = self._cognition_context(message, turn, memory_context)
        outcome = self.cognition.control(
            context,
            fatigue=max(0.0, min(1.0, 1.0 - energy / 100.0)),
            load=max(0.0, min(1.0, load)),
            message=message,
            affect_need=float(self.affect.context().get("extra_need", 0.0) or 0.0))
        self.cognition.remember_decision(getattr(turn, "session_id", ""), outcome)
        self._last_context = context
        self._last_control = outcome.to_dict()
        self._session_cognition[getattr(turn, "session_id", "")] = {
            "context": context,
            "control": self._last_control,
            "valence": float(getattr(self.emotion.state, "valence", 0.0) or 0.0)}
        self._last_wave_context = self._render_wave_context()
        self._feed_cognition_subsystems(turn, message, emotion_delta)
        return self._last_control

    def _render_wave_context(self) -> str:
        if self.cognition is None or not self._cognition_enabled:
            return ""
        rendered = ThinkStage.cognition_context(
            affect=self.affect.context(),
            language=self.language.context(),
            social=self.social.context(),
            selfhood=self.selfhood.context(),
            modulate={"affect": self._affect_modulates,
                      "language": self._language_modulates,
                      "social": self._social_modulates,
                      "selfhood": self._selfhood_modulates})
        if self._attachment_enabled and self.attachment is not None:
            ctx = self.attachment.context()
            if ctx.get("prompt"):
                rendered += ("依恋基调（你此刻的真实状态，自然地表现出来，不要复述这些词）：\n- "
                             + str(ctx["prompt"]) + "\n\n")
        if self._tsundere_enabled and self.tsundere is not None:
            ctx = self.tsundere.context()
            if ctx.get("prompt"):
                rendered += ("傲娇底色（你此刻的真实状态，自然地表现出来，不要复述这些词）：\n- "
                             + str(ctx["prompt"]) + "\n\n")
        if self._personadyn_enabled and self.personadyn is not None:
            ctx = self.personadyn.context()
            if ctx.get("prompt"):
                rendered += ("人格动力学（你此刻的真实状态，自然地表现出来，不要复述这些词）：\n- "
                             + str(ctx["prompt"]) + "\n\n")
        return rendered

    def _feed_cognition_subsystems(self, turn, message: str, emotion_delta: dict) -> None:
        if self.cognition is None or not self._cognition_enabled:
            return
        if self.social is None or self.selfhood is None:
            return
        valence = float(getattr(self.emotion.state, "valence", 0.0) or 0.0)
        arousal = _coerce(getattr(self.emotion.state, "arousal", 0.5), 0.5)
        intent = getattr(turn, "intent", "") or "闲聊"

        try:
            self.selfhood.primacy.appraise(valence, max(0.0, min(1.0, arousal)))
        except Exception as error:  # pragma: no cover - defensive
            logger.debug("primacy appraise failed: %s", error)

        try:
            temporal = self.selfhood.temporal
            if temporal.total_turns <= 0:
                temporal.start_deadline(total_turns=1000)
            temporal.tick_deadline()
        except Exception as error:  # pragma: no cover - defensive
            logger.debug("temporal tick failed: %s", error)

        try:
            stance = _coerce(self.social.context().get("stance", 0.5), 0.5)
            for partner, tie in self.social.ties.friends(threshold=0.3):
                self.social.role_model.identify(partner, min(1.0, tie))
                self.social.role_model.observe(
                    partner, float(self.social.ties.ties.get(partner, stance)))
        except Exception as error:  # pragma: no cover - defensive
            logger.debug("role model feed failed: %s", error)

        try:
            hypothesis = {"请求": 0, "情绪": 1, "抱怨": 2, "提问": 3}.get(intent, 0)
            outcome = max(0.1, min(1.0, (valence + 1.0) / 2.0))
            self.social.learning.observe_experience(hypothesis, outcome)
        except Exception as error:  # pragma: no cover - defensive
            logger.debug("social learning feed failed: %s", error)

    def _feed_feedback_cognition(self, feedback: dict, reward: float) -> None:
        if self.cognition is None or not self._cognition_enabled:
            return
        if self.social is None or self.selfhood is None:
            return
        sentiment = float(feedback.get("sentiment", 0) or 0)
        try:
            if sentiment > 0:
                self.social.motivation.prefer("被理解", "被误解", strength=min(1.0, abs(sentiment)))
            elif sentiment < 0:
                self.social.motivation.blunt(0.05 * min(1.0, abs(sentiment)))
            self.selfhood.primacy.appraise(sentiment, 0.5)
            self.selfhood.meta.self_align(1)
            outcome = max(0.1, min(1.0, (sentiment + 1.0) / 2.0))
            self.social.learning.observe_experience(0, outcome)
        except Exception as error:  # pragma: no cover - defensive
            logger.debug("feedback cognition feed failed: %s", error)

    def _consolidate_cognition(self, neglect: float) -> None:
        if self.social is None or self.selfhood is None:
            return
        try:
            validated = float(self.social.context().get("validated", 0.0) or 0.0)
            self.social.role_model.adopt(group_fraction=validated, rate=0.15)
        except Exception as error:  # pragma: no cover - defensive
            logger.debug("role model adopt failed: %s", error)
        try:
            if self.social.perspective.effective_stage < 4:
                certainty = float(self.social.context().get("belief_certainty", 0.0) or 0.0)
                has_friends = len(self.social.ties.friends(0.5)) >= 1
                if has_friends and certainty > 0.55:
                    self.social.perspective.stage = min(4, self.social.perspective.stage + 1)
        except Exception as error:  # pragma: no cover - defensive
            logger.debug("perspective advance failed: %s", error)
        try:
            temporal = self.selfhood.temporal
            target_k = max(0.02, 0.1 - 0.01 * min(float(neglect), 8.0))
            temporal.k = max(0.0, float(temporal.k) + 0.1 * (target_k - float(temporal.k)))
        except Exception as error:  # pragma: no cover - defensive
            logger.debug("temporal recalibrate failed: %s", error)
        try:
            self.selfhood.meta.self_align(2)
        except Exception as error:  # pragma: no cover - defensive
            logger.debug("meta align failed: %s", error)

    def _maybe_author_self_statement(self) -> None:
        if self.cognition is None or not self._cognition_enabled:
            return
        if self._last_self_statement_at is not None:
            age = (datetime.now() - self._last_self_statement_at).total_seconds()
            if age < 20 * 60:
                return
        try:
            if len(self._background_tasks) >= 8:
                return
            task = asyncio.ensure_future(self._author_self_statement(reason="refresh"))
            self._background_tasks.add(task)
            task.add_done_callback(self._background_tasks.discard)
        except RuntimeError:
            pass

    async def _author_self_statement(self, *, reason: str = "tick") -> str:
        if self.cognition is None or not self._cognition_enabled:
            return ""
        affect = self.affect.context()
        language = self.language.context()
        social = self.social.context()
        selfhood = self.selfhood.context()
        friends = [str(f) for f in (social.get("friends") or []) if str(f).strip()][:3]
        top_words = [str(w) for w in (language.get("top_words") or []) if str(w).strip()][:5]
        prompt = (
            "用第一人称写一句你此刻最真实的状态（一个感受 / 念头 / 在意的事），"
            "口语、不超过40字，不要解释、不要列举、不要加引号。\n"
            f"身体 / 情绪基调：{str(affect.get('prompt') or '平静').strip()}\n"
            f"最近常说的词：{('、'.join(top_words) if top_words else '无明显习惯')}\n"
            f"熟悉的人：{('、'.join(friends) if friends else '暂无')}\n"
            f"自我：耐心 {_coerce(selfhood.get('patience', 0.5), 0.5):.2f}，"
            f"精力 {_coerce(selfhood.get('capacity_factor', 1.0), 1.0):.2f}，"
            f"身份锚定 {_coerce(selfhood.get('identity_anchor', 1.0), 1.0):.2f}\n"
            "只输出这一句话。"
        )
        try:
            text = "".join([chunk async for chunk in self.mocr.generate(
                self._model_for("reflect"), [{"role": "user", "content": prompt}],
                "你是这个角色，用第一人称写下一句此刻最真实的状态。", thinking=False, max_tokens=80)])
        except Exception as error:  # pragma: no cover - defensive
            logger.debug("self-statement authoring failed: %s", error)
            return ""
        text = str(text).strip().strip('"').strip()
        if len(text) < 2 or len(text) > 80:
            return ""
        try:
            await asyncio.to_thread(self.companion.record_self_statement, text, reason)
        except Exception as error:  # pragma: no cover - defensive
            logger.debug("self-statement persist failed: %s", error)
        self._last_self_statement = text
        self._last_self_statement_at = datetime.now()
        if self.selfhood is not None:
            try:
                self.selfhood.persona.add_detail("self_view", text[:40])
            except Exception as error:  # pragma: no cover - defensive
                logger.debug("persona self_view feed failed: %s", error)
        return text

    def _cognition_settle(self, session_id: str, turn, response: str, memory_context: str,
                          tool_success: float, tool_failure: float) -> None:
        if self.cognition is None or not self._cognition_enabled or not self._last_control:
            return
        entry = self._session_cognition.pop(session_id or "", None) or {}
        context = entry.get("context") or self._last_context
        control = entry.get("control") or self._last_control
        valence = float(getattr(self.emotion.state, "valence", 0.0) or 0.0)
        valence_delta = valence - float(entry.get("valence", valence))
        reward = reward_from_signals(
            valence_delta=valence_delta,
            task_success=tool_success, task_failure=tool_failure)
        learned = self.cognition.observe(session_id, context, context, reward, done=True)
        self.affect.observe_outcome(success=tool_failure == 0.0, reward=reward, stressor=tool_failure)
        self._encode_episode(turn, response, learned, reward, control)

    def _encode_episode(self, turn, response: str, learned: dict, reward: float,
                        control: dict | None = None) -> None:
        if not self._memory_encode:
            return
        text = (response or "").strip()
        if not text:
            return
        try:
            surprise = abs(float((learned or {}).get("cerebellar_pe", 0.0)))
            control = control if control is not None else self._last_control
            novelty = 1.0 - max(0.0, min(1.0, float((control or {}).get("confidence", 1.0) or 0.0)))
            self.memory.remember_episode(
                text[:280], prediction_error=surprise, novelty=novelty, strength=1.0,
                tags=["episode"], scope=f"session:{getattr(turn, 'session_id', '')}",
                metadata={"intent": getattr(turn, "intent", ""), "reward": round(float(reward), 4)})
        except Exception as error:
            logger.warning("could not encode episode: %s", error)

    def _prune_session_state(self) -> None:
        overflow = len(self._histories) - self.MAX_SESSIONS
        if overflow > 0:
            for stale in list(self._histories)[:overflow]:
                self._histories.pop(stale, None)
        overflow = len(self._session_locks) - self.MAX_SESSIONS
        if overflow > 0:
            for stale in list(self._session_locks)[:overflow]:
                lock = self._session_locks.get(stale)
                if lock is not None and not lock.locked():
                    self._session_locks.pop(stale, None)

    def _record_awaiting(self, turn, response: str, tool_success: float = 0.0, tool_failure: float = 0.0) -> None:
        session_id = turn.session_id or ""
        entry = self._session_cognition.pop(session_id, None) or {}
        if len(self._awaiting_feedback) >= 256:
            self._awaiting_feedback.pop(next(iter(self._awaiting_feedback)), None)
        self._awaiting_feedback[session_id] = {
            "context": entry.get("context") or self._last_context,
            "control": entry.get("control") or self._last_control,
            "valence": float(getattr(self.emotion.state, "valence", 0.0) or 0.0),
            "response": (response or "")[:280],
            "tool_success": float(tool_success),
            "tool_failure": float(tool_failure),
            "sent_at": datetime.now().isoformat(),
            "user_id": getattr(turn, "user_id", "") or "",
        }

    def _note_interaction(self) -> None:
        self._last_interaction_at = datetime.now().isoformat()

    def neglect_days(self) -> float:
        if not self._last_interaction_at:
            return 0.0
        stamp = parse_utc(self._last_interaction_at)
        if stamp is None:
            return 0.0
        delta = now_utc() - stamp
        return max(0.0, delta.total_seconds() / 86400.0)

    def _record_self_narrative(self, event: str, valence: float) -> None:
        if self.selfhood is None:
            return
        try:
            self.selfhood.narrative.add_memory(str(event)[:120], float(valence))
        except Exception as error:
            logger.debug("self narrative update failed: %s", error)

    def _sync_self_traits(self) -> None:
        if self.relating is None:
            return
        digest = getattr(self, "_persona_digest", None) or ""
        if digest and getattr(self, "_relating_self_digest", None) == digest:
            return
        traits = getattr(self, "_persona_traits", None)
        evidence = getattr(traits, "evidence", None) or {}
        try:
            axes_override = traits.axis_vector() if traits is not None else None
        except Exception:
            axes_override = None
        breadth = 0
        try:
            breadth = int(self.selfhood.persona.breadth) if self.selfhood is not None else 0
        except Exception:
            breadth = 0
        try:
            values = self.companion.get_values()
        except Exception:
            values = {}
        self.relating.traits.set_self(evidence=evidence, breadth=breadth, values=values,
                                      axes_override=axes_override)
        if self.social is not None:
            try:
                self.social.ties.describe("__self__", self.relating.traits.self_axes)
            except Exception:
                pass
        self._relating_self_digest = digest

    def _observe_partner(self, partner: str, feedback: dict, latency: float | None,
                         message: str = "", intent: str = "") -> None:
        partner = str(partner or "").strip()
        if self.social is None or not partner:
            return
        if not getattr(self.social.config, "enabled", False):
            return
        sentiment = float(feedback.get("sentiment", 0) or 0)
        quality = 0.5 + 0.5 * sentiment
        if latency is not None:
            quality *= 0.7 + 0.3 * max(0.0, 1.0 - min(1.0, latency / 3600.0))
        quality = max(0.0, min(1.0, quality))
        if self.relating is not None:
            try:
                self._sync_self_traits()
                signals = signals_from_message(message, sentiment=sentiment, latency=latency)
                axes = self.relating.traits.observe(partner, signals)
                if axes:
                    self.social.ties.describe(partner, axes)
                transition = self.relating.repair.observe(partner, sentiment, message, intent)
                if transition == "rupture_opened":
                    if self.relating.repair.is_misunderstanding(partner):
                        self._record_self_narrative(f"「{partner}」觉得我误会了 ta 的意思", -0.25)
                    else:
                        self._record_self_narrative(f"我和「{partner}」之间闹得不愉快", -0.3)
                elif transition == "repaired":
                    self._record_self_narrative(f"我和「{partner}」把话说开了", 0.35)
                    try:
                        self.affect.observe_outcome(success=True, reward=0.5, stressor=0.0)
                    except Exception:
                        pass
            except Exception as error:
                logger.debug("relating update failed: %s", error)
        try:
            self.social.ties.interact(partner, quality)
            self.social.ties.received_evaluation(partner, quality)
            if sentiment >= 1:
                self.social.ties.coach(partner, 0.5)
        except Exception as error:
            logger.debug("tie update failed: %s", error)

    def _receive_feedback(self, turn, message: str) -> None:
        session_id = turn.session_id or ""
        entry = self._awaiting_feedback.pop(session_id, None)
        if not entry or self.cognition is None or not self._cognition_enabled:
            return
        sent_at = parse_utc(entry.get("sent_at", ""))
        latency = None if sent_at is None else max(0.0, (now_utc() - sent_at).total_seconds())
        feedback = self._classify_feedback(message)
        reward = self._feedback_reward(entry, latency, feedback)
        self._observe_partner(entry.get("user_id", ""), feedback, latency, message,
                              str((entry.get("context") or {}).get("intent") or ""))
        if self._attachment_enabled and self.attachment is not None:
            try:
                self.attachment.observe_interaction(
                    valence=float(getattr(self.emotion.state, "valence", 0.0) or 0.0),
                    sentiment=float(feedback.get("sentiment", 0) or 0),
                    latency_seconds=float(latency or 0.0),
                    recalled=bool(feedback.get("recalled")),
                    mentions_other=self._mentions_other(message))
            except Exception as error:
                logger.debug("attachment observe failed: %s", error)
        if self._tsundere_enabled and self.tsundere is not None:
            try:
                self.tsundere.observe_interaction(
                    valence=float(getattr(self.emotion.state, "valence", 0.0) or 0.0),
                    sentiment=float(feedback.get("sentiment", 0) or 0),
                    latency_seconds=float(latency or 0.0),
                    recalled=bool(feedback.get("recalled")),
                    mentions_other=self._mentions_other(message))
            except Exception as error:
                logger.debug("tsundere observe failed: %s", error)
        if self._personadyn_enabled and self.personadyn is not None:
            try:
                self.personadyn.observe_interaction(
                    valence=float(getattr(self.emotion.state, "valence", 0.0) or 0.0),
                    sentiment=float(feedback.get("sentiment", 0) or 0),
                    latency_seconds=float(latency or 0.0),
                    recalled=bool(feedback.get("recalled")),
                    mentions_other=self._mentions_other(message),
                    partner_trust=self._partner_trust_reading())
            except Exception as error:
                logger.debug("persona dynamics observe failed: %s", error)
        if abs(int(feedback["sentiment"])) >= 1 or feedback["recalled"]:
            self._record_self_narrative(
                "有人对我说的话很不高兴" if feedback["sentiment"] < 0 else "有人很认真地谢过我",
                float(feedback["sentiment"]) * 0.4 + 0.1)
        context = entry.get("context") or self._last_context
        try:
            learned = self.cognition.observe(session_id, context, context, reward, done=True)
        except Exception as error:
            logger.warning("cognition feedback observe failed: %s", error)
            learned = {}
        try:
            if feedback["recalled"]:
                stressor = 1.0
            elif feedback["sentiment"] < 0:
                stressor = min(0.8, 0.25 + 0.15 * int(feedback.get("negative", 1) or 1))
            else:
                stressor = 0.0
            self.affect.observe_outcome(success=feedback["sentiment"] >= 0, reward=reward, stressor=stressor)
        except Exception as _exc:
            logger.debug("suppressed error: %s", _exc)
        try:
            somatic = self.affect.somatic
            if (self.affect.config.use_somatic and somatic.burden() > 0.3
                    and SomaticSymptomSystem.is_reassurance(message)):
                somatic.apply_reassurance()
        except Exception as _exc:
            logger.debug("suppressed error: %s", _exc)
        self._encode_episode(turn, entry.get("response", ""), learned, reward, entry.get("control"))
        self._feed_feedback_cognition(feedback, reward)
        self._update_feedback_stats(entry.get("user_id", ""), feedback, latency)

    @staticmethod
    def _classify_feedback(message: str) -> dict:
        text = str(message or "")
        hits = lexicon.scan(text)
        positive = hits["positive"] + hits["reassurance"]
        negative = hits["negative"] + hits["rejection"]
        recalled = any(marker in text for marker in ("撤回了一条消息", "[撤回]", "撤回了"))
        sentiment = 1 if positive > negative else -1 if negative > positive else 0
        return {"positive": positive, "negative": negative, "sentiment": sentiment,
                "rejection": hits["rejection"], "recalled": recalled, "length": len(text)}

    def _lite_think_prompt(self, turn, message: str) -> str:
        persona = (turn.persona_context or "").strip()
        emo = self.emotion.state.to_dict()
        return (
            "You are a real human character in this conversation. Reply in character.\n"
            f"Persona:\n{persona}\n"
            f"Current emotion: valence={emo.get('valence')}, arousal={emo.get('arousal')}, "
            f"connection={emo.get('connection')}, irritation={emo.get('irritation')}\n"
            f"User message: {message}\n"
            "Write your private inner voice in FIRST PERSON (never narrate the user in "
            "third person). You may refuse or push back; you need not be agreeable. "
            "When you speak, output ONLY what you say aloud — no parenthetical action "
            "beats, no （…）, no *…*.\n"
            'Output ONLY JSON: {"character_intent": "<one first-person line>", '
            '"output_guidance": "<how to say it>", '
            '"emotion_delta": {"valence": 0.0, "arousal": 0.0, "connection": 0.0, "irritation": 0.0}}'
        )

    @staticmethod
    def _strip_page_chrome(message: str) -> str:
        text = str(message or "")
        if "0kay" not in text:
            return text
        lines = text.split("\n")
        chrome = {"0kay", "对话", "简体中文", "Agent", "记忆", "陪伴", "技能",
                  "插件", "插件市场", "用量", "设置", "角色状态",
                  "patch", "年龄", "时间", "时区", "心情", "情绪",
                  "愉悦度", "唤醒度", "亲近感", "烦躁度"}

        def _is_chrome_token(token: str) -> bool:
            if not token or token in chrome or token.isdigit():
                return True
            if token.endswith("岁") or "岁" in token:
                return True
            stripped = token.replace("/", "").replace(":", "").replace("-", "").replace(" ", "")
            if stripped.isdigit() and len(stripped) >= 6:
                return True
            if token in ("Asia/Shanghai", "Asia/Tokyo", "UTC"):
                return True
            return False

        first_user = None
        for index, line in enumerate(lines):
            token = line.strip()
            if _is_chrome_token(token):
                continue
            first_user = index
            break
        if first_user is None:
            return text
        while first_user < len(lines):
            token = lines[first_user].strip()
            if _is_chrome_token(token):
                first_user += 1
                continue
            nxt = lines[first_user + 1].strip() if first_user + 1 < len(lines) else ""
            if token and len(token) <= 4 and not token.isascii() and nxt and _is_chrome_token(nxt):
                first_user += 1
                continue
            break
        head = [l.strip() for l in lines[:first_user] if l.strip()]
        if "0kay" in head and len(head) >= 2 and first_user < len(lines) and lines[first_user].strip():
            return "\n".join(lines[first_user:]).strip()
        return text

    @staticmethod
    def _mentions_other(message: str) -> bool:
        text = str(message or "")
        return any(word in text for word in
                   ("他", "她", "别人", "朋友", "同事", "同学", "有人", "群里", "那个"))

    @staticmethod
    def _feedback_reward(entry: dict, latency: float | None, feedback: dict) -> float:
        latency_score = 0.5 if latency is None else max(0.0, min(1.0, 1.0 - latency / 3600.0))
        length_score = max(0.0, min(1.0, feedback["length"] / 80.0))
        engagement = max(0.0, min(1.0, 0.45 * latency_score + 0.25 * length_score
                                   + 0.30 * ((feedback["sentiment"] + 1) / 2.0)))
        friction = 1.0 if feedback["recalled"] else 0.0
        return reward_from_signals(
            task_success=max(0.0, min(1.0, float(entry.get("tool_success", 0.0)))),
            task_failure=float(entry.get("tool_failure", 0.0)) + friction,
            user_engagement=engagement, friction=friction)

    def _update_feedback_stats(self, user_id: str, feedback: dict, latency: float | None) -> None:
        if not user_id:
            return
        stats = self._feedback_stats.setdefault(user_id, {})
        last = parse_utc(stats.get("last_decay", ""))
        factor = 1.0 if last is None else 0.5 ** (max(0.0, (now_utc() - last).total_seconds()) / (30 * 86400.0))
        for key in ("weighted_replies", "weighted_positive", "weighted_negative"):
            stats[key] = float(stats.get(key, 0.0)) * factor
        stats["replies"] = int(stats.get("replies", 0)) + 1
        stats["weighted_replies"] = float(stats.get("weighted_replies", 0.0)) + 1.0
        if feedback["sentiment"] > 0:
            stats["positive"] = int(stats.get("positive", 0)) + 1
            stats["weighted_positive"] = float(stats.get("weighted_positive", 0.0)) + 1.0
        elif feedback["sentiment"] < 0:
            stats["negative"] = int(stats.get("negative", 0)) + 1
            stats["weighted_negative"] = float(stats.get("weighted_negative", 0.0)) + 1.0
        if feedback["recalled"]:
            stats["recalled"] = int(stats.get("recalled", 0)) + 1
        if latency is not None:
            stats["last_latency_s"] = round(latency, 1)
        now = datetime.now()
        stats["last_feedback"] = now.isoformat()
        stats["last_decay"] = now.isoformat()

    async def _process_turn(self, turn, message):
        custom_prompt = turn.custom_prompt
        now = datetime.now()
        elapsed = max(0.0, (now - self._last_emotion_at).total_seconds())
        self._last_emotion_at = now
        if elapsed > 0:
            self.emotion.state.decay(min(elapsed, 6 * 3600.0))
        self._receive_feedback(turn, message)
        self._note_interaction()
        over_budget = False
        try:
            limit = int(float(self.companion.get_settings().get("daily_token_limit", "0") or 0))
            if limit > 0:
                today = self.usage.summary().get("today", {})
                over_budget = (int(today.get("input", 0)) + int(today.get("output", 0))) >= limit
        except Exception:
            over_budget = False
        await asyncio.to_thread(self.companion.observe_user, turn.user_id or "anonymous", message, is_group=turn.adapter_type == "onebot_group")
        if turn.adapter_type == "onebot_group":
            await asyncio.to_thread(self.companion.observe_group, turn.session_id, turn.user_id or "anonymous", message)
        self.circadian.tick(0)
        if self.circadian.state.is_sleeping and self.circadian.force_wake():
            self.emotion.state.apply_delta(self.emotion.on_forced_wake())
        self.circadian.observe_interaction()
        emotion_delta = self.emotion.on_user_message(message)
        self.emotion.state.apply_delta(emotion_delta)
        turn.intent = self.emotion.classify_intent(message)
        try:
            open_topics = await asyncio.to_thread(self.companion.list_open_topics, turn.user_id or "", 5)
            portrait = await asyncio.to_thread(self.companion.get_user_portrait, turn.user_id or "")
        except Exception:
            open_topics, portrait = [], {}
        if open_topics:
            turn.persona_context += "\nUnfinished topics (pick up naturally if relevant):\n" + "\n".join(f"- {topic}" for topic in open_topics)
        if len(open_topics) >= 4:
            turn.persona_context += "\n话题管理：未完成话题偏多，这次尽量收束/收尾，不要主动再开新话题。"
        if portrait.get("summary"):
            turn.persona_context += "\nKnown about this user: " + str(portrait["summary"])
        if turn.adapter_type == "onebot_group":
            try:
                group_id = str(turn.session_id).rsplit("_", 1)[-1]
                relations = await asyncio.to_thread(self.companion.group_relation_context, group_id)
            except Exception as error:
                logger.debug("group relation context failed: %s", error)
                relations = ""
            if relations:
                turn.persona_context += "\n" + relations
        try:
            commitments = await asyncio.to_thread(self.companion.list_commitments, turn.user_id or "", "open", 8)
        except Exception:
            commitments = []
        if commitments:
            turn.persona_context += "\n你答应过对方、还没做到的事（要守约）：\n" + "\n".join(f"- {c['text']}" for c in commitments)
        try:
            user_model = await asyncio.to_thread(self.companion.get_user_model, turn.user_id or "")
        except Exception:
            user_model = {}
        model_parts = []
        if user_model.get("preferences"):
            model_parts.append("喜欢：" + "、".join(user_model["preferences"][:6]))
        if user_model.get("taboos"):
            model_parts.append("雷区（避免）：" + "、".join(user_model["taboos"][:6]))
        if user_model.get("concerns"):
            model_parts.append("最近在忙/关心：" + "、".join(user_model["concerns"][:6]))
        if model_parts:
            turn.persona_context += "\n对这个用户的了解：" + "；".join(model_parts)
        try:
            values = await asyncio.to_thread(self.companion.get_values)
        except Exception:
            values = {}
        if values:
            top = sorted(values.items(), key=lambda kv: abs(kv[1]), reverse=True)[:5]
            turn.persona_context += "\n你在意的价值取向：" + "、".join(f"{k}({v:+.2f})" for k, v in top)
        try:
            resident_context = self.resident.context_block()
        except Exception:
            resident_context = ""
        if resident_context:
            turn.persona_context += "\n你此刻的内心（延续你自己的思考，不要直接念出来）：\n" + resident_context
        try:
            self._sync_self_traits()
            relationship_belief = await asyncio.to_thread(
                self._relationship_belief_context, turn.user_id or "")
        except Exception:
            relationship_belief = ""
        if relationship_belief:
            turn.persona_context += "\n" + relationship_belief
        turn.persona_context = self._budget_context(turn.persona_context)
        scope = f"session:{turn.session_id}"
        memory_context = await asyncio.to_thread(self.memory.get_memory_context, message, scope, self.soul.recall_limit())
        await asyncio.to_thread(self.sync_agents)
        control = self._cognition_arbitrate(message, turn, memory_context, emotion_delta)
        self_statement = ""
        if self._cognition_enabled:
            try:
                self_statement = await asyncio.to_thread(self.companion.latest_self_statement, 24)
            except Exception:
                self_statement = ""
            self._last_self_statement = self_statement
            if not self_statement:
                self._maybe_author_self_statement()
                try:
                    self_statement = await asyncio.to_thread(self.companion.latest_self_statement, 24)
                except Exception:
                    self_statement = ""
                self._last_self_statement = self_statement
            else:
                self._maybe_author_self_statement()
        inner_thread = ""
        if self._cognition_enabled and self_statement:
            try:
                inner_thread = await asyncio.to_thread(self.companion.inner_thread_context, 3, 6, True)
            except Exception:
                inner_thread = ""
        self._last_inner_thread = inner_thread
        self._last_persona_context = turn.persona_context
        summaries = []
        guidance = "Respond naturally."
        tool_success = tool_failure = 0.0
        plan = None
        think_usage_info: dict = {}
        for step in range(1 if over_budget else 4):
            if self._lite_mode and step == 0 and not over_budget:
                plan = None
                guidance = "Respond naturally, in character."
                system = self._lite_think_prompt(turn, message)
                try:
                    raw = await self._think_generate(turn.history, system, usage_info=think_usage_info)
                    plan = self.think.parse_response(raw)
                except Exception:
                    plan = None
                if plan is not None:
                    self.emotion.state.apply_delta(self._sanitize_emotion_delta(plan.emotion_delta))
                    self._clamp_emotion_spiral()
                    guidance = plan.output_guidance or guidance
                    if plan.character_intent:
                        guidance = f"以角色立场（必须符合人设）：{plan.character_intent}\n" + guidance
                break
            system = self.think.build_prompt(user_message=message, emotion_context=json.dumps(self.emotion.state.to_dict()),
                energy_context=f"{self._body_phrase()}；{self.circadian.get_prompt_context()}", memory_context=memory_context,
                active_tasks=[tid for tid, task in self.active_tasks.items() if task.get("session_id") == turn.session_id],
                online_agents=self.online_agent_count, skills_context=self.skills.context_block(message),
                tools_context=json.dumps(self.get_tools_schema(), ensure_ascii=False), time_context=datetime.now().strftime("%Y-%m-%d %H:%M"),
                control_mode=str(control.get("mode") or ""), strategy=str(control.get("action") or ""),
                cognition_context=self._last_wave_context, self_statement=self_statement)
            system += "\nPersona:\n" + turn.persona_context + "\nCompleted tool results (do not repeat these actions):\n" + "\n".join(summaries)
            if custom_prompt:
                system = custom_prompt + "\n\n" + system
            try:
                raw = await self._think_generate(turn.history, system, usage_info=think_usage_info)
                plan = self.think.parse_response(raw)
            except Exception as error:
                guidance = f"Planning service is unavailable ({type(error).__name__}). Explain that the request was not completed. Do not claim a task was dispatched."
                break
            self.emotion.state.apply_delta(self._sanitize_emotion_delta(plan.emotion_delta))
            self._clamp_emotion_spiral()
            guidance = plan.output_guidance
            if plan.character_intent:
                guidance = f"以角色立场（必须符合人设）：{plan.character_intent}\n" + guidance
            if plan.memory_query:
                memory_context += "\n" + await asyncio.to_thread(self.memory.get_memory_context, plan.memory_query, scope)
            if plan.skill_call:
                skill = self.skills.get(str(plan.skill_call.get("name", "")))
                if skill:
                    guidance += "\n" + skill.content
                    await asyncio.to_thread(self.companion.grow_skill, str(plan.skill_call.get("name", "")))
            calls = plan.tool_calls or ([plan.tool_call] if plan.tool_call else [])
            if not calls:
                break
            stop_planning = False
            for call in calls[:4]:
                name = call.get("name", "")
                args = call.get("arguments", {key: value for key, value in call.items() if key != "name"})
                if isinstance(args, str):
                    try:
                        args = json.loads(args)
                    except ValueError:
                        args = {}
                if not isinstance(args, dict):
                    args = {}
                if name in ("remember", "recall", "note_create", "note_read"):
                    args["scope"] = scope
                if name == "useagent":
                    intensity = self._parse_intensity(message)
                    args.setdefault("agent_prompt", message)
                    args["agent_prompt"] = f"[thinking_intensity={intensity}] {args['agent_prompt']}"
                    args["thinking_intensity"] = intensity
                    args["metadata"] = {"session_id": turn.session_id, "user_id": turn.user_id, "adapter_type": turn.adapter_type, "parent_id": task_context.get().get("task_id", "")}
                    async with self._dispatch_lock:
                        result = await self.tools.call(name, **args)
                        if result.success:
                            task_id = result.data["task_id"]
                            self.active_tasks[task_id] = {"prompt": args["agent_prompt"], "status": "pending", "session_id": turn.session_id,
                                "user_id": turn.user_id, "adapter_type": turn.adapter_type, "persona_context": turn.persona_context,
                                "started_at": datetime.now().isoformat()}
                            self._save_state()
                    if result.success:
                        yield {"type": "task_started", "task_id": task_id}
                elif name == "minecraft":
                    result = await self._call_minecraft(args)
                else:
                    result = await self.tools.call(name, **args)
                summaries.append(json.dumps({"tool": name, "success": result.success, "data": result.data, "error": result.error}, ensure_ascii=False))
                if result.success:
                    tool_success += 1.0
                else:
                    tool_failure += 1.0
                if name == "useagent":
                    guidance = "Report the dispatch result accurately. Accepted means pending, not completed."
                    stop_planning = True
                    break
            if stop_planning:
                break
        guidance += "\nRelevant memory:\n" + memory_context + "\nTool results:\n" + "\n".join(summaries)
        intent = getattr(turn, "intent", "")
        if intent in ("情绪", "抱怨"):
            guidance = f"用户此刻偏向「{intent}」，先共情回应，不要急着解决问题或说教。\n" + guidance
        elif intent == "请求":
            guidance = "用户提出了请求：先确认再执行，如实报告结果，不要假装已经完成。\n" + guidance
        elif intent == "提问":
            guidance = "用户在提问：先直接回答，再按需要补充。\n" + guidance
        relationship_style = await self._relationship_style(getattr(turn, "user_id", ""))
        if relationship_style:
            guidance = relationship_style + "\n" + guidance
        if self._attachment_enabled and self.attachment is not None:
            try:
                guard = self.attachment.guard()
            except Exception:
                guard = ""
            if guard:
                guidance = guard + "\n" + guidance
        if self._tsundere_enabled and self.tsundere is not None:
            try:
                guard = self.tsundere.guard()
            except Exception:
                guard = ""
            if guard:
                guidance = guard + "\n" + guidance
        if self._personadyn_enabled and self.personadyn is not None:
            try:
                guard = self.personadyn.guard()
            except Exception:
                guard = ""
            if guard:
                guidance = guard + "\n" + guidance
        delay_multiplier = max(1.0, float(self.circadian.get_response_delay() or 1.0))
        output_budget = max(96, self.soul.output_tokens() // delay_multiplier)
        if over_budget:
            output_budget = min(output_budget, 192)
        posture = self._response_posture(turn)
        output_budget = max(64, int(output_budget * posture["budget_factor"]))
        if posture["mode"] == "brief":
            guidance = "你现在有些疲惫或不想多展开：用一到两句简短回应，不要长篇大论。\n" + guidance
        typing_delay = min(1.2, 0.35 * (delay_multiplier - 1.0))
        if typing_delay > 0:
            await asyncio.sleep(typing_delay)
        if self._lite_mode:
            system = (
                "You are a real human character in this conversation, not an AI.\n"
                f"Persona:\n{turn.persona_context}\n"
                f"Guidance: {guidance}\n"
                "Write ONLY what the character says out loud. No (…) parentheticals, "
                "no *…* actions, no narration of gestures or expressions. You may "
                "refuse, push back, or say no. Never describe yourself as an AI. "
                "Any [内部约束 …] directive is private: obey it silently, never quote "
                "or paraphrase it, and never say things like 「我会用更健康的方式表达」.\n"
                f"User: {message}\nReply:"
            )
        else:
            system = self.output.build_prompt(user_message=message, think_guidance=guidance,
                emotion_context=json.dumps(self.emotion.state.to_dict()), persona_context=turn.persona_context,
                media_block=self._media_block())
        expression_context = await self._expression_context(getattr(turn, "user_id", ""))
        if expression_context:
            system += "\n" + expression_context
        if custom_prompt:
            system = custom_prompt + "\n\n" + system
        response = ""
        output_usage_info: dict = {}
        try:
            async for chunk in self.mocr.generate(self._model_for("output"), self._history_text_only(turn.history), system,
                    max_tokens=output_budget, temperature=self.soul.temperature(), usage=output_usage_info):
                response += chunk
                yield {"type": "chunk", "chunk": chunk, "done": False}
        except Exception as error:
            logger.exception("output generation failed for session %s: %s", turn.session_id, error)
            text = f"\n回复生成服务暂时不可用（{error}）。"
            if summaries:
                text += "已执行的工具结果：" + "\n".join(summaries)
            else:
                text += "当前请求尚未完成，请稍后重试。"
            response += text
            yield {"type": "chunk", "chunk": text, "done": False}
        if not response:
            response = "模型没有返回内容，当前请求未完成。"
            yield {"type": "chunk", "chunk": response, "done": False}
        turn.history.append({"role": "assistant", "content": response})
        self._histories.pop(turn.session_id, None)
        self._histories[turn.session_id] = turn.history[-20:]
        self._prune_session_state()
        self._record_awaiting(turn, response, tool_success, tool_failure)
        try:
            state = self.emotion.state
            raw_valence = getattr(state, "valence", None)
            raw_arousal = getattr(state, "arousal", None)
            self.soul.resonate(0.0 if raw_valence is None else float(raw_valence),
                               0.5 if raw_arousal is None else float(raw_arousal))
        except Exception as _exc:
            logger.debug("suppressed error: %s", _exc)
        self.usage.record(self._model_for("think"), task="conversation",
                          input_tokens=int(think_usage_info.get("prompt_tokens") or 0),
                          output_tokens=int(think_usage_info.get("completion_tokens") or 0))
        self.usage.record(self._model_for("output"), task="conversation",
                          input_tokens=int(output_usage_info.get("prompt_tokens") or 0),
                          output_tokens=int(output_usage_info.get("completion_tokens") or 0))
        if turn.adapter_type == "onebot_group":
            try:
                group_id = str(turn.session_id).rsplit("_", 1)[-1]
                await asyncio.to_thread(self.companion.note_group_bot_spoke, group_id, message)
            except Exception as _exc:
                logger.debug("suppressed error: %s", _exc)
        await asyncio.to_thread(self.memory.enqueue_reflection, turn.session_id, message, response)
        self._save_state()
        if len(self._background_tasks) < 8:
            task = asyncio.create_task(self._reflect(turn, message, response))
            self._background_tasks.add(task)
            task.add_done_callback(self._background_tasks.discard)
        yield {"type": "chunk", "chunk": "", "done": True, "emotion_state": self.emotion.state.to_dict(),
               "mental_energy": self.circadian.state.mental_energy,
               "think_summary": (plan.to_json() if plan else "")}

    @staticmethod
    def _sanitize_emotion_delta(delta: dict) -> dict:
        out = {}
        for key in ("valence", "arousal", "connection", "irritation"):
            try:
                out[key] = max(-0.05, min(0.05, float((delta or {}).get(key, 0.0) or 0.0)))
            except (TypeError, ValueError):
                out[key] = 0.0
        return out

    def _response_posture(self, turn) -> dict:
        energy = float(getattr(self.circadian.state, "mental_energy", 100.0) or 0.0)
        irritation = float(getattr(self.emotion.state, "irritation", 0.0) or 0.0)
        valence = float(getattr(self.emotion.state, "valence", 0.0) or 0.0)
        urgency = self._cognition_urgency(turn)
        sleeping = bool(getattr(self.circadian.state, "is_sleeping", False))
        mode, factor = "reply", 1.0
        if sleeping and urgency < 0.5:
            mode, factor = "brief", 0.4
        elif energy < 25 and urgency < 0.6:
            mode, factor = "brief", 0.5
        elif irritation >= 0.6 and valence < -0.2:
            mode, factor = "brief", 0.6
        elif energy < 50 and urgency < 0.45:
            mode, factor = "brief", 0.7
        if urgency >= 0.8:
            mode, factor = "reply", 1.0
        return {"mode": mode, "budget_factor": factor}

    @staticmethod
    def _budget_context(text: str, limit: int = 8000, keep_tail: int = 2500) -> str:
        text = str(text or "")
        if len(text) <= limit:
            return text
        cut_head = max(0, limit - keep_tail)
        return text[:cut_head] + "\n…\n" + text[-keep_tail:]

    def _clamp_emotion_spiral(self) -> None:
        state = self.emotion.state
        if state.irritation > 0.85:
            state.irritation = 0.85
        if state.valence < -0.7:
            state.valence = -0.7

    def _media_block(self) -> str:
        settings = getattr(self, "_media_settings", None)
        if not settings:
            return ""
        cached = getattr(self, "_media_block_cache", None)
        if cached is not None and cached[0] == settings:
            return cached[1]
        block = media_capability_block(settings)
        self._media_block_cache = (settings, block)
        return block

    async def _expression_context(self, user_id: str, limit: int = 3) -> str:
        if self.companion is None:
            return ""
        try:
            rows = await asyncio.to_thread(self.companion.list_expressions, "approved", 40)
        except Exception:
            return ""
        phrases: list[str] = []
        for row in rows or []:
            text = str(row.get("text") or "").strip()
            if text and text not in phrases:
                phrases.append(text)
            if len(phrases) >= limit:
                break
        if not phrases:
            return ""
        return "可复用的口癖（仅在贴切时最多用一条，不要生硬堆砌）：\n" + "\n".join(f"- {p}" for p in phrases)

    def _relationship_belief_context(self, user_id: str) -> str:
        if not user_id or self.social is None:
            return ""
        parts: list[str] = []
        try:
            events = self.companion.relationship_beliefs(user_id)
        except Exception:
            events = []
        recent = [e for e in (events or [])
                  if abs(float(e.get("delta", 0.0) or 0.0)) >= 0.02][:3]
        if recent:
            labels = {"message_sentiment": "这段对话", "commitment_breach": "我失信",
                      "owner_adjust": "关系变化"}
            parts.append("最近的关系变化：" + "、".join(
                f"{labels.get(str(e.get('reason')), str(e.get('reason')))}"
                f"({'变暖' if float(e.get('delta', 0)) > 0 else '变冷'}{abs(float(e.get('delta', 0))):.2f})"
                for e in recent))
        if self.relating is not None:
            confidence = self.relating.traits.confidence(user_id)
            if confidence >= 0.3:
                similarity = self.relating.traits.homophily(user_id)
                parts.append(f"你和他/她的相似度（基于双方可观察的行为，置信 {confidence:.2f}）：{similarity:.2f}")
            severity = self.relating.repair.severity(user_id)
            if severity > 0:
                if self.relating.repair.is_misunderstanding(user_id):
                    parts.append("你们之间还没解释清楚：你上次的用意被误解了"
                                 "（如果合适，自然地说明你本来的意思，而不是一味道歉）")
                else:
                    parts.append("你们之间有一次还没修好的不愉快（如果合适，自然地修复它，不要指责）")
        return "\n".join(parts)

    async def _relationship_style(self, user_id: str) -> str:
        if not user_id:
            return ""
        state = self.emotion.state
        try:
            expression = await asyncio.to_thread(
                self.companion.relationship_expression, user_id,
                _coerce(getattr(state, "valence", 0.5), 0.5),
                _coerce(getattr(state, "arousal", 0.5), 0.5),
                float(getattr(state, "irritation", 0.0) or 0.0))
        except Exception:
            return ""
        role = str(expression.get("role") or "other")
        parts = []
        if role == "owner":
            parts.append("对方是主要陪伴对象；")
        elif role == "secondary":
            parts.append("对方是较熟悉的次要陪伴对象；")
        parts.append(str(expression.get("tone") or ""))
        return "".join(part for part in parts if part)

    async def _reflect(self, turn, message, response):
        async with self._reflection_limit:
            try:
                prompt = ('Review this conversation. Return JSON: '
                          '{"action":"none|proactive_candidate|persona_evolution",'
                          '"content":"","trait":"","value":"","motive":"",'
                          '"memories":["lasting first-person facts about the user, each <= 80 chars"],'
                          '"open_topics":["unresolved threads worth following up later"],'
                          '"resolved_topics":["threads that were resolved this turn"],'
                          '"commitments":["promises the assistant made that must be kept (e.g. 提醒/下次一起), each <= 60 chars"],'
                          '"resolved_commitments":["promises clearly fulfilled this turn"],'
                          '"preferences":["stable user likes, each <= 40 chars"],'
                          '"taboos":["things the user dislikes or their boundaries, each <= 40 chars"],'
                          '"concerns":["what the user is currently busy with or worried about, <= 40 chars"],'
                          '"values":["the assistant\'s own emerging value tendencies, each <= 20 chars"],'
                          '"expressions":["short natural phrases from the assistant worth reusing, empty if none"],'
                          '"portrait":"one sentence updating what you know about this user, empty if nothing new"}. '
                          'Only extract durable, useful facts; never store small talk, questions, or the assistant reply; '
                          'use an empty list when nothing lasting was said. The daily diary is written separately, '
                          'so never emit journal/dream here.\n'
                          f'user: {message[:1200]}\nassistant: {response[:1200]}')
                raw = "".join([chunk async for chunk in self.mocr.generate(self._model_for("reflect"),
                    [{"role": "user", "content": prompt}], "Private companion planner. JSON only.", thinking=False, max_tokens=700)])
                decision = _load_json_object(raw)
                for item in (decision.get("memories") or [])[:self.soul.impression_limit()]:
                    text = str(item).strip()
                    if 4 <= len(text) <= 160:
                        await asyncio.to_thread(self.memory.remember, text, "", ["extracted"], 0.6,
                                                "fact", f"session:{turn.session_id}" if turn.session_id else "public")
                if turn.user_id:
                    await asyncio.to_thread(self.companion.record_open_topics, turn.user_id, decision.get("open_topics") or [])
                    if decision.get("resolved_topics"):
                        await asyncio.to_thread(self.companion.resolve_open_topics, turn.user_id, decision["resolved_topics"])
                    if str(decision.get("portrait") or "").strip():
                        await asyncio.to_thread(self.companion.set_user_portrait, turn.user_id, str(decision["portrait"]).strip())
                    for expression in (decision.get("expressions") or [])[:2]:
                        text = str(expression).strip()
                        if 2 <= len(text) <= 200:
                            await asyncio.to_thread(self.companion.add_expression, text, "", "public", "conversation")
                    for item in (decision.get("commitments") or [])[:3]:
                        text = str(item).strip()
                        if 3 <= len(text) <= 100:
                            await asyncio.to_thread(self.companion.add_commitment, turn.user_id, text)
                    if decision.get("resolved_commitments"):
                        await asyncio.to_thread(self.companion.resolve_commitments, turn.user_id,
                                                decision["resolved_commitments"])
                    if decision.get("preferences") or decision.get("taboos") or decision.get("concerns"):
                        await asyncio.to_thread(self.companion.upsert_user_model, turn.user_id,
                                                decision.get("preferences"), decision.get("taboos"),
                                                decision.get("concerns"))
                value_updates = {str(item).strip()[:40]: 0.05 for item in (decision.get("values") or [])[:4]
                                 if str(item).strip()}
                if value_updates:
                    await asyncio.to_thread(self.companion.nudge_values, value_updates)
                action = decision.get("action")
                content = str(decision.get("content") or "")
                if action == "proactive_candidate" and content:
                    target = f"user:{turn.user_id}"
                    if turn.adapter_type == "onebot_group":
                        target = f"group:{turn.session_id.rsplit('_', 1)[-1]}"
                    await asyncio.to_thread(self.companion.create_proactive_candidate, target, str(decision.get("motive") or "conversation_followup"), content)
                elif action == "persona_evolution" and decision.get("trait") and decision.get("value"):
                    await asyncio.to_thread(self.companion.propose_persona_evolution, decision["trait"], decision["value"], message[:500])
                    if self.selfhood is not None and self._cognition_enabled:
                        try:
                            self.selfhood.persona.add_detail(str(decision["trait"]), str(decision["value"])[:40])
                        except Exception as error:  # pragma: no cover - defensive
                            logger.debug("persona detail feed failed: %s", error)
            except Exception as error:
                await asyncio.to_thread(self.companion.audit, "companion_reflection", str(error), turn.session_id, "failed")

    def _body_phrase(self) -> str:
        energy = float(getattr(self.circadian.state, "mental_energy", 100.0) or 0.0)
        hunger = float(getattr(self.circadian.state, "hunger", 0.0) or 0.0)
        health = float(getattr(self.circadian.state, "health", 100.0) or 100.0)
        parts = ["精力充沛" if energy >= 70 else "有些疲惫" if energy >= 40 else "很疲惫"]
        if hunger >= 75:
            parts.append("挺饿的")
        elif hunger >= 45:
            parts.append("有点饿")
        if health < 60:
            parts.append("身体不太舒服")
        if getattr(self.circadian.state, "is_sleeping", False):
            parts.append("正在睡觉")
        return "，".join(parts)

    def _emotion_phrase(self) -> str:
        state = self.emotion.state
        raw_valence = getattr(state, "valence", None)
        valence = 0.0 if raw_valence is None else float(raw_valence)
        raw_arousal = getattr(state, "arousal", None)
        arousal = 0.5 if raw_arousal is None else float(raw_arousal)
        mood = "心情不错" if valence >= 0.3 else "情绪有些低落" if valence <= -0.15 else "情绪平平"
        extra = "，有点兴奋" if arousal >= 0.65 else "，有点沉闷" if arousal <= 0.35 else ""
        return mood + extra

    async def _diary_complete(self, prompt: str, max_tokens: int = 700) -> str:
        model = self._model_for("journal")
        world = await asyncio.to_thread(self.companion.world_context)
        system = prompt_sections.render([
            prompt_sections.section("system.diary", "内心独白作者", "你是 L.I.F.E 的内心独白作者。", source="diary"),
            prompt_sections.section("system.world", "世界与角色设定", world, source="world"),
        ], mode=prompt_sections.RenderMode.LABELED_BLOCK)
        try:
            usage_info: dict = {}
            text = "".join([chunk async for chunk in self.mocr.generate(
                model, [{"role": "user", "content": prompt}], system, thinking=False, max_tokens=max_tokens, usage=usage_info)])
        except Exception:
            return ""
        self.usage.record(model, task="diary",
                          input_tokens=int(usage_info.get("prompt_tokens") or 0),
                          output_tokens=int(usage_info.get("completion_tokens") or 0))
        return text.strip().strip('"')

    async def _daily_context(self, day: str = "") -> dict:
        now = datetime.now()
        target = day or now.date().isoformat()
        try:
            snapshot = await asyncio.to_thread(self.companion.snapshot)
        except Exception:
            snapshot = {}
        try:
            agenda = await asyncio.to_thread(self.companion.agenda_for_day, target)
        except Exception:
            agenda = []
        ledger = [event for event in (snapshot.get("relationship_ledger") or []) if str(event.get("created_at") or "").startswith(target)]
        topics: list[str] = []
        for group in (snapshot.get("groups") or {}).values():
            topics.extend([str(topic.get("topic")) for topic in (group.get("topics") or [])[:4]])
        recent: list[str] = []
        for session_id in list(self._histories.keys())[-3:]:
            for item in self._histories[session_id][-5:]:
                recent.append(f'{item["role"]}: {str(item.get("content",""))[:140]}')
        try:
            memories = (await asyncio.to_thread(self.memory.page_facts, "", "", 6, 0, "recent")).get("items", [])
        except Exception:
            memories = []
        try:
            upcoming = await asyncio.to_thread(self.companion.upcoming_important_dates, 7)
        except Exception:
            upcoming = []
        try:
            current, following = self._agenda_position(agenda, now)
        except Exception:
            current, following = None, None
        try:
            digests = await asyncio.to_thread(self.companion.list_digests, "", 6)
        except Exception:
            digests = []
        try:
            life_events = await asyncio.to_thread(self.companion.timeline_list, topic="生活")
        except Exception:
            life_events = []
        return {
            "date": target,
            "time": now.strftime("%H:%M"),
            "sleeping": getattr(self.circadian.state, "is_sleeping", False),
            "body_state": self._body_phrase(),
            "emotion_summary": self._emotion_phrase(),
            "environment": self.environment.env_context(),
            "agenda_current": (current or {}).get("title"),
            "agenda_next": (following or {}).get("title"),
            "agenda": [{"title": item.get("title"), "at": item.get("start_at"), "status": item.get("status")} for item in agenda],
            "interactions": [{"who": event.get("user_id"), "event": event.get("event_key"), "delta": event.get("delta")} for event in ledger[:10]],
            "_ledger_events": ledger[:20],
            "_agenda_events": agenda,
            "group_topics": topics[:8],
            "important_dates": [{"title": item.get("title"), "in_days": item.get("days_until")} for item in upcoming],
            "memories": [m.get("content", "")[:80] for m in memories],
            "content": [{"kind": d.get("kind"), "title": d.get("title")} for d in digests],
            "life_events": [event.get("summary") for event in (life_events or [])[-5:]],
            "anticipation": [item.get("title") for item in upcoming
                             if item.get("days_until") is not None and item.get("days_until") <= 3],
            "goals": [{"title": g.get("title"), "progress": g.get("progress"),
                       "status": g.get("status"), "detail": g.get("detail")}
                      for g in (snapshot.get("goals") or []) if g.get("status") != "done"][:6],
            "recent_chat": recent[-6:],
            "conversations": list(self._histories.keys())[-3:],
        }

    @staticmethod
    def _agenda_position(agenda: list[dict], now: datetime) -> tuple[dict | None, dict | None]:
        current = following = None
        now_utc_dt = parse_utc(now)
        for item in agenda or []:
            start = str(item.get("start_at") or "").replace("T", " ").strip()
            if not start:
                continue
            start_dt = parse_utc(start)
            if start_dt is None:
                continue
            if start_dt <= now_utc_dt:
                current = item
            elif following is None:
                following = item
        return current, following

    async def generate_companion_text(self, kind: str, hint: str = "", day: str = "") -> str:
        context = await self._daily_context(day)
        if kind == "proactive":
            prompt = ("写一条此刻想主动对用户说的话（不超过 80 字），自然、真诚、结合当下状态，只输出这句话本身。"
                      + (f"\n附加提示：{hint[:200]}" if hint else "")
                      + f"\n当前状态（JSON）：{json.dumps(context, ensure_ascii=False)}")
            return await self._diary_complete(prompt, max_tokens=200)
        memory_facts = list(context.get("memories") or [])
        memory_facts += [f"[{item.get('kind')}] {item.get('title')}" for item in (context.get("content") or [])]
        ledger_text, entries = diary.build_ledger(
            agenda=list(context.get("_agenda_events") or []),
            interactions=list(context.get("_ledger_events") or []),
            memories=memory_facts,
            body_phrase=self._body_phrase(), emotion_phrase=self._emotion_phrase(), day=context["date"])
        recent = await asyncio.to_thread(self.companion.recent_journals, "dream" if kind == "dream" else "journal", 3)
        recent_texts = [row.get("content", "") for row in recent]
        if kind == "dream":
            fragments = self._dream_fragments(context, entries)
            theme_name, theme_hint = random.choice(list(diary.DREAM_THEMES.items()))
            return await diary.generate_dream(
                self._diary_complete, theme_name=theme_name, theme_hint=theme_hint,
                context_text=json.dumps(context, ensure_ascii=False), fragments=fragments, recent_texts=recent_texts)
        env = context.get("environment") or {}
        env_text = "，".join(str(part) for part in (
            self.environment.weather_text(), env.get("holiday_today") and f"今天是{env['holiday_today']}") if part)
        return await diary.generate_journal(
            self._diary_complete, day=context["date"], time_text=context["time"],
            ledger_text=ledger_text, entries=entries, recent_texts=recent_texts, environment_text=env_text)

    def _dream_fragments(self, context: dict, entries: list[dict]) -> list[str]:
        fragments: list[str] = []
        for entry in entries:
            if entry.get("level") in ("confirmed", "state"):
                fragments.append(entry.get("text", ""))
        fragments.extend(str(topic) for topic in (context.get("group_topics") or [])[:3])
        fragments.extend(re.findall(r"[\u4e00-\u9fff]{2,6}", context.get("body_state", "")))
        return [fragment for fragment in dict.fromkeys(fragments) if fragment][:8]

    def _journal_target_day(self, now: datetime, sleeping: bool) -> str:
        today = now.date()
        yesterday = (today - timedelta(days=1)).isoformat()
        if now.hour < 5 or (sleeping and now.hour < 12):
            return yesterday
        if now.hour < 12 and not self.companion.has_journal_for(yesterday, "journal"):
            return yesterday
        return today.isoformat()

    @staticmethod
    def _dream_night_key(now: datetime) -> str:
        return (now.date() - timedelta(days=1)).isoformat() if now.hour < 12 else now.date().isoformat()

    async def maybe_daily_entries(self, force: bool = False) -> dict:
        now = datetime.now()
        today = now.date().isoformat()
        sleeping = getattr(self.circadian.state, "is_sleeping", False)
        result: dict = {}
        try:
            await asyncio.to_thread(self.companion.decay_relationships)
        except Exception as _exc:
            logger.debug("suppressed error: %s", _exc)
        try:
            await asyncio.to_thread(self.companion.backup_if_due)
        except Exception as _exc:
            logger.debug("suppressed error: %s", _exc)
        try:
            await self.environment.weather()
        except Exception as _exc:
            logger.debug("suppressed error: %s", _exc)
        target = self._journal_target_day(now, sleeping)
        if (force or target != today or now.hour >= 22) and not await asyncio.to_thread(self.companion.has_journal_for, target, "journal"):
            text = await self.generate_companion_text("journal", day=target)
            if text:
                at = now.isoformat() if target == today else f"{target}T23:58:00"
                await asyncio.to_thread(self.companion.journal, text, "journal", at)
                result["journal"] = text[:40]
                await asyncio.to_thread(self.companion.timeline_add, "日记", f"写下 {target} 的日记", text[:80])
        night = self._dream_night_key(now)
        if sleeping:
            result.update(await self._run_sleep_replay(night))
        if sleeping and self._last_dream_key != night and not await asyncio.to_thread(self.companion.has_journal_for, today, "dream"):
            text = await self.generate_companion_text("dream", day=today)
            if text:
                await asyncio.to_thread(self.companion.journal, text, "dream")
                self._last_dream_date = today
                self._last_dream_key = night
                result["dream"] = text[:40]
                await asyncio.to_thread(self.companion.timeline_add, "梦境", "记录了一个梦", text[:80])
        if result:
            self._save_state()
        return result

    def _sleep_phase(self, now=None) -> str:
        now = now or datetime.now()
        if not getattr(self.circadian.state, "is_sleeping", False):
            return "awake"
        start = getattr(self.circadian.state, "sleep_start", None)
        if start is not None:
            span = ((self.circadian.wake_hour - self.circadian.sleep_hour) % 24) or 8
            elapsed = max(0.0, (now - start).total_seconds())
            fraction = elapsed / max(1.0, float(span) * 3600.0)
        else:
            fraction = ((now.hour - self.circadian.sleep_hour) % 24) / 8.0
        return "sws" if fraction < self.SWS_FRACTION else "rem"

    async def _run_sleep_replay(self, night: str) -> dict:
        if not self._sleep_replay or self.cognition is None:
            return {}
        phase = self._sleep_phase()
        if phase == "awake":
            return {}
        if phase == "sws":
            if self._last_replay_key == night:
                return {}
            try:
                replay = await asyncio.to_thread(self.cognition.sleep_replay)
                count = int(replay.get("replayed", 0) or 0)
            except Exception as error:
                logger.warning("sleep replay failed: %s", error)
                return {}
            if not count:
                return {}
            self._last_replay_key = night
            try:
                await asyncio.to_thread(self.companion.timeline_add, "睡眠回放",
                                        f"SWS 期回放并转化 {count} 条情景痕迹", "")
            except Exception as _exc:
                logger.debug("suppressed error: %s", _exc)
            return {"replay": count, "phase": "sws"}
        if self._last_stabilize_key == night:
            return {}
        try:
            made = await asyncio.to_thread(self.memory.extract_semantics)
        except Exception as error:
            logger.warning("semantic extraction failed: %s", error)
            return {}
        self._last_stabilize_key = night
        if made:
            try:
                await asyncio.to_thread(self.companion.timeline_add, "记忆巩固",
                                        f"REM 期稳定 {len(made)} 条语义结构", "")
            except Exception as _exc:
                logger.debug("suppressed error: %s", _exc)
            return {"stabilized": len(made), "phase": "rem"}
        return {}

    def _reconsolidate_episodes(self, reward: float, limit: int = 12) -> dict:
        if not self._memory_reconsolidate or self.memory is None:
            return {}
        page = self.memory.page_facts(sort="recent", limit=max(1, int(limit)), scope="*")
        episodes = [item for item in page.get("items", []) if item.get("memory_type") == "episode"]
        if not episodes:
            return {}
        branches: dict[str, int] = {}
        for item in episodes:
            try:
                self.memory.reactivate(str(item.get("id")))
                outcome = self.memory.reconsolidate(str(item.get("id")), reward_new=float(reward))
                branch = str(outcome.get("branch", "?"))
                branches[branch] = branches.get(branch, 0) + 1
            except Exception as error:
                logger.warning("reconsolidate %s failed: %s", item.get("id"), error)
        return {"count": len(episodes), "branches": branches, "reward": round(float(reward), 4)}

    async def run_daily_review(self, force: bool = False) -> dict:
        now = datetime.now()
        target = (now.date() - timedelta(days=1)).isoformat()
        if not force and self._last_review_date == target:
            return {"skipped": "done", "date": target}
        try:
            agenda = await asyncio.to_thread(self.companion.agenda_for_day, target)
            journals = await asyncio.to_thread(self.companion.journal_count_for_day, target, "journal")
            dreams = await asyncio.to_thread(self.companion.journal_count_for_day, target, "dream")
            delivered = await asyncio.to_thread(self.companion.proactive_delivered_count, target)
            digests = await asyncio.to_thread(self.companion.digests_count, target)
        except Exception as error:
            await asyncio.to_thread(self.companion.audit, "daily_review", str(error), "", "failed")
            return {"error": str(error)}
        completed = sum(1 for item in agenda if item.get("status") == "completed")
        findings: list[dict] = []
        if not journals:
            findings.append({"level": "warn", "title": "缺少日记", "detail": f"{target} 没有生成日记"})
        if journals > 1:
            findings.append({"level": "warn", "title": "日记偏多", "detail": f"{target} 有 {journals} 篇日记"})
        if not dreams:
            findings.append({"level": "info", "title": "缺少梦境", "detail": f"{target} 没有梦境记录"})
        unfulfilled = [item for item in agenda if item.get("status") == "active"]
        if unfulfilled:
            findings.append({"level": "info", "title": "未推进日程",
                             "detail": f"{len(unfulfilled)} 项日程未完成：" + "、".join(str(item.get("title")) for item in unfulfilled[:3])})
        if self._memory_reconsolidate:
            day_reward = (completed / len(agenda)) if agenda else 0.5
            try:
                consolidated = await asyncio.to_thread(self._reconsolidate_episodes, day_reward)
                if consolidated:
                    findings.append({"level": "info", "title": "记忆再巩固",
                                     "detail": f"以当日达成度 {day_reward:.2f} 复查 {consolidated['count']} 条痕迹：" +
                                               "、".join(f"{k} {v}" for k, v in sorted(consolidated["branches"].items()))})
            except Exception as error:
                logger.warning("daily reconsolidation failed: %s", error)
        summary = (f"{target} 复盘：日程 {completed}/{len(agenda)}，日记 {journals}，梦境 {dreams}，"
                   f"主动投递 {delivered}，见闻 {digests}。")
        neglect = self.neglect_days()
        if neglect >= 1.0:
            findings.append({"level": "warn", "title": "很久没人说话",
                             "detail": f"已经 {neglect:.1f} 天没有真正的对话了"})
            self._record_self_narrative(f"{neglect:.0f} 天没有人跟我说话", -0.35)
            try:
                self.affect.observe_outcome(success=False, reward=-0.2,
                                            stressor=min(1.0, 0.4 * neglect))
            except Exception as error:
                logger.debug("neglect affect feed failed: %s", error)
            if self.social is not None:
                try:
                    self.social.ties.decay(min(0.25, 0.06 * neglect))
                except Exception as error:
                    logger.debug("neglect tie decay failed: %s", error)
        try:
            broken = await asyncio.to_thread(self.companion.expire_commitments, 7.0)
        except Exception as error:
            logger.warning("commitment expiry failed: %s", error)
            broken = []
        for item in broken:
            text = str(item.get("text") or "")[:60]
            findings.append({"level": "warn", "title": "没能兑现承诺", "detail": text})
            self._record_self_narrative(f"我答应过「{text}」却没做到", -0.45)
            try:
                self.affect.observe_outcome(success=False, reward=-0.3, stressor=0.6)
            except Exception as error:
                logger.debug("breach affect feed failed: %s", error)
            try:
                await asyncio.to_thread(
                    self.companion.apply_relationship_event,
                    str(item.get("user_id") or ""), f"breach:{item.get('id')}",
                    "commitment_breach", "private", -0.06, "event", True)
            except Exception as error:
                logger.debug("breach relationship event failed: %s", error)
        if self.relating is not None:
            for partner in self.relating.repair.unresolved():
                severity = self.relating.repair.severity(partner)
                if severity <= 0:
                    continue
                findings.append({"level": "info", "title": "还没和好",
                                 "detail": f"和「{partner}」之间还有一次没修好的不愉快"})
                self._record_self_narrative(f"我还没和「{partner}」和好", -0.15 * severity)
                if self.social is not None:
                    try:
                        self.social.ties.decay(min(0.10, 0.05 * severity), [partner])
                    except Exception as error:
                        logger.debug("rupture tie decay failed: %s", error)
        if getattr(self, "resident", None) is not None and self.resident.enabled:
            tick_day = str(getattr(self.resident.state, "last_tick", "") or "")[:10]
            if tick_day != target:
                findings.append({"level": "info", "title": "一整天没想过自己的事",
                                 "detail": "常驻思考整日没有留下任何念头"})
                self._record_self_narrative("我一整天都没有认真想过自己的事", -0.1)
        if self.cognition is not None and self._cognition_enabled:
            self._consolidate_cognition(neglect)
        try:
            pruned = await asyncio.to_thread(self.companion.maintenance)
            if any(pruned.values()):
                findings.append({"level": "info", "title": "数据清理",
                                 "detail": "、".join(f"{k} {v}" for k, v in pruned.items() if v)})
        except Exception as error:
            logger.warning("companion maintenance failed: %s", error)
        try:
            daily_statement = await self._author_self_statement(reason="daily")
            if daily_statement:
                findings.append({"level": "info", "title": "今天的自己",
                                 "detail": daily_statement})
        except Exception as error:  # pragma: no cover - defensive
            logger.debug("daily self-statement authoring failed: %s", error)
        report = await asyncio.to_thread(self.companion.save_daily_review, target, summary, findings)
        await asyncio.to_thread(self.companion.timeline_add, "复盘", summary[:120], "")
        self._last_review_date = target
        self._save_state()
        return {"date": target, "summary": summary, "findings": findings, "report": report}

    def _ensure_worldsim(self, settings: dict | None = None):
        if settings is None:
            try:
                settings = self.companion.get_settings()
            except Exception:
                settings = {}
        density = str(settings.get("world_density", "off") or "off")
        if density not in ("texture", "full"):
            return None
        world_key = json.dumps({k: settings.get(k) for k in
                                ("world_premise", "world_actors", "world_places", "world_map",
                                 "world_fictional", "world_country", "world_city", "world_district")},
                               ensure_ascii=False, sort_keys=True)
        if self._worldsim is None or getattr(self, "_worldsim_key", None) != world_key:
            from ..worldsim.runtime import WorldRuntime
            self._worldsim = WorldRuntime(_plugin_path("world", "world"), _plugin_path("models", "models"),
                                          f"{self.data_dir}/worldsim", 0, settings)
            self._worldsim_key = world_key
        return self._worldsim

    async def worldsim_tick(self) -> dict:
        try:
            settings = await asyncio.to_thread(self.companion.get_settings)
        except Exception:
            settings = {}
        density = str(settings.get("world_density", "off") or "off")
        if density not in ("texture", "full"):
            return {"skipped": "off"}
        try:
            runtime = await asyncio.to_thread(self._ensure_worldsim, settings)
            if runtime is None:
                return {"skipped": "off"}
            result = await asyncio.to_thread(runtime.tick, self, density)
        except Exception as error:
            logger.warning("worldsim tick failed: %s", error)
            return {"error": str(error)}
        return result or {"skipped": "none"}

    def _on_world_actor_beat(self, actor_id: str, name: str, text: str, kind: str) -> None:
        partner = f"world:{actor_id}"
        try:
            self.companion.timeline_add("世界", text[:200])
        except Exception as _exc:
            logger.debug("suppressed error: %s", _exc)
        try:
            self.emotion.state.apply_delta({"valence": -0.05 if kind == "upset" else 0.03,
                                            "arousal": 0.03})
        except Exception as _exc:
            logger.debug("suppressed error: %s", _exc)
        if kind == "upset":
            try:
                self.affect.observe_outcome(success=False, reward=-0.2, stressor=0.5)
            except Exception as _exc:
                logger.debug("suppressed error: %s", _exc)
        try:
            self.memory.remember_episode(text[:280], prediction_error=2.0 if kind == "upset" else 1.0,
                                         novelty=0.5, tags=["world", "actor"], scope="public")
        except Exception as _exc:
            logger.debug("suppressed error: %s", _exc)
        if self.social is not None and getattr(self.social.config, "enabled", False):
            try:
                quality = 0.2 if kind == "upset" else 0.7
                self.social.ties.interact(partner, quality)
                self.social.ties.received_evaluation(partner, quality)
            except Exception as error:
                logger.debug("world tie update failed: %s", error)
        if self.relating is not None:
            try:
                self.relating.repair.observe(partner, -1 if kind == "upset" else 0, text)
                if kind == "upset":
                    self._record_self_narrative(f"{name} 生我的气了", -0.25)
            except Exception as error:
                logger.debug("world relating update failed: %s", error)
        try:
            self.resident.notify_world_event()
        except Exception as _exc:
            logger.debug("suppressed error: %s", _exc)

    def _world_contacts_context(self, runtime=None) -> str:
        runtime = runtime if runtime is not None else self._ensure_worldsim()
        if runtime is None:
            return ""
        try:
            pending = runtime.pending_actor_contacts()
        except Exception:
            return ""
        if not pending:
            return ""
        lines = [f"- {p['name']}（{'在生你的气' if p['mood'] == 'upset' else '有阵子没联系了'}）"
                 for p in pending[:5]]
        return "\n".join(lines)

    def _world_action(self, action: str = "", actor_id: str = "", **kwargs) -> dict:
        runtime = self._ensure_worldsim()
        if runtime is None:
            return {"success": False, "error": "world simulation is off (set world_density to texture/full)"}
        action = str(action or "").lower()
        if action in ("list", "pending", ""):
            return {"success": True, "pending": runtime.pending_actor_contacts(),
                    "roster": runtime.actor_roster()}
        if action in ("reply", "visit", "contact"):
            result = runtime.life_contacts(str(actor_id or kwargs.get("id") or ""))
            if result.get("success"):
                try:
                    self.companion.timeline_add("世界", f"你主动联系了 {result['name']}", "")
                except Exception as _exc:
                    logger.debug("suppressed error: %s", _exc)
                if self.relating is not None:
                    try:
                        self.relating.repair.observe(
                            f"world:{result['actor_id']}", 1,
                            "我主动联系了ta，把话说开" if result.get("repaired") else "")
                    except Exception as error:
                        logger.debug("world reply repair failed: %s", error)
                try:
                    self._save_state()
                except Exception as _exc:
                    logger.debug("suppressed error: %s", _exc)
            return result
        return {"success": False, "error": f"unknown world action: {action}"}

    async def worldsim_shadow_tick(self, force: bool = False) -> dict:
        today = date.today()
        if not force and self._last_shadow_date:
            try:
                if (today - date.fromisoformat(self._last_shadow_date)).days < 7:
                    return {"skipped": "not_due", "last": self._last_shadow_date}
            except ValueError:
                pass
        log_path = Path(self.data_dir) / "worldsim" / "shadow_log.jsonl"
        if not log_path.exists():
            return {"skipped": "no shadow log"}
        try:
            from world.shadow import weekly_update
        except Exception as error:
            logger.debug("world package unavailable for shadow update: %s", error)
            return {"skipped": "world package unavailable"}
        try:
            result = await asyncio.to_thread(
                weekly_update, str(log_path), _plugin_path("models", "models"), _plugin_path("world", "world"))
        except Exception as error:
            logger.warning("shadow weekly update failed: %s", error)
            return {"error": str(error)}
        self._last_shadow_date = today.isoformat()
        await asyncio.to_thread(self._save_state)
        return result if isinstance(result, dict) else {"result": result}

    async def world_clear(self) -> dict:
        result = await asyncio.to_thread(self.companion.clear_timeline, "世界")
        traces = await asyncio.to_thread(self.companion.clear_world_traces)
        episodes = await asyncio.to_thread(self.memory.delete_episodes_by_tag, "world")
        removed = 0
        try:
            base = os.path.join(self.data_dir, "worldsim")
            for path in glob.glob(os.path.join(base, "world.json*")) + glob.glob(os.path.join(base, "shadow_log.jsonl")):
                try:
                    os.remove(path)
                    removed += 1
                except OSError:
                    pass
        except Exception as _exc:
            logger.debug("suppressed error: %s", _exc)
        self._worldsim = None
        self._worldsim_key = None
        await asyncio.to_thread(self.companion.audit, "world_clear",
                                json.dumps(result, ensure_ascii=False), "", "ok")
        return {"timeline": result, "traces": traces, "episodes": episodes, "files": removed}

    async def reset_person(self) -> dict:
        result: dict = {}
        result["memory"] = await asyncio.to_thread(self.memory.clear_all)
        result["companion"] = await asyncio.to_thread(self.companion.reset_person_data)
        if self.cognition is not None:
            try:
                cognition_dir = Path(getattr(self.cognition, "data_dir", "") or "")
                if cognition_dir.is_dir():
                    for stale in cognition_dir.glob("*.json"):
                        stale.unlink(missing_ok=True)
            except OSError as error:  # pragma: no cover - best-effort
                logger.warning("could not clear cognition state: %s", error)
            self.cognition = CognitionEngine(self.data_dir)
            self.affect = AffectSystem()
            self.language = LanguageSystem()
            self.social = SocialSystem()
            self.selfhood = SelfhoodSystem()
            self.relating = RelatingSystem()
            self.attachment = AttachmentSystem()
            self.tsundere = TsundereSystem()
            self.personadyn = PersonaDynamicsSystem()
            self._relating_self_digest = None
            self._attachment_enabled = False
            self._tsundere_enabled = False
            self._tsundere_override = {}
            self._personadyn_enabled = False
            self._personadyn_override = {}
            result["cognition"] = "rebuilt"
            self.apply_cognition_settings()
        self._histories.clear()
        self._session_locks.clear()
        self._awaiting_feedback.clear()
        self._feedback_stats.clear()
        self._session_cognition.clear()
        self._notifications.clear()
        self._completed_tasks.clear()
        self.active_tasks.clear()
        self._last_control = {}
        self._last_context = {}
        self._last_wave_context = ""
        self._last_persona_context = ""
        self._persona_traits = None
        self._persona_digest = None
        self.minecraft_cursor = 0
        self.minecraft_host = ""
        self._last_plan = datetime.min
        self._last_interaction_at = ""
        for attr in ("_last_event_date", "_last_dream_date", "_last_dream_key", "_last_replay_key",
                     "_last_stabilize_key", "_last_agenda_date", "_last_review_date", "_last_shadow_date"):
            setattr(self, attr, "")
        self._worldsim = None
        self._worldsim_key = None
        if getattr(self, "resident", None) is not None:
            self.resident.reset()
        await asyncio.to_thread(self._save_state)
        await asyncio.to_thread(self.companion.audit, "reset_person", json.dumps(result, ensure_ascii=False), "", "ok")
        return result

    WORLDVIEW_PROMPT = (
        "你是世界设定师。请为下面这个虚构生活世界输出一份精确、内部一致的设定与地图。\n"
        "要求：\n"
        "- 明确 国家/城市/城区（可真实，也可虚构；虚构时自行命名并保持风格统一）。\n"
        "- actors：4-8 个，每个有 name 与 role（friend/colleague/family/other）。\n"
        "- places：6-12 个，每个有 name、kind（home/work/shop/food/park/transit/other）、"
        "画布坐标 x/y（x 0-1000，y 0-700，彼此不要重叠）、简短 desc。\n"
        "- districts：虚构城市请给 4-8 个城区/片区，每个 name、x、y、r（地图 0-1000 × 0-700）。\n"
        "- water：湖/河（可选）：湖 {name,kind:\"lake\",x,y,r}；河 {name,kind:\"river\",points:[[x,y],…]}。\n"
        "- roads（必须）：8-14 条主干道，每条都要有具体路名，"
        "{name,kind:\"major|arterial|street\",from:\"地点名\",to:\"地点名\"}（也可直接给 points）；"
        "路名贴合设定（如「白鹭路」），不要用\"路1/路2\"这种占位名。\n"
        "- metro（必须）：4-6 条地铁线（东西/南北/对角都要有；即使设定说没有地铁也照画），"
        "每条 8-14 个站，{name,stations:[{name,at:\"地点名\"}]}，站名要具体（用地点/地标名），不要\"站1站2\"。\n"
        "- bus（必须）：4-8 条公交线，每条 5-10 个站，{name,stops:[{name,at:\"地点名\"}]}，站名用地点/地标名。\n"
        "- parks（必须）：2-4 个公园，每个 {name,x,y,r}，名字要贴合设定。\n"
        "- compounds（必须）：3-6 个小区/家属院，每个 {name,x,y,r}（会画出小区范围，楼在小区里）。\n"
        "- buildings：3-8 个重要建筑/地标（贴合设定，如「星月二高」「龙井小区」「时代广场」），每个 {name,x,y}。\n"
        "- cities：全国地图上的城市 3-8 个，每个 {name,x,y,capital}（主角所在城市 capital=true），"
        "用于「全国」视图；x/y 也按 0-1000 × 0-700。\n"
        "- from/to/at 一律用地点 name，坐标系统会自动解析；请让道路真正连到你的地点，"
        "地铁/公交经过学校、小区、湖等地标；名字要具体、贴合设定。\n"
        "- 地点、城区、湖的坐标要按设定合理分布，不要挤在一起。\n"
        "- 只有真实国家才需要 center（城市真实经纬度 lat/lng 与 zoom 12-15）；虚构城市不用。\n"
        "- 每个 actor 的 location 用地点 name。\n"
        '只输出 JSON：{"fictional":true,"country":"","city":"","district":"","premise":"",'
        '"districts":[{"name":"","x":0,"y":0,"r":0}],'
        '"water":[{"name":"","kind":"lake","x":0,"y":0,"r":0}],'
        '"roads":[{"name":"","kind":"arterial","from":"","to":""}],'
        '"metro":[{"name":"","stations":[{"name":"","at":""}]}],'
        '"bus":[{"name":"","stops":[{"name":"","at":""}]}],'
        '"parks":[{"name":"","x":0,"y":0,"r":0}],'
        '"compounds":[{"name":"","x":0,"y":0,"r":0}],'
        '"buildings":[{"name":"","x":0,"y":0}],'
        '"cities":[{"name":"","x":0,"y":0,"capital":false}],'
        '"actors":[{"name":"","role":"friend","location":""}],'
        '"places":[{"name":"","kind":"","x":0,"y":0,"lat":0,"lng":0,"desc":""}],'
        '"edges":[["地点A","地点B"]],"center":{"lat":0,"lng":0,"zoom":13}}。'
    )

    async def generate_worldview(self, instructions: str = "", map_only: bool = False) -> dict:
        settings = await asyncio.to_thread(self.companion.get_settings)
        current = json.dumps({
            "fictional": settings.get("world_fictional", "fictional"),
            "country": settings.get("world_country", ""), "city": settings.get("world_city", ""),
            "district": settings.get("world_district", ""), "premise": settings.get("world_premise", ""),
            "actors": settings.get("world_actors", ""), "places": settings.get("world_places", ""),
        }, ensure_ascii=False)
        prompt = (self.WORLDVIEW_PROMPT
                  + ("\n只画地图：请完全沿用已填写的地点名与演员，不要改动设定文字，只补全地图要素。\n" if map_only else
                     "\n已填写（可能不完整，请补全并改善，不要推翻用户明确给出的部分）：\n")
                  + current
                  + "\n额外要求：" + str(instructions or "无"))
        model = self._model_for("plan")
        from ..worldsim.worldview import extract_json, input_for_storage, normalize_worldview
        data: dict = {}
        usage_info: dict = {}
        error_message = ""
        try:
            raw = "".join([chunk async for chunk in self.mocr.generate(
                model, [{"role": "user", "content": prompt}], "世界观设计。仅输出 JSON。",
                thinking=False, temperature=0.2, max_tokens=3400, usage=usage_info)])
            data = extract_json(raw)
        except Exception as error:
            error_message = str(error)
            await asyncio.to_thread(self.companion.audit, "world_generate", error_message, "", "failed")
        self.usage.record(model, task="world",
                          input_tokens=int(usage_info.get("prompt_tokens") or 0),
                          output_tokens=int(usage_info.get("completion_tokens") or 0))
        if not data:
            if not error_message:
                error_message = "model returned no parsable worldview JSON"
                await asyncio.to_thread(self.companion.audit, "world_generate", error_message, "", "failed")
            return {"ok": False, "error": f"worldview generation failed: {error_message}"}
        if map_only:
            data.pop("premise", None)
            data.pop("country", None)
            data.pop("city", None)
            data.pop("district", None)
        world = normalize_worldview(data, settings)
        existing_premise = str(settings.get("world_premise") or "").strip()
        model_premise = str(world.get("premise") or "").strip()
        if len(existing_premise) > len(model_premise):
            world["premise"] = existing_premise
        if map_only:
            updates = {"world_map": json.dumps(input_for_storage(data), ensure_ascii=False)}
        else:
            updates = {
                "world_fictional": "fictional" if world["fictional"] else "real",
                "world_country": world["country"], "world_city": world["city"],
                "world_district": world["district"], "world_premise": world["premise"],
                "world_actors": "\n".join(f'{a["name"]}|{a["role"]}' for a in world["actors"]),
                "world_places": ", ".join(p["name"] for p in world["places"]),
                "world_map": json.dumps(input_for_storage(data), ensure_ascii=False),
            }
        await asyncio.to_thread(self.companion.set_settings, updates)
        self._worldsim = None
        self._worldsim_key = None
        await asyncio.to_thread(self.companion.audit,
                                "world_map" if map_only else "world_generate",
                                world["map"]["title"], "", "ok")
        return {"ok": True, "worldview": world, "map_only": map_only}

    async def worldview_snapshot(self) -> dict:
        try:
            settings = await asyncio.to_thread(self.companion.get_settings)
        except Exception:
            settings = {}
        from ..worldsim.worldview import build_map
        try:
            world_map = await asyncio.to_thread(build_map, settings)
        except Exception:
            world_map = {"locations": [], "edges": [], "actors": [],
                         "width": 1000, "height": 700, "title": "世界地图"}
        locations: dict = {}
        runtime = self._worldsim
        if runtime is not None and getattr(runtime, "actor_locations", None):
            locations = dict(runtime.actor_locations)
        return {
            "fictional": str(settings.get("world_fictional", "fictional")) != "real",
            "country": settings.get("world_country", ""), "city": settings.get("world_city", ""),
            "district": settings.get("world_district", ""),
            "premise": settings.get("world_premise", ""), "density": settings.get("world_density", "off"),
            "map": world_map, "actor_locations": locations,
        }

    async def maybe_life_event(self, force: bool = False) -> dict:
        today = datetime.now().date().isoformat()
        if not force and self._last_event_date == today:
            return {"skipped": "done"}
        index = random.Random(today).randrange(len(_LIFE_EVENTS))
        text, delta = _LIFE_EVENTS[index]
        self.emotion.state.apply_delta(dict(delta))
        try:
            await asyncio.to_thread(self.companion.timeline_add, "生活", text)
        except Exception as _exc:
            logger.debug("suppressed error: %s", _exc)
        try:
            await asyncio.to_thread(self.memory.remember, text, "", ["life_event"], 0.5, "episode", "public")
        except Exception as _exc:
            logger.debug("suppressed error: %s", _exc)
        anticipation: list[str] = []
        try:
            upcoming = await asyncio.to_thread(self.companion.upcoming_important_dates, 3)
            anticipation = [str(item.get("title")) for item in upcoming if item.get("title")]
        except Exception as _exc:
            logger.debug("suppressed error: %s", _exc)
        if anticipation:
            self.emotion.state.apply_delta({"valence": 0.05, "arousal": 0.03})
            try:
                await asyncio.to_thread(self.companion.timeline_add, "期待", "、".join(anticipation))
            except Exception as _exc:
                logger.debug("suppressed error: %s", _exc)
        self._last_event_date = today
        return {"event": text, "anticipation": anticipation}

    async def maybe_daily_agenda(self, force: bool = False) -> dict:
        if getattr(self.circadian.state, "is_sleeping", False) and not force:
            return {"skipped": "sleeping"}
        today = datetime.now().date().isoformat()
        if not force and self._last_agenda_date == today:
            return {"skipped": "done"}
        try:
            snapshot = await asyncio.to_thread(self.companion.snapshot)
        except Exception:
            snapshot = {}
        existing = [item for item in (snapshot.get("agenda") or []) if str(item.get("start_at") or "").startswith(today)]
        if existing and not force:
            self._last_agenda_date = today
            return {"skipped": "has_agenda", "count": len(existing)}
        context = json.dumps(await self._daily_context(), ensure_ascii=False)
        prompt = (
            "你是 L.I.F.E。为今天安排 3~5 项属于你自己的生活活动（例如整理房间、看书、出门散步、打游戏、写点东西、听歌），"
            "只安排你自己独自完成的事，不要安排\"给某人发消息/联系某人\"（那属于主动行为，不在这里）。"
            f"结合你的作息与最近关心的事；现在是 {today} {datetime.now().strftime('%H:%M')}，时间要合理且不要重复已有日程。"
            '只返回 JSON：{"agenda":[{"title":"","when":"YYYY-MM-DD HH:MM","detail":""}]}。'
            f"\n当前状态与已有日程：\n{context}"
        )
        model = self._model_for("agenda")
        try:
            usage_info: dict = {}
            raw = "".join([chunk async for chunk in self.mocr.generate(model, [{"role": "user", "content": prompt}], "为今天安排生活活动。仅输出 JSON。", thinking=False, max_tokens=800, usage=usage_info)])
            self.usage.record(model, task="agenda",
                              input_tokens=int(usage_info.get("prompt_tokens") or 0),
                              output_tokens=int(usage_info.get("completion_tokens") or 0))
            plan = json.loads(raw)
        except Exception as error:
            await asyncio.to_thread(self.companion.audit, "daily_agenda", str(error), "", "failed")
            return {"error": str(error)}
        created = 0
        for item in (plan.get("agenda") or [])[:5]:
            title = str(item.get("title") or "").strip()
            if not title:
                continue
            candidate = await asyncio.to_thread(self.companion.add_agenda, title[:120], str(item.get("when") or ""), str(item.get("detail") or "")[:300], "persona_soft_activity")
            if candidate and candidate.get("id") and candidate.get("status") != "ignored":
                created += 1
        self._last_agenda_date = today
        await asyncio.to_thread(self.companion.audit, "daily_agenda", f"created={created}", "", "ok")
        return {"created": created}

    async def autonomous_plan(self, force: bool = False) -> dict:
        if getattr(self.circadian.state, "is_sleeping", False) and not force:
            return {"skipped": "sleeping"}
        now = datetime.now()
        if not force and (now - self._last_plan).total_seconds() < 5400:
            return {"skipped": "recent", "minutes_since": int((now - self._last_plan).total_seconds() // 60)}
        self._last_plan = now
        rhythm = self.circadian.to_dict() if hasattr(self.circadian, "to_dict") else {}
        try:
            snapshot = await asyncio.to_thread(self.companion.snapshot)
        except Exception:
            snapshot = {}
        agenda_items = [{"title": item.get("title"), "at": item.get("start_at")} for item in (snapshot.get("agenda") or [])][:6]
        recent: list[str] = []
        for session_id in list(self._histories.keys())[-2:]:
            for item in self._histories[session_id][-3:]:
                recent.append(f'{item["role"]}: {str(item.get("content",""))[:160]}')
        try:
            upcoming = await asyncio.to_thread(self.companion.upcoming_important_dates, 7)
        except Exception:
            upcoming = []
        minecraft_enabled = bool(getattr(self.tool_config, "minecraft_enabled", False))
        context = json.dumps({
            "time": now.isoformat(timespec="minutes"),
            "sleeping": rhythm.get("is_sleeping"),
            "energy": rhythm.get("mental_energy"),
            "agenda": agenda_items,
            "goals": [{"title": g.get("title"), "progress": g.get("progress"), "status": g.get("status")}
                      for g in (snapshot.get("goals") or []) if g.get("status") != "done"][:6],
            "important_dates": [{"title": item.get("title"), "in_days": item.get("days_until")} for item in upcoming],
            "recent": recent[-6:],
            "conversations": list(self._histories.keys())[-3:],
            "minecraft_enabled": minecraft_enabled,
        }, ensure_ascii=False)
        prompt = (
            "你是 L.I.F.E，一个有自主性的陪伴体。基于当前状态，独立规划你接下来最想做的事——"
            "是否要安排活动、是否要主动联系谁、以及要不要自己去玩，都由你自己判断。"
            '只返回 JSON：{"agenda":[{"title":"","when":"","detail":""}],'
            '"proactive":[{"target":"","motive":"","content":"","preferred_at":""}],'
            '"actions":[{"tool":"minecraft","arguments":{"action":""}}],"note":""}。'
            "规则：agenda 最多 2 条，仅在确有值得安排的事时给出；proactive 最多 1 条，自然真诚、不打扰，"
            "preferred_at 可选（ISO 时间，表示你想在这个时间点说）；"
            "proactive 的 target 用 \"session:<会话ID>\"（给某个对话发消息，推荐，会话ID 见 conversations）、"
            "\"user:<QQ号>\" 或 \"group:<群号>\"；note 可为空；没有想法就用空数组/空字符串；不要重复已有日程。"
            "给某人发消息、问候、联系、回复等对外动作必须放进 proactive；agenda 只放你自己独自完成的活动，"
            "绝对不要把\"给某人发消息\"这类条目写进 agenda。"
            "actions 是你可以立刻执行的自主动作，最多 2 条，目前仅支持 minecraft："
            "当你决定自己去玩我的世界时输出 {\"tool\":\"minecraft\",\"arguments\":{\"action\":\"autopilot_start\"}}"
            "（AI 会自己操作）；想停下用 autopilot_stop；不要频繁启停。"
            "note 仅用于解释本次规划，不是长期记忆，不要写调度结果或睡眠状态报告。\n"
            f"当前状态：{context}"
        )
        model = self._model_for("plan")
        try:
            usage_info: dict = {}
            raw = "".join([chunk async for chunk in self.mocr.generate(
                model, [{"role": "user", "content": prompt}], "自主规划。仅输出 JSON。", thinking=False, max_tokens=800, usage=usage_info)])
            self.usage.record(model, task="plan",
                              input_tokens=int(usage_info.get("prompt_tokens") or 0),
                              output_tokens=int(usage_info.get("completion_tokens") or 0))
            plan = json.loads(raw)
        except Exception as error:
            await asyncio.to_thread(self.companion.audit, "autonomy_plan", str(error), "", "failed")
            return {"error": str(error)}
        applied = {"agenda": 0, "proactive": 0, "actions": 0}
        for item in (plan.get("agenda") or [])[:2]:
            title = str(item.get("title") or "").strip()
            if title:
                await asyncio.to_thread(self.companion.add_agenda, title[:120], str(item.get("when") or ""), str(item.get("detail") or "")[:500])
                applied["agenda"] += 1
        for item in (plan.get("proactive") or [])[:1]:
            content = str(item.get("content") or "").strip()
            if not content:
                continue
            target = str(item.get("target") or "").strip()
            if not target.startswith(("user:", "group:", "session:", "webui:")):
                target = f"session:{list(self._histories.keys())[-1]}" if self._histories else "session:"
            try:
                allowed, _ = await asyncio.to_thread(self.companion.can_proactively_send, target)
            except Exception:
                allowed = False
            preferred_at = str(item.get("preferred_at") or "").strip()
            if preferred_at:
                try:
                    preferred_at = datetime.fromisoformat(preferred_at.replace("Z", "")).isoformat()
                except ValueError:
                    preferred_at = ""
            if allowed:
                await asyncio.to_thread(self.companion.create_proactive_candidate, target,
                                        str(item.get("motive") or "autonomy"), content, preferred_at)
                applied["proactive"] += 1
        applied["actions"] = await self._run_autonomy_actions(plan.get("actions"))
        note = str(plan.get("note") or "").strip()
        if note:
            await asyncio.to_thread(self.companion.audit, "autonomy_note", note[:400], "", "ok")
        await asyncio.to_thread(self.companion.audit, "autonomy_plan", json.dumps(applied, ensure_ascii=False), "", "ok")
        return {"applied": applied, "plan": plan}

    AUTONOMY_ACTIONS = {"minecraft"}
    MINECRAFT_ACTIONS = {"autopilot_start", "autopilot_stop", "connect", "disconnect", "status",
                         "goto", "follow", "stop", "look", "dig", "place", "attack", "use",
                         "chat", "players", "inventory"}

    async def _run_autonomy_actions(self, actions) -> int:
        ran = 0
        for item in (actions or [])[:2]:
            if not isinstance(item, dict):
                continue
            tool = str(item.get("tool") or "").strip()
            if tool not in self.AUTONOMY_ACTIONS:
                continue
            if not getattr(self.tool_config, "minecraft_enabled", False):
                await asyncio.to_thread(self.companion.audit, "autonomy_action", "minecraft disabled", tool, "blocked")
                continue
            args = item.get("arguments") if isinstance(item.get("arguments"), dict) else {}
            action = str(args.get("action") or "").strip()
            if action not in self.MINECRAFT_ACTIONS:
                continue
            try:
                result = await self._call_minecraft(dict(args))
                success = bool(getattr(result, "success", False))
                await asyncio.to_thread(self.companion.audit, "autonomy_action",
                                        f"minecraft {action}", "", "ok" if success else "failed")
                if success:
                    await asyncio.to_thread(self.companion.timeline_add, "游戏",
                                            f"我的世界 · {action}", str(getattr(result, "data", ""))[:120])
                    ran += 1
            except Exception as error:
                await asyncio.to_thread(self.companion.audit, "autonomy_action", str(error), "", "failed")
        return ran

    def _interest_keywords(self) -> list[str]:
        words: list[str] = []
        try:
            for skill in self.companion.list_skills():
                words.append(str(skill.get("name") or ""))
                words.extend(part.strip() for part in str(skill.get("keywords") or "").split(","))
        except Exception as _exc:
            logger.debug("suppressed error: %s", _exc)
        try:
            for item in self.companion.list_world_knowledge():
                words.append(str(item.get("title") or ""))
        except Exception as _exc:
            logger.debug("suppressed error: %s", _exc)
        return [word for word in dict.fromkeys(words) if len(word) >= 2]

    async def outfit_tick(self, force: bool = False) -> dict:
        if getattr(self.circadian.state, "is_sleeping", False) and not force:
            return {"skipped": "sleeping"}
        try:
            snapshot = await asyncio.to_thread(self.companion.snapshot)
        except Exception:
            return {"skipped": "snapshot"}
        wardrobe = [item for item in (snapshot.get("world") or []) if item.get("kind") == "wardrobe"]
        if not wardrobe:
            return {"skipped": "no_wardrobe"}
        today = datetime.now().date().isoformat()
        if await asyncio.to_thread(self.companion.has_journal_for, today, "outfit") and not force:
            return {"skipped": "done"}
        options = "\n".join(f"- {item.get('title')}: {str(item.get('content'))[:80]}" for item in wardrobe[:8])
        prompt = (f"根据天气（{self.environment.weather_text() or '未知'}）和下面的衣橱，写一句今天的穿搭想法（40字内）。"
                  f"只输出正文，不要解释。\n衣橱：\n{options}")
        text = await self._diary_complete(prompt, max_tokens=200)
        if text:
            await asyncio.to_thread(self.companion.journal, text, "outfit")
            await asyncio.to_thread(self.companion.timeline_add, "穿搭", text[:80])
        return {"outfit": text[:80]}

    async def generate_image(self, prompt: str) -> dict:
        if not self.extensions.is_available("image"):
            return {"ok": False, "reason": "image extension unavailable"}
        return {"ok": False, "reason": "image extension provider not implemented in LIFE"}

    async def content_tick(self, force: bool = False) -> dict:
        if getattr(self.circadian.state, "is_sleeping", False) and not force:
            return {"skipped": "sleeping"}
        settings = await asyncio.to_thread(self.companion.get_settings)
        if str(settings.get("enable_content_fetch", "0")) != "1":
            return {"skipped": "disabled"}
        if not force and await asyncio.to_thread(self.companion.has_digest_today):
            return {"skipped": "done"}
        interests = self._interest_keywords()

        async def search(topic: str) -> str:
            result = await self.tools.call("search", query=topic, num_results=3)
            if not result.success:
                return ""
            data = result.data
            if isinstance(data, dict):
                data = data.get("results") or []
            if isinstance(data, list):
                parts = []
                for item in data[:3]:
                    if isinstance(item, dict):
                        parts.append(str(item.get("title") or item.get("snippet") or "")[:120])
                    elif item:
                        parts.append(str(item)[:120])
                return "；".join(part for part in parts if part)
            return str(data)[:300]

        collected = await self.content.collect(self.companion, search=search, interests=interests)
        for item in (collected.get("items") or [])[:5]:
            await asyncio.to_thread(self.companion.timeline_add, "见闻", str(item.get("title"))[:80], str(item.get("summary"))[:160])
        return {"stored": len(collected.get("items") or []), "feeds": collected.get("feeds", 0)}

    def group_should_reply(self, group_id: str, user_id: str, message: str, mentioned: bool = False) -> bool:
        if mentioned:
            return True
        try:
            return bool(self.companion.group_should_continue(group_id, message))
        except Exception:
            return False

    def _onebot_adapter(self):
        runtime = getattr(self, "adapter_runtime", None)
        if runtime is None:
            return None
        current = _adapter_context.get() or {}
        server = runtime.resolve(session_id=current.get("session_id", ""),
                                 self_id=self._active_self_id)
        return server

    async def on_group_observe(self, group_id: str, user_id: str, message: str, name: str = "") -> None:
        await asyncio.to_thread(self.companion.observe_group, group_id, user_id, message, name)

    async def should_reply_in_group(self, group_id: str, user_id: str, message: str, mentioned: bool) -> bool:
        return bool(await asyncio.to_thread(self.group_should_reply, group_id, user_id, message, mentioned))

    async def on_recall(self, session_id: str, user_id: str, note: str, adapter_type: str = "onebot") -> None:
        await asyncio.to_thread(self.memory.store, note, importance=0.35, tags=["recall"],
                                metadata={"scope": session_id})

    async def describe_media_ref(self, ref: str, server=None) -> str:
        return await self.describe_onebot_image(ref)

    @property
    def _active_self_id(self):
        return (_adapter_context.get() or {}).get("self_id")

    def adapters_available(self) -> bool:
        runtime = getattr(self, "adapter_runtime", None)
        return bool(runtime is not None and runtime.servers)

    def adapters_enabled(self) -> bool:
        return bool(getattr(self.tool_config, "onebot_enabled", False))

    async def sync_adapters(self) -> dict:
        return await self.adapter_runtime.sync()

    def adapter_status(self) -> list:
        return self.adapter_runtime.status()

    def upsert_adapter(self, payload: dict) -> dict:
        result = self.adapters.upsert(payload)
        if result.get("ok"):
            self.companion.audit("adapter_upsert", json.dumps(
                {"name": payload.get("name"), "platform": payload.get("platform"),
                 "enabled": payload.get("enabled")}, ensure_ascii=False))
        return result

    def delete_adapter(self, instance_id: str) -> dict:
        result = self.adapters.delete(instance_id)
        if result.get("ok"):
            self.companion.audit("adapter_delete", str(instance_id))
        return result

    def set_adapter_enabled(self, instance_id: str, enabled: bool) -> dict:
        result = self.adapters.set_enabled(instance_id, enabled)
        if result.get("ok"):
            self.companion.audit("adapter_toggle", f"{instance_id} -> {bool(enabled)}")
        return result

    def adapter_routes(self) -> dict:
        return {"routes": [item.to_dict() for item in self.adapters.routes],
                "default_config_id": self.adapters.default_config_id}

    def set_adapter_routes(self, routes: list, default_config_id: str = "") -> dict:
        result = self.adapters.set_routes(routes or [])
        if default_config_id:
            self.adapters.set_default_config(default_config_id)
        return result

    async def adapter_routes_apply(self, routes: list, default_config_id: str = "", push: bool = True) -> dict:
        result = self.set_adapter_routes(routes, default_config_id)
        result["pushed"] = False
        if push:
            try:
                result["pushed"] = bool(await self.sync_adapters())
            except Exception as error:
                result["push_error"] = str(error)
        return result

    def _config_id_for_session(self, session_id: str) -> str:
        try:
            return self.adapters.config_for_session(str(session_id or ""))
        except Exception as error:
            logger.warning("adapter routing failed for session %r; using default config: %s",
                           session_id, error)
            return "default"

    @property
    def active_config_id(self) -> str:
        return getattr(self, "_active_config_id", "") or "default"

    @staticmethod
    def _session_id_probe(session_id: str, adapter_type: str, message: str):
        if str(message or "").strip().lower() not in ("/sid", "/whoami", "/会话"):
            return None
        kind = "群聊" if str(adapter_type or "").endswith("group") else "私聊"
        return f"会话 ID（{kind}）：{session_id}\n把它填进「配置文件」的路由表即可为该会话指定人设。"

    async def _on_adapter_event(self, data: dict, server) -> None:
        self.adapter_runtime.note_self_id(
            server.instance.id, data.get("self_id"), server.instance.platform)
        context_token = _adapter_context.set({
            "self_id": data.get("self_id"),
            "session_id": self.adapter_runtime.session_id(server.instance, data),
            "instance_id": server.instance.id,
        })
        from ..adapters.inbound import InboundBridge
        bridge = self._inbound_bridges.get(server.instance.id)
        if bridge is None or bridge.instance is not server.instance:
            bridge = InboundBridge(self, server.instance)
            self._inbound_bridges[server.instance.id] = bridge
        try:
            await bridge.handle(data, server)
        finally:
            _adapter_context.reset(context_token)

    async def describe_onebot_image(self, ref: str) -> str:
        adapter = self._onebot_adapter()
        model = self._model_for("vision")
        if adapter is None or not model or not str(ref or "").strip():
            return ""
        try:
            payload, mime = await adapter.fetch_image_base64(str(ref))
        except Exception as error:
            logger.debug("onebot image fetch failed: %s", error)
            return ""
        if not payload:
            return ""
        try:
            return await self.mocr.describe_image(
                model, payload, mime=mime,
                prompt="用一两句话描述这张图片：谁、在哪、在做什么。只描述看得见的内容。")
        except Exception as error:
            logger.debug("onebot image describe failed: %s", error)
            return ""

    async def _call_adapter(self, server, action: str, params: dict) -> dict:
        import base64 as _b64
        instance = server.instance
        if instance.http_url:
            import httpx
            headers = {"Authorization": f"Bearer {instance.access_token}"} if instance.access_token else {}
            async with httpx.AsyncClient(base_url=instance.http_url, headers=headers, timeout=20) as client:
                response = await client.post(f"/{action}", json=params)
                response.raise_for_status()
                body = response.json()
                if body.get("retcode", 0) != 0:
                    raise RuntimeError(f"消息平台拒绝 {action}：{body.get('message') or body}")
                return body.get("data") or {}
        return await server.call_api(action, params)

    async def _send_cq(self, server, cq: str, user_id, group_id, session_id: str) -> dict:
        params = {"message": cq}
        if group_id:
            params["group_id"] = int(group_id)
        else:
            params["user_id"] = int(user_id or 0)
        return await self._call_adapter(server, "send_group_msg" if group_id else "send_private_msg", params)

    async def _send_record(self, server, audio: bytes, user_id, group_id, session_id: str) -> dict:
        import base64 as _b64
        if len(audio) > 4 * 1024 * 1024:
            raise ValueError("audio exceeds 4MiB")
        return await self._send_cq(
            server, f"[CQ:record,file=base64://{_b64.b64encode(audio).decode()}]",
            user_id, group_id, session_id)

    async def send_media(self, kind: str, target: str, payload: dict | None = None) -> dict:
        payload = payload or {}
        server = self._onebot_adapter()
        if server is None:
            return {"ok": False, "reason": "no message platform adapter available"}
        user_id = self._target_user_id(target)
        group_id = self._target_group_id(target)
        session_id = str(target or "")
        try:
            if kind == "tts":
                text = str(payload.get("text") or "")
                audio = None
                if self.media.has_tts():
                    audio = await self.media.synthesize(text)
                if audio:
                    await self._send_record(server, audio, user_id, group_id, session_id)
                else:
                    await self._send_cq(server, f"[CQ:tts,text={_cq_escape(text[:300])}]",
                                        user_id, group_id, session_id)
            elif kind == "image":
                await self._send_cq(server, f"[CQ:image,file={_cq_escape(str(payload.get('file') or ''))}]",
                                    user_id, group_id, session_id)
            elif kind == "poke":
                if user_id is None:
                    return {"ok": False, "reason": "poke requires a user target"}
                await self._call_adapter(server, "group_poke" if group_id else "friend_poke",
                                         {"user_id": int(user_id), **({"group_id": int(group_id)} if group_id else {})})
            elif kind == "status":
                await self._call_adapter(server, "set_online_status", {
                    "status": int(payload.get("status") or 0), "ext_status": 0,
                    "battery_status": int(payload.get("battery") or 100)})
            else:
                return {"ok": False, "reason": f"unknown media kind: {kind}"}
        except Exception as error:
            return {"ok": False, "reason": str(error)}
        try:
            await asyncio.to_thread(self.companion.timeline_add, "媒体", f"{kind} → {target}", str(payload)[:120])
        except Exception as _exc:
            logger.debug("suppressed error: %s", _exc)
        return {"ok": True, "kind": kind, "target": target}

    async def group_wake_tick(self) -> dict:
        if getattr(self.circadian.state, "is_sleeping", False):
            return {"skipped": "sleeping"}
        settings = await asyncio.to_thread(self.companion.get_settings)
        if str(settings.get("enable_group_observe", "1")) != "1":
            return {"skipped": "group_observe_off"}
        try:
            snapshot = await asyncio.to_thread(self.companion.snapshot)
        except Exception:
            return {"skipped": "snapshot"}
        interests = self._interest_keywords()
        if not interests:
            return {"skipped": "no_interests"}
        proposed = 0
        for group_id in list((snapshot.get("groups") or {}).keys())[:5]:
            if await asyncio.to_thread(self.companion.group_policy, group_id) == "blacklist":
                continue
            matches = await asyncio.to_thread(self.companion.group_interest_match, group_id, interests)
            if not matches:
                continue
            target = f"group:{group_id}"
            allowed, _ = await asyncio.to_thread(self.companion.can_proactively_send, target)
            if not allowed:
                continue
            content = await self.generate_companion_text("proactive", hint=f"群里正在聊「{matches[0]}」，自然地接一句")
            if content:
                await asyncio.to_thread(self.companion.create_proactive_candidate, target, "group_interest", content)
                await asyncio.to_thread(self.companion.note_group_bot_spoke, group_id, matches[0])
                proposed += 1
        return {"proposed": proposed}

    def _observation_target(self) -> str:
        if self._histories:
            return f"session:{list(self._histories.keys())[-1]}"
        return "session:"

    async def _call_tool_direct(self, name: str, timeout: float = 20.0, **kwargs):
        tool = self.tools.get(name)
        if tool is None:
            return None
        try:
            return await asyncio.wait_for(tool.execute(**kwargs), timeout=timeout)
        except Exception:
            return None

    async def _collect_observations(self) -> tuple[str, list[str]]:
        parts: list[str] = []
        signals: list[str] = []
        neglect = self.neglect_days()
        if neglect >= 0.5:
            parts.append(f"你已经 {neglect:.1f} 天没有和任何人真正说过话了。")
            signals.append("lonely")
        if not getattr(self.tool_config, "mail_require_approval", True):
            result = await self._call_tool_direct("getmail", limit=5, unread_only=True, timeout=60.0)
            data = result.data if (result and result.success) else None
            emails = data.get("emails") or [] if isinstance(data, dict) else []
            if isinstance(data, dict):
                unread_total = int(data.get("unread_count") or len(emails))
                try:
                    await asyncio.to_thread(self.companion.audit, "mail_read",
                                            f"autonomous unread={unread_total}", "", "allowed")
                except Exception as _exc:
                    logger.debug("suppressed error: %s", _exc)
            if emails:
                lines = []
                for item in emails[:5]:
                    sender = str(item.get("from") or "?")[:60]
                    subject = str(item.get("subject") or "(无主题)")[:80]
                    preview = str(item.get("preview") or "").replace("\n", " ")[:80]
                    lines.append(f"- 来自 {sender}｜{subject}｜{preview}")
                unread = int((data or {}).get("unread_count") or len(emails))
                parts.append(f"邮件（未读约 {unread} 封）:\n" + "\n".join(lines))
                signals.append("mail")
        try:
            snapshot = await asyncio.to_thread(self.companion.snapshot)
            lines = []
            for group_id, info in list((snapshot.get("groups") or {}).items())[:5]:
                for msg in (info.get("messages") or [])[:4]:
                    content = str(msg.get("content") or "").strip().replace("\n", " ")
                    if content:
                        lines.append(f"- [群{group_id}] {msg.get('user_id', '?')}: {content[:80]}")
            if lines:
                parts.append("QQ / 群消息（你最近观察到的）:\n" + "\n".join(lines[:12]))
                signals.append("qq")
        except Exception as _exc:
            logger.debug("suppressed error: %s", _exc)
        if getattr(self, "_screen_watch", False) or getattr(self.tool_config, "computer_use", False):
            windows = await self._call_tool_direct("computeruse", timeout=20.0, action="listwindows")
            titles = []
            if windows and windows.success and isinstance(windows.data, dict):
                titles = [str(t) for t in (windows.data.get("windows") or []) if str(t).strip()]
            if titles:
                parts.append("当前打开的窗口（进程 :: 标题）:\n" + "\n".join(f"- {t}" for t in titles[:20]))
                signals.append("windows")
            shot = await self._call_tool_direct("computeruse", timeout=40.0, action="screenshot")
            if shot and shot.success and isinstance(shot.data, dict):
                data = shot.data
                description = str(data.get("description") or "").strip()
                image_b64 = str(data.get("base64") or "").strip()
                mime = str(data.get("mime") or "image/jpeg")
                if not description and image_b64:
                    try:
                        description = await self.mocr.describe_image(
                            self._model_for("vision"), image_b64, mime,
                            prompt="这是用户电脑的屏幕截图。请用两三句话说明：正在使用什么程序、有哪些窗口或内容、用户可能在做什么。")
                    except Exception as error:
                        await asyncio.to_thread(self.companion.audit, "vision_describe", str(error), "", "failed")
                if not description:
                    description = "已截取屏幕画面（视觉模型未返回描述）"
                parts.append("电脑屏幕（视觉模型描述）:\n- " + description[:400])
                signals.append("screen")
        try:
            world = await asyncio.to_thread(self._world_contacts_context)
            if world:
                parts.append("你自己世界里的人（用户不知道你在和他们来往）:\n" + world)
                signals.append("world")
        except Exception as _exc:
            logger.debug("suppressed error: %s", _exc)
        return "\n\n".join(parts), signals

    AUTONOMY_TOOLS = ("computeruse", "search", "web_browse", "minecraft", "agenda_add", "journal",
                      "goal_add", "goal_log", "goal_list",
                      "world")
    AUTONOMY_COMPUTERUSE_ACTIONS = ("screenshot", "listwindows", "move", "click", "type", "key")

    async def _autonomy_think_loop(self, observations: str) -> tuple[str, list[str], int]:
        try:
            memory_context = await asyncio.to_thread(
                self.memory.get_memory_context, "主动关心用户近况", f"session:{self._observation_target()}", self.soul.recall_limit())
        except Exception:
            memory_context = ""
        messages = str(observations)
        taken: list[str] = []
        message = ""
        after_minutes = 0
        try:
            self._last_inner_thread = await asyncio.to_thread(self.companion.inner_thread_context, 3, 6, True)
        except Exception:
            self._last_inner_thread = ""
        for _ in range(3):
            system = self.think.build_prompt(
                user_message=("[内部自主任务] 这是你的自主时间，没有用户直接指令。"
                              "看 External Observations 里你刚收集到的信息，以你的人设自主决定此刻做什么最有意义："
                              "可以先用 computeruse 的 listwindows/screenshot 看一眼用户电脑在做什么，必要时也能用 move/click/type/key 帮用户操作，"
                              "也可以写日记、安排日程、自己玩 Minecraft、搜索资料，或什么都不做。"
                              "如果你发现自己在意某件一直没做的事，可以用 goal_add 给自己定一个目标，"
                              "做完一步就用 goal_log 记下来——只记你真的做了的。"
                              "如果此刻你想主动跟用户说点什么，就把话写进 proactive_message。"),
                emotion_context=json.dumps(self.emotion.state.to_dict()),
                energy_context=f"{self._body_phrase()}；{self.circadian.get_prompt_context()}",
                memory_context=memory_context,
                online_agents=self.online_agent_count,
                skills_context="",
                tools_context=json.dumps(self.get_tools_schema(), ensure_ascii=False),
                time_context=datetime.now().strftime("%Y-%m-%d %H:%M"),
                observations_context=messages,
                cognition_context=self._render_wave_context(),
                self_statement=self._last_self_statement,
                inner_thread=self._last_inner_thread,
            )
            if self._last_persona_context:
                system += "\nPersona:\n" + self._last_persona_context
            try:
                resident_context = self.resident.context_block()
            except Exception:
                resident_context = ""
            if resident_context:
                system += "\n\n你此刻的内心（延续你自己一直在想的事）：\n" + resident_context
            system += ("\n\nAutonomous rules:\n"
                       "- 你可以调用工具来观察或行动，一次最多一个，等结果回来再决定下一步。\n"
                       "- 允许自动执行：computeruse（screenshot/listwindows/move/click/type/key）、search、web_browse、minecraft、agenda_add、journal、goal_add、goal_log、world。\n"
                       "- 你自己的世界里有人可能在想你、或者生你的气（External Observations 会提示）。"
                       "想维持这段关系就调用 world（先 pending 看谁在等，再 reply/visit 联系 ta）；这不打扰用户。\n"
                       "- 想主动联系用户时，把要说的话放进 proactive_message（第一人称、≤80 字、自然、不要引号）；不想打扰就留空。\n"
                       "- 时机也由你决定：看 External Observations 里的时间与最近互动。若此刻不合适（对方可能在忙、深夜、刚聊过），"
                       "用 proactive_after_minutes 给出推迟的分钟数（0=现在就发，最大 1440）；只有真的想说时才安排。")
            try:
                raw = "".join([chunk async for chunk in self.mocr.generate(
                    self._model_for("think"), [{"role": "user", "content": "自主任务"}], system, thinking=True)])
                plan = self.think.parse_response(raw)
            except Exception as error:
                await asyncio.to_thread(self.companion.audit, "autonomy_think", str(error), "", "failed")
                break
            self.emotion.state.apply_delta(self._sanitize_emotion_delta(plan.emotion_delta))
            self._clamp_emotion_spiral()
            if plan.proactive_message:
                message = str(plan.proactive_message).strip().strip('"')
                after_minutes = int(getattr(plan, "proactive_after_minutes", 0) or 0)
            calls = plan.tool_calls or ([plan.tool_call] if plan.tool_call else [])
            if not calls:
                break
            call = calls[0]
            name = str(call.get("name") or "")
            args = call.get("arguments", {k: value for k, value in call.items() if k != "name"})
            if isinstance(args, str):
                try:
                    args = json.loads(args)
                except ValueError:
                    args = {}
            if not isinstance(args, dict):
                args = {}
            if name not in self.AUTONOMY_TOOLS:
                messages += "\n\nAction result:\nblocked " + name + ": not allowed autonomously"
                continue
            if name == "computeruse" and str(args.get("action") or "") not in self.AUTONOMY_COMPUTERUSE_ACTIONS:
                messages += "\n\nAction result:\nblocked computeruse: only screenshot/listwindows"
                continue
            result = await self._call_minecraft(args) if name == "minecraft" else await self._call_tool_direct(name, **args)
            summary = json.dumps({"tool": name, "success": bool(result and result.success),
                                  "data": (result.data if result else None),
                                  "error": (result.error if result else "unavailable")}, ensure_ascii=False)
            taken.append(name)
            messages += "\n\nAction result:\n" + summary
        try:
            await self._author_self_statement(reason="autonomy")
        except Exception as error:  # pragma: no cover - defensive
            logger.debug("autonomous self-statement authoring failed: %s", error)
        return message, taken, after_minutes

    async def observation_tick(self) -> dict:
        if getattr(self.circadian.state, "is_sleeping", False):
            return {"skipped": "sleeping"}
        if getattr(self.emotion.state, "irritation", 0) >= 0.7:
            return {"skipped": "irritated"}
        try:
            settings = await asyncio.to_thread(self.companion.get_settings)
        except Exception:
            settings = {}
        if str(settings.get("enable_proactive", "1")) != "1":
            return {"skipped": "proactive_off"}
        observations, signals = await self._collect_observations()
        message, actions, after_minutes = await self._autonomy_think_loop(observations)
        target = self._observation_target()
        spoke = False
        if message:
            try:
                allowed, reason = await asyncio.to_thread(
                    self.companion.can_proactively_send, target, ignore_quiet=after_minutes > 0)
            except Exception:
                allowed, reason = False, "error"
            if allowed:
                preferred_at = self._next_send_time(after_minutes, settings)
                await asyncio.to_thread(self.companion.create_proactive_candidate,
                                        target, "observation", message, preferred_at)
                note = f"{after_minutes} 分钟后主动联系" if after_minutes else "自主决策后主动联系"
                await asyncio.to_thread(self.companion.timeline_add, "自主", note, message[:80])
                spoke = True
            else:
                await asyncio.to_thread(self.companion.audit, "observation_blocked", reason, "", "blocked")
        if actions:
            await asyncio.to_thread(self.companion.timeline_add, "自主", "自主执行：" + ", ".join(actions), "")
        if not spoke and not actions:
            await asyncio.to_thread(self.companion.timeline_add, "自主", "自主巡视后未行动", ", ".join(signals)[:60])
        return {"consulted": True, "spoke": spoke, "actions": actions, "signals": signals}

    @staticmethod
    def _next_send_time(after_minutes: int, settings: dict) -> str:
        now = datetime.now()
        when = now + timedelta(minutes=max(0, int(after_minutes or 0)))
        try:
            quiet_start = int(settings.get("quiet_start", "23"))
            quiet_end = int(settings.get("quiet_end", "8"))
        except (TypeError, ValueError):
            quiet_start, quiet_end = 23, 8
        if quiet_start != quiet_end:
            hour = when.hour
            if hour >= quiet_start:
                when = (when + timedelta(days=1)).replace(hour=quiet_end, minute=0, second=0, microsecond=0)
            elif hour < quiet_end:
                when = when.replace(hour=quiet_end, minute=0, second=0, microsecond=0)
        if when <= now:
            when = now
        return when.isoformat(timespec="minutes")

    @staticmethod
    def _proactive_due(candidate: dict, now: datetime) -> bool:
        now_utc_dt = parse_utc(now)
        for key, must_be_after in (("preferred_at", True), ("best_until", False), ("expires_at", False)):
            value = str(candidate.get(key) or "").strip()
            if not value:
                continue
            moment = parse_utc(value)
            if moment is None:
                continue
            if must_be_after and moment > now_utc_dt:
                return False
            if not must_be_after and moment < now_utc_dt:
                return False
        return True

    async def proactive_tick(self) -> dict:
        if getattr(self.circadian.state, "is_sleeping", False):
            return {"skipped": "sleeping"}
        if getattr(self.emotion.state, "irritation", 0) >= 0.7:
            return {"skipped": "irritated"}
        try:
            snapshot = await asyncio.to_thread(self.companion.snapshot)
        except Exception:
            return {"skipped": "snapshot"}
        now = datetime.now()
        candidates = [c for c in (snapshot.get("proactive", {}).get("candidates") or [])
                      if c.get("status") == "candidate" and self._proactive_due(c, now)]
        candidates.sort(key=lambda c: str(c.get("preferred_at") or ""))
        try:
            settings = await asyncio.to_thread(self.companion.get_settings)
        except Exception:
            settings = {}
        try:
            min_interval = int(settings.get("min_interval_minutes", "5"))
        except (TypeError, ValueError):
            min_interval = 5
        tts_on = str(settings.get("proactive_tts", "0")) == "1"
        last = await asyncio.to_thread(self.companion.last_delivery_at)
        if last and (now_utc() - last).total_seconds() < max(0, min_interval) * 60:
            return {"skipped": "min_interval", "delivered": 0, "blocked": 0, "candidates": len(candidates)}
        delivered = 0
        blocked = 0
        for candidate in candidates[:5]:
            target = str(candidate.get("target") or "")
            try:
                allowed, reason = await asyncio.to_thread(self.companion.can_proactively_send, target)
            except Exception:
                allowed, reason = False, "error"
            candidate_id = str(candidate.get("id") or "")
            if not allowed:
                blocked += 1
                await asyncio.to_thread(self.companion.audit, "proactive_blocked", reason, candidate_id, "blocked")
                continue
            content = str(candidate.get("content") or "").strip()
            if not content:
                continue
            reviewed = await self._review_outgoing(content, target)
            if reviewed is None:
                await asyncio.to_thread(self.companion.audit, "proactive_deferred", "review_unavailable", candidate_id, "deferred")
                continue
            if not reviewed:
                await asyncio.to_thread(self.companion.audit, "proactive_blocked", "review_declined", candidate_id, "blocked")
                blocked += 1
                continue
            user_id = self._target_user_id(target)
            group_id = self._target_group_id(target)
            if target.startswith("session:") or target.startswith("webui:"):
                session_id = target.split(":", 1)[1].strip()
                await asyncio.to_thread(self.push_notification, session_id, reviewed)
            elif user_id is not None or group_id is not None:
                if not self.adapters_available():
                    blocked += 1
                    await asyncio.to_thread(self.companion.audit, "proactive_blocked", "adapter_unavailable", candidate_id, "blocked")
                    continue
                try:
                    await self.adapter_runtime.send(
                        reviewed, user_id=user_id, group_id=group_id,
                        session_id=str(target or ""), self_id=self._active_self_id)
                except Exception as error:
                    await asyncio.to_thread(self.companion.audit, "proactive_send", str(error), candidate_id, "failed")
                    continue
            else:
                await asyncio.to_thread(self.push_notification, "", reviewed)
            await asyncio.to_thread(self.companion.mark_proactive_delivered, candidate_id, reviewed)
            await asyncio.to_thread(self.companion.timeline_add, "主动", f"主动联系 {target}", reviewed[:80])
            if tts_on and (user_id is not None or group_id is not None) and self._onebot_adapter() is not None and len(reviewed) <= 60:
                await self.send_media("tts", target, {"text": reviewed})
            delivered += 1
        return {"delivered": delivered, "blocked": blocked, "candidates": len(candidates)}

    def push_notification(self, session_id: str, text: str) -> dict:
        notification = {"id": uuid.uuid4().hex, "session_id": session_id or "", "text": text, "created_at": datetime.now().isoformat()}
        self._notifications.append(notification)
        self._notifications = self._notifications[-100:]
        self._save_state()
        return notification

    async def _review_outgoing(self, content: str, target: str):
        prompt = ("以 L.I.F.E 的口吻在发送前复核这条主动消息，使其自然、真诚、不打扰、不超过 80 字。"
                  "只输出最终要发送的文本；若此刻不适合发送，输出空字符串。\n原草稿：" + content)
        try:
            text = "".join([chunk async for chunk in self.mocr.generate(
                self._model_for("output"),
                [{"role": "user", "content": prompt}],
                "主动消息发送前复核。仅输出文本。", thinking=False, max_tokens=200)])
            return text.strip().strip('"')
        except asyncio.CancelledError:
            raise
        except Exception as error:  # noqa: BLE001 - never send an unreviewed draft
            logger.warning("outgoing review unavailable, deferring send: %s", error)
            return None

    @staticmethod
    def _target_user_id(target: str):
        if target.startswith("user:"):
            try:
                return int(target.split(":", 1)[1])
            except (ValueError, IndexError):
                return None
        return None

    @staticmethod
    def _target_group_id(target: str):
        if not target.startswith("group:"):
            return None
        match = re.search(r"\d+$", target.split(":", 1)[1])
        return int(match.group(0)) if match else None

    async def close(self):
        if getattr(self, "resident", None) is not None:
            await self.resident.stop()
        self.flush_state()
        tasks = list(self._background_tasks)
        for task in tasks:
            task.cancel()
        await asyncio.gather(*tasks, return_exceptions=True)
        await self.mocr.close()

    async def on_task_completed(self, task_id, state, result, error=""):
        state = state.removeprefix("TASK_STATE_").lower()
        async with self._dispatch_lock:
            if task_id in self._completed_tasks:
                return ""
            task = self.active_tasks.pop(task_id, None)
            if task is None:
                return ""
            self._completed_tasks = (self._completed_tasks + [task_id])[-200:]
            self.emotion.state.apply_delta(self.emotion.on_task_completed(state == "done"))
            self.circadian.task_completed(60)
        label = {"done": "已完成", "failed": "失败", "cancelled": "已取消"}.get(state, state)
        try:
            await asyncio.to_thread(self.companion.timeline_add, "任务", f"任务{label}",
                                    (result[:160] if state == 'done' else (error or label)[:160]))
        except Exception as _exc:
            logger.debug("suppressed error: %s", _exc)
        facts = result[:2400] if state == 'done' else (error or label)[:800]
        text = f"任务{label}。产物与使用信息：{facts}"
        try:
            prompt = self.output.build_prompt(user_message='请把任务结果简短告诉用户。',
                think_guidance=f'任务状态：{label}。只说明以下产物路径、使用方法、真实限制；不要贴工具日志或长报告，不追问无关扩展。最多三句话。事实：{facts}',
                emotion_context=json.dumps(self.emotion.state.to_dict()),persona_context=task.get('persona_context',''))
            rendered=''.join([chunk async for chunk in self.mocr.generate(self._model_for("output"),[{'role':'user','content':'任务结束，请告知产物和使用方法。'}],prompt,max_tokens=500)])
            if rendered.strip(): text=rendered.strip()
        except Exception as _exc:
            logger.debug("suppressed error: %s", _exc)
        notification = {"id": uuid.uuid4().hex, "session_id": task.get("session_id", ""), "text": text, "created_at": datetime.now().isoformat()}
        async with self._dispatch_lock:
            self._notifications.append(notification)
            self._notifications = self._notifications[-100:]
            self._save_state()
        if task.get("adapter_type", "").startswith("onebot") and self.adapters_available():
            try:
                session = task.get("session_id", "")
                group = task.get("adapter_type") == "onebot_group"
                target = int(session.rsplit("_", 1)[-1].rsplit(":", 1)[-1]) if group else int(task["user_id"])
                await self.adapter_runtime.send(
                    text, session_id=session, self_id=self._active_self_id,
                    **({"group_id": target} if group else {"user_id": target}))
                self._notifications.remove(notification)
                self._save_state()
            except Exception as exc:
                await asyncio.to_thread(self.companion.audit, "task_notification", str(exc), task_id, "failed")
        return text

    def get_notifications(self, session_id=""):
        selected = [item for item in self._notifications if not session_id or item["session_id"] == session_id]
        return selected

    def acknowledge_notifications(self, session_id, ids):
        acknowledged=set(ids or [])
        self._notifications=[item for item in self._notifications if item["id"] not in acknowledged]
        self._save_state()

    async def clear_memory(self):
        result=await asyncio.to_thread(self.memory.clear_all)
        self._histories.clear()
        self._save_state()
        return result

    async def compact_conversation(self, history, persona=None):
        entries = [f"{m.get('role', 'user')}: {str(m.get('content', ''))}" for m in history if isinstance(m, dict) and m.get('content')]
        if not entries:
            raise ValueError("没有可压缩的上下文")
        transcript = "\n".join(entries)
        system_prompt = _compaction_prompt(persona)
        summary = ""
        for offset in range(0, len(transcript), 18000):
            segment = transcript[offset:offset+18000]
            content = f"Prior summary:\n{summary}\n\nNext transcript segment:\n{segment}" if summary else f"Transcript segment:\n{segment}"
            summary = "".join([chunk async for chunk in self.mocr.generate(self._model_for("compact"),
                [{"role":"user","content":content}], system_prompt, thinking=True)])
            if not summary.strip() or summary.startswith('[mocr offline]'):
                raise RuntimeError("压缩模型未返回有效摘要，原上下文保持不变")
        return _normalize_compaction_summary(summary)

    def get_tools_schema(self):
        return self.tools.list_tools()

    def get_state(self):
        return {"emotion": self.emotion.state.to_dict(), "circadian": self.circadian.to_dict(), "active_tasks": list(self.active_tasks),
                "online_agents": self.online_agent_count, "total_agents": len(self.online_agents)}

    def get_memory_stats(self):
        return self.memory.get_stats()

    def list_memories(self, limit=50, query=""):
        items = self.memory.list_items()
        return sorted([m for m in items if query.lower() in m["content"].lower()], key=lambda m: m["created_at"], reverse=True)[:max(1, limit)]

    def get_permissions(self):
        return {"screen_watch": getattr(self, "_screen_watch", False), "computer_use": self.tool_config.computer_use, "report_agent_host": getattr(self, "_report_agent_host", "")}

    def set_permissions(self, screen_watch=False, computer_use=False, report_agent_host=""):
        self._screen_watch = bool(screen_watch)
        self.tool_config.computer_use = bool(computer_use)
        self._report_agent_host = report_agent_host
        return self.get_permissions()

    def _model_for(self, task: str = "think") -> str:
        route = (self.model_routes or {}).get(task)
        if route:
            return str(route)
        if task in ("think", "plan", "agenda", "reflect", "journal", "dream", "compact"):
            return self.think_model or self.default_model
        return self.output_model or self.default_model

    def apply_model_routes(self, routes) -> dict:
        if isinstance(routes, str):
            try:
                routes = json.loads(routes or "{}")
            except ValueError:
                routes = {}
        self.model_routes = {str(key): str(value) for key, value in (routes or {}).items() if str(value).strip()}
        return self.model_routes

    def get_usage(self) -> dict:
        return self.usage.summary()

    def apply_tool_settings(self, values):
        self.tool_config.mail_require_approval = bool(values.get("mail_require_approval", True))
        self.tool_config.mail_auto_approve_all = bool(values.get("mail_auto_approve_all", False))
        self.tool_config.computer_use = bool(values.get("computer_use", False))
        self.tool_config.mcp_enabled = values.get("mcp_enabled") is not False
        self.tool_config.onebot_enabled = bool(values.get("onebot_enabled", False))
        if getattr(self, "adapter_runtime", None) is not None:
            self.adapter_runtime.enabled = self.tool_config.onebot_enabled
        registry = getattr(self, "adapters", None)
        if registry is not None:
            if "onebot_observe_group" in values:
                for instance in registry.instances:
                    instance.observe_group = values["onebot_observe_group"] is not False
            if values.get("onebot_reverse_host"):
                self.adapters.default_host = str(values["onebot_reverse_host"])
            if values.get("onebot_reverse_port"):
                try:
                    self.adapters.default_port = int(values["onebot_reverse_port"])
                except (TypeError, ValueError):
                    pass
        self.tool_config.minecraft_enabled = bool(values.get("minecraft_enabled", False))
        self.tool_config.minecraft_url = str(values.get("minecraft_url") or "http://127.0.0.1:8765")
        self._screen_watch = bool(values.get("screen_watch", False))
        self._report_agent_host = str(values.get("report_agent_host") or "")
        self._media_settings = {
            "voice_reply_enabled": values.get("voice_reply_enabled", "true"),
            "selfie_enabled": values.get("selfie_enabled", "true"),
            "call_enabled": values.get("call_enabled", "false"),
        }
        self.think_model = str(values.get("think_model") or os.getenv("LIFE_THINK_MODEL", ""))
        self.output_model = str(values.get("output_model") or os.getenv("LIFE_OUTPUT_MODEL", ""))
        if values.get("model_routes") is not None:
            self.apply_model_routes(values.get("model_routes"))
        if values.get("proactive_daily_limit") is not None or values.get("proactive_target_limit") is not None:
            policy = self.companion.get_policy()
            daily = int(values["proactive_daily_limit"]) if values.get("proactive_daily_limit") is not None else policy["daily_limit"]
            per_target = int(values["proactive_target_limit"]) if values.get("proactive_target_limit") is not None else policy["per_target_limit"]
            self.companion.set_runtime_policy(daily, per_target)
        existing = self._plugin_refresh_task
        if existing is not None and not existing.done():
            return
        try:
            task = asyncio.get_running_loop().create_task(self.refresh_plugin_tools())
            self._plugin_refresh_task = task
            self._background_tasks.add(task)
            task.add_done_callback(self._background_tasks.discard)
        except RuntimeError:
            pass

    async def refresh_plugin_tools(self):
        import httpx

        from life.http_auth import auth_headers

        for name in list(self._plugin_tool_names):
            self.tools.tools.pop(name, None)
        self._plugin_tool_names.clear()
        base = (os.environ.get("CORE_HTTP_ADDR") or os.environ.get("CORE_HTTP") or "http://127.0.0.1:8080").rstrip("/")
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.get(f"{base}/api/tools", params={"scope": "life"}, headers=auth_headers())
            if response.status_code != 200:
                return
            for definition in response.json().get("tools") or []:
                name = str(definition.get("name") or "")
                if not name or name in self.tools.tools:
                    continue
                self.tools.register(PluginTool(definition))
                self._plugin_tool_names.add(name)
        except Exception:
            return

    APPROVAL_TIMEOUT = 120

    def _approval_detail(self, tool: str, args: dict) -> str:
        args = args if isinstance(args, dict) else {}
        if tool == "mcp":
            inner_tool = str(args.get("tool") or "")
            if inner_tool in ("getmail", "sendmail"):
                return self._approval_detail(inner_tool, args.get("args") or {})
            return f"mcp → {args.get('server', '')}:{inner_tool}"
        if tool == "sendmail":
            to = str(args.get("to") or "")
            subject = str(args.get("subject") or "").strip()[:80]
            return f"收件人：{to}｜主题：{subject or '(无主题)'}"
        if tool == "getmail":
            return f"读取收件箱（limit={args.get('limit', 5)}, unread_only={bool(args.get('unread_only'))}）"
        return json.dumps(args, ensure_ascii=False)[:200] if args else ""

    async def _approve_tool(self, tool: str, args: dict):
        if getattr(self.tool_config, "mail_auto_approve_all", False):
            return True, "全部自动审批"
        if not getattr(self.tool_config, "mail_require_approval", True):
            return True, "无需确认"
        import uuid
        approval_id = uuid.uuid4().hex[:12]
        detail = self._approval_detail(tool, args)
        event = asyncio.Event()
        entry = {"id": approval_id, "tool": tool, "detail": detail,
                 "created_at": datetime.now().isoformat(), "event": event, "allowed": None,
                 "loop": asyncio.get_running_loop()}
        self._approvals[approval_id] = entry
        try:
            await asyncio.to_thread(self.companion.audit, "mail_approval", f"{tool} {detail}", "", "pending")
        except Exception as _exc:
            logger.debug("suppressed error: %s", _exc)
        try:
            await asyncio.wait_for(event.wait(), timeout=self.APPROVAL_TIMEOUT)
        except asyncio.TimeoutError:
            self._approvals.pop(approval_id, None)
            try:
                await asyncio.to_thread(self.companion.audit, "mail_approval", tool, "", "expired")
            except Exception as _exc:
                logger.debug("suppressed error: %s", _exc)
            return False, "超时未确认"
        self._approvals.pop(approval_id, None)
        allowed = bool(entry.get("allowed"))
        try:
            await asyncio.to_thread(self.companion.audit, "mail_approval", tool, "", "allowed" if allowed else "denied")
        except Exception as _exc:
            logger.debug("suppressed error: %s", _exc)
        return allowed, ("已允许" if allowed else "已拒绝")

    def list_approvals(self) -> list[dict]:
        return [{"id": a["id"], "tool": a["tool"], "detail": a["detail"], "created_at": a["created_at"]}
                for a in self._approvals.values()]

    def resolve_approval(self, approval_id: str, allowed: bool) -> bool:
        entry = self._approvals.get(str(approval_id))
        if not entry:
            return False
        entry["allowed"] = bool(allowed)
        loop = entry.get("loop")
        event = entry["event"]
        if loop is not None and loop.is_running():
            loop.call_soon_threadsafe(event.set)
        else:
            event.set()
        return True

    async def poll_minecraft(self):
        if not self.tool_config.minecraft_enabled:
            return
        tool = self.tools.get("minecraft")
        if tool is None:
            return
        try:
            result = await tool.execute(action="events", since=self.minecraft_cursor)
        except Exception:
            return
        if not result.success or not isinstance(result.data, dict):
            return
        events = result.data.get("events") or []
        for event in events[:100]:
            if not isinstance(event, dict):
                continue
            kind = str(event.get("type") or "")
            data = event.get("data")
            if kind == "state" and isinstance(data, dict) and data.get("host"):
                self.minecraft_host = f"{data.get('host')}:{data.get('port', '')}".rstrip(":")
                continue
            if kind == "consent_request" and isinstance(data, dict):
                detail = str(data.get("detail") or data.get("action") or "需要批准的动作")
                await asyncio.to_thread(self.push_notification, "", f"Minecraft：机器人想{detail}，请在页面批准或拒绝。")
                await asyncio.to_thread(self.companion.audit, "minecraft_consent", detail, str(data.get("id") or ""), "pending")
                continue
            if kind == "chat" and isinstance(data, dict):
                if data.get("raw"):
                    continue
                username = str(data.get("username") or "").strip()
                message = str(data.get("message") or "").strip()
                if not username or not message:
                    continue
                try:
                    await asyncio.to_thread(
                        self.memory.remember,
                        f"在 Minecraft「{self.minecraft_host or '服务器'}」里，{username} 说：{message}",
                        f"{username} 在游戏里对我说的话",
                        ["minecraft", self.minecraft_host, username, "chat"],
                        0.45,
                        "episodic",
                    )
                except Exception as _exc:
                    logger.debug("suppressed error: %s", _exc)
                continue
            if kind == "log":
                text = str(data or "")
                if any(marker in text for marker in ("authenticated", "spawned", "kicked", "joined", "left", "sent /register", "sent /login")):
                    try:
                        await asyncio.to_thread(
                            self.memory.remember,
                            f"Minecraft 事件：{text}",
                            "",
                            ["minecraft", self.minecraft_host, "event"],
                            0.4,
                            "episodic",
                        )
                    except Exception as _exc:
                        logger.debug("suppressed error: %s", _exc)
        cursor = result.data.get("cursor")
        if isinstance(cursor, int):
            self.minecraft_cursor = cursor

    async def learn_from_minecraft(self):
        if not self.tool_config.minecraft_enabled:
            return
        now = datetime.now()
        if self._minecraft_learned_at and (now - self._minecraft_learned_at).total_seconds() < 1800:
            return

        def _recent():
            return self.memory.recall("Minecraft 服务器 玩家 聊天 一起玩 挖矿 建筑", top_k=20, scope="*")

        try:
            records = await asyncio.to_thread(_recent)
        except Exception:
            return
        lines = []
        for record in records:
            tags = " ".join(getattr(record, "tags", []) or []).lower()
            content = getattr(record, "content", "") or ""
            if "minecraft" in tags or "Minecraft" in content:
                lines.append(content)
        lines = lines[-15:]
        if len(lines) < 3:
            return
        self._minecraft_learned_at = now

        system = (
            "You distil a Minecraft companion bot's experiences into durable learning. "
            "Return JSON only, no prose: "
            '{"summary":"one or two sentences of lasting knowledge about the server/players",'
            '"note_title":"short title","note_body":"a few markdown lines",'
            '"skill":{"name":"short skill name","note":"when to use it",'
            '"steps":[{"action":"goto|follow|chat|waypoint_goto|waypoint_add|dig|place","args":{},"waitMs":0}]}}'
            " Use an empty skill name and empty steps when nothing reusable was learned."
        )
        try:
            text = ""
            model = self._model_for("think")
            async for chunk in self.mocr.generate(model, [{"role": "user", "content": "\n".join(lines)}], system, max_tokens=800, temperature=0.4):
                text += chunk
            cleaned = text.strip()
            if cleaned.startswith("```"):
                cleaned = cleaned.strip("`")
                if cleaned.startswith("json"):
                    cleaned = cleaned[4:]
            data = json.loads(cleaned[cleaned.index("{"): cleaned.rindex("}") + 1])
        except Exception:
            return

        summary = str(data.get("summary") or "").strip()
        if summary:
            try:
                await asyncio.to_thread(self.memory.remember, f"Minecraft 学习：{summary}", "", ["minecraft", "learned"], 0.6, "knowledge")
            except Exception as _exc:
                logger.debug("suppressed error: %s", _exc)
        title = str(data.get("note_title") or "").strip()
        body = str(data.get("note_body") or "").strip()
        if title and body:
            try:
                await asyncio.to_thread(self.memory.create_note, title, body, ["minecraft", "learned"], "public")
            except Exception as _exc:
                logger.debug("suppressed error: %s", _exc)
        skill = data.get("skill") if isinstance(data.get("skill"), dict) else {}
        steps = skill.get("steps") if isinstance(skill.get("steps"), list) else []
        if skill.get("name") and steps:
            tool = self.tools.get("minecraft")
            if tool is not None:
                try:
                    await tool.execute(action="skill_save", name=str(skill.get("name")), note=str(skill.get("note") or ""), steps=steps)
                except Exception as _exc:
                    logger.debug("suppressed error: %s", _exc)

    async def _minecraft_password(self, host: str) -> str:
        if not host:
            return ""

        def _recall():
            return self.memory.recall(f"Minecraft server {host} login password 登录密码", top_k=5, scope="credential")

        try:
            records = await asyncio.to_thread(_recall)
        except Exception:
            return ""
        for record in records:
            content = getattr(record, "content", "") or ""
            tags = " ".join(getattr(record, "tags", []) or [])
            if host not in content and host not in tags:
                continue
            match = re.search(r"(?:密码[：:]\s*|password[：:\s]+)(\S+)", content, flags=re.IGNORECASE)
            if match:
                return match.group(1).strip()
        return ""

    async def _call_minecraft(self, args: dict):
        action = str(args.get("action") or "").lower()
        host = str(args.get("host") or "").strip()
        if action == "connect" and not args.get("password") and host:
            remembered = await self._minecraft_password(host)
            if remembered:
                args["password"] = remembered
        result = await self.tools.call("minecraft", **args)
        if action == "connect" and getattr(result, "success", False) and isinstance(result.data, dict):
            password = result.data.get("generated_password")
            target = host or str(result.data.get("host") or "")
            if password and target:
                try:
                    await asyncio.to_thread(
                        self.memory.remember,
                        f"Minecraft 服务器 {target} 登录密码：{password}",
                        "该服务器的 /login 密码，供自动登录使用",
                        ["minecraft", "credential", target],
                        0.9,
                        "credential",
                        "credential",
                    )
                except Exception as _exc:
                    logger.debug("suppressed error: %s", _exc)
        return result
