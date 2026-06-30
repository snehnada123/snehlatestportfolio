import { useEffect, useMemo, useState } from 'react'
import type { HeroQuote } from '../data/quotes'
import { useCompactLayout } from '../hooks/useCompactLayout'

const FULL_NAME = 'Sneh Nada'

interface SimpleTypeWriterProps {
  text: string
  delay?: number
  className?: string
  onComplete?: () => void
}

export function SimpleTypeWriter({
  text,
  delay = 80,
  className = '',
  onComplete,
}: SimpleTypeWriterProps) {
  const [displayed, setDisplayed] = useState('')
  const [cursorVisible, setCursorVisible] = useState(true)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (displayed.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1))
      }, delay)
      return () => clearTimeout(timer)
    }

    if (!done) {
      setDone(true)
      const timer = setTimeout(() => setCursorVisible(false), 1000)
      onComplete?.()
      return () => clearTimeout(timer)
    }
  }, [displayed, text, delay, onComplete, done])

  useEffect(() => {
    if (done && !cursorVisible) return
    const interval = setInterval(() => setCursorVisible((v) => !v), 530)
    return () => clearInterval(interval)
  }, [done, cursorVisible])

  return (
    <span className={className}>
      {displayed}
      {!done && (
        <span
          className="inline-block h-[1em] w-[0.6em] ml-1 bg-foreground align-middle"
          style={{
            opacity: cursorVisible ? 1 : 0,
            transition: 'opacity 0.1s',
          }}
          aria-hidden="true"
        />
      )}
    </span>
  )
}

interface NameTypeWriterProps {
  className?: string
  onComplete?: () => void
}

function InsertNameTypeWriter({ className = '', onComplete }: NameTypeWriterProps) {
  const [fullText, setFullText] = useState('')
  const [cursorPos, setCursorPos] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'moving' | 'inserting' | 'done'>('typing')
  const [cursorVisible, setCursorVisible] = useState(true)
  const [insertIndex, setInsertIndex] = useState(0)

  const firstPart = 'Sneh'
  const insertPart = ' Nada'

  useEffect(() => {
    if (phase !== 'typing') return

    if (insertIndex < firstPart.length) {
      const timer = setTimeout(() => {
        setFullText(firstPart.slice(0, insertIndex + 1))
        setCursorPos(insertIndex + 1)
        setInsertIndex((i) => i + 1)
      }, 100)
      return () => clearTimeout(timer)
    }

    const timer = setTimeout(() => {
      setPhase('inserting')
      setInsertIndex(0)
    }, 400)
    return () => clearTimeout(timer)
  }, [phase, insertIndex])

  useEffect(() => {
    if (phase !== 'inserting') return

    if (insertIndex < insertPart.length) {
      const timer = setTimeout(() => {
        setFullText((prev) => {
          const before = prev.slice(0, cursorPos)
          const after = prev.slice(cursorPos)
          return before + insertPart[insertIndex] + after
        })
        setCursorPos((p) => p + 1)
        setInsertIndex((i) => i + 1)
      }, 100)
      return () => clearTimeout(timer)
    }

    setPhase('done')
    onComplete?.()
  }, [phase, insertIndex, cursorPos, onComplete])

  useEffect(() => {
    if (phase !== 'done') return
    setCursorVisible(false)
  }, [phase])

  useEffect(() => {
    if (phase === 'done') return
    const interval = setInterval(() => setCursorVisible((v) => !v), 530)
    return () => clearInterval(interval)
  }, [phase])

  const before = fullText.slice(0, cursorPos)
  const after = fullText.slice(cursorPos)

  return (
    <span className={className}>
      {before}
      {phase !== 'done' && (
        <span
          className="inline-block h-[1em] w-[0.6em] ml-1 bg-foreground align-middle"
          style={{
            opacity: cursorVisible ? 1 : 0,
            transition: 'opacity 0.1s',
          }}
          aria-hidden="true"
        />
      )}
      {after}
    </span>
  )
}

export function NameTypeWriter({ className = '', onComplete }: NameTypeWriterProps) {
  const compact = useCompactLayout()

  if (compact) {
    return (
      <SimpleTypeWriter
        text={FULL_NAME}
        delay={90}
        className={className}
        onComplete={onComplete}
      />
    )
  }

  return <InsertNameTypeWriter className={className} onComplete={onComplete} />
}

interface QuoteTypeWriterProps {
  quotes: HeroQuote[]
  active?: boolean
  typeDelay?: number
  deleteDelay?: number
  pauseMs?: number
  className?: string
}

function formatQuote(quote: HeroQuote): string {
  return `${quote.text} — ${quote.author}`
}

export function QuoteTypeWriter({
  quotes,
  active = true,
  typeDelay = 28,
  deleteDelay = 18,
  pauseMs = 3200,
  className = '',
}: QuoteTypeWriterProps) {
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState<'idle' | 'typing' | 'pause' | 'deleting'>('idle')
  const [cursorVisible, setCursorVisible] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  const fullText = useMemo(
    () => (quotes.length > 0 ? formatQuote(quotes[quoteIndex % quotes.length]) : ''),
    [quotes, quoteIndex],
  )

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!active || quotes.length === 0) return

    if (reducedMotion) {
      setDisplayed(formatQuote(quotes[0]))
      setPhase('idle')
      return
    }

    if (phase === 'idle') {
      setDisplayed('')
      setPhase('typing')
    }
  }, [active, quotes, reducedMotion, phase])

  useEffect(() => {
    if (!active || quotes.length === 0 || reducedMotion) return

    if (phase === 'typing') {
      if (displayed.length < fullText.length) {
        const timer = window.setTimeout(() => {
          setDisplayed(fullText.slice(0, displayed.length + 1))
        }, typeDelay)
        return () => window.clearTimeout(timer)
      }

      setPhase('pause')
      return
    }

    if (phase === 'pause') {
      const timer = window.setTimeout(() => setPhase('deleting'), pauseMs)
      return () => window.clearTimeout(timer)
    }

    if (phase === 'deleting') {
      if (displayed.length > 0) {
        const timer = window.setTimeout(() => {
          setDisplayed((value) => value.slice(0, -1))
        }, deleteDelay)
        return () => window.clearTimeout(timer)
      }

      setQuoteIndex((index) => (index + 1) % quotes.length)
      setPhase('typing')
    }
  }, [
    active,
    quotes.length,
    reducedMotion,
    phase,
    displayed,
    fullText,
    typeDelay,
    deleteDelay,
    pauseMs,
  ])

  useEffect(() => {
    if (!active || reducedMotion || phase === 'idle') return
    const interval = window.setInterval(() => setCursorVisible((value) => !value), 530)
    return () => window.clearInterval(interval)
  }, [active, reducedMotion, phase])

  if (quotes.length === 0) return null

  return (
    <span className={className} aria-live="polite">
      {displayed}
      {active && !reducedMotion && phase !== 'idle' && (
        <span
          className="inline-block h-[1em] w-[0.6em] ml-1 bg-foreground align-middle"
          style={{
            opacity: cursorVisible ? 1 : 0,
            transition: 'opacity 0.1s',
          }}
          aria-hidden="true"
        />
      )}
    </span>
  )
}