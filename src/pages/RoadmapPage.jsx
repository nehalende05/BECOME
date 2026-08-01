/**
 * RoadmapPage.jsx — Identity Transformation Roadmap
 * Visual journey from current to target identity with milestones.
 */

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Lock, ArrowRight, Flame, Target, TrendingUp, Zap, BookOpen, Brain } from 'lucide-react'
import { useApp } from '../store/AppContext.jsx'
import { useNavigate } from 'react-router-dom'
import PageTransition from '../components/PageTransition.jsx'

const IDENTITY_STAGES = [
  {
    id: 'foundation',
    label: 'Foundation Builder',
    range: '0–25%',
    description: 'Building awareness of your patterns and installing your first keystone habits.',
    milestones: [
      { task: 'Complete onboarding & identity setup',        done: true },
      { task: 'Finish your first curation session',          done: false },
      { task: 'Log 3 consecutive days of activity',          done: false },
      { task: 'Complete 5 recommended content items',        done: false },
    ],
    color: '#111111',
    icon: Flame,
  },
  {
    id: 'explorer',
    label: 'Explorer',
    range: '25–50%',
    description: 'Experimenting with new behaviors and discovering what resonates with your identity.',
    milestones: [
      { task: 'Achieve a 7-day consistency streak',          done: false },
      { task: 'Complete 15 content items',                   done: false },
      { task: 'Reach 60% AI Trust Score',                    done: false },
      { task: 'Reflect on 3 pieces of completed content',    done: false },
    ],
    color: '#6366F1',
    icon: Target,
  },
  {
    id: 'creator',
    label: 'Creator',
    range: '50–75%',
    description: 'Applying insights consistently and building compounding growth across multiple areas.',
    milestones: [
      { task: 'Achieve a 21-day consistency streak',         done: false },
      { task: 'Complete 30 content items',                   done: false },
      { task: 'Reach 75% AI Trust Score',                    done: false },
      { task: 'Complete ACT and CONNECT intervention types', done: false },
    ],
    color: '#F59E0B',
    icon: TrendingUp,
  },
  {
    id: 'leader',
    label: 'Leader',
    range: '75–100%',
    description: 'Your new identity is embodied. You teach, lead, and create for others.',
    milestones: [
      { task: 'Achieve a 30-day consistency streak',         done: false },
      { task: 'Complete 50+ content items',                  done: false },
      { task: 'Reach 90% AI Trust Score',                    done: false },
      { task: 'Unlock all 4 intervention types',             done: false },
    ],
    color: '#10B981',
    icon: Brain,
  },
]

const WEEKLY_FOCUS = [
  { day: 'Monday',    task: 'Mindset reset — watch 1 short video',        type: 'video',   icon: BookOpen },
  { day: 'Tuesday',   task: 'Deep read — one article or book chapter',     type: 'read',    icon: BookOpen },
  { day: 'Wednesday', task: 'Practice — apply yesterday\'s insight',       type: 'action',  icon: Zap },
  { day: 'Thursday',  task: 'Reflection — journal your progress',          type: 'reflect', icon: Brain },
  { day: 'Friday',    task: 'Curator session — get 3 fresh picks',         type: 'curate',  icon: Target },
  { day: 'Saturday',  task: 'Rest & absorb — podcast or long-form read',   type: 'rest',    icon: BookOpen },
  { day: 'Sunday',    task: 'Weekly review — track growth milestones',     type: 'review',  icon: TrendingUp },
]

export default function RoadmapPage() {
  const navigate = useNavigate()
  const { profile, growthState } = useApp()

  const currentTrait    = profile?.currentTraits?.split(',')[0]?.trim() || 'Current Self'
  const targetTrait     = profile?.targetTraits?.split(',')[0]?.trim()  || 'Target Self'
  const consistency     = growthState?.consistency     ?? 0
  const completedCount  = growthState?.completedCount  ?? 0
  const trustScore      = growthState?.trustScore      ?? 0
  const identityStage   = growthState?.identityStage   ?? 'early'

  const stageMap = { early: 0, mid: 1, advanced: 2, leader: 3 }
  const activeStageIdx = stageMap[identityStage] ?? 0

  const overallProgress = Math.min(100, Math.round(
    (consistency / 30) * 40 +
    (Math.min(completedCount, 50) / 50) * 40 +
    (trustScore / 100) * 20
  ))

  const today = new Date().getDay() // 0=Sun, 1=Mon...
  const dayOrder = [1, 2, 3, 4, 5, 6, 0]
  const todayIdx = dayOrder.indexOf(today)

  return (
    <PageTransition>
      <div className="page-inner" style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 36px 60px' }}>

        {/* ── HEADER ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace', color: '#888888', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            YOUR TRANSFORMATION ROADMAP
          </span>
          <h1 style={{ fontSize: 38, fontWeight: 800, color: '#111111', letterSpacing: '-1px', marginTop: 8, marginBottom: 10 }}>
            From {currentTrait}
            <span style={{ color: '#888888', fontWeight: 400 }}> to </span>
            {targetTrait}
          </h1>
          <p style={{ fontSize: 14, color: '#555555', maxWidth: 560, lineHeight: 1.6, margin: 0 }}>
            Your personalised identity transformation path. Each stage unlocks deeper growth, better recommendations, and a stronger AI understanding of who you're becoming.
          </p>
        </motion.div>

        {/* ── OVERALL PROGRESS ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{ padding: '28px 32px', background: '#FFFFFF', border: '1px solid #E8E5DF', borderRadius: 24, marginBottom: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace', color: '#888888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>
                OVERALL PROGRESS
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#111111', lineHeight: 1 }}>{overallProgress}%</div>
              <div style={{ fontSize: 13, color: '#555555', marginTop: 4 }}>toward {targetTrait}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              {[
                { label: 'Streak',    value: `${consistency}d` },
                { label: 'Completed', value: completedCount },
                { label: 'Trust',     value: `${trustScore}%` },
              ].map(({ label, value }) => (
                <div key={label} style={{ textAlign: 'center', padding: '12px 16px', background: '#F8F6F2', borderRadius: 14 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#111111' }}>{value}</div>
                  <div style={{ fontSize: 10, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ position: 'relative', height: 10, background: '#F0EDE6', borderRadius: 99, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: '#111111', borderRadius: 99 }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            {['0%', '25%', '50%', '75%', '100%'].map(p => (
              <span key={p} style={{ fontSize: 10, color: '#AAAAAA' }}>{p}</span>
            ))}
          </div>
        </motion.div>

        {/* ── IDENTITY STAGES ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace', color: '#888888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>
            IDENTITY STAGES
          </div>
          {IDENTITY_STAGES.map((stage, idx) => {
            const isActive  = idx === activeStageIdx
            const isLocked  = idx > activeStageIdx
            const isPassed  = idx < activeStageIdx
            const Icon      = stage.icon

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.06 }}
                style={{
                  padding: '22px 24px',
                  background: isActive ? '#111111' : '#FFFFFF',
                  border: `1px solid ${isActive ? '#111111' : '#E8E5DF'}`,
                  borderRadius: 20,
                  display: 'flex',
                  gap: 20,
                  opacity: isLocked ? 0.5 : 1,
                  boxShadow: isActive ? '0 6px 24px rgba(0,0,0,0.12)' : '0 1px 4px rgba(0,0,0,0.02)',
                }}
              >
                {/* Stage icon */}
                <div style={{ flexShrink: 0 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: isActive ? 'rgba(255,255,255,0.12)' : '#F8F6F2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                    {isLocked ? <Lock size={18} color="#AAAAAA" /> : <Icon size={18} color={isActive ? '#FFFFFF' : '#111111'} />}
                  </div>
                  <div style={{ fontSize: 10, color: isActive ? 'rgba(255,255,255,0.5)' : '#AAAAAA', textAlign: 'center', fontWeight: 600 }}>
                    {stage.range}
                  </div>
                </div>

                {/* Stage content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: isActive ? '#FFFFFF' : '#111111', margin: 0 }}>
                      {stage.label}
                    </h3>
                    {isActive && (
                      <span style={{ padding: '3px 10px', background: 'rgba(255,255,255,0.15)', borderRadius: 999, fontSize: 10, fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.5px' }}>
                        CURRENT
                      </span>
                    )}
                    {isPassed && (
                      <span style={{ padding: '3px 10px', background: '#F0FDF4', borderRadius: 999, fontSize: 10, fontWeight: 700, color: '#16A34A' }}>
                        COMPLETED ✓
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: isActive ? 'rgba(255,255,255,0.65)' : '#555555', margin: '0 0 14px', lineHeight: 1.5 }}>
                    {stage.description}
                  </p>

                  {/* Milestones */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {stage.milestones.map((m, mi) => (
                      <div key={mi} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        {m.done || isPassed
                          ? <CheckCircle2 size={14} color={isActive ? '#FFFFFF' : '#16A34A'} style={{ flexShrink: 0, marginTop: 1 }} />
                          : <Circle size={14} color={isActive ? 'rgba(255,255,255,0.3)' : '#D0CDC5'} style={{ flexShrink: 0, marginTop: 1 }} />
                        }
                        <span style={{ fontSize: 12, color: isActive ? 'rgba(255,255,255,0.7)' : '#555555', lineHeight: 1.4 }}>
                          {m.task}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* ── WEEKLY SCHEDULE ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ padding: '28px 32px', background: '#FFFFFF', border: '1px solid #E8E5DF', borderRadius: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace', color: '#888888', letterSpacing: '1px', textTransform: 'uppercase' }}>
              RECOMMENDED WEEKLY SCHEDULE
            </div>
            <button
              onClick={() => navigate('/session')}
              type="button"
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#111111', color: '#FFFFFF', border: 'none', borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
            >
              Start Today <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {WEEKLY_FOCUS.map(({ day, task, icon: Icon }, idx) => {
              const isToday = idx === todayIdx
              return (
                <div
                  key={day}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '13px 16px',
                    background: isToday ? '#111111' : '#FAFAFA',
                    border: `1px solid ${isToday ? '#111111' : '#F0EDE6'}`,
                    borderRadius: 14,
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: isToday ? 'rgba(255,255,255,0.12)' : '#F0EDE6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={14} color={isToday ? '#FFFFFF' : '#555555'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: isToday ? 'rgba(255,255,255,0.5)' : '#888888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{day}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: isToday ? '#FFFFFF' : '#111111' }}>{task}</div>
                  </div>
                  {isToday && (
                    <span style={{ padding: '3px 10px', background: 'rgba(255,255,255,0.15)', borderRadius: 999, fontSize: 10, fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.5px' }}>
                      TODAY
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>

      </div>
    </PageTransition>
  )
}
