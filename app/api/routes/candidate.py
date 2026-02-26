from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from typing import Any

from app.models.request_models import CandidateSearchRequest
from app.models.response_models import CandidateSearchResponse, EvaluationResponse, CandidateResult
from app.services.embedding_service import EmbeddingService, get_embedding_service
from app.services.vector_service import VectorService, get_vector_service
from app.services.evaluation_service import EvaluationService
from app.services.resume_service import ResumeService
from app.utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/candidates", tags=["Candidates"])


def get_evaluation_service(
    vs: VectorService = Depends(get_vector_service),
    es: EmbeddingService = Depends(get_embedding_service),
) -> EvaluationService:
    return EvaluationService(vector_service=vs, embedding_service=es)


@router.post(
    "/search",
    response_model=CandidateSearchResponse,
    summary="Search and rank candidates by job description",
)
async def search_candidates(
    body: CandidateSearchRequest,
    vs: VectorService = Depends(get_vector_service),
    es: EmbeddingService = Depends(get_embedding_service),
):
    """
    Query Pinecone with the provided job description and return the top-ranked
    candidates using hybrid scoring:
    `final_score = 0.7 × similarity + 0.3 × (ats_score / 100)`
    """
    try:
        query_embedding = es.encode(body.job_description)
        candidates = vs.search_candidates(query_embedding, top_k=50)
        top_k = candidates[: body.top_k]

        return CandidateSearchResponse(
            job_description=body.job_description,
            total_results=len(top_k),
            candidates=[CandidateResult(**c) for c in top_k],
        )
    except Exception as exc:
        logger.exception("Error during candidate search")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))


@router.get(
    "/{email}/evaluate",
    response_model=EvaluationResponse,
    summary="Evaluate a single candidate by email ID",
)
async def evaluate_candidate(
    email: str,
    eval_svc: EvaluationService = Depends(get_evaluation_service),
):
    """
    Retrieve the candidate's resume from Pinecone, compute semantic similarity,
    ATS score and GitHub/URL credibility, then return a combined final score.
    """
    try:
        result = eval_svc.evaluate(email)
        return EvaluationResponse(**result)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    except Exception as exc:
        logger.exception("Error during candidate evaluation")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))

ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg"}


@router.post(
    "/upload",
    summary="Upload and process resume files into Pinecone",
)
async def upload_resumes(
    files: list[UploadFile] = File(..., description="Resume files (PDF, PNG, JPG)"),
    vs: VectorService = Depends(get_vector_service),
    es: EmbeddingService = Depends(get_embedding_service),
) -> dict[str, Any]:
    """
    Upload one or more resume files (PDF / PNG / JPG / JPEG).
    Each file is OCR-processed or text-extracted, summarised by the LLM,
    embedded and upserted to Pinecone with an ATS score.
    Returns a summary of processed and skipped files.
    """
    resume_svc = ResumeService(embedding_service=es, vector_service=vs)
    results: list[dict] = []
    errors: list[dict] = []

    for upload in files:
        filename = upload.filename or "unknown"
        from pathlib import Path
        suffix = Path(filename).suffix.lower()

        if suffix not in ALLOWED_EXTENSIONS:
            errors.append({"filename": filename, "error": f"Unsupported file type: {suffix}"})
            continue

        try:
            file_bytes = await upload.read()
            result = resume_svc.process(filename=filename, file_bytes=file_bytes)
            results.append(result)
        except ValueError as exc:
            logger.warning(f"Skipping {filename}: {exc}")
            errors.append({"filename": filename, "error": str(exc)})
        except Exception as exc:
            logger.exception(f"Error processing {filename}")
            errors.append({"filename": filename, "error": str(exc)})

    return {
        "processed": len(results),
        "skipped": len(errors),
        "results": results,
        "errors": errors,
    }