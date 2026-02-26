import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import JobRoles from "./pages/JobRoles";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import CandidatePipeline from "./pages/CandidatePipeline";
import CandidateProfile from "./pages/CandidateProfile";
import InterviewIntelligence from "./pages/InterviewIntelligence";
import InterviewScheduler from "./pages/InterviewScheduler";
import EmailAutomation from "./pages/EmailAutomation";
import TalentPool from "./pages/TalentPool";
import Analytics from "./pages/Analytics";
import AIChatbot from "./pages/AIChatbot";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/jobs" element={<JobRoles />} />
            <Route path="/analyzer" element={<ResumeAnalyzer />} />
            <Route path="/pipeline" element={<CandidatePipeline />} />
            <Route path="/pipeline/:id" element={<CandidateProfile />} />
            <Route path="/analyzer/:id" element={<CandidateProfile />} />
            <Route path="/interview-intelligence" element={<InterviewIntelligence />} />
            <Route path="/scheduler" element={<InterviewScheduler />} />
            <Route path="/email-automation" element={<EmailAutomation />} />
            <Route path="/talent-pool" element={<TalentPool />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/chatbot" element={<AIChatbot />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
