/**
 * Navigation.jsx — Left Sidebar (Matches Screenshot Design)
 * Items: Dashboard, Today's Session, Journey, Curator, Library, Roadmap, Profile
 */

import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, PlayCircle, Compass, Sparkles,
  Library, Map, User, ChevronLeft, ChevronRight,
  RotateCcw, ArrowLeft, BookOpen
} from 'lucide-react'
import { useApp } from '../store/AppContext.jsx'
import { useBackToHome } from '../PvtAgentApp.jsx'

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/session',   icon: PlayCircle,       label: "Today's Session" },
  { to: '/journey',   icon: Compass,          label: 'Journey' },
  { to: '/curator',   icon: Sparkles,         label: 'Curator' },
  { to: '/library',   icon: Library,          label: 'Library' },
  { to: '/roadmap',   icon: Map,              label: 'Roadmap' },
  { to: '/profile',   icon: User,             label: 'Profile' },
]

export default function Navigation() {
  const [collapsed, setCollapsed] = useState(false)
  const { profile, reset } = useApp()
  const navigate = useNavigate()
  const backToHome = useBackToHome()

  const handleReset = () => {
    if (window.confirm('Reset all your data and start fresh?')) {
      reset()
      navigate('/onboarding')
    }
  }

  const userName = profile?.name || 'NEha'
  const firstName = userName.split(' ')[0]

  return (
    <motion.nav
      animate={{ width: collapsed ? 72 : 220 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      style={{
        position: 'fixed', top: 0, left: 0, height: '100vh',
        backgroundColor: '#F8F6F2',
        borderRight: '1px solid #E5E2DC',
        display: 'flex', flexDirection: 'column',
        zIndex: 100, overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* ── Brand Logo ── */}
      <div style={{
        padding: collapsed ? '22px 0' : '24px 24px 12px',
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              style={{
                fontFamily: 'Inter, -apple-system, sans-serif',
                fontSize: 20,
                fontWeight: 900,
                color: '#111111',
                letterSpacing: '-0.5px',
                textTransform: 'uppercase',
              }}
            >
              BECOME
            </motion.span>
          )}
        </AnimatePresence>
        {collapsed && (
          <span style={{
            fontFamily: 'Inter, -apple-system, sans-serif',
            fontSize: 14, fontWeight: 900, color: '#111111',
            letterSpacing: '-0.5px', textTransform: 'uppercase',
          }}>B</span>
        )}
      </div>

      {/* ── User Info ── */}
      <div style={{
        padding: collapsed ? '10px 0' : '10px 20px 14px',
        display: 'flex', alignItems: 'center', gap: 10,
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          backgroundColor: '#111111',
          color: '#FFFFFF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, fontSize: 13, fontWeight: 700,
        }}>
          {firstName[0]?.toUpperCase() || 'N'}
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: '#111111', lineHeight: 1.2 }}>
                {firstName}
              </div>
              <div style={{ fontSize: 11, color: '#777777', marginTop: 1 }}>
                Growth Curator
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Nav Links ── */}
      <div style={{ flex: 1, padding: '6px 10px', overflowY: 'auto' }}>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 11,
              padding: collapsed ? '11px 0' : '10px 14px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              margin: '2px 0', borderRadius: 10,
              textDecoration: 'none', transition: 'all 0.15s ease',
              background: isActive ? '#FFFFFF' : 'transparent',
              color: isActive ? '#111111' : '#666666',
              boxShadow: isActive ? '0 1px 6px rgba(0,0,0,0.06)' : 'none',
              border: isActive ? '1px solid #E5E2DC' : '1px solid transparent',
              fontWeight: isActive ? 600 : 500,
              fontSize: 13,
            })}
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={16}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  style={{ flexShrink: 0, color: isActive ? '#111111' : '#777777' }}
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* ── AI Curator Badge at Bottom ── */}
      {!collapsed && (
        <div style={{ padding: '0 12px 12px' }}>
          <div style={{
            padding: '10px 12px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E2DC',
            borderRadius: 12,
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#111111' }}>AI Curator</span>
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
            </div>
            <p style={{ fontSize: 10, color: '#777777', margin: 0, lineHeight: 1.4 }}>
              Always learning.<br />Always with you.
            </p>
          </div>
        </div>
      )}

      {/* ── Bottom Actions ── */}
      <div style={{
        padding: collapsed ? '10px 0' : '10px 12px',
        borderTop: '1px solid #E5E2DC',
        display: 'flex',
        justifyContent: collapsed ? 'center' : 'space-between',
        alignItems: 'center',
        gap: 6,
      }}>
        {!collapsed && (
          <button
            onClick={backToHome}
            type="button"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E0DDD6',
              borderRadius: 8,
              color: '#333333',
              cursor: 'pointer',
              padding: '5px 9px',
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 11, fontWeight: 600,
              transition: 'all 0.15s',
            }}
          >
            <ArrowLeft size={12} /> Home
          </button>
        )}

        {!collapsed && (
          <button
            onClick={handleReset}
            title="Reset data"
            type="button"
            style={{
              background: 'none', border: 'none', color: '#999999',
              cursor: 'pointer', padding: '5px', borderRadius: 6,
              display: 'flex', alignItems: 'center', transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#F43F5E'}
            onMouseLeave={e => e.currentTarget.style.color = '#999999'}
          >
            <RotateCcw size={13} />
          </button>
        )}

        <button
          onClick={() => setCollapsed(c => !c)}
          type="button"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E0DDD6',
            borderRadius: 8,
            color: '#555555',
            cursor: 'pointer', padding: '5px 7px',
            display: 'flex', alignItems: 'center', transition: 'all 0.15s',
          }}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </div>
    </motion.nav>
  )
}
