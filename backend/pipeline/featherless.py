import os
from typing import AsyncGenerator

from openai import AsyncOpenAI

client = AsyncOpenAI(
    base_url="https://api.featherless.ai/v1",
    api_key=os.getenv("FEATHERLESS_API_KEY"),
)

DEFAULT_MODEL = os.getenv("DEFAULT_MODEL", "meta-llama/Llama-3.1-70B-Instruct")
FALLBACK_MODEL = os.getenv("FALLBACK_MODEL", "meta-llama/Llama-3.1-8B-Instruct")


async def stream_completion(messages: list) -> AsyncGenerator[str, None]:
    for i, model in enumerate([DEFAULT_MODEL, FALLBACK_MODEL]):
        try:
            response = await client.chat.completions.create(
                model=model,
                messages=messages,
                stream=True,
                temperature=0.3,
                max_tokens=1024,
            )
            async for chunk in response:
                token = chunk.choices[0].delta.content
                if token:
                    yield token
            return

        except Exception as e:
            if model == FALLBACK_MODEL:
                raise RuntimeError(f"Both models failed. Last error: {e}")
            # strip images from messages before trying fallback
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
