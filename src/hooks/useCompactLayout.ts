import { useEffect, useState } from 'react'
import { isMobilePreview } from '../utils/mobilePreview'

export function shouldUseCompactLayout(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 639px)').matches || isMobilePreview()
}

export function useCompactLayout(): boolean {
  const [compact, setCompact] = useState(shouldUseCompactLayout)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 639px)')
    const update = () => setCompact(shouldUseCompactLayout())
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return compact
}