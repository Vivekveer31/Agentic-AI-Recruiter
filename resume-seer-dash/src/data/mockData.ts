export const jobRoles = [
  { id: "jr1", title: "Senior Frontend Engineer", department: "Engineering", openings: 3, applications: 127, shortlisted: 18, status: "Active" },
  { id: "jr2", title: "ML Engineer", department: "AI/ML", openings: 2, applications: 89, shortlisted: 12, status: "Active" },
  { id: "jr3", title: "Product Manager", department: "Product", openings: 1, applications: 203, shortlisted: 9, status: "Active" },
  { id: "jr4", title: "DevOps Engineer", department: "Infrastructure", openings: 2, applications: 64, shortlisted: 8, status: "Active" },
  { id: "jr5", title: "UX Designer", department: "Design", openings: 1, applications: 91, shortlisted: 11, status: "Paused" },
];

export const candidates = [
  {
    id: "c1",
    name: "Arjun Sharma",
    email: "arjun.sharma@gmail.com",
    phone: "+91 98765 43210",
    role: "Senior Frontend Engineer",
    experience: "6 years",
    atsScore: 91,
    skillMatch: 94,
    status: "Strong",
    location: "Bangalore, IN",
    education: "B.Tech CSE, IIT Delhi",
    skills: ["React", "TypeScript", "GraphQL", "Node.js", "AWS", "Docker"],
    summary: "Highly experienced frontend engineer with a strong track record of building scalable React applications. Led a team of 5 engineers at Flipkart, delivered 40% performance improvement on the checkout flow.",
    strengths: ["System design depth", "TypeScript proficiency", "Strong communication", "Leadership experience"],
    weaknesses: ["Limited backend exposure", "No mobile development experience"],
    redFlags: [],
    experience_timeline: [
      { company: "Flipkart", role: "Senior SDE-2", period: "2021–Present", duration: "3 yrs" },
      { company: "Razorpay", role: "SDE-1", period: "2019–2021", duration: "2 yrs" },
      { company: "Infosys", role: "Software Engineer", period: "2018–2019", duration: "1 yr" },
    ],
    projects: [
      { name: "Flipkart Checkout Revamp", impact: "40% faster page load, $2M revenue uplift" },
      { name: "Design System Library", impact: "Adopted by 12 teams, 60% dev velocity improvement" },
    ],
    skillScores: { React: 95, TypeScript: 92, "System Design": 85, "Node.js": 72, AWS: 68, GraphQL: 88 },
    matchExplanation: "Score of 91/100: Exceptional React & TypeScript skills (95, 92), 6 yrs highly relevant experience, IIT pedigree. -4 for limited backend depth.",
    interviewQuestions: {
      technical: [
        "How would you architect a micro-frontend system for a large e-commerce platform?",
        "Explain your approach to optimizing React rendering performance at scale.",
        "How do you handle state management when combining GraphQL with local state?",
        "Describe your experience with TypeScript generics and advanced type patterns.",
      ],
      behavioral: [
        "Tell me about a time you disagreed with a product decision and how you handled it.",
        "Describe leading a team through a technically complex migration.",
        "How do you mentor junior engineers while managing your own delivery?",
      ],
      skillGap: [
        "How comfortable are you with backend API design? Walk me through a REST API you'd design.",
        "What's your familiarity with containerization and CI/CD pipelines?",
      ],
      followUp: [
        "What architectural patterns did you use for the Flipkart checkout revamp?",
        "How did you measure the 40% performance improvement?",
      ],
    },
  },
  {
    id: "c2",
    name: "Priya Mehta",
    email: "priya.mehta@outlook.com",
    phone: "+91 87654 32109",
    role: "ML Engineer",
    experience: "4 years",
    atsScore: 84,
    skillMatch: 79,
    status: "Strong",
    location: "Hyderabad, IN",
    education: "M.Tech AI, IIT Bombay",
    skills: ["Python", "PyTorch", "TensorFlow", "MLOps", "FastAPI", "SQL"],
    summary: "ML Engineer with 4 years building production ML pipelines at Swiggy. Specialized in recommendation systems and NLP models. Published 2 research papers at ACL 2023.",
    strengths: ["Strong ML fundamentals", "Research background", "MLOps expertise", "Cross-functional collaboration"],
    weaknesses: ["Limited LLM fine-tuning experience", "No distributed systems background"],
    redFlags: [],
    experience_timeline: [
      { company: "Swiggy", role: "ML Engineer", period: "2021–Present", duration: "3 yrs" },
      { company: "TCS Research", role: "Research Intern", period: "2020–2021", duration: "1 yr" },
    ],
    projects: [
      { name: "Food Recommendation Engine", impact: "18% increase in order conversion" },
      { name: "ETA Prediction System", impact: "Reduced RMSE by 34%, deployed to 50M users" },
    ],
    skillScores: { Python: 95, PyTorch: 88, "ML Theory": 92, MLOps: 80, NLP: 85, FastAPI: 72 },
    matchExplanation: "Score of 84/100: Strong ML research background, production experience at Swiggy. -16 for no LLM experience and limited distributed systems knowledge.",
    interviewQuestions: {
      technical: [
        "How would you design an end-to-end ML pipeline for real-time recommendation at 10M QPS?",
        "Explain how you would handle training data imbalance for fraud detection.",
        "Walk me through your MLOps workflow from experiment tracking to production.",
      ],
      behavioral: [
        "Describe a model that underperformed in production despite good offline metrics.",
        "How do you communicate ML limitations to non-technical stakeholders?",
      ],
      skillGap: [
        "What's your experience with LLM fine-tuning and RLHF?",
        "How familiar are you with distributed training using Horovod or FSDP?",
      ],
      followUp: [
        "How did you prevent feature leakage in the recommendation engine?",
        "What monitoring did you set up for the ETA prediction model?",
      ],
    },
  },
  {
    id: "c3",
    name: "Rahul Gupta",
    email: "rahul.g@yahoo.com",
    phone: "+91 76543 21098",
    role: "Senior Frontend Engineer",
    experience: "3 years",
    atsScore: 67,
    skillMatch: 61,
    status: "Borderline",
    location: "Pune, IN",
    education: "B.E. IT, VIT University",
    skills: ["React", "JavaScript", "CSS", "Redux"],
    summary: "Mid-level frontend developer with 3 years at a mid-size startup. Solid React fundamentals but limited exposure to enterprise-scale architecture and TypeScript.",
    strengths: ["React proficiency", "Fast learner", "Good CSS skills"],
    weaknesses: ["No TypeScript experience", "Limited system design knowledge", "No team leadership"],
    redFlags: ["3-month employment gap (2022)", "Overstated experience in resume vs LinkedIn"],
    experience_timeline: [
      { company: "Kredmint", role: "Frontend Developer", period: "2022–Present", duration: "2 yrs" },
      { company: "Freelance", role: "Web Developer", period: "2021–2022", duration: "1 yr" },
    ],
    projects: [
      { name: "Admin Dashboard", impact: "Internal tool used by 50 users" },
    ],
    skillScores: { React: 72, JavaScript: 75, CSS: 80, TypeScript: 20, "System Design": 35, Redux: 65 },
    matchExplanation: "Score of 67/100: Solid React base but significant gaps in TypeScript (role requirement), no enterprise-scale experience. Red flag on resume-LinkedIn discrepancy.",
    interviewQuestions: {
      technical: [
        "Can you explain the difference between controlled and uncontrolled components?",
        "How do you handle performance optimization in React?",
        "Walk me through how you'd migrate a JavaScript codebase to TypeScript.",
      ],
      behavioral: [
        "Tell me about a challenging bug you solved and your debugging approach.",
        "Describe a situation where you had to quickly learn a new technology.",
      ],
      skillGap: [
        "What's your experience with TypeScript—can you explain generics and utility types?",
        "How do you approach scaling a frontend application to handle 1M+ users?",
      ],
      followUp: [
        "Can you explain the 3-month gap on your resume in 2022?",
        "I see a discrepancy in your years of experience between resume and LinkedIn—can you clarify?",
      ],
    },
  },
  {
    id: "c4",
    name: "Sneha Patel",
    email: "sneha.patel@gmail.com",
    phone: "+91 95432 10987",
    role: "Product Manager",
    experience: "5 years",
    atsScore: 88,
    skillMatch: 86,
    status: "Strong",
    location: "Mumbai, IN",
    education: "MBA, IIM Ahmedabad",
    skills: ["Product Strategy", "Agile", "SQL", "Figma", "A/B Testing", "OKRs"],
    summary: "Experienced PM with 5 years at Paytm building fintech products at scale. Launched 3 products with $10M+ GMV. Data-driven with strong analytical depth and stakeholder management skills.",
    strengths: ["Strong data intuition", "Executive communication", "Cross-functional leadership", "Customer empathy"],
    weaknesses: ["Limited technical depth for AI/ML products", "No B2B SaaS experience"],
    redFlags: [],
    experience_timeline: [
      { company: "Paytm", role: "Senior PM", period: "2021–Present", duration: "3 yrs" },
      { company: "Nykaa", role: "Associate PM", period: "2019–2021", duration: "2 yrs" },
    ],
    projects: [
      { name: "Paytm Insurance Launch", impact: "$8M GMV in year 1, 2.3M policies sold" },
      { name: "Nykaa Loyalty Program", impact: "35% increase in repeat purchase rate" },
    ],
    skillScores: { "Product Strategy": 90, "Agile/Scrum": 88, "SQL Analytics": 82, "Stakeholder Mgmt": 91, "A/B Testing": 85, Figma: 70 },
    matchExplanation: "Score of 88/100: IIM background, 5 yrs high-impact product experience, strong metrics orientation. -12 for no B2B SaaS or AI product experience.",
    interviewQuestions: {
      technical: [
        "How would you prioritize a backlog of 50 features with limited engineering bandwidth?",
        "Walk me through how you'd define success metrics for an AI-powered feature.",
        "How do you structure an A/B test for a payment flow change?",
      ],
      behavioral: [
        "Describe a time when data contradicted your intuition and how you resolved it.",
        "Tell me about a product you shipped that failed and what you learned.",
      ],
      skillGap: [
        "How would you approach product strategy for a B2B SaaS enterprise product?",
        "How comfortable are you defining requirements for ML model features?",
      ],
      followUp: [],
    },
  },
  {
    id: "c5",
    name: "Vikram Nair",
    email: "vikram.nair@hotmail.com",
    phone: "+91 88765 43201",
    role: "DevOps Engineer",
    experience: "7 years",
    atsScore: 92,
    skillMatch: 95,
    status: "Strong",
    location: "Chennai, IN",
    education: "B.Tech ECE, NIT Trichy",
    skills: ["Kubernetes", "Terraform", "AWS", "CI/CD", "Docker", "Prometheus", "Golang"],
    summary: "Senior DevOps/SRE with 7 years of experience managing infrastructure at scale. Led migration of 200+ microservices to Kubernetes at Ola. 99.99% uptime track record.",
    strengths: ["Kubernetes expert", "Cost optimization mindset", "Incident management", "Security-first approach"],
    weaknesses: ["Limited application development skills", "No data engineering background"],
    redFlags: [],
    experience_timeline: [
      { company: "Ola", role: "Senior SRE", period: "2020–Present", duration: "4 yrs" },
      { company: "Wipro", role: "Cloud Engineer", period: "2017–2020", duration: "3 yrs" },
    ],
    projects: [
      { name: "K8s Migration (200+ services)", impact: "40% infra cost reduction, 3x deployment speed" },
      { name: "SRE Practice Setup", impact: "Reduced MTTR from 45min to 8min" },
    ],
    skillScores: { Kubernetes: 96, Terraform: 93, AWS: 91, "CI/CD": 90, Docker: 95, Prometheus: 88, Golang: 75 },
    matchExplanation: "Score of 92/100: Exceptional Kubernetes and Terraform expertise, proven large-scale infrastructure management, excellent SRE track record. Near-perfect match.",
    interviewQuestions: {
      technical: [
        "How would you design a zero-downtime deployment strategy for 200 microservices?",
        "Explain your approach to Kubernetes resource quotas and HPA configuration.",
        "How do you implement GitOps with ArgoCD or FluxCD?",
      ],
      behavioral: [
        "Describe your most complex production incident and how you managed it.",
        "How do you build a culture of reliability in an engineering org?",
      ],
      skillGap: [
        "How familiar are you with eBPF for observability?",
        "What's your experience with multi-cloud or cloud-agnostic architectures?",
      ],
      followUp: [],
    },
  },
  {
    id: "c6",
    name: "Ananya Roy",
    email: "ananya.roy@gmail.com",
    phone: "+91 91234 56789",
    role: "UX Designer",
    experience: "4 years",
    atsScore: 79,
    skillMatch: 82,
    status: "Strong",
    location: "Kolkata, IN",
    education: "B.Des, NID Ahmedabad",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems", "Framer"],
    summary: "UX Designer with 4 years creating award-winning digital experiences. Strong research background. Led end-to-end design of PhonePe's SMB product used by 5M merchants.",
    strengths: ["Research-driven design", "Design systems expertise", "Stakeholder presentations", "NID pedigree"],
    weaknesses: ["Limited enterprise B2B design experience", "No motion design skills"],
    redFlags: [],
    experience_timeline: [
      { company: "PhonePe", role: "Senior UX Designer", period: "2021–Present", duration: "3 yrs" },
      { company: "Josh Talks", role: "UX Designer", period: "2020–2021", duration: "1 yr" },
    ],
    projects: [
      { name: "PhonePe SMB App", impact: "5M merchants, 4.7★ App Store rating" },
      { name: "PhonePe Design System", impact: "Adopted by 25 product teams" },
    ],
    skillScores: { Figma: 95, "User Research": 90, Prototyping: 88, "Design Systems": 92, Accessibility: 78, Framer: 70 },
    matchExplanation: "Score of 79/100: NID background, strong design system expertise, proven impact. -21 for no B2B enterprise UX and limited motion design.",
    interviewQuestions: {
      technical: [
        "Walk me through your design process from research to final handoff.",
        "How do you build and maintain a design system for a large product org?",
      ],
      behavioral: [
        "Tell me about a design decision you pushed back on and why.",
        "How do you design for diverse user groups including low-literacy users?",
      ],
      skillGap: [
        "How do you approach B2B enterprise UX differently from consumer product design?",
        "What's your experience with complex data visualization and dashboard design?",
      ],
      followUp: [],
    },
  },
  {
    id: "c7",
    name: "Karan Malhotra",
    email: "karan.m@gmail.com",
    phone: "+91 79876 54321",
    role: "ML Engineer",
    experience: "2 years",
    atsScore: 52,
    skillMatch: 48,
    status: "Reject",
    location: "Delhi, IN",
    education: "B.Tech CSE, Amity University",
    skills: ["Python", "Scikit-learn", "Pandas", "NumPy"],
    summary: "Junior ML engineer with 2 years experience mostly in data analysis and classical ML. Limited exposure to deep learning or production systems.",
    strengths: ["Python proficiency", "Data analysis skills"],
    weaknesses: ["No deep learning experience", "No production ML experience", "Limited MLOps knowledge", "No research background"],
    redFlags: ["Resume listed 'Expert' in PyTorch but no relevant projects", "No measurable impact in any role"],
    experience_timeline: [
      { company: "Accenture", role: "Data Analyst", period: "2022–Present", duration: "2 yrs" },
    ],
    projects: [
      { name: "Sentiment Analysis Notebook", impact: "Academic project only" },
    ],
    skillScores: { Python: 70, "ML Theory": 45, "Deep Learning": 15, MLOps: 10, NLP: 30, PyTorch: 12 },
    matchExplanation: "Score of 52/100: Significant skills gap vs JD requirements. Claims PyTorch expertise but no DL projects. Role requires production ML experience minimum 3 years.",
    interviewQuestions: { technical: [], behavioral: [], skillGap: [], followUp: [] },
  },
];

export const dashboardMetrics = {
  totalApplications: 574,
  shortlisted: 58,
  rejected: 312,
  interviewsScheduled: 24,
  avgAtsScore: 71.4,
  timeToHire: "18 days",
  offerAcceptRate: "84%",
  activeJobs: 9,
};

export const scoreDistribution = [
  { range: "0-20", count: 12 },
  { range: "21-40", count: 38 },
  { range: "41-60", count: 87 },
  { range: "61-70", count: 94 },
  { range: "71-80", count: 148 },
  { range: "81-90", count: 123 },
  { range: "91-100", count: 72 },
];

export const skillsDistribution = [
  { name: "React/Frontend", value: 34, color: "#6366f1" },
  { name: "ML/AI", value: 22, color: "#10b981" },
  { name: "DevOps/Cloud", value: 18, color: "#f59e0b" },
  { name: "Product", value: 14, color: "#8b5cf6" },
  { name: "Design", value: 12, color: "#06b6d4" },
];

export const experienceDistribution = [
  { level: "0-1 yr", count: 45 },
  { level: "1-2 yrs", count: 78 },
  { level: "2-3 yrs", count: 112 },
  { level: "3-5 yrs", count: 167 },
  { level: "5-7 yrs", count: 98 },
  { level: "7-10 yrs", count: 54 },
  { level: "10+ yrs", count: 20 },
];

export const shortlistTrend = [
  { week: "W1 Jan", shortlisted: 8, rejected: 42, applications: 78 },
  { week: "W2 Jan", shortlisted: 12, rejected: 55, applications: 91 },
  { week: "W3 Jan", shortlisted: 6, rejected: 38, applications: 67 },
  { week: "W4 Jan", shortlisted: 15, rejected: 61, applications: 103 },
  { week: "W1 Feb", shortlisted: 9, rejected: 48, applications: 82 },
  { week: "W2 Feb", shortlisted: 18, rejected: 70, applications: 121 },
  { week: "W3 Feb", shortlisted: 11, rejected: 52, applications: 88 },
  { week: "W4 Feb", shortlisted: 21, rejected: 78, applications: 143 },
];

export const radarData = [
  { skill: "React", required: 90, candidates: 72 },
  { skill: "TypeScript", required: 85, candidates: 58 },
  { skill: "System Design", required: 80, candidates: 55 },
  { skill: "Node.js", required: 70, candidates: 65 },
  { skill: "AWS", required: 65, candidates: 48 },
  { skill: "Leadership", required: 75, candidates: 52 },
];

export const funnelData = [
  { stage: "Applications", count: 574, percentage: 100 },
  { stage: "Screened", count: 312, percentage: 54 },
  { stage: "Shortlisted", count: 58, percentage: 10 },
  { stage: "Interviewed", count: 24, percentage: 4.2 },
  { stage: "Offers Sent", count: 12, percentage: 2.1 },
  { stage: "Hired", count: 8, percentage: 1.4 },
];

export const talentPool = [
  { id: "t1", name: "Amit Joshi", role: "Senior Backend Engineer", tags: ["Go", "Microservices", "Kafka"], score: 87, status: "Available", lastSeen: "2 weeks ago", notify: true },
  { id: "t2", name: "Divya Krishnan", role: "Data Scientist", tags: ["Python", "NLP", "LLMs"], score: 91, status: "Open to Offers", lastSeen: "3 days ago", notify: true },
  { id: "t3", name: "Manish Tiwari", role: "Frontend Engineer", tags: ["React", "TypeScript", "Design Systems"], score: 78, status: "Passively Looking", lastSeen: "1 month ago", notify: false },
  { id: "t4", name: "Kavitha Rajan", role: "Engineering Manager", tags: ["Leadership", "Java", "Agile"], score: 84, status: "Available", lastSeen: "1 week ago", notify: true },
  { id: "t5", name: "Saurabh Mishra", role: "Cloud Architect", tags: ["AWS", "GCP", "Terraform"], score: 93, status: "Open to Offers", lastSeen: "5 days ago", notify: false },
  { id: "t6", name: "Nalini Subramaniam", role: "Product Designer", tags: ["Figma", "Research", "B2B"], score: 82, status: "Passively Looking", lastSeen: "2 months ago", notify: true },
];

export const scheduledInterviews = [
  { id: "i1", candidate: "Arjun Sharma", role: "Senior Frontend Engineer", round: "Technical Round 1", date: "2026-02-20", time: "10:00 AM", interviewer: "Ravi Kumar", status: "Confirmed" },
  { id: "i2", candidate: "Priya Mehta", role: "ML Engineer", round: "System Design", date: "2026-02-21", time: "02:00 PM", interviewer: "Dr. Anand Rao", status: "Confirmed" },
  { id: "i3", candidate: "Sneha Patel", role: "Product Manager", round: "Case Study", date: "2026-02-22", time: "11:00 AM", interviewer: "Neha Sharma", status: "Pending" },
  { id: "i4", candidate: "Vikram Nair", role: "DevOps Engineer", round: "Culture Fit", date: "2026-02-24", time: "03:00 PM", interviewer: "CTO", status: "Confirmed" },
  { id: "i5", candidate: "Ananya Roy", role: "UX Designer", round: "Portfolio Review", date: "2026-02-25", time: "01:00 PM", interviewer: "Design Lead", status: "Pending" },
];

export const emailTemplates = [
  {
    id: "e1",
    name: "Shortlist Notification",
    subject: "Congratulations! You've been shortlisted for {{role}} at TalentAI",
    body: `Dear {{name}},

We are pleased to inform you that you have been shortlisted for the {{role}} position at TalentAI.

Your profile stood out among {{total}} applicants, and we're excited to move forward with your application.

Next Steps:
- Technical Assessment: {{date}}
- Duration: 90 minutes
- Format: Online coding exercise + system design discussion

Please confirm your availability by clicking the link below.

Best regards,
{{recruiter_name}}
Talent Acquisition | TalentAI`,
    category: "Shortlist",
    sentCount: 58,
  },
  {
    id: "e2",
    name: "Interview Invite",
    subject: "Interview Scheduled: {{role}} — {{date}} at {{time}}",
    body: `Dear {{name}},

We'd like to schedule your {{round}} interview for the {{role}} position.

Details:
- Date: {{date}}
- Time: {{time}} IST
- Duration: 60 minutes
- Platform: Google Meet (link below)
- Interviewer: {{interviewer}}

Meeting Link: {{meet_link}}

Please reach out if you need to reschedule.

Best,
{{recruiter_name}}`,
    category: "Interview",
    sentCount: 24,
  },
  {
    id: "e3",
    name: "Rejection (Respectful)",
    subject: "Update on your application for {{role}} at TalentAI",
    body: `Dear {{name}},

Thank you for taking the time to apply for the {{role}} position and for your interest in TalentAI.

After careful consideration of your profile alongside a highly competitive applicant pool, we have decided to move forward with other candidates whose experience more closely matches our current requirements.

This is not a reflection of your potential, and we encourage you to apply for future openings that match your skills.

We wish you all the best in your career journey.

Warm regards,
{{recruiter_name}}
TalentAI Recruiting`,
    category: "Rejection",
    sentCount: 312,
  },
];

export const diversityData = [
  { category: "Gender", data: [{ name: "Male", value: 68 }, { name: "Female", value: 29 }, { name: "Non-binary", value: 3 }] },
  { category: "Location", data: [{ name: "Metro", value: 72 }, { name: "Tier-2", value: 22 }, { name: "Tier-3", value: 6 }] },
  { category: "College Tier", data: [{ name: "IIT/IIM/NIT", value: 28 }, { name: "Tier-2 Colleges", value: 45 }, { name: "Other", value: 27 }] },
];
