import { site } from '../data/site'
import { useTimeOnEarth } from '../hooks/useTimeOnEarth'
import { padTimeUnit } from '../utils/timeOnEarth'

export function TimeOnEarth() {
  const { years, days, hours, minutes, seconds } = useTimeOnEarth(site.birthDate)

  return (
    <p
      className="text-mono text-caption text-muted tabular-nums leading-relaxed"
      aria-live="polite"
      aria-label={`${years} years, ${days} days on Earth`}
    >
      <span className="text-terminal">{days.toLocaleString()}</span> days ·{' '}
      {years} {years === 1 ? 'year' : 'years'}
      <span className="hidden sm:inline">
        {' '}
        ·{' '}
        <span className="normal-case">
          {padTimeUnit(hours)}:{padTimeUnit(minutes)}:{padTimeUnit(seconds)}
        </span>
      </span>
    </p>
  )
}