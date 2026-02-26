from fastapi import APIRouter, Depends, HTTPException, status

from app.models.request_models import ScheduleInterviewRequest, SendEmailRequest
from app.models.response_models import ScheduleInterviewResponse, SendEmailResponse
from app.services.calendar_service import CalendarService, get_calendar_service
from app.services.email_service import EmailService, get_email_service
from app.utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/interview", tags=["Interview"])


@router.post(
    "/schedule",
    response_model=ScheduleInterviewResponse,
    summary="Schedule a Google Meet interview for a candidate",
)
async def schedule_interview(
    body: ScheduleInterviewRequest,
    cal: CalendarService = Depends(get_calendar_service),
):
    """
    Creates a Google Calendar event with a Google Meet link and sends an
    invite to the candidate. Returns the Meet URL.
    """
    try:
        meet_link = cal.schedule_meeting(
            candidate_email=body.candidate_email,
            interview_date=body.interview_date,
            start_time=body.start_time,
            duration_minutes=body.duration_minutes,
        )
        return ScheduleInterviewResponse(
            candidate_email=body.candidate_email,
            interview_date=body.interview_date,
            start_time=body.start_time,
            meet_link=meet_link,
        )
    except Exception as exc:
        logger.exception("Error scheduling interview")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))


@router.post(
    "/send-email",
    response_model=SendEmailResponse,
    summary="Send interview invitation email to a candidate",
)
async def send_interview_email(
    body: SendEmailRequest,
    mail: EmailService = Depends(get_email_service),
):
    """
    Sends a formatted interview invitation email containing the interview
    date and Google Meet link.
    """
    try:
        message = mail.send_interview_invite(
            candidate_email=body.candidate_email,
            interview_date=body.interview_date,
            meet_link=body.meet_link,
        )
        return SendEmailResponse(
            candidate_email=body.candidate_email,
            status="sent",
            message=message,
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc))
    except Exception as exc:
        logger.exception("Error sending interview email")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))
