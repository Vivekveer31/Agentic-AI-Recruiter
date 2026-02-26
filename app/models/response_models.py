from pydantic import BaseModel
from typing import Any


class CandidateResult(BaseModel):
    id: str
    similarity_score: float
    ats_score: float
    final_score: float
    metadata: dict[str, Any] = {}


class CandidateSearchResponse(BaseModel):
    job_description: str
    total_results: int
    candidates: list[CandidateResult]


class EvaluationResponse(BaseModel):
    email_id: str
    similarity_score: float
    ats_score: float
    credibility_score: float
    final_score: float
    urls_checked: list[str]


class ScheduleInterviewResponse(BaseModel):
    candidate_email: str
    interview_date: str
    start_time: str
    meet_link: str
    status: str = "scheduled"


class SendEmailResponse(BaseModel):
    candidate_email: str
    status: str
    message: str


class AgentResponse(BaseModel):
    user_query: str
    agent_response: str


class ErrorResponse(BaseModel):
    detail: str
    error_type: str | None = None
