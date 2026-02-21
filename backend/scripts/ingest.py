import glob
import os
import sys

from sympy.series.sequences import RecursiveSeq

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv

load_dotenv()

from pipeline.rag import get_collection

KB_DIR = "./data/knowledge_base"
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50


def chunk_text(text: str, size: int, overlap: int) -> list[str]:
    chunks = []
    start = 0
    while start < len(text):
        end = start + size
        chunks.append(text[start:end])
        start += size - overlap
    return chunks


def ingest():
    collection = get_collection()
    files = glob.glob(f"{KB_DIR}/**/*.md", recursive=True) + glob.glob(
        f"{KB_DIR}/**/*.txt", recursive=True
    )

    if not files:
        print(f"No files found in {KB_DIR}")
        return

    all_chunks = []
    all_ids = []

    for filepath in files:
        with open(filepath, "r", encoding="utf-8") as f:
            text = f.read()
        chunks = chunk_text(text, CHUNK_SIZE, CHUNK_OVERLAP)
        filename = os.path.basename(filepath)

        for i, chunk in enumerate(chunks):
            all_chunks.append(chunk)
            all_ids.append(f"{filename}_{i}")

        print(f" {filename}->{len(chunks)} chunks")


if __name__ == "__main__":
    ingest()
