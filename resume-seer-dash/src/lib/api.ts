// ---------------------------------------------------------------------------
// Central API client — all requests point to the FastAPI backend
// ---------------------------------------------------------------------------

const BASE_URL = "http://localhost:8000";

// ---------- shared helper --------------------------------------------------
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ---------- Types ----------------------------------------------------------
export interface CandidateResult {
  id: string;
  similarity_score: number;
  ats_score: number;
  final_score: number;
  metadata: Record<string, unknown>;
}

export interface CandidateSearchResponse {
  job_description: string;
  total_results: number;
  candidates: CandidateResult[];
}

export interface EvaluationResponse {
  email_id: string;
  similarity_score: number;
  ats_score: number;
  credibility_score: number;
  final_score: number;
  urls_checked: string[];
}

export interface ScheduleInterviewResponse {
  candidate_email: string;
  interview_date: string;
  start_time: string;
  meet_link: string;
  status: string;
}

export interface SendEmailResponse {
  candidate_email: string;
  status: string;
  message: string;
}

export interface AgentResponse {
  user_query: string;
  agent_response: string;
}

export interface UploadResumeResult {
  email: string;
  ats_score: number;
  summary_preview: string;
  upserted: boolean;
}

export interface UploadResponse {
  processed: number;
  skipped: number;
  results: UploadResumeResult[];
  errors: { filename: string; error: string }[];
}

// ---------- Agent ----------------------------------------------------------
export async function runAgent(query: string): Promise<AgentResponse> {
  return apiFetch<AgentResponse>("/agent/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_query: query }),
  });
}

// ---------- Candidates ----------------------------------------------------
export async function searchCandidates(
  jobDescription: string,
  topK = 10
): Promise<CandidateSearchResponse> {
  return apiFetch<CandidateSearchResponse>("/candidates/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ job_description: jobDescription, top_k: topK }),
  });
}

export async function evaluateCandidate(email: string): Promise<EvaluationResponse> {
  return apiFetch<EvaluationResponse>(
    `/candidates/${encodeURIComponent(email)}/evaluate`
  );
}

export async function uploadResumes(files: File[]): Promise<UploadResponse> {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  return apiFetch<UploadResponse>("/candidates/upload", {
    method: "POST",
    body: form,
  });
}

// ---------- Interview -----------------------------------------------------
export interface ScheduleInterviewRequest {
  candidate_email: string;
  interview_date: string;
  start_time: string;
  duration_minutes?: number;
}

export async function scheduleInterview(
  data: ScheduleInterviewRequest
): Promise<ScheduleInterviewResponse> {
  return apiFetch<ScheduleInterviewResponse>("/interview/schedule", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export interface SendEmailRequest {
  candidate_email: string;
  interview_date: string;
  meet_link: string;
}

export async function sendInterviewEmail(
  data: SendEmailRequest
): Promise<SendEmailResponse> {
  return apiFetch<SendEmailResponse>("/interview/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
