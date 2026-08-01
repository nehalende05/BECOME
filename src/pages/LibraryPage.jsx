/**
 * LibraryPage.jsx — Full Content Library
 * Browse all 36+ curated growth modules filtered by type, domain, and complexity.
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, BookOpen, Mic, FileText, Search, ExternalLink, Clock, Star } from 'lucide-react'
import { CONTENT_LIBRARY, DOMAINS } from '../services/contentLibrary.js'
import PageTransition from '../components/PageTransition.jsx'

const TYPE_CONFIG = {
  Video:   { icon: Play,     color: '#111111', bg: '#111111' },
  Book:    { icon: BookOpen, color: '#111111', bg: '#111111' },
  Podcast: { icon: Mic,      color: '#111111', bg: '#111111' },
  Article: { icon: FileText, color: '#111111', bg: '#111111' },
}

const DOMAIN_LABELS = {
  habits: 'Habits', productivity: 'Productivity', mindset: 'Mindset',
  identity: 'Identity', focus: 'Focus', creativity: 'Creativity',
  relationships: 'Relationships', health: 'Health', purpose: 'Purpose',
  learning: 'Learning', resilience: 'Resilience', leadership: 'Leadership',
}

const COMPLEXITY_BADGE = {
  beginner:     { label: 'Beginner',     bg: '#F0FDF4', color: '#16A34A' },
  intermediate: { label: 'Intermediate', bg: '#FFFBEB', color: '#D97706' },
  advanced:     { label: 'Advanced',     bg: '#FFF1F2', color: '#E11D48' },
}

export default function LibraryPage() {
  const [search,    setSearch]    = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [domainFilter, setDomainFilter] = useState('All')

  const types   = ['All', 'Video', 'Book', 'Podcast', 'Article']
  const domains = ['All', ...Object.keys(DOMAIN_LABELS)]

  const filtered = CONTENT_LIBRARY.filter(item => {
    const matchType   = typeFilter === 'All'   || item.type === typeFilter
    const matchDomain = domainFilter === 'All' || item.domains?.includes(domainFilter)
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase())
                                || item.creator.toLowerCase().includes(search.toLowerCase())
    return matchType && matchDomain && matchSearch
  })

  const stats = {
    total:    CONTENT_LIBRARY.length,
    videos:   CONTENT_LIBRARY.filter(i => i.type === 'Video').length,
    books:    CONTENT_LIBRARY.filter(i => i.type === 'Book').length,
    podcasts: CONTENT_LIBRARY.filter(i => i.type === 'Podcast').length,
  }

  return (
    <PageTransition>
      <div className="page-inner" style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 36px 60px' }}>

        {/* ── HEADER ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace', color: '#888888', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            CURATED CONTENT LIBRARY
          </span>
          <h1 style={{ fontSize: 38, fontWeight: 800, color: '#111111', letterSpacing: '-1px', marginTop: 8, marginBottom: 10 }}>
            Growth Library
          </h1>
          <p style={{ fontSize: 14, color: '#555555', maxWidth: 560, lineHeight: 1.6, margin: 0 }}>
            {stats.total}+ hand-picked videos, books, and podcasts from the world's best thinkers — all selected to accelerate your identity transformation.
          </p>
        </motion.div>

        {/* ── STAT PILLS ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}
        >
          {[
            { label: 'Total Items', value: stats.total, icon: Star },
            { label: 'Videos',      value: stats.videos, icon: Play },
            { label: 'Books',       value: stats.books,  icon: BookOpen },
            { label: 'Podcasts',    value: stats.podcasts, icon: Mic },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', background: '#FFFFFF', border: '1px solid #E8E5DF', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.02)' }}
            >
              <div style={{ width: 30, height: 30, borderRadius: 8, background: '#F8F6F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={14} color="#111111" />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#111111', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 11, color: '#888888', marginTop: 2 }}>{label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── SEARCH + FILTERS ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          style={{ marginBottom: 24 }}
        >
          {/* Search Bar */}
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <Search size={15} color="#888888" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by title or creator…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '12px 14px 12px 40px',
                fontSize: 14, background: '#FFFFFF',
                border: '1px solid #E8E5DF', borderRadius: 14,
                color: '#111111', outline: 'none', boxSizing: 'border-box',
                boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
              }}
              onFocus={e => e.target.style.borderColor = '#111111'}
              onBlur={e => e.target.style.borderColor = '#E8E5DF'}
            />
          </div>

          {/* Type Filters */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            {types.map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                type="button"
                style={{
                  padding: '6px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.15s',
                  background: typeFilter === t ? '#111111' : '#FFFFFF',
                  color:      typeFilter === t ? '#FFFFFF' : '#555555',
                  border: `1px solid ${typeFilter === t ? '#111111' : '#E8E5DF'}`,
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Domain Filters */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {domains.map(d => (
              <button
                key={d}
                onClick={() => setDomainFilter(d)}
                type="button"
                style={{
                  padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 500,
                  cursor: 'pointer', transition: 'all 0.15s',
                  background: domainFilter === d ? '#F8F6F2' : 'transparent',
                  color:      domainFilter === d ? '#111111' : '#888888',
                  border: `1px solid ${domainFilter === d ? '#D0CDC5' : 'transparent'}`,
                  textTransform: 'capitalize',
                }}
              >
                {d === 'All' ? 'All Domains' : DOMAIN_LABELS[d]}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── RESULTS COUNT ── */}
        <div style={{ fontSize: 12, color: '#888888', marginBottom: 16, fontWeight: 600 }}>
          Showing {filtered.length} of {CONTENT_LIBRARY.length} items
        </div>

        {/* ── LIBRARY GRID ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtered.map((item, idx) => {
            const cfg   = TYPE_CONFIG[item.type] || TYPE_CONFIG.Video
            const Icon  = cfg.icon
            const badge = COMPLEXITY_BADGE[item.complexity] || COMPLEXITY_BADGE.beginner

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.025 }}
                style={{
                  padding: '20px', background: '#FFFFFF',
                  border: '1px solid #E8E5DF', borderRadius: 20,
                  display: 'flex', flexDirection: 'column', gap: 12,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = '#D0CDC5' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.02)'; e.currentTarget.style.borderColor = '#E8E5DF' }}
              >
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: '#111111', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} color="#FFFFFF" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#111111', lineHeight: 1.3, marginBottom: 2 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 12, color: '#888888' }}>by {item.creator}</div>
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: 12, color: '#555555', lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.description}
                </p>

                {/* Key insight */}
                {item.keyInsight && (
                  <div style={{ padding: '10px 12px', background: '#F8F6F2', borderRadius: 10, borderLeft: '3px solid #111111' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>Key Insight</div>
                    <div style={{ fontSize: 12, color: '#333333', fontStyle: 'italic', lineHeight: 1.5 }}>"{item.keyInsight}"</div>
                  </div>
                )}

                {/* Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: badge.bg, color: badge.color }}>
                      {badge.label}
                    </span>
                    {item.duration && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#888888' }}>
                        <Clock size={11} />
                        {item.duration}
                      </span>
                    )}
                  </div>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#111111', fontWeight: 600, textDecoration: 'none' }}
                    >
                      Open <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#888888' }}>
            <Search size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p style={{ fontSize: 14 }}>No items match your filters. Try adjusting your search.</p>
          </div>
        )}

      </div>
    </PageTransition>
  )
}
