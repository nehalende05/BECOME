/**
 * OnboardingPage.jsx — Centered Minimalist Editorial Off-White Onboarding Experience
 * Exactly matches the design aesthetics of Screenshot 2 and spans 100% of the screen with matching off-white background.
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, ArrowLeft, Check, Sparkles,
  User, Target, Brain, Monitor, Leaf
} from 'lucide-react'
import { useApp } from '../store/AppContext.jsx'
import { updateGrowthState } from '../services/storage.js'

// ─── STEP DEFINITIONS ────────────────────────────────────────────────────────

const CURRENT_TRAIT_OPTIONS = [
  'Procrastination', 'Easily Distracted', 'Inconsistent', 'Perfectionist',
  'Overwhelmed', 'Burnt Out', 'Struggle To Execute Ideas', 'Afraid Of Failure',
  'Self-Doubt', 'Undisciplined', 'Time Management', 'Creatively Stuck',
  'Stressed', 'Unmotivated', 'Unfocused', 'Depressed',
  'Exhausted', 'Out Of Shape', 'In Debt', 'Isolated',
  'Fixed Mindset', "Don't Believe In Myself", 'Over-consuming', 'Fitness Inconsistency',
  'Directionless', 'Absent-minded', 'Impatient', 'Disorganized',
  'People-pleaser', 'Hesitant'
]

const TARGET_TRAIT_OPTIONS = [
  'Disciplined', 'Deeply Focused', 'Resilient', 'Consistent',
  'Confident', 'Growth Mindset', 'Action-oriented', 'Visionary',
  'Wealthy', 'Healthy & Active', 'Peaceful & Calm', 'Courageous',
  'Accountable', 'Mindful & Present', 'Well-organized', 'Financially Literate',
  'Confident Speaker', 'Tech Leader', 'High-performer', 'Creative',
  'Productive', 'Self-trusting', 'Proactive', 'Optimistic',
  'Empathetic Leader', 'Strategic Thinker', 'Unstoppable', 'Open-minded',
  'Purpose-driven', 'My Highest Self'
]

const LEARNING_STYLE_OPTIONS = [
  { id: 'visual', label: 'Visual', emoji: '👁️', desc: 'Diagrams, videos, illustrations' },
  { id: 'auditory', label: 'Auditory', emoji: '🎧', desc: 'Podcasts, discussions, audio' },
  { id: 'reading', label: 'Reading', emoji: '📖', desc: 'Books, articles, long-form' },
  { id: 'kinesthetic', label: 'Doing', emoji: '⚡', desc: 'Exercises, challenges, action' },
]

const MEDIA_OPTIONS = [
  { id: 'video', label: 'Short Videos', emoji: '🎬', desc: '5-20 minutes, fast-paced' },
  { id: 'podcast', label: 'Podcasts', emoji: '🎙️', desc: 'Deep conversations, long-form' },
  { id: 'book', label: 'Books', emoji: '📚', desc: 'Comprehensive learning' },
  { id: 'article', label: 'Articles', emoji: '✍️', desc: 'Quick reads, specific insights' },
]

const LENGTH_OPTIONS = [
  { id: 'short', label: 'Short', emoji: '⚡', desc: '< 15 mins' },
  { id: 'medium', label: 'Medium', emoji: '🌿', desc: '15-45 mins' },
  { id: 'long', label: 'Long', emoji: '🌊', desc: '45+ mins' },
]

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────

const TagCloud = ({ options, selected, onToggle, max = null }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20, justifyContent: 'center' }}>
    {options.map(opt => {
      const isSelected = selected.includes(opt)
      const isDisabled = max && !isSelected && selected.length >= max
      return (
        <button
          key={opt}
          onClick={() => !isDisabled && onToggle(opt)}
          type="button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 18px',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 500,
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            opacity: isDisabled ? 0.4 : 1,
            transition: 'all 0.18s ease',
            background: isSelected ? '#111111' : '#FFFFFF',
            color: isSelected ? '#FFFFFF' : '#333333',
            border: isSelected ? '1px solid #111111' : '1px solid #E5E2DC',
            boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.03)',
          }}
        >
          {isSelected && <Check size={13} strokeWidth={2.5} />}
          {opt}
        </button>
      )
    })}
  </div>
)

const CardGrid = ({ options, selected, onToggle, multi = false }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginTop: 20 }}>
    {options.map(opt => {
      const isSelected = multi ? selected.includes(opt.id) : selected === opt.id
      return (
        <button
          key={opt.id}
          onClick={() => onToggle(opt.id)}
          type="button"
          style={{
            padding: '18px 16px',
            background: isSelected ? '#FFFFFF' : '#FAFAFA',
            border: `1.5px solid ${isSelected ? '#111111' : '#E8E5DF'}`,
            borderRadius: 16,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.18s ease',
            position: 'relative',
            boxShadow: isSelected ? '0 4px 14px rgba(0,0,0,0.06)' : 'none',
          }}
        >
          {isSelected && (
            <div style={{
              position: 'absolute',
              top: 10,
              right: 10,
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: '#111111',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Check size={10} color="white" strokeWidth={3} />
            </div>
          )}
          <div style={{ fontSize: 22, marginBottom: 8 }}>{opt.emoji}</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#111111', marginBottom: 2 }}>
            {opt.label}
          </div>
          <div style={{ fontSize: 12, color: '#666666', lineHeight: 1.4 }}>
            {opt.desc}
          </div>
        </button>
      )
    })}
  </div>
)

// ─── MAIN ONBOARDING PAGE COMPONENT ──────────────────────────────────────────

const STEPS = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'identity', title: 'Who You Are' },
  { id: 'target', title: 'Who You\'re Becoming' },
  { id: 'goals', title: 'Your Goals' },
  { id: 'learning', title: 'How You Learn' },
  { id: 'media', title: 'What You Enjoy' },
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { saveProfile } = useApp()
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    name: '',
    currentTraits: [],
    targetTraits: [],
    goals: '',
    learningStyle: [],
    preferredMedia: [],
    contentLength: 'medium',
  })

  const update = (key, val) => setData(d => ({ ...d, [key]: val }))

  const toggleTrait = (key, val) => {
    setData(d => {
      const arr = d[key]
      return { ...d, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] }
    })
  }

  const canAdvance = () => {
    switch (step) {
      case 0: return data.name.trim().length >= 2
      case 1: return data.currentTraits.length >= 1
      case 2: return data.targetTraits.length >= 1
      case 3: return data.goals.trim().length >= 10
      case 4: return data.learningStyle.length >= 1
      case 5: return data.preferredMedia.length >= 1
      default: return true
    }
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = () => {
    const profile = {
      ...data,
      currentTraits: data.currentTraits.join(', '),
      targetTraits: data.targetTraits.join(', '),
    }
    saveProfile(profile)
    updateGrowthState({ sessionCount: 0, lastInteraction: Date.now() })
    navigate('/dashboard')
  }

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#F9F7F2',
      color: '#111111',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '24px 32px 40px',
      fontFamily: 'Inter, -apple-system, sans-serif',
      boxSizing: 'border-box'
    }}>

      {/* TOP HEADER BAR */}
      <header style={{
        maxWidth: 760,
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 24,
        borderBottom: '1px solid #EAE6DF',
      }}>
        {/* Brand Logo (Black Circle with 'B' + BECOME text) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: '#111111',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: '-0.5px'
          }}>
            B
          </div>
          <span style={{
            fontFamily: 'DM Serif Display, Georgia, serif',
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '1px',
            color: '#111111',
            textTransform: 'uppercase'
          }}>
            BECOME
          </span>
        </div>

        {/* Stepper Dots Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {STEPS.map((_, i) => (
            <React.Fragment key={i}>
              <div style={{
                width: i === step ? 10 : 8,
                height: i === step ? 10 : 8,
                borderRadius: '50%',
                backgroundColor: i <= step ? '#111111' : '#E0DCD5',
                transition: 'all 0.25s ease',
              }} />
              {i < STEPS.length - 1 && (
                <div style={{
                  width: 16,
                  height: 2,
                  backgroundColor: i < step ? '#111111' : '#E0DCD5',
                  transition: 'all 0.25s ease',
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Count */}
        <span style={{ fontSize: 13, color: '#666666', fontWeight: 500 }}>
          Step {step + 1} of {STEPS.length}
        </span>
      </header>

      {/* MAIN STEP CONTENT AREA */}
      <main style={{
        maxWidth: 540,
        width: '100%',
        margin: 'auto',
        padding: '48px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ width: '100%' }}
          >
            {/* STEP 0: WELCOME */}
            {step === 0 && (
              <div style={{ textAlign: 'center' }}>
                {/* Sprout Icon / Plant Line Art */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22v-9" />
                    <path d="M12 13C12 7.5 7.5 4 2 4c0 5.5 3.5 10 10 10z" />
                    <path d="M12 10C12 5.5 15.5 2 21 2c0 5.5 -3.5 9 -9 9z" />
                    <path d="M8 22h8" />
                  </svg>
                </div>

                <h1 style={{
                  fontFamily: 'DM Serif Display, Georgia, serif',
                  fontSize: 40,
                  fontWeight: 400,
                  color: '#111111',
                  lineHeight: 1.15,
                  marginBottom: 16,
                  letterSpacing: '-0.5px'
                }}>
                  Your Growth Journey
                  <br />
                  <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Starts Here</span>
                </h1>

                <p style={{
                  color: '#555555',
                  fontSize: 15,
                  lineHeight: 1.6,
                  maxWidth: 460,
                  margin: '0 auto 36px'
                }}>
                  I'm your personal growth curator. I won't recommend what's popular — I'll recommend what's right for <em style={{ fontStyle: 'italic', color: '#111111' }}>you</em>, right now.
                </p>

                <div style={{ textAlign: 'left', maxWidth: 440, margin: '0 auto' }}>
                  <label style={{
                    fontSize: 13,
                    color: '#111111',
                    fontWeight: 600,
                    display: 'block',
                    marginBottom: 10
                  }}>
                    What should I call you?
                  </label>
                  <input
                    placeholder="Your first name"
                    value={data.name}
                    onChange={e => update('name', e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && canAdvance() && handleNext()}
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      fontSize: 15,
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #E0DDD6',
                      borderRadius: 14,
                      color: '#111111',
                      outline: 'none',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={e => e.target.style.borderColor = '#111111'}
                    onBlur={e => e.target.style.borderColor = '#E0DDD6'}
                  />
                </div>
              </div>
            )}

            {/* STEP 1: CURRENT TRAITS */}
            {step === 1 && (
              <div style={{ textAlign: 'center' }}>
                <h2 style={{
                  fontFamily: 'DM Serif Display, Georgia, serif',
                  fontSize: 34,
                  fontWeight: 400,
                  color: '#111111',
                  marginBottom: 10,
                  lineHeight: 1.2
                }}>
                  Who are you <span style={{ fontStyle: 'italic' }}>right now?</span>
                </h2>
                <p style={{ color: '#555555', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                  Honest self-awareness is the start of every transformation. Select the traits that describe you today.
                </p>
                <TagCloud
                  options={CURRENT_TRAIT_OPTIONS}
                  selected={data.currentTraits}
                  onToggle={val => toggleTrait('currentTraits', val)}
                />
                {data.currentTraits.length > 0 && (
                  <p style={{ fontSize: 12, color: '#777777', marginTop: 14 }}>
                    {data.currentTraits.length} selected · No judgment, only awareness.
                  </p>
                )}
              </div>
            )}

            {/* STEP 2: TARGET TRAITS */}
            {step === 2 && (
              <div style={{ textAlign: 'center' }}>
                <h2 style={{
                  fontFamily: 'DM Serif Display, Georgia, serif',
                  fontSize: 34,
                  fontWeight: 400,
                  color: '#111111',
                  marginBottom: 10,
                  lineHeight: 1.2
                }}>
                  Who do you want to <span style={{ fontStyle: 'italic' }}>become?</span>
                </h2>
                <p style={{ color: '#555555', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                  Every piece of content recommended will bridge the gap. Pick up to 5 target traits.
                </p>
                <TagCloud
                  options={TARGET_TRAIT_OPTIONS}
                  selected={data.targetTraits}
                  onToggle={val => toggleTrait('targetTraits', val)}
                  max={5}
                />
                {data.targetTraits.length > 0 && (
                  <div style={{
                    marginTop: 18,
                    padding: '12px 16px',
                    background: '#FFFFFF',
                    border: '1px solid #E5E2DC',
                    borderRadius: 12,
                    display: 'inline-block'
                  }}>
                    <p style={{ fontSize: 13, color: '#444444', fontStyle: 'italic', margin: 0 }}>
                      "I am becoming {data.targetTraits.slice(0, 2).map(t => t.toLowerCase()).join(' and ')}{data.targetTraits.length > 2 ? '...' : '.'}"
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: GOALS */}
            {step === 3 && (
              <div style={{ textAlign: 'center' }}>
                <h2 style={{
                  fontFamily: 'DM Serif Display, Georgia, serif',
                  fontSize: 34,
                  fontWeight: 400,
                  color: '#111111',
                  marginBottom: 10,
                  lineHeight: 1.2
                }}>
                  What do you want to <span style={{ fontStyle: 'italic' }}>achieve?</span>
                </h2>
                <p style={{ color: '#555555', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                  Be specific about your immediate focus and goals.
                </p>
                <textarea
                  placeholder="e.g. Build a daily writing habit, master deep work, and stop procrastinating on important projects..."
                  value={data.goals}
                  onChange={e => update('goals', e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    fontSize: 14,
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #E0DDD6',
                    borderRadius: 14,
                    color: '#111111',
                    outline: 'none',
                    lineHeight: 1.6,
                    resize: 'vertical',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#111111'}
                  onBlur={e => e.target.style.borderColor = '#E0DDD6'}
                />
                <p style={{ fontSize: 12, color: '#888888', marginTop: 8 }}>
                  {data.goals.length} characters (minimum 10)
                </p>
              </div>
            )}

            {/* STEP 4: LEARNING STYLE */}
            {step === 4 && (
              <div style={{ textAlign: 'center' }}>
                <h2 style={{
                  fontFamily: 'DM Serif Display, Georgia, serif',
                  fontSize: 34,
                  fontWeight: 400,
                  color: '#111111',
                  marginBottom: 10,
                  lineHeight: 1.2
                }}>
                  How do you learn <span style={{ fontStyle: 'italic' }}>best?</span>
                </h2>
                <p style={{ color: '#555555', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                  Select all modalities that suit your learning style.
                </p>
                <CardGrid
                  options={LEARNING_STYLE_OPTIONS}
                  selected={data.learningStyle}
                  onToggle={id => toggleTrait('learningStyle', id)}
                  multi
                />
              </div>
            )}

            {/* STEP 5: MEDIA PREFERENCES */}
            {step === 5 && (
              <div style={{ textAlign: 'center' }}>
                <h2 style={{
                  fontFamily: 'DM Serif Display, Georgia, serif',
                  fontSize: 34,
                  fontWeight: 400,
                  color: '#111111',
                  marginBottom: 10,
                  lineHeight: 1.2
                }}>
                  What content do you <span style={{ fontStyle: 'italic' }}>enjoy?</span>
                </h2>
                <p style={{ color: '#555555', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                  Select your preferred formats and ideal session length.
                </p>
                <CardGrid
                  options={MEDIA_OPTIONS}
                  selected={data.preferredMedia}
                  onToggle={id => toggleTrait('preferredMedia', id)}
                  multi
                />

                <div style={{ marginTop: 24, textAlign: 'left' }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#111111', display: 'block', marginBottom: 10, textAlign: 'center' }}>
                    Preferred session length
                  </label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {LENGTH_OPTIONS.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => update('contentLength', opt.id)}
                        type="button"
                        style={{
                          flex: 1,
                          padding: '12px 10px',
                          background: data.contentLength === opt.id ? '#FFFFFF' : '#FAFAFA',
                          border: `1.5px solid ${data.contentLength === opt.id ? '#111111' : '#E5E2DC'}`,
                          borderRadius: 14,
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.18s ease',
                        }}
                      >
                        <div style={{ fontSize: 18, marginBottom: 4 }}>{opt.emoji}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111111' }}>
                          {opt.label}
                        </div>
                        <div style={{ fontSize: 11, color: '#777777', marginTop: 2 }}>
                          {opt.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* FOOTER ACTIONS BAR */}
      <footer style={{
        maxWidth: 760,
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: step > 0 ? 'space-between' : 'flex-end',
        paddingTop: 24,
        borderTop: '1px solid #EAE6DF',
      }}>
        {step > 0 && (
          <button
            onClick={() => setStep(s => s - 1)}
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              backgroundColor: '#FFFFFF',
              color: '#111111',
              border: '1px solid #E0DDD6',
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F5F3ED'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
          >
            <ArrowLeft size={16} />
            Back
          </button>
        )}

        <button
          onClick={handleNext}
          disabled={!canAdvance()}
          type="button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 26px',
            backgroundColor: canAdvance() ? '#111111' : '#CCCCCC',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 600,
            cursor: canAdvance() ? 'pointer' : 'not-allowed',
            opacity: canAdvance() ? 1 : 0.6,
            boxShadow: canAdvance() ? '0 4px 14px rgba(0,0,0,0.15)' : 'none',
            transition: 'all 0.18s ease',
          }}
          onMouseEnter={e => { if (canAdvance()) e.currentTarget.style.backgroundColor = '#222222' }}
          onMouseLeave={e => { if (canAdvance()) e.currentTarget.style.backgroundColor = '#111111' }}
        >
          {step === STEPS.length - 1 ? (
            <>
              <Sparkles size={16} />
              Begin My Journey
            </>
          ) : (
            <>
              Continue
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </footer>
    </div>
  )
}
