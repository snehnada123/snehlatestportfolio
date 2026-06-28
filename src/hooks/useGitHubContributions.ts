import { useEffect, useState } from 'react'
import type { Contribution } from '../utils/githubContributions'

interface GitHubContributionsResponse {
  contributions: Contribution[]
  total: Record<string, number>
}

export function useGitHubContributions(username: string) {
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
        )

        if (!response.ok) {
          throw new Error('Failed to load GitHub activity')
        }

        const data = (await response.json()) as GitHubContributionsResponse

        if (!cancelled) {
          setContributions(data.contributions ?? [])
        }
      } catch {
        if (!cancelled) {
          setError('Unable to load contribution graph')
          setContributions([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    if (username) {
      load()
    }

    return () => {
      cancelled = true
    }
  }, [username])

  return { contributions, loading, error }
}