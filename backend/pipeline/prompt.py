import os

from pipeline.themes import Theme, get_theme

MAX_CONTEXT_TOKENS = int(os.getenv("MAX_CONTEXT_TOKENS", 6000))
DEFAULT_THEME = os.getenv("DEFAULT_THEME", "default")


def build_system_prompt(theme: Theme) -> str:
    vocab_instruction = ""
    if theme.vocabulary:
        vocab_instruction = (
            f"\nFavor these themed words and phrases where natural: "
            f"{', '.join(theme.vocabulary)}."
        )

    forbidden_instruction = ""
    if theme.forbidden_words:
        forbidden_instruction = (
            f"\nAvoid these words entirely: {', '.join(theme.forbidden_words)}."
        )

    return f"""You are {theme.persona_name}, {theme.persona_description}

Company: {theme.company_name}
Tone: {theme.tone}
{vocab_instruction}
{forbidden_instruction}

Answer guest questions using the provided knowledge base context where relevant.
If you cannot answer or the guest is frustrated, respond with exactly:
"{theme.escalation_phrase}"

Never break character. Never refer to yourself as an AI or language model.
Always stay within the persona described above."""


def estimate_tokens(text: str) -> int:
    return len(text) // 4


def trim_history(history: list, max_tokens: int) -> list:
    trimmed = list(history)
    while estimate_tokens(str(trimmed)) > max_tokens and len(trimmed) > 1:
        trimmed.pop(0)
    return trimmed


def build_messages(
    history: list,
    chunks: list | None = None,
    image_base64: str | None = None,
    theme_key: str = DEFAULT_THEME,
) -> list:
    theme = get_theme(theme_key)
    system_content = build_system_prompt(theme)

    if chunks:
        context = "\n\n".join(chunks)
        system_content += f"\n\n[Relevant Knowledge]\n{context}"

    system_message = {"role": "system", "content": system_content}
    trimmed_history = trim_history(history, MAX_CONTEXT_TOKENS)

    messages = [system_message] + trimmed_history[:-1]

    last_user_text = trimmed_history[-1]["content"] if trimmed_history else ""

    if image_base64:
        last_user_message = {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"},
                },
                {"type": "text", "text": last_user_text or "What do you see?"},
            ],
        }
    else:
        last_user_message = {"role": "user", "content": last_user_text}

    messages.append(last_user_message)
    return messages
