import datetime
import os.path
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import pickle

SCOPES = ["https://www.googleapis.com/auth/calendar"]

def authenticate_google():
    creds = None

    if os.path.exists("token.pkl"):
        with open("token.pkl", "rb") as token:
            creds = pickle.load(token)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                "credentials.json", SCOPES
            )
            creds = flow.run_local_server(port=0)

        with open("token.pkl", "wb") as token:
            pickle.dump(creds, token)

    service = build("calendar", "v3", credentials=creds)
    return service


def create_event():
    service = authenticate_google()

    event = {
        "summary": "Test Interview",
        "start": {
            "dateTime": "2026-02-27T10:00:00+05:30",
            "timeZone": "Asia/Kolkata",
        },
        "end": {
            "dateTime": "2026-02-27T10:30:00+05:30",
            "timeZone": "Asia/Kolkata",
        },
    }

    event = service.events().insert(calendarId="primary", body=event).execute()
    print("Event created:", event.get("htmlLink"))


if __name__ == "__main__":
    create_event()