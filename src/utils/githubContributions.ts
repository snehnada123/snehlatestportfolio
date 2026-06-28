export interface Contribution {
  date: string
  count: number
  level: number
}

export interface ContributionDay {
  date: string
  count: number
  level: number
}

export interface ContributionWeek {
  days: (ContributionDay | null)[]
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseGitHubUsername(url: string): string {
  return url.replace(/\/$/, '').split('/').pop() ?? ''
}

export function buildContributionGrid(contributions: Contribution[]) {
  const byDate = new Map(contributions.map((c) => [c.date, c]))
  const sorted = [...contributions].sort((a, b) => a.date.localeCompare(b.date))

  if (sorted.length === 0) {
    return { weeks: [] as ContributionWeek[], monthLabels: [] as { label: string; column: number }[], total: 0 }
  }

  const endDate = new Date(sorted[sorted.length - 1].date)
  const startDate = new Date(endDate)
  startDate.setDate(startDate.getDate() - 364)

  const gridStart = new Date(startDate)
  gridStart.setDate(gridStart.getDate() - gridStart.getDay())

  const weeks: ContributionWeek[] = []
  const cursor = new Date(gridStart)
  let total = 0

  while (cursor <= endDate || weeks.length < 53) {
    const days: (ContributionDay | null)[] = []

    for (let day = 0; day < 7; day++) {
      const key = toDateKey(cursor)
      const entry = byDate.get(key)

      if (cursor < startDate || cursor > endDate) {
        days.push(null)
      } else if (entry) {
        days.push(entry)
        total += entry.count
      } else {
        days.push({ date: key, count: 0, level: 0 })
      }

      cursor.setDate(cursor.getDate() + 1)
    }

    weeks.push({ days })

    if (cursor > endDate && weeks.length >= 53) break
  }

  const monthLabels: { label: string; column: number }[] = []
  let lastMonth = -1

  weeks.forEach((week, column) => {
    const firstValid = week.days.find((day) => day !== null)
    if (!firstValid) return

    const month = new Date(firstValid.date).getMonth()
    if (month !== lastMonth) {
      monthLabels.push({ label: MONTHS[month], column })
      lastMonth = month
    }
  })

  return { weeks, monthLabels, total }
}

export function formatContributionDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}