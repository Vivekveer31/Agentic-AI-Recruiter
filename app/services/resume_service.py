"""
ResumeService
=============
Processes uploaded resume files (images via EasyOCR, PDFs via pypdf),
summarises the text with the configured LLM, embeds the summary, computes
an ATS score against a default JD, and upserts everything into Pinecone.
"""
from __future__ import annotations

import io
import re
import logging
from pathlib import Path
from typing import Any

import numpy as np

from app.core.config import get_settings
from app.services.embedding_service import EmbeddingService
from app.services.vector_service import VectorService
from app.utils.logger import get_logger

logger = get_logger(__name__)

# Default JD used for ATS scoring when no specific JD is provided at upload time
DEFAULT_JD = (
    "Looking for a Machine Learning Engineer with 3+ years experience "
    "in Python, TensorFlow, NLP and Deep Learning."
)


class ResumeService:
    def __init__(self, embedding_service: EmbeddingService, vector_service: VectorService):
        self._es = embedding_service
        self._vs = vector_service
        self._llm = self._build_llm()
        self._jd_embedding: list[float] = self._es.encode(DEFAULT_JD)

    # ------------------------------------------------------------------
    # LLM builder
    # ------------------------------------------------------------------
    @staticmethod
    def _build_llm():
        from langchain_openai import ChatOpenAI
        s = get_settings()
        return ChatOpenAI(
            model=s.LLM_MODEL,
            base_url=s.GROQ_BASE_URL,
            api_key=s.GROQ_API_KEY,
            temperature=0,
        )

    # ------------------------------------------------------------------
    # Text extraction helpers
    # ------------------------------------------------------------------
    @staticmethod
    def _extract_text_image(file_bytes: bytes) -> str:
        """EasyOCR – supports PNG / JPG / JPEG."""
        import easyocr
        reader = easyocr.Reader(["en"], gpu=False)
        result = reader.readtext(file_bytes, detail=0)
        return "\n".join(result)

    @staticmethod
    def _extract_text_pdf(file_bytes: bytes) -> str:
        """pypdf – pure-Python PDF text extraction."""
        from pypdf import PdfReader
        reader = PdfReader(io.BytesIO(file_bytes))
        pages = [page.extract_text() or "" for page in reader.pages]
        return "\n".join(pages)

    # ------------------------------------------------------------------
    # LLM summarisation
    # ------------------------------------------------------------------
    def _summarise(self, raw_text: str) -> str:
        from langchain_core.prompts import PromptTemplate
        template = PromptTemplate(
            input_variables=["ocr_content"],
            template=(
                "Summarize the following resume content concisely, "
                "highlighting the candidate's skills, experience, education, "
                "and contact information:\n\n{ocr_content}"
            ),
        )
        chain = template | self._llm
        response = chain.invoke({"ocr_content": raw_text})
        # response is an AIMessage
        return response.content if hasattr(response, "content") else str(response)

    # ------------------------------------------------------------------
    # Field extraction helpers
    # ------------------------------------------------------------------
    @staticmethod
    def _extract_email(text: str) -> str | None:
        match = re.search(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}", text)
        return match.group() if match else None

    @staticmethod
    def _extract_phone(text: str) -> str:
        words = text.split()
        phone = None
        prev = None
        for word in words:
            if prev == "Phone:":
                phone = word
                break
            prev = word
        if phone:
            phone = phone.replace("~", "").replace("-", "")
        return phone or ""

    # ------------------------------------------------------------------
    # ATS scoring
    # ------------------------------------------------------------------
    def _compute_ats_score(self, summary_embedding: list[float]) -> float:
        resume_vec = np.array(summary_embedding)
        jd_vec = np.array(self._jd_embedding)
        similarity = float(
            np.dot(resume_vec, jd_vec) / (np.linalg.norm(resume_vec) * np.linalg.norm(jd_vec))
        )
        return round(similarity * 10, 2)

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
    def process(self, filename: str, file_bytes: bytes) -> dict[str, Any]:
        """
        Process a single resume file.

        Returns
        -------
        dict with keys: email, ats_score, summary_preview, upserted (bool)
        """
        suffix = Path(filename).suffix.lower()

        # --- Step 1: extract raw text ---
        if suffix in (".png", ".jpg", ".jpeg"):
            raw_text = self._extract_text_image(file_bytes)
        elif suffix == ".pdf":
            raw_text = self._extract_text_pdf(file_bytes)
        else:
            raise ValueError(f"Unsupported file type: {suffix}")

        if not raw_text.strip():
            raise ValueError(f"Could not extract text from {filename}")

        # --- Step 2: LLM summarisation ---
        summary = self._summarise(raw_text)

        # --- Step 3: extract email (required for Pinecone ID) ---
        email = self._extract_email(summary) or self._extract_email(raw_text)
        if not email:
            raise ValueError(f"No email found in resume {filename}; skipping.")

        # --- Step 4: embed + ATS score ---
        embedding = self._es.encode(summary)
        ats_score = self._compute_ats_score(embedding)

        # --- Step 5: upsert to Pinecone ---
        self._vs.upsert(
            vectors=[
                {
                    "id": email,
                    "values": embedding,
                    "metadata": {
                        "email": email,
                        "summary": summary,
                        "ats_score": ats_score,
                        "filename": filename,
                    },
                }
            ]
        )
        logger.info(f"Upserted resume for {email} | ats_score={ats_score}")

        return {
            "email": email,
            "ats_score": ats_score,
            "summary_preview": summary[:200] + ("…" if len(summary) > 200 else ""),
            "upserted": True,
        }
