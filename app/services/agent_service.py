import json
from langchain.agents import create_react_agent, AgentExecutor
from langchain_openai import ChatOpenAI
from langchain.tools import tool
from langchain_core.prompts import PromptTemplate

from app.core.config import get_settings
from app.services.embedding_service import EmbeddingService
from app.services.vector_service import VectorService
from app.services.evaluation_service import EvaluationService
from app.services.calendar_service import CalendarService
from app.services.email_service import EmailService
from app.utils.logger import get_logger

logger = get_logger(__name__)

AGENT_PROMPT = PromptTemplate.from_template(
    """You are an AI HR Recruitment Assistant. Help the HR team find, evaluate,
and schedule interviews for the best candidates.

You have access to the following tools:
{tools}

IMPORTANT RULES FOR ACTION INPUT:
- For tools that need a single value (query_retriever, evaluate_candidate), pass the value directly as a plain string.
- For tools that need multiple values (schedule_google_meet, send_interview_email), you MUST pass a valid JSON object string.
  Example for schedule_google_meet:
    Action Input: {{"candidate_email": "john@example.com", "interview_date": "2026-03-10", "start_time": "11:00", "duration_minutes": 60}}
  Example for send_interview_email:
    Action Input: {{"candidate_email": "john@example.com", "interview_date": "2026-03-10", "meet_link": "https://meet.google.com/abc-xyz"}}
- Never use comma-separated values. Always use a JSON dict for multi-parameter tools.

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action (plain string for single-param tools, JSON dict string for multi-param tools)
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Begin!

Question: {input}
Thought:{agent_scratchpad}"""
)


class AgentService:
    def __init__(
        self,
        embedding_service: EmbeddingService,
        vector_service: VectorService,
        evaluation_service: EvaluationService,
        calendar_service: CalendarService,
        email_service: EmailService,
    ):
        self._es = embedding_service
        self._vs = vector_service
        self._eval = evaluation_service
        self._cal = calendar_service
        self._mail = email_service
        self._executor = self._build_executor()

    # ------------------------------------------------------------------
    # Tool definitions (closures capture service references)
    # ------------------------------------------------------------------

    def _build_tools(self):
        vs = self._vs
        es = self._es
        eval_svc = self._eval
        cal = self._cal
        mail = self._mail

        @tool
        def query_retriever(job_description: str) -> str:
            """
            Search for matching candidates given a job description.
            Returns a comma-separated list of candidate email IDs.
            """
            embedding = es.encode(job_description)
            candidates = vs.search_candidates(embedding, top_k=50)
            top_5 = candidates[:5]
            emails = [c["id"] for c in top_5]
            return ", ".join(emails) if emails else "No candidates found."

        @tool
        def evaluate_candidate(email_id: str) -> str:
            """
            Evaluate a candidate by their email ID.
            Returns detailed scores including similarity, ATS, credibility and final score.
            """
            try:
                result = eval_svc.evaluate(email_id)
                return (
                    f"email_id: {result['email_id']}, "
                    f"similarity_score: {result['similarity_score']}, "
                    f"ats_score: {result['ats_score']}, "
                    f"credibility_score: {result['credibility_score']}, "
                    f"final_score: {result['final_score']}, "
                    f"urls_checked: {result['urls_checked']}"
                )
            except ValueError as e:
                return f"Error: {e}"

        @tool
        def schedule_google_meet(input_json: str) -> str:
            """
            Schedule a Google Meet interview for a candidate.
            Returns the Google Meet URL.
            REQUIRED: Pass a JSON string with these keys:
              - candidate_email (string): candidate's email address
              - interview_date (string): date in YYYY-MM-DD format
              - start_time (string): time in HH:MM format (24h)
              - duration_minutes (int, optional): meeting duration in minutes, default 60
            Example: {"candidate_email": "john@example.com", "interview_date": "2026-03-10", "start_time": "11:00", "duration_minutes": 60}
            """
            try:
                # Accept either a JSON dict string or a bare string fallback
                try:
                    params = json.loads(input_json)
                except (json.JSONDecodeError, TypeError):
                    return "Error: Action Input must be a valid JSON object string. Example: {\"candidate_email\": \"a@b.com\", \"interview_date\": \"2026-03-10\", \"start_time\": \"11:00\"}"
                candidate_email = params.get("candidate_email", "")
                interview_date = params.get("interview_date", "")
                start_time = params.get("start_time", "")
                duration_minutes = int(params.get("duration_minutes", 60))
                if not candidate_email or not interview_date or not start_time:
                    return "Error: candidate_email, interview_date, and start_time are all required."
                return cal.schedule_meeting(candidate_email, interview_date, start_time, duration_minutes)
            except Exception as e:
                return f"Error scheduling meeting: {e}"

        @tool
        def send_interview_email(input_json: str) -> str:
            """
            Send an interview invitation email to a candidate.
            REQUIRED: Pass a JSON string with these keys:
              - candidate_email (string): candidate's email address
              - interview_date (string): date string e.g. "2026-03-10"
              - meet_link (string): Google Meet URL
            Example: {"candidate_email": "john@example.com", "interview_date": "2026-03-10", "meet_link": "https://meet.google.com/abc-xyz"}
            """
            try:
                try:
                    params = json.loads(input_json)
                except (json.JSONDecodeError, TypeError):
                    return "Error: Action Input must be a valid JSON object string."
                candidate_email = params.get("candidate_email", "")
                interview_date = params.get("interview_date", "")
                meet_link = params.get("meet_link", "")
                if not candidate_email or not interview_date or not meet_link:
                    return "Error: candidate_email, interview_date, and meet_link are all required."
                return mail.send_interview_invite(candidate_email, interview_date, meet_link)
            except Exception as e:
                return f"Error sending email: {e}"

        return [query_retriever, evaluate_candidate, schedule_google_meet, send_interview_email]

    def _build_executor(self) -> AgentExecutor:
        settings = get_settings()
        llm = ChatOpenAI(
            model=settings.LLM_MODEL,
            base_url=settings.GROQ_BASE_URL,
            api_key=settings.GROQ_API_KEY,
            temperature=0,
        )
        tools = self._build_tools()
        agent = create_react_agent(llm=llm, tools=tools, prompt=AGENT_PROMPT)
        return AgentExecutor(agent=agent, tools=tools, verbose=True, handle_parsing_errors=True, max_iterations=20)

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def run(self, user_query: str) -> str:
        logger.info(f"Agent query: {user_query}")
        result = self._executor.invoke({"input": user_query})
        return result.get("output", "")
