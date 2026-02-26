import smtplib
from email.mime.text import MIMEText

from app.core.config import get_settings
from app.utils.logger import get_logger

logger = get_logger(__name__)


class EmailService:
    def __init__(self, host: str, port: int, user: str, password: str):
        self._host = host
        self._port = port
        self._user = user
        self._password = password

    def send_interview_invite(
        self,
        candidate_email: str,
        interview_date: str,
        meet_link: str,
    ) -> str:
        """Send an interview invitation email to a candidate."""
        subject = "Interview Invitation"
        body = (
            f"Dear Candidate,\n\n"
            f"Congratulations! Based on your profile, we would like to invite you "
            f"for an interview.\n\n"
            f"📅 Date: {interview_date}\n"
            f"🔗 Meeting Link: {meet_link}\n\n"
            f"Please confirm your availability.\n\n"
            f"Regards,\n"
            f"HR Team"
        )

        msg = MIMEText(body)
        msg["Subject"] = subject
        msg["From"] = self._user
        msg["To"] = candidate_email

        try:
            with smtplib.SMTP_SSL(self._host, self._port) as server:
                server.login(self._user, self._password)
                server.send_message(msg)
            logger.info(f"Interview email sent to {candidate_email}")
            return f"Email sent successfully to {candidate_email}"
        except smtplib.SMTPException as exc:
            logger.error(f"Failed to send email to {candidate_email}: {exc}")
            raise RuntimeError(f"Email delivery failed: {exc}") from exc


def get_email_service() -> EmailService:
    settings = get_settings()
    return EmailService(
        host=settings.EMAIL_HOST,
        port=settings.EMAIL_PORT,
        user=settings.EMAIL_USER,
        password=settings.EMAIL_PASS,
    )
