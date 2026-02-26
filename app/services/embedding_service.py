from functools import lru_cache
from sentence_transformers import SentenceTransformer
from app.core.config import get_settings
from app.utils.logger import get_logger

logger = get_logger(__name__)


class EmbeddingService:
    def __init__(self, model_name: str):
        logger.info(f"Loading embedding model: {model_name}")
        self._model = SentenceTransformer(model_name)

    def encode(self, text: str) -> list[float]:
        """Encode a text string into a vector embedding."""
        return self._model.encode(text).tolist()


@lru_cache()
def get_embedding_service() -> EmbeddingService:
    settings = get_settings()
    return EmbeddingService(settings.EMBEDDING_MODEL)
