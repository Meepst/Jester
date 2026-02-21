import os
from typing import Optional

MAX_CONTEXT_TOKENS = int(os.getenv("MAX_CONTEXT_TOKENS", 6000))

SYSTEM_PROMPT = """You are a helpful and friendly support agent.
Answer the user's questions using the provided knowledge base context where relevant.
If you cannot answer the question or the user is frustrated, output [ESCALATE] on its own line.
Be concise. Do not make up information that is not in the context."""


def estimate_tokens(text: str) -> int:
    # rough estimate: 1 token ≈ 4 characters
    return len(text) // 4


def trim_history(history: list, max_tokens: int) -> list:
    trimmed = list(history)
    while estimate_tokens(str(trimmed)) > max_tokens and len(trimmed) > 1:
        # remove oldest non-system turn
        trimmed.pop(0)
    return trimmed


def build_messages(
    history: list, chunks: list | None = None, image_base64: str | None = None
) -> list:
    system_content = SYSTEM_PROMPT

    if chunks:
        context = "\n\n".join(chunks)
        system_content += f"\n\n[Relevant Knowledge]\n{context}"

    system_message = {"role": "system", "content": system_content}
    trimmed_history = trim_history(history, MAX_CONTEXT_TOKENS)

    messages = [system_message] + trimmed_history[
        :-1
    ]  # everything except the last user turn

    # rebuild the last user turn with image if present
    last_user_text = trimmed_history[-1]["content"] if trimmed_history else ""

    if image_base64:
        last_user_message = {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"},
                },
                {
                    "type": "text",
                    "text": last_user_text or "What do you see in this image?",
                },
            ],
        }
    else:
        last_user_message = {"role": "user", "content": last_user_text}

    messages.append(last_user_message)
    return messages
