import { Download } from 'lucide-react'
import { useState } from 'react'
import { site } from '../data/site'

const linkClass = 'hero-link hero-link--primary'

export function ResumeButton() {
  const [notice, setNotice] = useState<string | null>(null)

  if (site.resume.available) {
    return (
      <a href={site.resume.path} download className={linkClass}>
        <Download className="h-4 w-4" aria-hidden="true" />
        Resume
      </a>
    )
  }

  const handleClick = () => {
    setNotice(site.resume.unavailableMessage)
    window.setTimeout(() => setNotice(null), 3000)
  }

  return (
    <span className="flex w-full min-w-0 flex-col gap-1">
      <button type="button" onClick={handleClick} className={linkClass}>
        <Download className="h-4 w-4" aria-hidden="true" />
        Resume
      </button>
      {notice && (
        <span className="text-mono text-caption text-muted" role="status" aria-live="polite">
          {notice}
        </span>
      )}
    </span>
  )
}