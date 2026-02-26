from pydantic import BaseModel, EmailStr, Field


class CandidateSearchRequest(BaseModel):
    job_description: str = Field(
        ...,
        min_length=10,
        example=(
            "Looking for a Machine Learning Engineer with 3+ years experience "
            "in Python, TensorFlow, NLP and Deep Learning."
        ),
    )
    top_k: int = Field(default=5, ge=1, le=50)


class ScheduleInterviewRequest(BaseModel):
    candidate_email: EmailStr = Field(..., example="candidate@example.com")
    interview_date: str = Field(..., example="2025-03-15")
    start_time: str = Field(..., example="10:00")
    duration_minutes: int = Field(default=60, ge=15, le=240)


class SendEmailRequest(BaseModel):
    candidate_email: EmailStr = Field(..., example="candidate@example.com")
    interview_date: str = Field(..., example="2025-03-15")
    meet_link: str = Field(..., example="https://meet.google.com/abc-defg-hij")


class AgentQueryRequest(BaseModel):
    user_query: str = Field(
        ...,
        min_length=5,
        example="Find and evaluate top ML engineers, then schedule interviews for the best 3.",
    )
