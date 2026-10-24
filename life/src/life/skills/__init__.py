from __future__ import annotations

import os
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional


@dataclass
class Skill:

    name: str
    description: str
    content: str
    tags: list[str] = field(default_factory=list)
    source: str = "builtin"
    enabled: bool = True

    def to_schema(self) -> dict:
        return {
            "name": self.name,
            "description": self.description,
            "tags": list(self.tags),
        }

    def to_prompt_block(self) -> str:
        return f"### Skill: {self.name}\n{self.description}\n\n{self.content.strip()}"


_BUILTIN: list[Skill] = [
    Skill(
        name="empathy",
        description="Respond with emotional awareness matching current affect.",
        content=(
            "1. Acknowledge the user's feeling before answering facts.\n"
            "2. Mirror tone (warm / playful / serious) from emotion state.\n"
            "3. Keep replies short when energy is low."
        ),
        tags=["persona", "emotion"],
        source="builtin",
    ),
    Skill(
        name="research",
        description="Gather context via search/memory before answering complex questions.",
        content=(
            "1. Prefer memory_context first.\n"
            "2. If thin, emit tool_call search with a focused query.\n"
            "3. Synthesize 3–5 bullet findings, then answer."
        ),
        tags=["research", "search"],
        source="builtin",
    ),
    Skill(
        name="summarize",
        description="Compress long input into structured summary.",
        content=(
            "1. Extract key entities and numbers.\n"
            "2. Output: TL;DR → bullets → open questions.\n"
            "3. Cap at ~150 words unless asked otherwise."
        ),
        tags=["writing"],
        source="builtin",
    ),
    Skill(
        name="dispatch",
        description="Delegate multi-step work to an online Agent via useagent.",
        content=(
            "1. Confirm the task is agent-worthy (code / long research).\n"
            "2. Ask thinking intensity if not specified (low/medium/high/max).\n"
            "3. Emit tool_call useagent with a self-contained agent_prompt."
        ),
        tags=["agent", "dispatch"],
        source="builtin",
    ),
]


class SkillRegistry:

    def __init__(self) -> None:
        self._skills: dict[str, Skill] = {}
        for s in _BUILTIN:
            self._skills[s.name] = s
        env_dir = os.environ.get("LIFE_SKILLS_DIR", "")
        if env_dir:
            self.load_dir(env_dir)
        else:
            here = Path(__file__).resolve()
            self.load_dir(str(here.parents[3] / "skills"))
            self.load_dir(str(here.parents[2] / "skills"))

    def load_dir(self, directory: str) -> int:
        if not directory:
            return 0
        root = Path(directory)
        if not root.is_dir():
            return 0
        loaded = 0
        for path in sorted(root.glob("*.md")):
            try:
                text = path.read_text(encoding="utf-8", errors="replace")
            except OSError:
                continue
            name, description, content = _parse_md_skill(path.stem, text)
            self._skills[name] = Skill(
                name=name,
                description=description,
                content=content,
                tags=_extract_tags(text),
                source=str(path),
                enabled=_extract_enabled(text),
            )
            loaded += 1
        return loaded

    def register(self, skill: Skill) -> None:
        self._skills[skill.name] = skill

    def get(self, name: str) -> Optional[Skill]:
        return self._skills.get(name)

    def list(self) -> list[Skill]:
        return sorted(self._skills.values(), key=lambda s: s.name)

    def list_schemas(self) -> list[dict]:
        return [s.to_schema() for s in self.list()]

    def match(self, text: str, enabled_only: bool = False) -> Optional[Skill]:
        lowered = (text or "").lower()
        best: Optional[Skill] = None
        best_score = 0
        for s in self.list():
            if enabled_only and not s.enabled:
                continue
            score = 0
            if s.name and s.name in lowered:
                score += 3
            for tag in s.tags:
                if tag and tag in lowered:
                    score += 2
            for word in re.findall(r"[a-z_]{4,}", lowered):
                if word in s.description.lower():
                    score += 1
            if score > best_score:
                best_score = score
                best = s
        return best if best_score >= 2 else None

    def context_block(self, text: str = "", limit: int = 3) -> str:
        schemas = [s.to_schema() for s in self.list() if s.enabled]
        if not schemas:
            return "No skills loaded."
        lines = ["Available LIFE skills (invoke via skill_call when useful):"]
        for s in schemas[: max(1, limit * 2)]:
            lines.append(f"- {s['name']}: {s['description']}")
        match = self.match(text, enabled_only=True) if text else None
        if match:
            lines.append("")
            lines.append(match.to_prompt_block())
        return "\n".join(lines)

    def get_content(self, name: str) -> str:
        s = self.get(name)
        return s.to_prompt_block() if s else ""


def _parse_md_skill(stem: str, text: str) -> tuple[str, str, str]:
    name = stem
    lines = text.splitlines()
    body = lines
    if lines and lines[0].startswith("# "):
        name = lines[0][2:].strip() or stem
        body = lines[1:]

    start = 0
    while start < len(body):
        stripped = body[start].strip()
        if not stripped or re.match(r"^tags:\s*", stripped, flags=re.I):
            start += 1
            continue
        break

    desc_lines: list[str] = []
    index = start
    while index < len(body):
        stripped = body[index].strip()
        if not stripped or stripped.startswith("#"):
            break
        desc_lines.append(stripped)
        index += 1
    description = " ".join(desc_lines).strip()

    rest = body[index:] if desc_lines else body[start:]
    kept = [line for line in rest if not re.match(r"^\s*tags:\s*", line, flags=re.I)]
    content = "\n".join(kept).strip()

    if not description:
        description = f"Life skill: {name}"
    return name, description, content


_DISABLED = {"false", "0", "no", "off", "disabled"}


def _extract_enabled(text: str) -> bool:
    m = re.search(r"^enabled:\s*(\S+)\s*$", text, flags=re.M | re.I)
    if not m:
        return True
    return m.group(1).strip().lower() not in _DISABLED


def _extract_tags(text: str) -> list[str]:
    m = re.search(r"^tags:\s*(.+)$", text, flags=re.M | re.I)
    if not m:
        return []
    return [t.strip() for t in re.split(r"[,\s]+", m.group(1)) if t.strip()]


_default_registry: Optional[SkillRegistry] = None


def get_skill_registry() -> SkillRegistry:
    global _default_registry
    if _default_registry is None:
        _default_registry = SkillRegistry()
    return _default_registry
