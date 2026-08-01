/**
 * ProfilePage.jsx — User Profile & Settings
 * Shows identity snapshot, preferences, and allows resetting / re-onboarding.
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Target, BookOpen, Headphones, Clock, RotateCcw, ChevronRight, Award, TrendingUp, Flame, Brain } from 'lucide-react'
import { useApp } from '../store/AppContext.jsx'
import { useNavigate } from 'react-router-dom'
import PageTransition from '../components/PageTransition.jsx'

const STAT_CARD = ({ icon: Icon, label, value, sub }) => (
  <div style={{ padding: '20px', background: '#FFFFFF', border: '1px solid #E8E5DF', borderRadius: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.02)' }}>
    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F8F6F2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
      <Icon size={16} color="#111111" />
    </div>
    <div style={{ fontSize: 28, fontWeight: 800, color: '#111111', lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 12, fontWeight: 600, color: '#555555', marginTop: 4 }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: '#888888', marginTop: 2 }}>{sub}</div>}
  </div>
)

const SECTION = ({ title, children }) => (
  <div style={{ padding: '24px 28px', background: '#FFFFFF', border: '1px solid #E8E5DF', borderRadius: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.02)' }}>
    <div style={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace', color: '#888888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 18 }}>
      {title}
    </div>
    {children}
  </div>
)

const ROW = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid #F5F3EE' }}>
    <span style={{ fontSize: 13, color: '#777777', flexShrink: 0, minWidth: 140 }}>{label}</span>
    <span style={{ fontSize: 13, fontWeight: 600, color: '#111111', textAlign: 'right', maxWidth: 360, lineHeight: 1.5 }}>{value || '—'}</span>
  </div>
)

const BADGE = ({ text }) => (
  <span style={{ display: 'inline-block', padding: '4px 12px', background: '#F8F6F2', border: '1px solid #E0DDD6', borderRadius: 999, fontSize: 12, fontWeight: 600, color: '#333333', margin: '3px' }}>
    {text}
  </span>
)

export default function ProfilePage() {
  const navigate = useNavigate()
  const { profile, growthState, reset } = useApp()
  const [showConfirm, setShowConfirm] = useState(false)

  const firstName = profile?.name?.split(' ')[0] || 'Explorer'
  const consistency    = growthState?.consistency    ?? 0
  const trustScore     = growthState?.trustScore     ?? 0
  const completedCount = growthState?.completedCount ?? 0
  const sessionCount   = growthState?.sessionCount   ?? 0

  const currentTraits  = profile?.currentTraits?.split(',').map(t => t.trim()).filter(Boolean) || []
  const targetTraits   = profile?.targetTraits?.split(',').map(t => t.trim()).filter(Boolean)  || []
  const learningStyle  = profile?.learningStyle  || []
  const preferredMedia = profile?.preferredMedia || []

  const handleReset = () => {
    reset()
    navigate('/onboarding')
  }

  const identityStage = growthState?.identityStage || 'early'
  const stageName = { early: 'Foundation Builder', mid: 'Explorer', advanced: 'Creator', leader: 'Leader' }[identityStage] || 'Foundation Builder'

  return (
    <PageTransition>
      <div className="page-inner" style={{ maxWidth: 900, margin: '0 auto', padding: '32px 36px 60px' }}>

        {/* ── PROFILE HERO ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '32px 36px',
            background: '#111111',
            borderRadius: 24,
            marginBottom: 24,
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background circles */}
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
          <div style={{ position: 'absolute', bottom: -20, right: 80, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.02)' }} />

          {/* Avatar */}
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 28, fontWeight: 800 }}>{firstName[0]?.toUpperCase() || 'N'}</span>
          </div>

          {/* Name & stage */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{profile?.name || 'Explorer'}</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 12 }}>Growth Curator Member</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ padding: '5px 14px', background: 'rgba(255,255,255,0.1)', borderRadius: 999, fontSize: 12, fontWeight: 700, letterSpacing: '0.5px' }}>
                {stageName}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
                AI Curator Active
              </span>
            </div>
          </div>

          {/* Quick action */}
          <button
            onClick={() => navigate('/session')}
            type="button"
            style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14, color: '#FFFFFF', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
          >
            Start Session <ChevronRight size={14} />
          </button>
        </motion.div>

        {/* ── STATS GRID ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}
        >
          <STAT_CARD icon={Flame}      label="Day Streak"    value={`${consistency}d`}    sub="consecutive days" />
          <STAT_CARD icon={Award}      label="Trust Score"   value={`${trustScore}%`}     sub="AI confidence" />
          <STAT_CARD icon={TrendingUp} label="Completed"     value={completedCount}        sub="content items" />
          <STAT_CARD icon={Brain}      label="Sessions"      value={sessionCount}          sub="total sessions" />
        </motion.div>

        {/* ── IDENTITY ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}
        >
          <SECTION title="CURRENT IDENTITY TRAITS">
            {currentTraits.length > 0
              ? <div>{currentTraits.map(t => <BADGE key={t} text={t} />)}</div>
              : <p style={{ fontSize: 13, color: '#888888' }}>No traits set. Re-run onboarding to add them.</p>
            }
          </SECTION>
          <SECTION title="TARGET IDENTITY TRAITS">
            {targetTraits.length > 0
              ? <div>{targetTraits.map(t => <BADGE key={t} text={t} />)}</div>
              : <p style={{ fontSize: 13, color: '#888888' }}>No target traits set yet.</p>
            }
          </SECTION>
        </motion.div>

        {/* ── PROFILE DETAILS ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.11 }}
          style={{ marginBottom: 16 }}
        >
          <SECTION title="YOUR PROFILE DETAILS">
            <ROW label="Full Name"       value={profile?.name} />
            <ROW label="Active Goal"     value={profile?.goals} />
            <ROW label="Learning Style"  value={learningStyle.join(', ')} />
            <ROW label="Preferred Media" value={preferredMedia.join(', ')} />
            <ROW label="Content Length"  value={profile?.contentLength ? profile.contentLength.charAt(0).toUpperCase() + profile.contentLength.slice(1) : null} />
            <ROW label="Identity Stage"  value={stageName} />
            <ROW label="Member Since"    value={profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'} />
          </SECTION>
        </motion.div>

        {/* ── LEARNING PREFERENCES ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.13 }}
          style={{ marginBottom: 24 }}
        >
          <SECTION title="HOW YOUR CURATOR PICKS FOR YOU">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { icon: BookOpen,    label: 'Learning Style',   val: learningStyle.length > 0 ? learningStyle.join(', ') : 'Visual, Reading' },
                { icon: Headphones,  label: 'Preferred Format', val: preferredMedia.length > 0 ? preferredMedia.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(', ') : 'Video, Article' },
                { icon: Clock,       label: 'Session Length',   val: profile?.contentLength === 'short' ? 'Short (< 15 min)' : profile?.contentLength === 'long' ? 'Long (45+ min)' : 'Medium (15–45 min)' },
                { icon: Target,      label: 'Goal Focus',       val: profile?.goals?.slice(0, 50) + '…' || 'Build daily habits' },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} style={{ display: 'flex', gap: 12, padding: '14px', background: '#F8F6F2', borderRadius: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: '#FFFFFF', border: '1px solid #E8E5DF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={14} color="#111111" />
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111111' }}>{val}</div>
                  </div>
                </div>
              ))}
            </div>
          </SECTION>
        </motion.div>

        {/* ── DANGER ZONE ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{ padding: '22px 28px', background: '#FFFBFB', border: '1px solid #FFE0E0', borderRadius: 20 }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace', color: '#E11D48', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 10 }}>
            RESET PROFILE
          </div>
          <p style={{ fontSize: 13, color: '#555555', marginBottom: 16, lineHeight: 1.5 }}>
            Resets all your data — profile, history, sessions, and streak — and restarts the onboarding flow. This cannot be undone.
          </p>

          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              type="button"
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#FFFFFF', border: '1.5px solid #FFCCCC', borderRadius: 12, color: '#E11D48', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              <RotateCcw size={14} />
              Reset & Start Over
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 13, color: '#E11D48', fontWeight: 600 }}>Are you sure? This is permanent.</span>
              <button onClick={handleReset} type="button" style={{ padding: '8px 16px', background: '#E11D48', border: 'none', borderRadius: 10, color: '#FFFFFF', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Yes, Reset</button>
              <button onClick={() => setShowConfirm(false)} type="button" style={{ padding: '8px 16px', background: '#FFFFFF', border: '1px solid #E8E5DF', borderRadius: 10, color: '#333333', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            </div>
          )}
        </motion.div>

      </div>
    </PageTransition>
  )
}
