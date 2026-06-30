import { ExternalLink } from 'lucide-react'
import { useMemo, useState } from 'react'
import { site } from '../data/site'
import { useGitHubContributions } from '../hooks/useGitHubContributions'
import {
  buildContributionGrid,
  formatContributionDate,
  parseGitHubUsername,
} from '../utils/githubContributions'

const WEEKDAY_LABELS = [
  { row: 1, label: 'Mon' },
  { row: 3, label: 'Wed' },
  { row: 5, label: 'Fri' },
]

export function GitHubActivity() {
  const username = parseGitHubUsername(site.links.github)
  const { contributions, loading, error } = useGitHubContributions(username)
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null)

  const { weeks, monthLabels, total } = useMemo(
    () => buildContributionGrid(contributions),
    [contributions],
  )

  return (
    <section
      id="activity"
      aria-label="GitHub Activity"
      className="page-section border-t border-border"
    >
      <div className="mx-auto max-w-6xl page-inner flex flex-col gap-6 sm:gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex max-w-2xl flex-col gap-3">
            <h2 className="text-title">GitHub Activity</h2>
            <p className="text-body text-muted">
              <span className="sm:hidden">Last year of GitHub contributions.</span>
              <span className="hidden sm:inline">
                Contribution heatmap for the last year — each square is one day, color intensity
                reflects how much happened on GitHub that day.
              </span>
            </p>
          </div>

          <a
            href={site.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-mono text-small text-muted underline underline-offset-4 decoration-1 hover:text-terminal transition-colors"
          >
            @{username}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <div className="border border-border p-3 sm:p-6">
          {loading && (
            <p className="text-mono text-caption text-muted">Loading contribution graph...</p>
          )}

          {error && !loading && (
            <p className="text-mono text-caption text-muted">{error}</p>
          )}

          {!loading && !error && weeks.length > 0 && (
            <>
              <p className="mb-2 text-mono text-caption text-muted sm:hidden">
                Swipe to see the full year →
              </p>

              <div className="github-heatmap-scroll overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
                <div className="github-heatmap min-w-max">
                  <div className="github-heatmap__months" aria-hidden="true">
                    <span className="github-heatmap__spacer" />
                    {weeks.map((_, column) => {
                      const month = monthLabels.find((item) => item.column === column)
                      return (
                        <span key={column} className="github-heatmap__month">
                          {month?.label ?? ''}
                        </span>
                      )
                    })}
                  </div>

                  <div className="github-heatmap__body">
                    <div className="github-heatmap__weekdays hidden sm:grid" aria-hidden="true">
                      {Array.from({ length: 7 }).map((_, row) => {
                        const label = WEEKDAY_LABELS.find((item) => item.row === row)
                        return (
                          <span key={row} className="github-heatmap__weekday">
                            {label?.label ?? ''}
                          </span>
                        )
                      })}
                    </div>

                    <div className="github-heatmap__grid">
                      {weeks.map((week, column) => (
                        <div key={column} className="github-heatmap__week">
                          {week.days.map((day, row) => (
                            <div
                              key={`${column}-${row}`}
                              className={
                                day
                                  ? `github-heatmap__cell github-heatmap__cell--level-${day.level}`
                                  : 'github-heatmap__cell github-heatmap__cell--empty'
                              }
                              onMouseEnter={(event) => {
                                if (!day) return
                                const label =
                                  day.count === 0
                                    ? `No contributions on ${formatContributionDate(day.date)}`
                                    : `${day.count} contribution${day.count === 1 ? '' : 's'} on ${formatContributionDate(day.date)}`

                                setTooltip({
                                  text: label,
                                  x: event.clientX,
                                  y: event.clientY,
                                })
                              }}
                              onMouseLeave={() => setTooltip(null)}
                              aria-label={
                                day
                                  ? `${day.count} contributions on ${formatContributionDate(day.date)}`
                                  : undefined
                              }
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 sm:mt-5 sm:gap-4">
                <p className="text-mono text-caption text-muted">
                  <span className="text-foreground">{total}</span>
                  <span className="sm:hidden"> contributions</span>
                  <span className="hidden sm:inline"> contributions in the last year</span>
                </p>

                <div
                  className="flex items-center gap-1.5 text-mono text-caption text-muted sm:gap-2"
                  aria-label="Contribution intensity scale from less to more"
                >
                  <span>Less</span>
                  {[0, 1, 2, 3, 4].map((level) => (
                    <span
                      key={level}
                      className={`github-heatmap__cell github-heatmap__cell--level-${level}`}
                    />
                  ))}
                  <span>More</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {tooltip && (
        <div
          className="github-heatmap__tooltip"
          style={{ left: tooltip.x + 12, top: tooltip.y - 36 }}
          role="tooltip"
        >
          {tooltip.text}
        </div>
      )}
    </section>
  )
}