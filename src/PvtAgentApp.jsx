/**
 * PvtAgentApp.jsx
 *
 * Embeds the full pvt-agent BECOME growth curator application
 * inside a MemoryRouter so it runs as a self-contained sub-app.
 * ALL routes have the Navigation sidebar.
 */

import React, { createContext, useContext } from 'react'
import { MemoryRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AppProvider, useApp } from './store/AppContext.jsx'
import Navigation from './components/Navigation.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx'
import DashboardPage  from './pages/DashboardPage.jsx'
import SessionPage    from './pages/SessionPage.jsx'
import JourneyPage    from './pages/JourneyPage.jsx'
import CuratorPage    from './pages/CuratorPage.jsx'
import LibraryPage    from './pages/LibraryPage.jsx'
import RoadmapPage    from './pages/RoadmapPage.jsx'
import ProfilePage    from './pages/ProfilePage.jsx'
import { hasProfile } from './services/storage.js'

import './pvt-agent-styles.css'

// Context so any child component can call back to the main Hero Landing Page
export const BackToHomeContext = createContext(() => {})
export const useBackToHome = () => useContext(BackToHomeContext)

// ─────────────────────────────────────────────────
// Protected layout: ALL pages get the sidebar + main content area
// ─────────────────────────────────────────────────
function ProtectedLayout() {
  const { isLoaded } = useApp()
  const location = useLocation()

  if (!isLoaded) return null

  return (
    <div className="page-layout gradient-mesh">
      <Navigation />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/dashboard" element={<DashboardPage />}  />
            <Route path="/session"   element={<SessionPage />}    />
            <Route path="/journey"   element={<JourneyPage />}    />
            <Route path="/curator"   element={<CuratorPage />}    />
            <Route path="/library"   element={<LibraryPage />}    />
            <Route path="/roadmap"   element={<RoadmapPage />}    />
            <Route path="/profile"   element={<ProfilePage />}    />
            <Route path="*"          element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}

// ─────────────────────────────────────────────────
// Router-aware app routes
// ─────────────────────────────────────────────────
function AppRoutes() {
  const { isLoaded } = useApp()
  if (!isLoaded) return null

  return (
    <Routes>
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/*"          element={<ProtectedLayout />} />
    </Routes>
  )
}

// ─────────────────────────────────────────────────
// Root export — wrapped in MemoryRouter + AppProvider
// ─────────────────────────────────────────────────
export default function PvtAgentApp({ onBackToHome, initialRoute: customInitialRoute }) {
  // Smart initial route:
  // Explicit route passed OR check profile:
  // New users (no profile saved) → /onboarding
  // Returning users (profile exists) → /dashboard
  const initialRoute = customInitialRoute || (hasProfile() ? '/dashboard' : '/onboarding')

  return (
    <BackToHomeContext.Provider value={onBackToHome || (() => {})}>
      <motion.div
        className="pvt-agent-root"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <AppProvider>
          <MemoryRouter initialEntries={[initialRoute]} initialIndex={0}>
            <AppRoutes />
          </MemoryRouter>
        </AppProvider>
      </motion.div>
    </BackToHomeContext.Provider>
  )
}
