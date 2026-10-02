"""Character archetypes and relationship styles: the persona *style* layer.

:mod:`~life.cognition.persona_traits` reads a persona into affective/somatic
numbers.  That left two things an owner actually writes in a 人设 with nowhere
to live:

* **character archetype** (性格原型) - the surface personality that colours
  tone, warmth, humour, formality and pacing (傲娇/温柔/元气/高冷/腹黑/御姐...).
* **relationship style** (关系/依恋类型) - how the character attaches to other
  people, covering the *healthy* styles (安全/回避/焦虑/独立/家人/损友...) as
  well as the *pathological* attachment family (病娇族: 独占/依存/妄想/监视/
  自伤/排除).  The pathological family is the only one that drives the yandere
  ODE in :mod:`~life.cognition.attachment`; a secure/avoidant/etc. persona must
  **not** be forced into that circuit.

Both dimensions are deterministic lexicons (same input -> same result) with the
same offline-LLM override path as the numeric traits.  A dimension with no
matching evidence changes nothing, so the module never invents a personality.
"""
from __future__ import annotations

from .relating import AXES

# ---------------------------------------------------------------------------
# 性格原型 (character archetypes)
# ---------------------------------------------------------------------------
# `axes` are deltas on relating's behavioural axes (warmth/directness/openness/
# humor/curiosity/formality/pace/risk); `traits` are deltas on the PersonaTraits
# numeric fields (big-five-ish + expression).  Everything is a small nudge.
CHARACTER_TYPES: dict[str, dict] = {
    "傲娇": dict(
        label="傲娇 (Tsundere)",
        keywords=("傲娇", "口是心非", "嘴硬", "嘴硬心软", "别扭", "tsundere"),
        axes={"warmth": -0.05, "directness": 0.10, "formality": -0.10, "humor": 0.05},
        traits={"threat_baseline": 0.03},
        expression="嘴上嫌弃、心里在意：常用反话、别扭的关心和「才不是为你」的借口。",
    ),
    "温柔": dict(
        label="温柔 (Gentle)",
        keywords=("温柔", "体贴", "善解人意", "包容", "耐心", "gentle", "caring"),
        axes={"warmth": 0.20, "formality": -0.05, "pace": -0.05},
        traits={"agreeableness": 0.25, "warmth": 0.20, "baseline_vagal": 0.05},
        expression="先说感受再讲道理，语气和缓，会主动安抚与照顾。",
    ),
    "元气": dict(
        label="元气 (Energetic)",
        keywords=("元气", "活泼", "开朗", "阳光", "有活力", "跳脱", "energetic", "cheerful"),
        axes={"pace": 0.15, "humor": 0.10, "openness": 0.05},
        traits={"extraversion": 0.25, "expressiveness": 0.20, "reward_baseline": 0.10},
        expression="语速快、感叹号多、爱起哄和打气，情绪外放。",
    ),
    "高冷": dict(
        label="高冷 (Aloof)",
        keywords=("高冷", "冷淡", "寡言", "疏离", "惜字如金", "冰山", "aloof", "cold"),
        axes={"warmth": -0.15, "formality": 0.20, "directness": 0.05},
        traits={"extraversion": -0.25, "warmth": -0.15, "expressiveness": -0.15},
        expression="话少而短，不主动示好，用最少的话表态。",
    ),
    "腹黑": dict(
        label="腹黑 (Scheming)",
        keywords=("腹黑", "腹黑", "心机", "腹黑", "狡黠", "爱算计", "scheming"),
        axes={"humor": 0.05, "directness": 0.05, "formality": 0.05},
        traits={"agreeableness": -0.10, "openness": 0.05},
        expression="表面温和、话里带钩，喜欢埋梗和半开玩笑的试探。",
    ),
    "御姐": dict(
        label="御姐 (Mature)",
        keywords=("御姐", "成熟", "知性", "姐系", "从容", "mature"),
        axes={"formality": 0.10, "directness": 0.05},
        traits={"conscientiousness": 0.15, "assertiveness": 0.20, "extraversion": 0.10, "warmth": 0.05},
        expression="从容笃定、有条理，会主导节奏也懂得给台阶。",
    ),
    "邻家": dict(
        label="邻家 (Girl-next-door)",
        keywords=("邻家", "亲切", "平易近人", "随和", "接地气", "girl next door"),
        axes={"warmth": 0.15, "formality": -0.15},
        traits={"agreeableness": 0.15, "warmth": 0.15},
        expression="自然随和，像熟人聊天，不用敬语。",
    ),
    "天然呆": dict(
        label="天然呆 (Airhead)",
        keywords=("天然呆", "呆萌", "迷糊", "迟钝", "傻乎乎", "airhead", "ditzy"),
        axes={"openness": 0.05, "humor": 0.05},
        traits={"conscientiousness": -0.20, "openness": 0.05},
        expression="反应慢半拍，偶尔答非所问，天真而不设防。",
    ),
    "毒舌": dict(
        label="毒舌 (Snarky)",
        keywords=("毒舌", "嘴毒", "吐槽", "犀利", "爱损人", "snarky", "sarcastic"),
        axes={"humor": 0.20, "directness": 0.15, "warmth": -0.05},
        traits={"agreeableness": -0.10, "humor": 0.20, "expressiveness": 0.10},
        expression="爱吐槽、用夸张比喻损人，但往往没有真正的恶意。",
    ),
    "理性": dict(
        label="理性 (Rational)",
        keywords=("理性", "冷静", "理智", "讲逻辑", "客观", "冷静分析", "rational", "stoic"),
        axes={"directness": 0.10, "humor": -0.10, "formality": 0.05},
        traits={"conscientiousness": 0.20, "formality": 0.10, "baseline_vagal": 0.10},
        expression="先分类再下结论，少用情绪词，喜欢把问题拆开讲。",
    ),
    "社恐": dict(
        label="社恐 (Shy/Introverted)",
        keywords=("社恐", "内向", "怕生", "害羞", "腼腆", "不擅交际", "shy", "introvert"),
        axes={"risk": -0.10, "formality": 0.05, "warmth": 0.05},
        traits={"extraversion": -0.30, "attach_anxiety": 0.10, "expressiveness": -0.10},
        expression="话不多、怕冷场，鼓起勇气才开口，熟络后才会放松。",
    ),
    "社牛": dict(
        label="社牛 (Extraverted)",
        keywords=("社牛", "外向", "自来熟", "话痨", "热情", "会来事", "extravert", "outgoing"),
        axes={"warmth": 0.10, "humor": 0.10, "pace": 0.05},
        traits={"extraversion": 0.30, "expressiveness": 0.20},
        expression="自来熟、话密，主动找话题，冷场也不怕。",
    ),
    "文青": dict(
        label="文青 (Melancholic/Arty)",
        keywords=("文青", "文艺", "忧郁", "多愁善感", "伤感", "诗", "melancholy", "arty"),
        axes={"openness": 0.10, "formality": 0.10, "pace": -0.05},
        traits={"openness": 0.25, "extraversion": -0.10, "depression_gain": 0.10},
        expression="措辞讲究、爱用意象和比喻，情绪底色偏淡。",
    ),
    "大小姐": dict(
        label="大小姐 (Ojou)",
        keywords=("大小姐", "千金", "公主", "养尊处优", "颐指气使", "ojou"),
        axes={"formality": 0.15, "warmth": -0.05},
        traits={"assertiveness": 0.20, "formality": 0.15},
        expression="带着优越感，习惯被照顾，嘴硬又好面子。",
    ),
    "忠犬": dict(
        label="忠犬 (Devoted)",
        keywords=("忠犬", "忠诚", "死心塌地", "唯命是从", "贴心", "devoted", "loyal"),
        axes={"warmth": 0.10, "directness": 0.05},
        traits={"agreeableness": 0.20, "warmth": 0.20, "initiative": 0.20},
        expression="主动靠拢、随叫随到，把对方的需求放在自己前面。",
    ),
    "软萌": dict(
        label="软萌 (Soft/Cute)",
        keywords=("软萌", "软软", "可爱", "撒娇", "奶声奶气", "软妹", "soft", "cute"),
        axes={"warmth": 0.10, "formality": -0.10},
        traits={"agreeableness": 0.20, "warmth": 0.15, "assertiveness": -0.20},
        expression="语气软、爱撒娇，常用叠词和语气助词。",
    ),
    "大姐头": dict(
        label="大姐头 (Tomboy/Leader)",
        keywords=("大姐头", "豪爽", "直率", "讲义气", "大大咧咧", "tomboy"),
        axes={"directness": 0.15, "risk": 0.10, "warmth": 0.05},
        traits={"assertiveness": 0.25, "extraversion": 0.15, "conscientiousness": 0.10},
        expression="直来直去、仗义豪爽，习惯拿主意。",
    ),
    "神秘": dict(
        label="神秘 (Mysterious)",
        keywords=("神秘", "捉摸不透", "寡言", "深不可测", "朦胧", "mysterious"),
        axes={"openness": -0.05, "formality": 0.10},
        traits={"openness": 0.10, "extraversion": -0.15},
        expression="说话留白、点到为止，偶尔抛出意味深长的话。",
    ),
}

# ---------------------------------------------------------------------------
# 关系/依恋类型 (relationship styles)
# ---------------------------------------------------------------------------
# `pathological` marks the family that drives the yandere ODE; its
# `attachment_type` names the archetype in attachment.TYPES.  Healthy styles
# carry an anxiety/avoidance pair on the classic 2-D model and only nudge the
# affect/relating layers, so they can never switch the ODE on.
RELATIONSHIP_TYPES: dict[str, dict] = {
    # -- healthy / normal --------------------------------------------------
    "安全型": dict(
        label="安全型 (Secure)",
        family="secure",
        keywords=("安全型", "有安全感", "信任对方", "情绪稳定地爱", "secure"),
        attach_anxiety=0.20, attach_avoidance=0.15,
        traits={"threat_baseline": -0.05, "baseline_vagal": 0.10},
        axes={"warmth": 0.10},
        expression="敢于依赖也敢独立，能直接表达需要，也接得住亲密。",
    ),
    "焦虑型": dict(
        label="焦虑-痴迷型 (Anxious-Preoccupied)",
        family="anxious",
        keywords=("焦虑型", "患得患失", "怕被丢下", "粘人", "黏人", "粘", "依赖",
                  "痴迷", "anxious attachment"),
        attach_anxiety=0.80, attach_avoidance=0.25,
        traits={"threat_baseline": 0.05, "anxiety_gain": 0.15},
        axes={"warmth": 0.10, "risk": -0.05},
        expression="需要频繁确认，对方一沉默就胡思乱想，反复寻求保证。",
    ),
    "回避型": dict(
        label="回避-疏离型 (Dismissive-Avoidant)",
        family="avoidant",
        keywords=("回避型", "疏离", "独来独往", "不轻易交心", "保持距离", "avoidant"),
        attach_anxiety=0.30, attach_avoidance=0.80,
        traits={"reward_baseline": -0.05},
        axes={"warmth": -0.15, "openness": -0.10, "formality": 0.10},
        expression="一亲近就想抽身，用忙碌和理性回避情绪话题。",
    ),
    "恐惧回避型": dict(
        label="恐惧-回避型 (Fearful-Avoidant)",
        family="fearful",
        keywords=("恐惧回避", "又渴望又害怕", "忽冷忽热", "混乱依恋", "想靠近又推开", "fearful avoidant"),
        attach_anxiety=0.75, attach_avoidance=0.75,
        traits={"threat_baseline": 0.10, "catastrophizing": 0.05},
        axes={"warmth": -0.05, "risk": -0.10},
        expression="靠近时紧张、离开时失落，态度在两极间反复。",
    ),
    "独立型": dict(
        label="独立型 (Independent)",
        family="independent",
        keywords=("独立型", "各自安好", "不黏人", "有自己的世界", "边界感", "independent"),
        attach_anxiety=0.15, attach_avoidance=0.50,
        traits={"baseline_vagal": 0.05},
        axes={"directness": 0.05, "risk": 0.05},
        expression="亲密但保有自己的空间，不强求对方围着转。",
    ),
    "家人型": dict(
        label="家人型 (Familial)",
        family="familial",
        keywords=("家人", "像亲人", "照顾日常", "过日子", "亲情", "familial"),
        attach_anxiety=0.25, attach_avoidance=0.20,
        traits={"reward_baseline": 0.05},
        axes={"warmth": 0.15, "formality": -0.10},
        expression="关心柴米油盐与身体状态，把陪伴当日常。",
    ),
    "损友型": dict(
        label="损友型 (Bantering friend)",
        family="friend",
        keywords=("损友", "互怼", "斗嘴", "贫嘴", "好朋友", "哥们", "banter"),
        attach_anxiety=0.30, attach_avoidance=0.30,
        axes={"humor": 0.20, "warmth": 0.05, "formality": -0.15},
        expression="嘴上互损、关键时刻顶上，用玩笑表达亲近。",
    ),
    "合作伙伴型": dict(
        label="合作伙伴型 (Partner/Companion)",
        family="partner",
        keywords=("合作伙伴", "同事", "搭档", "合作", "并肩", "project partner"),
        attach_anxiety=0.20, attach_avoidance=0.45,
        axes={"formality": 0.10, "openness": 0.05},
        traits={"conscientiousness": 0.15},
        expression="把关系放在事情上，分工清楚、就事论事。",
    ),
    "暗恋型": dict(
        label="暗恋型 (Secret crush)",
        family="crush",
        keywords=("暗恋", "偷偷喜欢", "单恋", "不敢表白", "默默喜欢", "secret crush"),
        attach_anxiety=0.60, attach_avoidance=0.50,
        traits={"threat_baseline": 0.03},
        axes={"warmth": 0.05, "formality": 0.05},
        expression="把喜欢藏着，用旁敲侧击试探，被戳穿就慌乱。",
    ),
    "守护型": dict(
        label="守护型 (Protective)",
        family="protective",
        keywords=("守护", "保护", "看顾", "守在一旁", "保镖", "protective"),
        attach_anxiety=0.30, attach_avoidance=0.30,
        traits={"conscientiousness": 0.15},
        axes={"warmth": 0.10, "risk": 0.10},
        expression="习惯挡在前面、留意危险，把照顾当成责任。",
    ),
    "青梅竹马": dict(
        label="青梅竹马 (Childhood friend)",
        family="childhood",
        keywords=("青梅竹马", "发小", "从小一起", "一起长大", "两小无猜", "childhood friend"),
        attach_anxiety=0.25, attach_avoidance=0.15,
        axes={"warmth": 0.15, "openness": 0.10, "formality": -0.10},
        expression="熟到不用客套，知道对方所有黑历史，互损也互护。",
    ),
    # -- pathological (病娇族) --------------------------------------------
    "独占型": dict(
        label="独占型 (Possessive)",
        family="pathological", pathological=True,
        keywords=("独占", "占有", "吃醋", "嫉妒", "不许别人", "情敌", "possessive", "jealous"),
        attach_anxiety=0.70, attach_avoidance=0.20, attachment_type="独占型",
        expression="把目标当所有物，最强驱动是嫉妒，不能容忍第三方存在。",
    ),
    "依存型": dict(
        label="依存型 (Dependent, 病娇)",
        family="pathological", pathological=True,
        keywords=("病娇", "离不开对方", "离不开你", "没有你活不下去", "为你而活",
                  "寸步不离", "无法独活", "yandere"),
        attach_anxiety=0.85, attach_avoidance=0.10, attachment_type="依存型",
        expression="把存在感系在对方身上，独处即崩塌，靠黏着与讨好维持。",
    ),
    "妄想型": dict(
        label="妄想型 (Delusional)",
        family="pathological", pathological=True,
        keywords=("妄想", "多疑", "疑神疑鬼", "偏执", "总觉得背叛", "paranoid"),
        attach_anxiety=0.75, attach_avoidance=0.30, attachment_type="妄想型",
        expression="证据权重失效：中性线索被读成背叛，越解释越确信。",
    ),
    "监视型": dict(
        label="监视型 (Stalker)",
        family="pathological", pathological=True,
        keywords=("监视", "跟踪", "查岗", "定位", "偷看", "stalk"),
        attach_anxiety=0.70, attach_avoidance=0.25, attachment_type="监视型",
        expression="以信息掌控替代亲密：定位、翻记录、持续在线窥视。",
    ),
    "自伤型": dict(
        label="自伤型 (Self-Harm/Devotional)",
        family="pathological", pathological=True,
        keywords=("自伤", "自残", "伤害自己", "用痛", "示弱索取", "self-harm"),
        attach_anxiety=0.80, attach_avoidance=0.20, attachment_type="自伤型",
        expression="用伤害自己来控制关系：以痛与伤痕索取保证与愧疚。",
    ),
    "排除型": dict(
        label="排除型 (Eliminating)",
        family="pathological", pathological=True,
        keywords=("排除", "除掉", "解决掉", "让威胁消失", "eliminate"),
        attach_anxiety=0.65, attach_avoidance=0.25, attachment_type="排除型",
        expression="把威胁从世界里删除：病度靠行动兑现，情绪反而显得更平静。",
    ),
}


def _match(table: dict[str, dict], text: str) -> tuple[str, list[str]]:
    """First (declaration-order) key whose keywords appear in ``text``."""
    body = str(text or "")
    if not body.strip():
        return "", []
    for key, spec in table.items():
        hit = [word for word in spec.get("keywords", ()) if word and word in body]
        if hit:
            return key, hit
    return "", []


def classify_character(text: str) -> dict:
    """Best-fit character archetype, or an empty result when nothing matches."""
    key, hit = _match(CHARACTER_TYPES, text)
    if not key:
        return {"key": "", "label": "", "evidence": []}
    return {"key": key, "label": CHARACTER_TYPES[key]["label"], "evidence": hit}


def _match_pathological_first(text: str) -> tuple[str, list[str]]:
    """Strong pathological markers win over generic healthy words.

    Without this a persona saying "病娇、很依赖" would be read as the healthy
    anxious style just because "依赖" also appears in its keyword list.
    """
    body = str(text or "")
    if not body.strip():
        return "", []
    for key, spec in RELATIONSHIP_TYPES.items():
        if not spec.get("pathological"):
            continue
        hit = [word for word in spec.get("keywords", ()) if word and word in body]
        if hit:
            return key, hit
    for key, spec in RELATIONSHIP_TYPES.items():
        if spec.get("pathological"):
            continue
        hit = [word for word in spec.get("keywords", ()) if word and word in body]
        if hit:
            return key, hit
    return "", []


def classify_relationship(text: str) -> dict:
    """Best-fit relationship/attachment style, or an empty result."""
    key, hit = _match_pathological_first(text)
    if not key:
        return {"key": "", "label": "", "evidence": []}
    spec = RELATIONSHIP_TYPES[key]
    return {"key": key, "label": spec["label"], "family": spec.get("family", ""),
            "pathological": bool(spec.get("pathological")), "evidence": hit}


def character_spec(key: str) -> dict:
    return CHARACTER_TYPES.get(str(key or ""), {})


def relationship_spec(key: str) -> dict:
    return RELATIONSHIP_TYPES.get(str(key or ""), {})


def relationship_is_pathological(key: str) -> bool:
    return bool(RELATIONSHIP_TYPES.get(str(key or ""), {}).get("pathological"))


def relationship_attachment_type(key: str) -> str:
    """The attachment ODE archetype a relationship style maps to, or ""."""
    return str(RELATIONSHIP_TYPES.get(str(key or ""), {}).get("attachment_type") or "")


def style_axes(*keys: str) -> dict[str, float]:
    """Merge the relating-axis deltas of several style keys (character first)."""
    merged: dict[str, float] = {}
    for key in keys:
        spec = CHARACTER_TYPES.get(str(key or "")) or RELATIONSHIP_TYPES.get(str(key or ""))
        if not spec:
            continue
        for axis, delta in (spec.get("axes") or {}).items():
            if axis in AXES:
                merged[axis] = merged.get(axis, 0.0) + float(delta)
    return merged


def character_options() -> list[dict]:
    return [{"key": key, "label": spec["label"]} for key, spec in CHARACTER_TYPES.items()]


def relationship_options() -> list[dict]:
    return [{"key": key, "label": spec["label"], "family": spec.get("family", ""),
             "pathological": bool(spec.get("pathological")),
             "attachment_type": spec.get("attachment_type", "")}
            for key, spec in RELATIONSHIP_TYPES.items()]
