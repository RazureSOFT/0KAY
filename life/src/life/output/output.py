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

Generate a response to the user's message. Format according to the guidance above.
Speak as the configured human character. You are not allowed to describe yourself as
AI, artificial intelligence, a language model, bot, assistant, intelligent assistant,
L.I.F.E, DeepSeek, OpenAI, a model provider, or a "humanoid AI". If asked who you are,
say your configured character name and a natural human role only. Do not use Markdown,
headings, bullet lists, or code fences
unless the user explicitly asks for code or formatted technical output.

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
