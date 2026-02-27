# 🤖  Agentic AI Recruiter


A **AI-powered HR Recruitment Automation** built with FastAPI, LangChain, Pinecone, Google Calendar and SMTP. It automates the end-to-end pipeline from resume retrieval and candidate evaluation to interview scheduling and email invitations.

---

## 📐 Architecture

```
┌──────────────────────────────────────────────────────┐
│                    FastAPI Application                │
│                                                      │
│  /candidates/search  →  EmbeddingService             │
│                         VectorService (Pinecone)     │
│                         Hybrid Scoring               │
│                                                      │
│  /candidates/{email}/evaluate → EvaluationService   │
│                                 GitHub credibility   │
│                                                      │
│  /interview/schedule → CalendarService (Google)      │
│  /interview/send-email → EmailService (SMTP)         │
│                                                      │
│  /agent/run → AgentService (LangChain ReAct Agent)   │
│               ↳ uses all tools above autonomously    │
└──────────────────────────────────────────────────────┘
```

### Scoring Formula

```
# Candidate Search (hybrid ranking)
final_score = 0.7 × similarity_score + 0.3 × (ats_score / 100)

# Candidate Evaluation (deep score)
final_score = 0.6 × similarity + 0.25 × (ats_score / 100) + 0.15 × (credibility / 50)
```

---

## 📁 Project Structure

```
hr_ai_agent/
├── app/
│   ├── main.py                    # FastAPI app entry point
│   ├── core/
│   │   ├── config.py              # Pydantic Settings (env vars)
│   │   └── security.py            # API key auth middleware
│   ├── services/
│   │   ├── embedding_service.py   # BGE sentence embeddings
│   │   ├── vector_service.py      # Pinecone queries + hybrid scoring
│   │   ├── evaluation_service.py  # Deep candidate evaluation
│   │   ├── calendar_service.py    # Google Calendar / Meet
│   │   ├── email_service.py       # SMTP email delivery
│   │   └── agent_service.py       # LangChain ReAct agent
│   ├── api/routes/
│   │   ├── candidate.py           # /candidates endpoints
│   │   ├── interview.py           # /interview endpoints
│   │   └── agent.py               # /agent endpoint
│   ├── models/
│   │   ├── request_models.py      # Pydantic request schemas
│   │   └── response_models.py     # Pydantic response schemas
│   └── utils/
│       └── logger.py              # Structured logging
├── tests/
│   └── test_candidate.py
├── .env.example
├── requirements.txt
├── Dockerfile
└── README.md
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `PINECONE_API_KEY` | Pinecone API key |
| `PINECONE_INDEX` | Pinecone index name |
| `GROQ_API_KEY` | Groq API key (OpenAI-compatible) |
| `GROQ_BASE_URL` | Groq base URL |
| `LLM_MODEL` | LLM model ID |
| `EMAIL_HOST` | SMTP host (e.g. smtp.gmail.com) |
| `EMAIL_PORT` | SMTP port (e.g. 465) |
| `EMAIL_USER` | Sender email address |
| `EMAIL_PASS` | App password (Gmail) |
| `GOOGLE_CREDENTIALS_FILE` | Path to Google OAuth credentials JSON |
| `GOOGLE_TOKEN_FILE` | Path to cached token pickle |
| `EMBEDDING_MODEL` | HuggingFace embedding model ID |

---

## 🚀 Local Setup

### Prerequisites
- Python 3.11+
- A Pinecone account with a populated index
- A Google Cloud project with Calendar API enabled
- A Gmail account with an App Password

### 1 – Clone and install

```bash
git clone https://github.com/your-org/hr-ai-agent.git
cd hr-ai-agent
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2 – Configure environment

```bash
cp .env.example .env
# Edit .env with your actual credentials
```

### 3 – Google OAuth setup

Place your `credentials.json` (downloaded from Google Cloud Console) in the project root. On first run the server will open a browser to authenticate and will save `token.pickle` for subsequent runs.

### 4 – Run the server

```bash
uvicorn app.main:app --reload --port 8000
```

Visit **http://localhost:8000/docs** for the interactive Swagger UI.

---

## 📡 API Endpoints

### `POST /candidates/search`
Search and rank candidates using hybrid scoring.

```bash
curl -X POST http://localhost:8000/candidates/search \
  -H "Content-Type: application/json" \
  -d '{
    "job_description": "Machine Learning Engineer with 3+ years in Python, TensorFlow and NLP",
    "top_k": 5
  }'
```

### `GET /candidates/{email}/evaluate`
Deep evaluation of a single candidate.

```bash
curl http://localhost:8000/candidates/john%40example.com/evaluate
```

### `POST /interview/schedule`
Schedule a Google Meet interview.

```bash
curl -X POST http://localhost:8000/interview/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_email": "candidate@example.com",
    "interview_date": "2025-03-15",
    "start_time": "10:00",
    "duration_minutes": 60
  }'
```

### `POST /interview/send-email`
Send an interview invitation email.

```bash
curl -X POST http://localhost:8000/interview/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_email": "candidate@example.com",
    "interview_date": "2025-03-15",
    "meet_link": "https://meet.google.com/abc-defg-hij"
  }'
```

### `POST /agent/run`
Natural language instruction to the autonomous HR agent.

```bash
curl -X POST http://localhost:8000/agent/run \
  -H "Content-Type: application/json" \
  -d '{
    "user_query": "Find the top 3 ML engineers, evaluate them, and schedule interviews for next Monday at 11am."
  }'
```

---

## 🐳 Docker Deployment

### Build and run

```bash
docker build -t hr-ai-agent .
docker run -p 8000:8000 --env-file .env hr-ai-agent
```

### With Google credentials

```bash
docker run -p 8000:8000 \
  --env-file .env \
  -v $(pwd)/credentials.json:/app/credentials.json \
  -v $(pwd)/token.pickle:/app/token.pickle \
  hr-ai-agent
```

### Docker Compose (recommended)

```yaml
# docker-compose.yml
version: "3.9"
services:
  hr-agent:
    build: .
    ports:
      - "8000:8000"
    env_file:
      - .env
    volumes:
      - ./credentials.json:/app/credentials.json
      - ./token.pickle:/app/token.pickle
    restart: unless-stopped
```

```bash
docker compose up -d
```

---

## 🧪 Running Tests

```bash
pytest tests/ -v
```

---

## 📘 API Documentation

Once the server is running:
- **Swagger UI** → http://localhost:8000/docs
- **ReDoc** → http://localhost:8000/redoc

---

## 🔄 Workflow Explanation

1. **Resume Ingestion** – Resumes are embedded using `BAAI/bge-small-en-v1.5` and stored in Pinecone with ATS score metadata.
2. **Candidate Search** – A job description is embedded and queried against Pinecone. Results are re-ranked using the hybrid formula.
3. **Candidate Evaluation** – Individual candidates are scored on semantic relevance, ATS match, and online credibility (GitHub profile, live URLs).
4. **Interview Scheduling** – Google Calendar API creates a calendar event with a Google Meet link and sends calendar invites.
5. **Email Notification** – A formatted invitation email is sent via SMTP.
6. **Agent Orchestration** – The `/agent/run` endpoint accepts free-form HR instructions and the LangChain ReAct agent autonomously chains the above steps.
