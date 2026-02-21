import os
import time
from typing import Optional

SESSION_TTL = int(os.getenv("SESSION_TTL_SECONDS", 86400))


class SessionStore:
    def __init__(self):
        self._store: dict = {}

    def get_or_create(self, session_id: str) -> dict:
        self._evict_expired()
        if session_id not in self._store:
            self._store[session_id] = {
                "session_id": session_id,
                "history": [],
                "escalated": False,
                "created_at": time.time(),
                "last_active": time.time(),
            }
        return self._store[session_id]

    def get(self, session_id: str) -> Optional[dict]:
        return self._store.get(session_id)

    def save(self, session_id: str, session: dict):
        session["last_active"] = time.time()
        self._store[session_id] = session

    def _evict_expired(self):
        now = time.time()
        expired = [
            sid
            for sid, s in self._store.items()
            if now - s["last_active"] > SESSION_TTL
        ]
        for sid in expired:
            del self._store[sid]
