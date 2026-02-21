import os

import chromadb
from chromadb.api.types import Documents, EmbeddingFunction, Embeddings
from chromadb.utils.embedding_functions import ONNXMiniLM_L6_V2

CHROMA_DIR = os.getenv("CHROMA_PERSIST_DIR", "./data/chroma_db")
COLLECTION_NAME = "knowledge_base"
TOP_K = 3


class WrappedONNX(EmbeddingFunction[Documents]):
    def __init__(self):
        self._fn = ONNXMiniLM_L6_V2()

    def __call__(self, input: Documents) -> Embeddings:
        return self._fn(input)


embedding_fn = WrappedONNX()

client = chromadb.PersistentClient(path=CHROMA_DIR)


def get_collection():
    return client.get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=embedding_fn,  # type: ignore[arg-type]
    )


def retrieve(query: str) -> list[str]:
    collection = get_collection()
    if collection.count() == 0:
        return []

    results = collection.query(
        query_texts=[query],
        n_results=min(TOP_K, collection.count()),
    )
    return results["documents"][0] if results["documents"] else []
