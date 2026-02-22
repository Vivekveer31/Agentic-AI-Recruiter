 Agentic AI Recruiter

An autonomous AI-powered recruitment pipeline that evaluates candidates based on real project depth — not just keywords.


 The Problem
Traditional ATS (Applicant Tracking Systems) rank candidates by keyword frequency. This means:

A candidate can copy-paste the job description into their resume and rank #1
Genuinely skilled developers with less polished resumes get filtered out
Recruiters waste hours manually reviewing hundreds of resumes
Interview scheduling adds another layer of manual coordination

The result: Bad hires, missed talent, and wasted recruiter time.

 The Solution
Agentic AI Recruiter is a fully autonomous pipeline that:

Accepts bulk resume uploads from recruiters
Extracts project/GitHub links from each resume
Scrapes GitHub repositories and analyzes README files
Uses Gemini AI to score candidates on actual project depth
Shortlists top-N candidates automatically
Schedules interviews directly on the recruiter's Google Calendar

Zero manual intervention per candidate.

 Architecture
┌─────────────────────────────────────────────────────────┐
│                    RECRUITER UPLOADS                     │
│                  (Bulk Resume PDFs)                      │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  RESUME PARSER                           │
│  • Extracts text from PDF                               │
│  • Identifies URLs (GitHub, portfolio, LinkedIn)        │
│  • Classifies and prioritizes GitHub links              │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                 GITHUB SCRAPER                           │
│  • Opens each GitHub repository                         │
│  • Fetches README.md content                            │
│  • Handles rate limiting with token pool + caching      │
│  • Flags private repos gracefully                       │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              GEMINI AI SCORING ENGINE                    │
│  • Evaluates: Problem clarity, Tech complexity,         │
│    Stack relevance, Project completeness                │
│  • Returns structured JSON score (0-100)                │
│  • Input sanitized to prevent prompt injection          │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              SHORTLISTING ENGINE                         │
│  • Ranks candidates by composite AI score               │
│  • Selects top-N (configurable by recruiter)            │
│  • Generates detailed score breakdown report            │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│           GOOGLE CALENDAR SCHEDULER                      │
│  • OAuth2 authentication for recruiter's calendar       │
│  • Finds available slots within recruiter's window      │
│  • Creates calendar events with candidate as invitee    │
│  • Sends automatic email invitations                    │
└─────────────────────────────────────────────────────────┘

 Tech Stack
TechnologyWhy UsedNode.jsAsync-heavy pipeline — perfect for I/O bound tasks like scraping and API callsTypeScriptType safety across the pipeline, reduces runtime errorsGemini AI APIPowerful LLM for contextual project evaluationGitHub REST APIFetch repo content and README files programmaticallyGoogle Calendar APIAutomate interview scheduling directly on recruiter's calendarOAuth2Secure authentication for Google services

 Key Features

Beyond Keyword Matching — Evaluates what candidates actually built, not what words they used
Bulk Processing — Upload 100+ resumes at once, pipeline handles everything
GitHub Deep Analysis — Opens actual repos, reads README, understands project context
AI Scoring with Transparency — Each candidate gets a breakdown: problem clarity score, tech complexity score, relevance score
Prompt Injection Protection — README content is sanitized before being passed to Gemini
Rate Limit Handling — GitHub API token pooling + caching layer for scraped repos
Private Repo Handling — Gracefully flags and skips private repos without crashing
Auto Interview Scheduling — Top-N candidates get calendar invites automatically
