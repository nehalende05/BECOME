import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Clock,
  BookOpen,
  Target,
  Library,
  Compass,
  User,
  Bell,
  ArrowRight,
  Play,
  Zap,
  Brain,
  Check,
  Crown,
  Sparkles,
  LogOut,
  Terminal
} from 'lucide-react';

import { runGrowthAgent } from '../services/growthAgent.js';
import { useApp } from '../store/AppContext.jsx';
import { useBackToHome } from '../PvtAgentApp.jsx';
import AgentThinking from './AgentThinking.jsx';
import RecommendationCard from './RecommendationCard.jsx';

export default function DashboardView() {
  const navigate = useNavigate();
  const backToHome = useBackToHome();
  const { profile, growthState, completeRecommendation, skipRecommendation } = useApp() || {};

  // Navigation state
  const [activeTab, setActiveTab] = useState('Dashboard');

  // Backend Agent execution state
  const [agentRunning, setAgentRunning] = useState(false);
  const [agentReasoningDone, setAgentReasoningDone] = useState(false);
  const [agentSessionData, setAgentSessionData] = useState(null);
  const [agentRecs, setAgentRecs] = useState([]);

  // User Profile details matching exact screenshot text
  const userName = 'NEha';
  const userInitials = 'N';
  const currentTrait = 'Easily Distracted';
  const targetTrait = 'Deeply Focused';
  const activeGoal = 'Build a daily study habit';

  // Interactive widgets state matching screenshot
  const [progressPercent, setProgressPercent] = useState(28);

  const [curationItems, setCurationItems] = useState([
    { id: 1, type: 'Watch', title: 'Atomic Habits Chapter 3', duration: '12 min', icon: 'play' },
    { id: 2, type: 'Read', title: 'Deep Work Summary', duration: '8 min', icon: 'book' },
    { id: 3, type: 'Practice', title: '25-minute Focus Sprint', duration: '', icon: 'zap', actionText: 'Start →' }
  ]);

  const [recentGrowth] = useState([
    { id: 1, when: 'Yesterday', text: 'Finished Morning Deep Work' },
    { id: 2, when: 'Yesterday', text: 'Read Psychology of Success' },
    { id: 3, when: '2 Days Ago', text: 'Reflection Completed' }
  ]);

  const [days, setDays] = useState([
    { label: 'M', checked: true },
    { label: 'T', checked: true },
    { label: 'W', checked: true },
    { label: 'T', checked: true },
    { label: 'F', checked: true },
    { label: 'S', checked: false },
    { label: 'S', checked: false },
    { label: 'M', checked: false },
    { label: 'T', checked: false },
    { label: 'W', checked: false },
    { label: 'T', checked: false },
    { label: 'F', checked: false },
    { label: 'S', checked: false },
    { label: 'S', checked: false },
  ]);

  // Execute Backend AI Agent Pipeline
  const handleExecuteBackendAgent = async () => {
    setAgentRunning(true);
    setAgentReasoningDone(false);
    try {
      const data = await runGrowthAgent(
        profile || { name: userName, currentTraits: currentTrait, targetTraits: targetTrait, goals: activeGoal },
        growthState || { trustScore: 82, momentum: 'medium', identityStage: 'early' },
        6
      );
      setAgentSessionData(data);
      setAgentRecs(data.recommendations || []);
    } catch (err) {
      console.error('Error running growth agent:', err);
      setAgentRunning(false);
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: "Today's Session", icon: Clock, path: '/session' },
    { name: 'Journey', icon: BookOpen, path: '/journey' },
    { name: 'Curator', icon: Target, action: handleExecuteBackendAgent },
    { name: 'Library', icon: Library },
    { name: 'Roadmap', icon: Compass },
    { name: 'Profile', icon: User },
  ];

  const handleNavClick = (item) => {
    setActiveTab(item.name);
    if (item.path) {
      navigate(item.path);
    } else if (item.action) {
      item.action();
    }
  };

  const handleItemClick = (item) => {
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
    navigate('/session', { state: { selectedVideo: item } });
  };

  return (
    <div className="min-h-screen bg-[#F6F5F2] text-[#111111] font-sans flex relative selection:bg-black selection:text-white">
      
      {/* ── LEFT SIDEBAR ── */}
      <aside className="w-64 bg-[#FAF9F6] border-r border-black/10 flex flex-col justify-between p-6 shrink-0 relative z-20 min-h-screen">
        <div>
          {/* Logo */}
          <div className="mb-6">
            <h1 
              onClick={backToHome}
              className="text-2xl font-bold tracking-tight text-[#111111] cursor-pointer hover:opacity-80 transition-opacity font-editorial uppercase"
            >
              BECOME
            </h1>
          </div>

          {/* User Profile Info */}
          <div className="flex items-center gap-3 mb-8 p-1">
            <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
              {userInitials}
            </div>
            <div>
              <div className="font-semibold text-sm text-[#111111] leading-tight">
                {userName}
              </div>
              <div className="text-xs text-gray-500 leading-tight">
                Growth Curator
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#EAEAEA] text-[#111111] shadow-xs'
                      : 'text-[#666666] hover:bg-black/5 hover:text-[#111111]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#111111]' : 'text-[#777777]'}`} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Box: AI Curator */}
        <div className="mt-8">
          <div className="bg-[#EFECE6] rounded-2xl p-4 relative overflow-hidden border border-black/5">
            <div className="absolute right-0 bottom-0 w-24 h-24 opacity-30 pointer-events-none">
              <img src="/ai-hand-left.png" alt="AI Hand" className="w-full h-full object-contain" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#111111] mb-1">
                <span>AI Curator</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              </div>
              <p className="text-[11px] text-gray-600 leading-snug">
                Always learning.<br />Always with you.
              </p>
            </div>
          </div>

          <button 
            onClick={backToHome}
            className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-500 hover:bg-black/5 font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Back to Home
          </button>
        </div>
      </aside>

      {/* ── MAIN WORKSPACE CONTENT ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
        
        {/* TOP HEADER */}
        <header className="h-16 px-8 flex items-center justify-end border-b border-black/5 bg-[#F6F5F2]/80 backdrop-blur-xs sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-full bg-white border border-black/10 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs">
              <Bell className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              <User className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* BACKEND AGENT RUNNING OVERLAY */}
        {agentRunning ? (
          <div className="p-8 max-w-5xl mx-auto w-full">
            {!agentReasoningDone ? (
              <div className="bg-white rounded-3xl p-8 border border-black/10 shadow-md">
                <div className="text-center mb-6">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 font-bold block mb-1">
                    AUTONOMOUS GROWTH CURATOR PIPELINE
                  </span>
                  <h2 className="font-editorial text-3xl font-bold text-[#111111]">
                    BECOME AI Reasoning Engine
                  </h2>
                </div>

                <AgentThinking
                  steps={agentSessionData?.reasoning?.thinkingSteps || [
                    { step: `OBSERVE: Analyzing identity gap (${currentTrait} → ${targetTrait})...`, duration: 500 },
                    { step: "THINK: Evaluating daily habit consistency & momentum...", duration: 600 },
                    { step: "DISCOVER: Filtering 36+ growth modules against target identity...", duration: 600 },
                    { step: "CURATE: Executing BECOME personalization engine...", duration: 700 },
                    { step: "EXPLAIN: Synthesizing customized action rationale...", duration: 400 },
                    { step: "Curation Ready ✓", duration: 300 }
                  ]}
                  onComplete={() => setAgentReasoningDone(true)}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 border border-black/10 shadow-2xs flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-mono font-bold text-emerald-700 uppercase">
                        {agentSessionData?.engineType || 'BECOME Personalization Engine'}
                      </span>
                    </div>
                    <h2 className="font-editorial text-2xl font-bold text-[#111111]">
                      {agentSessionData?.reasoning?.sessionTitle || "Today's Curated Growth Path"}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      {agentSessionData?.reasoning?.sessionMessage}
                    </p>
                  </div>

                  <button 
                    onClick={() => setAgentRunning(false)}
                    className="px-5 py-2.5 bg-black text-white text-xs font-semibold rounded-full hover:bg-black/80 transition-colors cursor-pointer"
                  >
                    Return to Dashboard
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-editorial text-xl font-bold text-[#111111]">
                    Curated Action Modules ({agentRecs.length})
                  </h3>

                  {agentRecs.map((rec, idx) => (
                    <RecommendationCard
                      key={rec.id || idx}
                      rec={rec}
                      index={idx}
                      onComplete={(r) => {
                        completeRecommendation?.(r);
                        confetti({ particleCount: 50, spread: 60 });
                      }}
                      onSkip={(r) => skipRecommendation?.(r)}
                      interventionType={agentSessionData?.reasoning?.interventionType || 'LEARN'}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (

          /* MAIN DASHBOARD GRID MATCHING EXACT SCREENSHOT */
          <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
            
            {/* HERO BANNER CARD */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 border border-black/10 shadow-2xs relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              {/* Floating 3D Robot Hand Background Artwork */}
              <div className="absolute right-0 top-0 bottom-0 w-80 md:w-96 pointer-events-none select-none overflow-hidden opacity-90">
                <img
                  src="/card-ai-hand.png"
                  alt="AI Hand Artwork"
                  className="w-full h-full object-contain object-right"
                />
              </div>

              <div className="max-w-xl relative z-10">
                <h1 className="font-editorial text-4xl md:text-5xl font-bold tracking-tight text-[#111111] mb-3 leading-tight">
                  Who Are You <br /> Becoming Today?
                </h1>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Your AI Curator has analyzed your current identity and prepared today's growth path just for you.
                </p>

                <button 
                  onClick={() => navigate('/session')}
                  className="bg-black text-white font-medium text-sm px-6 py-3 rounded-full inline-flex items-center gap-2 hover:bg-black/80 transition-all shadow-sm cursor-pointer"
                >
                  <span>Begin Today's Session</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* ROW 1: IDENTITY TRANSFORMATION & TODAY'S CURATION */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* CARD 1: IDENTITY TRANSFORMATION */}
              <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-black/10 shadow-2xs flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-5">
                    IDENTITY TRANSFORMATION
                  </span>

                  <div className="flex items-center justify-between text-xs mb-4">
                    <div>
                      <div className="text-[10px] font-semibold text-gray-400 uppercase mb-1">CURRENT IDENTITY</div>
                      <div className="font-bold text-base md:text-lg text-[#111111]">{currentTrait}</div>
                    </div>
                    
                    <div className="text-center px-4">
                      <span className="font-bold text-sm text-[#111111] block mb-0.5">{progressPercent}%</span>
                      <span className="text-[10px] text-gray-400 font-medium">Progress</span>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-semibold text-gray-400 uppercase mb-1">TARGET IDENTITY</div>
                      <div className="font-bold text-base md:text-lg text-[#111111]">{targetTrait}</div>
                    </div>
                  </div>

                  {/* Interactive Slider Bar */}
                  <div 
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const newPct = Math.min(100, Math.max(0, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
                      setProgressPercent(newPct);
                      confetti({ particleCount: 25, spread: 40 });
                    }}
                    className="relative w-full h-1.5 bg-gray-200 rounded-full my-6 flex items-center cursor-pointer group"
                  >
                    <div 
                      className="h-full bg-black rounded-full transition-all duration-300 relative" 
                      style={{ width: `${progressPercent}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 bg-black border-2 border-white rounded-full shadow-xs group-hover:scale-125 transition-transform" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-black/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#111111] shrink-0">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase text-gray-400 tracking-wider">ACTIVE GOAL</div>
                    <div className="font-bold text-sm text-[#111111]">{activeGoal}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Small steps today. Massive change tomorrow.</div>
                  </div>
                </div>
              </div>

              {/* CARD 2: TODAY'S CURATION MATCHING EXACT SCREENSHOT */}
              <div className="md:col-span-5 bg-white rounded-3xl p-6 border border-black/10 shadow-2xs flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-4">
                    TODAY'S CURATION
                  </span>

                  <div className="space-y-3">
                    {/* Item 1: Watch Atomic Habits Chapter 3 */}
                    <div 
                      onClick={() => handleItemClick(curationItems[0])}
                      className="flex items-center justify-between p-3 rounded-2xl border border-black/5 bg-gray-50/70 hover:border-black/20 hover:bg-gray-100/80 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold leading-tight truncate text-[#111111]">
                            Watch
                          </div>
                          <div className="text-[11px] text-gray-600 font-medium">
                            Atomic Habits Chapter 3
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-gray-400 shrink-0 ml-2">
                        12 min
                      </div>
                    </div>

                    {/* Item 2: Read Deep Work Summary */}
                    <div 
                      onClick={() => handleItemClick(curationItems[1])}
                      className="flex items-center justify-between p-3 rounded-2xl border border-black/5 bg-gray-50/70 hover:border-black/20 hover:bg-gray-100/80 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <BookOpen className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold leading-tight truncate text-[#111111]">
                            Read
                          </div>
                          <div className="text-[11px] text-gray-600 font-medium">
                            Deep Work Summary
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-gray-400 shrink-0 ml-2">
                        8 min
                      </div>
                    </div>

                    {/* Item 3: Practice 25-minute Focus Sprint */}
                    <div 
                      onClick={() => handleItemClick(curationItems[2])}
                      className="flex items-center justify-between p-3 rounded-2xl border border-black/5 bg-gray-50/70 hover:border-black/20 hover:bg-gray-100/80 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Zap className="w-3.5 h-3.5 fill-white" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold leading-tight truncate text-[#111111]">
                            Practice
                          </div>
                          <div className="text-[11px] text-gray-600 font-medium">
                            25-minute Focus Sprint
                          </div>
                        </div>
                      </div>

                      <div className="text-xs font-bold text-black flex items-center gap-1 shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform">
                        <span>Start</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>

            {/* ROW 2: AI REFLECTION, MOMENTUM, AI CONFIDENCE */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* CARD 3: AI REFLECTION */}
              <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-black/10 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      AI REFLECTION
                    </span>
                    <Brain className="w-4 h-4 text-gray-400" />
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed italic mb-4">
                    "Yesterday you completed your focus session. Your consistency is improving."
                  </p>
                </div>

                <div className="pt-3 border-t border-black/5">
                  <div className="text-[11px] font-bold text-[#111111]">
                    Today's recommendation:
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    Remove distractions before starting your study session.
                  </div>
                </div>
              </div>

              {/* CARD 4: MOMENTUM */}
              <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-black/10 shadow-2xs flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-4">
                    MOMENTUM
                  </span>

                  {/* Day Checkboxes */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {days.map((d, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setDays(prev => prev.map((item, i) => i === idx ? { ...item, checked: !item.checked } : item));
                        }}
                        className={`w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold transition-colors ${
                          d.checked ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="font-bold text-sm text-[#111111]">
                    5 day consistency
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Keep going, {userName}!
                  </div>
                </div>
              </div>

              {/* CARD 5: AI CONFIDENCE */}
              <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-black/10 shadow-2xs flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-4">
                    AI CONFIDENCE
                  </span>

                  <div className="flex items-center gap-4">
                    {/* Ring Chart */}
                    <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-gray-100"
                          strokeWidth="3"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-black"
                          strokeDasharray="82, 100"
                          strokeWidth="3"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute font-bold text-xs text-[#111111]">82%</span>
                    </div>

                    <div className="text-xs text-gray-600 leading-relaxed">
                      Your curator understands your habits well. Accuracy improving every day.
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* ROW 3: IDENTITY STAGE & RECENT GROWTH */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* CARD 6: IDENTITY STAGE */}
              <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-black/10 shadow-2xs flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-6">
                    IDENTITY STAGE
                  </span>

                  {/* Horizontal Stage Stepper */}
                  <div className="relative flex items-center justify-between px-4 py-2">
                    {/* Line Connector */}
                    <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 -z-0" />

                    {/* Stage 1: Active */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shadow-xs">
                        <Sparkles className="w-4 h-4 fill-white" />
                      </div>
                      <div className="font-bold text-xs text-[#111111] mt-3 text-center">
                        Foundation<br />Builder
                      </div>
                    </div>

                    {/* Stage 2 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-white border-2 border-gray-300 text-gray-400 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                      </div>
                      <div className="font-medium text-xs text-gray-400 mt-3 text-center">
                        Explorer
                      </div>
                    </div>

                    {/* Stage 3 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-white border-2 border-gray-300 text-gray-400 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                      </div>
                      <div className="font-medium text-xs text-gray-400 mt-3 text-center">
                        Creator
                      </div>
                    </div>

                    {/* Stage 4 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-white border-2 border-gray-300 text-gray-400 flex items-center justify-center">
                        <Crown className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                      <div className="font-medium text-xs text-gray-400 mt-3 text-center">
                        Leader
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* CARD 7: RECENT GROWTH */}
              <div className="md:col-span-5 bg-white rounded-3xl p-6 border border-black/10 shadow-2xs flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-4">
                    RECENT GROWTH
                  </span>

                  <div className="space-y-3">
                    {recentGrowth.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                        <span className="text-gray-400 text-[11px] w-20 shrink-0">{item.when}</span>
                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                        <span className="font-medium text-[#111111]">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-black/5 mt-4">
                  <button 
                    onClick={() => navigate('/journey')}
                    className="text-xs font-bold text-black inline-flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>View All Activity</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}
