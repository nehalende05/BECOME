/**
 * JourneyPage.jsx — Growth History & Timeline (off-white theme)
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen, CheckCircle2, XCircle, Clock,
  Award, ExternalLink, TrendingUp, Flame, Brain
} from 'lucide-react'
import { useApp } from '../store/AppContext.jsx'
import PageTransition from '../components/PageTransition.jsx'

const TYPE_LABEL = {
  Video:   'Watched',
  Book:    'Read',
  Podcast: 'Listened',
  Article: 'Read',
}

export default function JourneyPage() {
  const { history, growthState, profile } = useApp()
  const [filter, setFilter] = useState('all')

  const firstName = profile?.name?.split(' ')[0] || 'Explorer'

  const filteredHistory = history.filter(h => {
    if (filter === 'completed') return h.status === 'completed'
    if (filter === 'skipped')   return h.status === 'skipped'
    return true
  })

  const completedCount = history.filter(h => h.status === 'completed').length
  const skippedCount   = history.filter(h => h.status === 'skipped').length

  return (
    <PageTransition>
      <div className="page-inner" style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 36px 60px' }}>

        {/* ── HEADER ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace', color: '#888888', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            IDENTITY TIMELINE
          </span>
          <h1 style={{ fontSize: 38, fontWeight: 800, color: '#111111', letterSpacing: '-1px', marginTop: 8, marginBottom: 10 }}>
            My Growth Journey
          </h1>
          <p style={{ fontSize: 14, color: '#555555', maxWidth: 540, lineHeight: 1.6, margin: 0 }}>
            A complete record of your sessions, completed content, and identity milestones — every step toward becoming {profile?.targetTraits?.split(',')[0]?.trim() || 'your best self'}.
          </p>
        </motion.div>

        {/* ── STAT CARDS ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}
        >
          {[
            { icon: TrendingUp, label: 'Completed',  value: completedCount, color: '#111111' },
            { icon: Clock,      label: 'Skipped',    value: skippedCount,   color: '#888888' },
            { icon: Flame,      label: 'Day Streak', value: `${growthState?.consistency ?? 0}d`, color: '#111111' },
            { icon: Brain,      label: 'Trust Score',value: `${growthState?.trustScore ?? 0}%`, color: '#111111' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} style={{ padding: '20px', background: '#FFFFFF', border: '1px solid #E8E5DF', borderRadius: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: '#F8F6F2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Icon size={15} color={color} />
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#111111', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 11, color: '#888888', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </motion.div>

        {/* ── FILTERS ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}
        >
          <h2 style={{ fontSize: 10, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'monospace', margin: 0 }}>
            RECOMMENDATION LOG ({filteredHistory.length} items)
          </h2>
          <div style={{ display: 'flex', gap: 6 }}>
            {['all', 'completed', 'skipped'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                type="button"
                style={{
                  padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                  textTransform: 'capitalize', cursor: 'pointer', transition: 'all 0.15s',
                  background: filter === f ? '#111111' : '#FFFFFF',
                  color:      filter === f ? '#FFFFFF' : '#555555',
                  border: `1px solid ${filter === f ? '#111111' : '#E8E5DF'}`,
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── TIMELINE ── */}
        {filteredHistory.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ padding: '60px 24px', textAlign: 'center', background: '#FFFFFF', border: '1px dashed #E8E5DF', borderRadius: 20 }}
          >
            <Award size={36} color="#DDDDDD" style={{ marginBottom: 14 }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#333333', marginBottom: 8 }}>
              {filter === 'all' ? 'No history yet' : `No ${filter} items found`}
            </h3>
            <p style={{ fontSize: 13, color: '#888888', maxWidth: 360, margin: '0 auto' }}>
              {filter === 'all'
                ? `Complete recommendations in a session to see them here, ${firstName}!`
                : `Try switching to "all" to see your full history.`
              }
            </p>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredHistory.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                style={{
                  padding: '18px 22px',
                  background: '#FFFFFF',
                  border: `1px solid ${item.status === 'completed' ? '#E0F2EE' : '#E8E5DF'}`,
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {/* Status icon */}
                  {item.status === 'completed'
                    ? <CheckCircle2 size={20} color="#10B981" style={{ flexShrink: 0 }} />
                    : <XCircle      size={20} color="#F43F5E" style={{ flexShrink: 0 }} />
                  }

                  {/* Content info */}
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111111', marginBottom: 2 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 12, color: '#888888', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ textTransform: 'capitalize' }}>
                        {TYPE_LABEL[item.type] || item.type}
                      </span>
                      {item.creator && <><span>·</span><span>by {item.creator}</span></>}
                      {item.duration && <><span>·</span><Clock size={10} /><span>{item.duration}</span></>}
                    </div>
                  </div>
                </div>

                {/* Right side */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 700,
                    background: item.status === 'completed' ? '#F0FDF4' : '#FFF1F2',
                    color:      item.status === 'completed' ? '#16A34A' : '#E11D48',
                  }}>
                    {item.status === 'completed' ? 'Completed' : 'Skipped'}
                  </span>

                  <span style={{ fontSize: 11, color: '#AAAAAA' }}>
                    {item.loggedAt ? new Date(item.loggedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                  </span>

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#555555', fontWeight: 600, textDecoration: 'none' }}
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </PageTransition>
  )
}
