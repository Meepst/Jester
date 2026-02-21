import asyncio
import json

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from pipeline.escalation import check_escalation
from pipeline.featherless import stream_completion
from pipeline.prompt import build_messages
from pipeline.rag import retrieve
from session.store import SessionStore

router = APIRouter(prefix="/chat")
store = SessionStore()


class MessageRequest(BaseModel):
    message: str
    image: str | None = None


@router.post("/{session_id}/stream")
async def stream(session_id: str, body: MessageRequest):
    session = store.get_or_create(session_id)

    if session["escalated"]:
        raise HTTPException(status_code=409, detail="Session has been escalated.")

    session["history"].append({"role": "user", "content": body.message})

    async def generate():
        try:
            chunks = retrieve(body.message)
            messages = build_messages(session["history"], chunks, body.image)

            full_response = ""
            async for token in stream_completion(messages):
                full_response += token
                yield f"data: {json.dumps({'token': token})}\n\n"
                await asyncio.sleep(0)

            session["history"].append({"role": "assistant", "content": full_response})

            if check_escalation(full_response):
                session["escalated"] = True
                yield f"data: {json.dumps({'escalated': True})}\n\n"

            store.save(session_id, session)
            yield "data: [DONE]\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
            yield "data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",  # important for nginx proxies
        },
    )
