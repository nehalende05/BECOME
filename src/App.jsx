import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CuratorSection from './components/CuratorSection';
import IdentityTimeline from './components/IdentityTimeline';
import PersonalAITeam from './components/PersonalAITeam';
import ReasoningEngine from './components/ReasoningEngine';
import HowItWorks from './components/HowItWorks';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import OnboardingModal from './components/OnboardingModal';
import VideoDemoModal from './components/VideoDemoModal';
import { hasProfile } from './services/storage.js';

// pvt-agent — the full AI growth curator app
import PvtAgentApp from './PvtAgentApp.jsx';

export default function App() {
  // ── Flow: Landing → Onboarding (new) or Dashboard (returning) ──
  const [currentView, setCurrentView] = useState('landing');
  const [initialAgentRoute, setInitialAgentRoute] = useState(null);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Called when user clicks any CTA on the landing page.
  // New users → go to onboarding first.
  // Returning users (profile exists) → go straight to dashboard.
  const handleStartJourney = () => {
    setInitialAgentRoute(null); // PvtAgentApp auto-detects based on profile
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView('agent');
  };

  // Direct open Dashboard (e.g. from nav link if profile exists)
  const handleOpenDashboard = () => {
    setInitialAgentRoute('/dashboard');
    setCurrentView('agent');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return to Stage 1: Landing page with Hero
  const handleBackToHome = () => {
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render the full BECOME app (onboarding or dashboard, depending on profile)
  if (currentView === 'agent') {
    return (
      <PvtAgentApp
        onBackToHome={handleBackToHome}
        initialRoute={initialAgentRoute}
      />
    );
  }

  // Otherwise render the landing page
  return (
    <div className="min-h-screen bg-[#F6F4EF] text-[#111111] font-sans relative selection:bg-black selection:text-white">
      <div className="paper-grain" />

      <Navbar
        onOpenModal={handleStartJourney}
        onOpenDashboard={handleStartJourney}
      />

      <Hero
        onOpenModal={handleStartJourney}
        onOpenDemo={() => setIsDemoOpen(true)}
      />

      <CuratorSection />
      <IdentityTimeline />
      <PersonalAITeam />
      <ReasoningEngine />
      <HowItWorks onOpenModal={handleStartJourney} />
      <FinalCTA onOpenModal={handleStartJourney} />
      <Footer onOpenModal={handleStartJourney} />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
      <VideoDemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
      />
    </div>
  );
}
