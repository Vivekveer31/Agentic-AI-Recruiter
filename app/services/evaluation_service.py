import re
import requests
from datetime import datetime
from app.services.embedding_service import EmbeddingService
from app.services.vector_service import VectorService
from app.utils.logger import get_logger

logger = get_logger(__name__)


class EvaluationService:
    def __init__(self, vector_service: VectorService, embedding_service: EmbeddingService):
        self._vs = vector_service
        self._es = embedding_service

    def evaluate(self, email_id: str) -> dict:
        """
        Full candidate evaluation:
        - Fetch resume from Pinecone
        - Compute semantic similarity to job description
        - Compute ATS score
        - Compute credibility score from URLs/GitHub
        - Return weighted final score
        """
        fetch_result = self._vs.fetch(ids=[email_id])

        if email_id not in fetch_result["vectors"]:
            raise ValueError(f"Candidate '{email_id}' not found in vector database.")

        vector_data = fetch_result["vectors"][email_id]
        metadata = vector_data.get("metadata", {})
        resume_text = metadata.get("resume_text", "")
        ats_score = metadata.get("ats_score", 0)

        # Semantic similarity against job description
        job_query = (
            "Looking for a Machine Learning Engineer with 3+ years experience "
            "in Python, TensorFlow, NLP and Deep Learning."
        )
        job_embedding = self._es.encode(job_query)

        query_result = self._vs.query(
            vector=job_embedding,
            top_k=1,
            include_metadata=False,
            filter={"id": {"$eq": email_id}},
        )

        similarity_score = 0.0
        if query_result["matches"]:
            similarity_score = query_result["matches"][0]["score"]

        # Credibility analysis
        urls = self._extract_urls(resume_text)
        credibility_score = self._compute_credibility(urls)

        # Weighted final score
        ats_normalized = ats_score / 100
        credibility_normalized = min(credibility_score / 50, 1.0)

        final_score = (
            0.6 * similarity_score
            + 0.25 * ats_normalized
            + 0.15 * credibility_normalized
        )

        return {
            "email_id": email_id,
            "similarity_score": round(similarity_score, 4),
            "ats_score": ats_score,
            "credibility_score": credibility_score,
            "final_score": round(final_score, 4),
            "urls_checked": urls,
        }

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _extract_urls(text: str) -> list[str]:
        return re.findall(r"https?://[^\s]+", text)

    @staticmethod
    def _check_url_alive(url: str) -> bool:
        try:
            response = requests.get(url, timeout=5)
            return response.status_code == 200
        except Exception:
            return False

    @staticmethod
    def _analyze_github(url: str) -> int:
        if "github.com" not in url:
            return 0
        try:
            username = url.split("github.com/")[-1].split("/")[0]
            api_url = f"https://api.github.com/users/{username}"
            resp = requests.get(api_url, timeout=5)
            if resp.status_code != 200:
                return 0

            data = resp.json()
            score = 0
            if data.get("public_repos", 0) >= 5:
                score += 10
            if data.get("followers", 0) >= 3:
                score += 5
            created_at = data.get("created_at")
            if created_at:
                created_date = datetime.strptime(created_at, "%Y-%m-%dT%H:%M:%SZ")
                if (datetime.utcnow() - created_date).days > 180:
                    score += 5
            return score
        except Exception:
            return 0

    def _compute_credibility(self, urls: list[str]) -> int:
        score = 0
        for url in urls:
            if self._check_url_alive(url):
                score += 10
            score += self._analyze_github(url)
        return score
