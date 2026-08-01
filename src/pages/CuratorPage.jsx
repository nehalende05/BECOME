/**
 * CuratorPage.jsx — Meet Your AI Growth Curator
 * Shows the curator's identity, philosophy, current context, and a live preview session.
 */

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, Sparkles, Target, TrendingUp, RefreshCw, ChevronRight, Zap, Eye, BookOpen, Play } from 'lucide-react'
import { useApp } from '../store/AppContext.jsx'
import { runGrowthAgent } from '../services/growthAgent.js'
import { useNavigate } from 'react-router-dom'
import PageTransition from '../components/PageTransition.jsx'

const PIPELINE_STEPS = [
  { icon: Eye,        label: 'OBSERVE',   desc: 'Reads your current identity, traits, goals, and session history' },
  { icon: Brain,      label: 'THINK',     desc: 'Determines your intervention type: Learn, Reflect, Act, or Connect' },
  { icon: Sparkles,   label: 'DISCOVER',  desc: 'Scans 36+ curated growth modules across habits, focus & mindset' },
  { icon: Target,     label: 'CURATE',    desc: 'Scores each item against your profile with random variance for freshness' },
  { icon: TrendingUp, label: 'EXPLAIN',   desc: 'Generates personalised "why this, why now" reasoning for each pick' },
]

const TYPE_ICON = {
  Video:   { icon: Play,     color: '#111111' },
  Book:    { icon: BookOpen, color: '#111111' },
  Podcast: { icon: Brain,    color: '#111111' },
  Article: { icon: BookOpen, color: '#111111' },
}

export default function CuratorPage() {
  const navigate = useNavigate()
  const { profile, growthState } = useApp()
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const firstName  = profile?.name?.split(' ')[0] || 'Explorer'
  const currentTrait = profile?.currentTraits?.split(',')[0]?.trim() || 'your current self'
  const targetTrait  = profile?.targetTraits?.split(',')[0]?.trim()  || 'your target self'
  const trustScore   = growthState?.trustScore ?? 52

  const loadPreview = async () => {
    setLoading(true)
    try {
      const data = await runGrowthAgent(profile, growthState, 2)
      setPreview(data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { if (profile) loadPreview() }, [])

  return (
    <PageTransition>
      <div className="page-inner" style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 36px 60px' }}>

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 36 }}
        >
          <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace', color: '#888888', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            YOUR AI GROWTH CURATOR
          </span>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: '#111111', letterSpacing: '-1px', marginTop: 8, marginBottom: 10 }}>
            Meet Your Curator
          </h1>
          <p style={{ fontSize: 15, color: '#555555', maxWidth: 600, lineHeight: 1.6 }}>
            Not a recommendation engine. Not an algorithm. Your curator is an AI reasoning system
            built to understand <em>who you're becoming</em> — and serve content that bridges the gap.
          </p>
        </motion.div>

        {/* ── CURATOR IDENTITY CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28
          }}
        >
          {/* Left: curator persona */}
          <div style={{ padding: '32px', background: '#111111', borderRadius: 24, color: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
            <div style={{ position: 'absolute', bottom: -20, left: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={22} color="#FFFFFF" />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>BECOME Curator</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Autonomous Growth Intelligence</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
                <span style={{ fontSize: 11, color: '#10B981', fontWeight: 600 }}>Active</span>
              </div>
            </div>

            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: 24 }}>
              "I study your identity, not your history. Every recommendation is chosen because it will move you
              from <strong style={{ color: '#FFFFFF' }}>{currentTrait}</strong> toward{' '}
              <strong style={{ color: '#FFFFFF' }}>{targetTrait}</strong>."
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Trust Score',    value: `${trustScore}%` },
                { label: 'Library Size',   value: '36+ items' },
                { label: 'Intervention',   value: 'LEARN → REFLECT' },
                { label: 'Variety Filter', value: 'Last 24 shown' },
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: '12px', background: 'rgba(255,255,255,0.06)', borderRadius: 12 }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: current context */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ padding: '22px', background: '#FFFFFF', border: '1px solid #E8E5DF', borderRadius: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace', color: '#888888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>WHAT I KNOW ABOUT YOU</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { key: 'Identity',  val: `${currentTrait} → ${targetTrait}` },
                  { key: 'Goal',      val: profile?.goals?.slice(0, 60) + (profile?.goals?.length > 60 ? '…' : '') || 'Not set yet' },
                  { key: 'Learning',  val: profile?.learningStyle?.join(', ') || 'Visual, Reading' },
                  { key: 'Prefers',   val: profile?.preferredMedia?.join(', ') || 'Videos, Articles' },
                ].map(({ key, val }) => (
                  <div key={key} style={{ display: 'flex', gap: 10 }}>
                    <span style={{ fontSize: 12, color: '#888888', minWidth: 72, flexShrink: 0 }}>{key}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#111111' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '22px', background: '#FFFFFF', border: '1px solid #E8E5DF', borderRadius: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.02)', flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace', color: '#888888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 12 }}>HOW I IMPROVE</div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  'Every completed session increases trust score by +3',
                  'Skipped content lowers future similar picks',
                  'Variety filter rotates from last 24 shown items',
                  'Intervention type rotates: LEARN → REFLECT → ACT → CONNECT',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: '#555555', lineHeight: 1.5 }}>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#111111', color: '#FFFFFF', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* ── PIPELINE STEPS ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ padding: '28px 32px', background: '#FFFFFF', border: '1px solid #E8E5DF', borderRadius: 24, marginBottom: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace', color: '#888888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 24 }}>
            THE CURATION PIPELINE — HOW IT WORKS
          </div>
          <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start' }}>
            {PIPELINE_STEPS.map(({ icon: Icon, label, desc }, i) => (
              <React.Fragment key={label}>
                <div style={{ flex: 1, textAlign: 'center', padding: '0 8px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#F8F6F2', border: '2px solid #E8E5DF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                    <Icon size={18} color="#111111" />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#111111', letterSpacing: '0.5px', marginBottom: 6 }}>{label}</div>
                  <div style={{ fontSize: 11, color: '#666666', lineHeight: 1.5 }}>{desc}</div>
                </div>
                {i < PIPELINE_STEPS.length - 1 && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', paddingTop: 20 }}>
                    <ChevronRight size={16} color="#CCCCCC" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* ── LIVE PREVIEW ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{ padding: '28px 32px', background: '#FFFFFF', border: '1px solid #E8E5DF', borderRadius: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace', color: '#888888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>
                LIVE CURATOR PREVIEW
              </div>
              <p style={{ fontSize: 13, color: '#555555', margin: 0 }}>
                What your curator is thinking right now for {firstName}
              </p>
            </div>
            <button
              onClick={loadPreview}
              type="button"
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#111111', color: '#FFFFFF', border: 'none', borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              Re-generate
            </button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1, 2].map(i => (
                <div key={i} style={{ height: 72, background: '#F8F6F2', borderRadius: 16, animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          ) : preview ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {preview.recommendations.slice(0, 2).map((rec, i) => {
                const meta = TYPE_ICON[rec.type] || { icon: Zap, color: '#111111' }
                const Icon = meta.icon
                return (
                  <div
                    key={rec.id}
                    style={{ display: 'flex', gap: 16, padding: '18px 20px', background: '#FAFAFA', borderRadius: 16, border: '1px solid #F0EDE6' }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: '#111111', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={16} color="#FFFFFF" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#111111', marginBottom: 4 }}>{rec.title}</div>
                      <div style={{ fontSize: 12, color: '#777777', marginBottom: 6 }}>by {rec.creator} · {rec.duration}</div>
                      <div style={{ fontSize: 12, color: '#555555', fontStyle: 'italic', lineHeight: 1.5 }}>"{rec.whyThis}"</div>
                    </div>
                    <div style={{ fontSize: 11, color: '#888888', flexShrink: 0, alignSelf: 'flex-start', marginTop: 2 }}>#{i + 1}</div>
                  </div>
                )
              })}
              <div style={{ textAlign: 'center', marginTop: 4 }}>
                <button
                  onClick={() => navigate('/session')}
                  type="button"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', background: '#111111', color: '#FFFFFF', border: 'none', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  <Sparkles size={14} />
                  Start Full Curation Session
                </button>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: 14, color: '#888888', textAlign: 'center', padding: '24px 0' }}>
              Complete onboarding to activate your curator.
            </p>
          )}
        </motion.div>

      </div>
    </PageTransition>
  )
}
