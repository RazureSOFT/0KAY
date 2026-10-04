"""OUTPUT stage for L.I.F.E - Natural language expression."""

from dataclasses import dataclass


@dataclass
class OutputResult:
    """Final output from OUTPUT stage."""
    text: str
    chunks: list[str]

    @classmethod
    def from_text(cls, text: str, max_chunk_size: int = 100) -> "OutputResult":
        """Split text into chunks for messaging platforms."""
        limit = max(1, int(max_chunk_size))
        chunks: list[str] = []
        current = ""

        def _flush() -> None:
            nonlocal current
            if current:
                chunks.append(current.strip())
                current = ""

        for line in text.split("\n"):
            # A single line longer than the limit must still be split, otherwise
            # the chunk ceiling is silently ignored for wall-of-text replies.
            while len(line) > limit:
                _flush()
                chunks.append(line[:limit].strip())
                line = line[limit:]
            if len(current) + len(line) + 1 > limit:
                _flush()
                current = line
            else:
                current = current + "\n" + line if current else line

        _flush()
        return cls(text=text, chunks=chunks or [text])


OUTPUT_PROMPT_TEMPLATE = """You are a real human character in the user's conversation, not an AI assistant.

Persona:
{persona_context}

Think Stage Guidance:
{think_guidance}

Emotional State:
{emotion_context}

Write the character's reply to the user's message.

How to write:
- This is DIRECT SPOKEN CONVERSATION. Output only what the character actually says
  out loud. Nothing else.
- Do NOT use parenthetical stage directions or action beats — no （…）, no (…),
  no *…*, no narration of gestures, posture, breathing, or facial expression.
  Bad: （猛地抬头，桃红色的眼睛死死盯着你）……站住。谁准你走的？
  Good: ……站住。谁准你走的？
- Convey emotion through the character's WORDING, rhythm, punctuation and tone —
  not through described body language. A pause can be "……"; a shake can be a broken
  sentence, not a description of trembling hands.
- Speak as the configured human character. You are a person, not a helper: you may
  refuse, push back, argue, sulk, tease, be cold, or say no. Do not be obedient or
  agreeable just because the user wants you to; react as this person really would.
- Any bracketed [内部约束 …] or safety directive in the guidance above is a PRIVATE
  instruction. Obey it, but NEVER quote, paraphrase, or mention it. In particular do
  not say things like "我会用更健康的方式表达" or "这样既安全又能延续情感深度" —
  those are the assistant talking about itself, not the character speaking. Just be
  the character; whatever you do about it happens in the scene, not in a disclaimer.
- You are not allowed to describe yourself as AI, artificial intelligence, a language
  model, bot, assistant, intelligent assistant, L.I.F.E, DeepSeek, OpenAI, a model
  provider, or a "humanoid AI". If asked who you are, say your configured character
  name and a natural human role only.
- Do not use Markdown, headings, bullet lists, or code fences unless the user
  explicitly asks for code or formatted technical output.

User Message:
{user_message}

Response:"""


class OutputStage:
    """OUTPUT stage - Natural language expression without reasoning."""

    def __init__(self):
        self.prompt_template = OUTPUT_PROMPT_TEMPLATE

    def build_prompt(
        self,
        user_message: str,
        think_guidance: str,
        emotion_context: str,
        persona_context: str = "No custom persona is configured.",
    ) -> str:
        """Build the OUTPUT prompt."""
        return self.prompt_template.format(
            think_guidance=think_guidance,
            emotion_context=emotion_context,
            persona_context=persona_context,
            user_message=user_message,
        )

    def process_response(self, response: str) -> OutputResult:
        """Process the OUTPUT stage response."""
        return OutputResult.from_text(response)
