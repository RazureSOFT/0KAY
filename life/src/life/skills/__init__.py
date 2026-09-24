"""L.I.F.E skill system — persona-owned procedures (separate from Agent skills).

Skills are named prompt packages that guide THINK/OUTPUT behavior.
Loaded from builtins + optional LIFE_SKILLS_DIR (*.md files).
"""

from __future__ import annotations

import os
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional


@dataclass
class Skill:
    """A named skill / procedure for L.I.F.E."""

    name: str
    description: str
    content: str
    tags: list[str] = field(default_factory=list)
    source: str = "builtin"

    def to_schema(self) -> dict:
        return {
            "name": self.name,
            "description": self.description,
            "tags": list(self.tags),
        }

    def to_prompt_block(self) -> str:
        return f"### Skill: {self.name}\n{self.description}\n\n{self.content.strip()}"


# Built-in LIFE skills (persona behavior, not tools)
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
    """Registry of L.I.F.E skills (independent from ToolRegistry)."""

    def __init__(self) -> None:
        self._skills: dict[str, Skill] = {}
        for s in _BUILTIN:
            self._skills[s.name] = s
        env_dir = os.environ.get("LIFE_SKILLS_DIR", "")
        if env_dir:
            self.load_dir(env_dir)
        else:
            # Package default: life/skills/*.md (src/life/skills → ../../../skills)
            here = Path(__file__).resolve()
            self.load_dir(str(here.parents[3] / "skills"))
            self.load_dir(str(here.parents[2] / "skills"))

    def load_dir(self, directory: str) -> int:
        """Load *.md skills from a directory. Returns count loaded."""
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

    def match(self, text: str) -> Optional[Skill]:
        """Pick the best skill for a user message (tag/name keyword hit)."""
        lowered = (text or "").lower()
        best: Optional[Skill] = None
        best_score = 0
        for s in self.list():
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
        """Human-readable skill list + best match block for THINK prompt."""
        schemas = self.list_schemas()
        if not schemas:
            return "No skills loaded."
        lines = ["Available LIFE skills (invoke via skill_call when useful):"]
        for s in schemas[: max(1, limit * 2)]:
            lines.append(f"- {s['name']}: {s['description']}")
        match = self.match(text) if text else None
        if match:
            lines.append("")
            lines.append(match.to_prompt_block())
        return "\n".join(lines)

    def get_content(self, name: str) -> str:
        s = self.get(name)
        return s.to_prompt_block() if s else f"Skill '{name}' not found."


def _parse_md_skill(stem: str, text: str) -> tuple[str, str, str]:
    """Parse SKILL.md-style front matter: # name, first prose paragraph = description."""
    name = stem
    description = ""
    content = text.strip()
    lines = text.splitlines()
    if lines and lines[0].startswith("# "):
        name = lines[0][2:].strip() or stem
        rest = lines[1:]
        # first non-empty prose paragraph after heading (skip tags: / metadata lines)
        para: list[str] = []
        for line in rest:
            if not line.strip():
                if para:
                    break
                continue
            if line.startswith("#"):
                break
            if re.match(r"^tags:\s*", line.strip(), flags=re.I):
                continue
            para.append(line.strip())
        description = " ".join(para).strip()
        if description:
            # drop description paragraph (and tags) from content body start
            body_start = 0
            seen_para = False
            for i, line in enumerate(lines[1:], start=1):
                if not line.strip():
                    if seen_para:
                        body_start = i
                        break
                    continue
                if line.startswith("#"):
                    body_start = i
                    break
                if re.match(r"^tags:\s*", line.strip(), flags=re.I) and not seen_para:
                    continue
                seen_para = True
            content = "\n".join(lines[body_start:]).strip() or text.strip()
    if not description:
        description = f"Life skill: {name}"
    return name, description, content


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
