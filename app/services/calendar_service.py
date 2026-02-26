import os
import uuid
import pickle
from datetime import datetime, timedelta

from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from google.auth.transport.requests import Request

from app.core.config import get_settings
from app.utils.logger import get_logger

logger = get_logger(__name__)

SCOPES = ["https://www.googleapis.com/auth/calendar"]


class CalendarService:
    def __init__(self, credentials_file: str, token_file: str):
        self._credentials_file = credentials_file
        self._token_file = token_file
        self._service = self._build_service()

    def _build_service(self):
        creds = None
        if os.path.exists(self._token_file):
            with open(self._token_file, "rb") as f:
                creds = pickle.load(f)

        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    self._credentials_file, SCOPES
                )
                creds = flow.run_local_server(port=0)
            with open(self._token_file, "wb") as f:
                pickle.dump(creds, f)

        return build("calendar", "v3", credentials=creds)

    def schedule_meeting(
        self,
        candidate_email: str,
        interview_date: str,
        start_time: str,
        duration_minutes: int = 60,
    ) -> str:
        """
        Create a Google Calendar event with Meet link.
        Returns the Google Meet URL.
        """
        start_datetime = self._parse_datetime(interview_date, start_time)
        end_datetime = start_datetime + timedelta(minutes=duration_minutes)

        event_body = {
            "summary": "Interview Meeting",
            "start": {
                "dateTime": start_datetime.isoformat(),
                "timeZone": "Asia/Kolkata",
            },
            "end": {
                "dateTime": end_datetime.isoformat(),
                "timeZone": "Asia/Kolkata",
            },
            "attendees": [{"email": candidate_email}],
            "conferenceData": {
                "createRequest": {"requestId": str(uuid.uuid4())}
            },
        }

        created_event = (
            self._service.events()
            .insert(
                calendarId="primary",
                body=event_body,
                conferenceDataVersion=1,
            )
            .execute()
        )

        meet_url = created_event["conferenceData"]["entryPoints"][0]["uri"]
        logger.info(f"Scheduled meeting for {candidate_email}: {meet_url}")
        return meet_url

    @staticmethod
    def _parse_datetime(date_str: str, time_str: str) -> datetime:
        combined = f"{date_str} {time_str}"
        for fmt in (
            f"{date_str}T{time_str}",
            "%Y-%m-%d %I:%M %p",
            "%Y-%m-%d %H:%M",
        ):
            try:
                if "T" in fmt:
                    return datetime.fromisoformat(fmt)
                return datetime.strptime(combined, fmt)
            except ValueError:
                continue
        raise ValueError(f"Cannot parse date/time: '{date_str}' '{time_str}'")


def get_calendar_service() -> CalendarService:
    settings = get_settings()
    return CalendarService(settings.GOOGLE_CREDENTIALS_FILE, settings.GOOGLE_TOKEN_FILE)
