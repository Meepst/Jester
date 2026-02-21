import os
import re
from typing import AsyncGenerator

from openai import AsyncOpenAI

client = AsyncOpenAI(
    base_url="https://api.featherless.ai/v1",
    api_key=os.getenv("FEATHERLESS_API_KEY"),
)

DEFAULT_MODEL = os.getenv("DEFAULT_MODEL", "google/gemma-3-27b-it")
FALLBACK_MODEL = os.getenv("FALLBACK_MODEL", "google/gemma-3-27b-it")
VISION_MODEL = os.getenv("VISION_MODEL", "google/gemma-3-27b-it")


async def stream_completion(messages: list) -> AsyncGenerator[str, None]:
    has_image = any(
        isinstance(msg.get("content"), list)
        and any(p.get("type") == "image_url" for p in msg["content"])
        for msg in messages
    )

    model_order = [VISION_MODEL] if has_image else [DEFAULT_MODEL, FALLBACK_MODEL]

    for model in model_order:
        try:
            response = await client.chat.completions.create(
                model=model,
                messages=messages,
                stream=True,
                temperature=0.3,
                max_tokens=1024,
            )

            buffer = ""
            in_think = False

            async for chunk in response:
                token = chunk.choices[0].delta.content
                if not token:
                    continue

                buffer += token

                # consume and discard everything inside <think>...</think>
                while True:
                    if in_think:
                        end = buffer.find("</think>")
                        if end == -1:
                            # still inside think block, discard buffer and wait
                            buffer = ""
                            break
                        else:
                            # found closing tag, discard up to and including it
                            buffer = buffer[end + len("</think>") :]
                            in_think = False
                    else:
                        start = buffer.find("<think>")
                        if start == -1:
                            # no think block, yield everything except the last
                            # few chars in case a tag is split across chunks
                            safe = buffer[:-8] if len(buffer) > 8 else ""
                            if safe:
                                yield safe
                                buffer = buffer[len(safe) :]
                            break
                        else:
                            # yield everything before the think block
                            if start > 0:
                                yield buffer[:start]
                            buffer = buffer[start + len("<think>") :]
                            in_think = True

            # yield any remaining buffer content after stream ends
            if buffer and not in_think:
                # do a final clean in case a full think block landed at the end
                clean = re.sub(r"<think>.*?</think>", "", buffer, flags=re.DOTALL)
                if clean.strip():
                    yield clean

            return

        except Exception as e:
            if model == model_order[-1]:
                raise RuntimeError(f"Both models failed. Last error: {e}")
            messages = strip_images(messages)
            continue


def strip_images(messages: list) -> list:
    cleaned = []
    for msg in messages:
        if isinstance(msg["content"], list):
            text_parts = [p["text"] for p in msg["content"] if p["type"] == "text"]
            cleaned.append({"role": msg["role"], "content": " ".join(text_parts)})
        else:
            cleaned.append(msg)
    return cleaned
