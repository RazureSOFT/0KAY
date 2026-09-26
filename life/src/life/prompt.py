"""Prompt section orchestration: compose prompt fragments deterministically.

A prompt is a tree of labelled sections. Rendering can emit either the bodies
only (for models that dislike structure) or labelled blocks (for traceability).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum


class RenderMode(str, Enum):
    BODY_ONLY = "body"
    LABELED_BLOCK = "labeled"


@dataclass
class PromptSection:
    key: str
    title: str
    content: str = ""
    source: str = ""
    children: tuple["PromptSection", ...] = field(default_factory=tuple)

    def iter_all(self):
        yield self
        for child in self.children:
            yield from child.iter_all()


def section(key: str, title: str, content: str = "", source: str = "", children: tuple = ()) -> PromptSection:
    return PromptSection(key=key, title=title, content=content, source=source, children=tuple(children))


def render(sections: list[PromptSection], mode: RenderMode = RenderMode.BODY_ONLY) -> str:
    blocks: list[str] = []
    for root in sections:
        for node in root.iter_all():
            body = str(node.content or "").strip()
            if not body:
                continue
            if mode == RenderMode.LABELED_BLOCK:
                blocks.append(f"### {node.title}\n{body}")
            else:
                blocks.append(body)
    return "\n\n".join(blocks)
