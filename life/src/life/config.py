"""Shared constants for L.I.F.E.

Only genuinely cross-module constants belong here.  This module previously also
carried typed default groups (``CognitionDefaults``, ``MemoryThresholds``,
``CircadianDefaults``, ``EmotionDecayRates``, ``SoulDefaults``,
``RelationshipDefaults``) that duplicated the real owners in ``cognition/``,
``emotion/``, ``circadian/``, ``soul.py`` and ``companion/`` and had already
drifted out of sync.  Nothing imported them, so they were removed: each value
now has exactly one source of truth (its owning class).
"""
from __future__ import annotations

# A bounded pool of everyday events with affect deltas: this is what gives the
# character a life *outside* the chat.  Shared by the engine's life-event
# generator and the daily cycle so the two copies cannot drift apart.
LIFE_EVENTS: tuple[tuple[str, dict], ...] = (
    ("早上把房间彻底收拾了一遍，心情清爽了一些", {"valence": 0.06, "arousal": 0.02}),
    ("出门时下起了雨，忘了带伞", {"valence": -0.04, "irritation": 0.05}),
    ("楼下那只猫又来蹭饭了", {"valence": 0.07, "connection": 0.03}),
    ("看完了一部一直想看的纪录片", {"valence": 0.08, "arousal": -0.03}),
    ("做了顿还算成功的饭", {"valence": 0.05}),
    ("翻到一张旧照片，发了会儿呆", {"valence": -0.02, "arousal": -0.02}),
    ("下午有点困，泡了杯咖啡", {"valence": 0.01, "arousal": 0.04}),
    ("听到一首很喜欢的歌，循环了很久", {"valence": 0.06}),
)
