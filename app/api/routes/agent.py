from fastapi import APIRouter, Depends, HTTPException, status

from app.models.request_models import AgentQueryRequest
from app.models.response_models import AgentResponse
from app.services.agent_service import AgentService
from app.services.embedding_service import EmbeddingService, get_embedding_service
from app.services.vector_service import VectorService, get_vector_service
from app.services.evaluation_service import EvaluationService
from app.services.calendar_service import CalendarService, get_calendar_service
from app.services.email_service import EmailService, get_email_service
from app.utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/agent", tags=["Agent"])


def get_agent_service(
    es: EmbeddingService = Depends(get_embedding_service),
    vs: VectorService = Depends(get_vector_service),
    cal: CalendarService = Depends(get_calendar_service),
    mail: EmailService = Depends(get_email_service),
) -> AgentService:
    eval_svc = EvaluationService(vector_service=vs, embedding_service=es)
    return AgentService(
        embedding_service=es,
        vector_service=vs,
        evaluation_service=eval_svc,
        calendar_service=cal,
        email_service=mail,
    )


@router.post(
    "/run",
    response_model=AgentResponse,
    summary="Run the HR agent with a natural language query",
)
async def run_agent(
    body: AgentQueryRequest,
    agent: AgentService = Depends(get_agent_service),
):
    """
    Pass a natural language instruction to the AI HR agent.
    The agent will autonomously decide which tools to use (search, evaluate,
    schedule, email) to fulfil the request.

    Example queries:
    - "Find the top 5 ML engineers and schedule interviews for them this Friday at 2pm."
    - "Evaluate candidate john@example.com and send an interview invite if score > 0.7."
    """
    try:
        response = agent.run(body.user_query)
        return AgentResponse(user_query=body.user_query, agent_response=response)
    except Exception as exc:
        logger.exception("Agent execution error")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))
