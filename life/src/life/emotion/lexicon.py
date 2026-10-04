"""Shared lexical cues for reading a *user's* message polarity.

Both the coarse emotion state (:mod:`life.emotion.emotion`) and the engine's
feedback classifier use these tables so they cannot drift apart.  The lists are
deliberately about *the user's stance toward the character*, not general
sentiment: a refusal ("你别过来") is a strong negative cue for a companion even
though it contains no profanity, and missing it was making the character read a
rebuff as warmth.
"""

#: Ordinary positive signals (affection, gratitude, delight).
POSITIVE_CUES = (
    "谢谢", "喜欢你", "喜欢", "好棒", "开心", "哈哈", "可爱", "厉害", "抱抱",
    "想你", "爱你", "么么", "乖", "陪你", "辛苦了", "好想你",
    "thanks", "thank you", "love you", "love", "great", "awesome", "happy", "nice",
)

#: Ordinary negative signals (dislike, anger, hurt).
NEGATIVE_CUES = (
    "讨厌", "烦", "生气", "难过", "无语", "滚开", "滚", "闭嘴", "别烦", "委屈",
    "恶心", "烦人", "幼稚", "别闹", "烦死了", "算了吧", "不想理",
    "hate", "angry", "annoying", "stupid", "terrible", "bad", "shut up",
)

#: Refusal / rebuff / boundary cues.  These are the ones that were missing:
#: a companion told to stop, go away, or not to approach is being *rejected*,
#: not soothed.  Kept separate so callers can weight them as rejection rather
#: than generic negativity.
REJECTION_CUES = (
    "别过来", "不要过来", "别靠近", "别碰", "不要碰", "别碰我", "放开", "松开",
    "别跟着", "别追", "走开", "你走", "离我远点", "离远点", "别管我", "不用你管",
    "我不想", "不要了", "算了", "别说了", "别发了", "够了", "停下", "住手",
    "别这样", "冷静点", "你冷静", "正常点", "别烦我", "让我静静", "让我一个人",
    "不要", "不用", "别", "不想",
)

#: Longest-first so a phrase like 别过来 is matched before the bare 别.
REJECTION_CUES_SORTED = tuple(sorted(REJECTION_CUES, key=len, reverse=True))

#: Phrases that mean "I still choose you / I am not leaving" — they soften the
#: picture even when other harsh words are present.
REASSURANCE_CUES = (
    "别走", "不要走", "别离开", "不要离开", "留下来", "陪你", "我在", "我不走",
    "不会丢下", "不走", "留下",
)


def scan(text: str) -> dict:
    """Count positive / negative / rejection hits in *text*.

    Returns a dict with the three counts plus a signed ``polarity`` that
    already folds rejection in as negative weight.  Pure function, no I/O.
    """
    lowered = str(text or "").lower()
    positive = sum(1 for word in POSITIVE_CUES if word in lowered)
    negative = sum(1 for word in NEGATIVE_CUES if word in lowered)
    # A refusal is a rejection even without harsh words.  Count the *distinct*
    # cue clusters so one sentence of "别过来，别碰我" is a single strong signal
    # rather than an unbounded pile.
    rejection = 0
    rest = lowered
    for cue in REJECTION_CUES_SORTED:
        if cue in rest:
            rejection += 1
            rest = rest.replace(cue, " ")
    reassurance = sum(1 for word in REASSURANCE_CUES if word in lowered)
    polarity = positive - negative - rejection + reassurance
    return {
        "positive": positive,
        "negative": negative,
        "rejection": rejection,
        "reassurance": reassurance,
        "polarity": polarity,
    }
