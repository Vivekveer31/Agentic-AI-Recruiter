from functools import lru_cache
from pinecone import Pinecone
from app.core.config import get_settings
from app.utils.logger import get_logger

logger = get_logger(__name__)


class VectorService:
    def __init__(self, api_key: str, index_name: str):
        logger.info(f"Connecting to Pinecone index: {index_name}")
        pc = Pinecone(api_key=api_key)
        self._index = pc.Index(index_name)

    def query(
        self,
        vector: list[float],
        top_k: int = 50,
        include_metadata: bool = True,
        filter: dict | None = None,
    ) -> dict:
        kwargs = dict(vector=vector, top_k=top_k, include_metadata=include_metadata)
        if filter:
            kwargs["filter"] = filter
        return self._index.query(**kwargs)

    def fetch(self, ids: list[str]) -> dict:
        return self._index.fetch(ids=ids)

    def upsert(self, vectors: list[dict]) -> dict:
        """Upsert vectors into the Pinecone index."""
        return self._index.upsert(vectors=vectors)

    def search_candidates(
        self, query_embedding: list[float], top_k: int = 50
    ) -> list[dict]:
        """
        Query Pinecone and return hybrid-ranked candidate list.
        Hybrid score = 0.7 * similarity + 0.3 * (ats_score / 100)
        """
        results = self.query(vector=query_embedding, top_k=top_k, include_metadata=True)

        candidates = []
        for match in results["matches"]:
            similarity = match["score"]
            ats_score = match["metadata"].get("ats_score", 0)
            final_score = (0.7 * similarity) + (0.3 * (ats_score / 100))

            candidates.append(
                {
                    "id": match["id"],
                    "similarity_score": round(similarity, 4),
                    "ats_score": ats_score,
                    "final_score": round(final_score, 4),
                    "metadata": match.get("metadata", {}),
                }
            )

        candidates.sort(key=lambda x: x["final_score"], reverse=True)
        return candidates


@lru_cache()
def get_vector_service() -> VectorService:
    settings = get_settings()
    return VectorService(settings.PINECONE_API_KEY, settings.PINECONE_INDEX)
