import { useCallback, useMemo, useState, type CSSProperties } from 'react'
import { site } from '../data/site'
import { isBirthday } from '../utils/timeOnEarth'

function isBirthdayPreview(): boolean {
  return new URLSearchParams(window.location.search).get('birthday') === 'preview'
}

const BALLOON_COLORS = [
  '#7c3aed',
  '#a78bfa',
  '#f472b6',
  '#60a5fa',
  '#34d399',
  '#fbbf24',
  '#fb7185',
]

const BALLOON_COUNT = 24
const FRAGMENT_COUNT = 8

interface BalloonConfig {
  id: number
  left: number
  delay: number
  duration: number
  size: number
  drift: number
  color: string
}

function createBalloons(): BalloonConfig[] {
  return Array.from({ length: BALLOON_COUNT }, (_, id) => ({
    id,
    left: 4 + Math.random() * 92,
    delay: Math.random() * 14,
    duration: 10 + Math.random() * 8,
    size: 28 + Math.random() * 18,
    drift: -24 + Math.random() * 48,
    color: BALLOON_COLORS[id % BALLOON_COLORS.length],
  }))
}

export function BirthdayBalloons() {
  const preview = isBirthdayPreview()
  const active = isBirthday(site.birthDate) || preview
  const balloons = useMemo(() => (active ? createBalloons() : []), [active])
  const [burstingIds, setBurstingIds] = useState<Set<number>>(() => new Set())
  const [goneIds, setGoneIds] = useState<Set<number>>(() => new Set())

  const handlePop = useCallback((id: number, element: HTMLButtonElement) => {
    if (burstingIds.has(id) || goneIds.has(id)) return
    element.style.animationPlayState = 'paused'
    setBurstingIds((current) => new Set(current).add(id))
  }, [burstingIds, goneIds])

  const handleBurstEnd = useCallback((id: number) => {
    setGoneIds((current) => new Set(current).add(id))
    setBurstingIds((current) => {
      const next = new Set(current)
      next.delete(id)
      return next
    })
  }, [])

  if (!active) return null

  return (
    <>
      {preview && (
        <p className="birthday-balloons__preview" aria-live="polite">
          Birthday preview — click balloons to pop · remove{' '}
          <code className="birthday-balloons__preview-code">?birthday=preview</code>{' '}
          from the URL
        </p>
      )}

      <div className="birthday-balloons">
        {balloons.map((balloon) => {
          if (goneIds.has(balloon.id)) return null
          const bursting = burstingIds.has(balloon.id)

          return (
            <button
              key={balloon.id}
              type="button"
              className={`birthday-balloon${bursting ? ' birthday-balloon--burst' : ''}`}
              aria-label="Pop balloon"
              disabled={bursting}
              onClick={(event) => handlePop(balloon.id, event.currentTarget)}
              style={
                {
                  '--left': `${balloon.left}%`,
                  '--delay': `${balloon.delay}s`,
                  '--duration': `${balloon.duration}s`,
                  '--size': `${balloon.size}px`,
                  '--drift': `${balloon.drift}px`,
                  '--color': balloon.color,
                } as CSSProperties
              }
            >
              <span
                className="birthday-balloon__body"
                aria-hidden="true"
                onAnimationEnd={
                  bursting
                    ? () => handleBurstEnd(balloon.id)
                    : undefined
                }
              />
              <span className="birthday-balloon__string" aria-hidden="true" />
              {bursting &&
                Array.from({ length: FRAGMENT_COUNT }).map((_, index) => (
                  <span
                    key={index}
                    className="birthday-balloon__fragment"
                    style={
                      {
                        '--fragment-angle': `${index * (360 / FRAGMENT_COUNT)}deg`,
                      } as CSSProperties
                    }
                    aria-hidden="true"
                  />
                ))}
            </button>
          )
        })}
      </div>
    </>
  )
}