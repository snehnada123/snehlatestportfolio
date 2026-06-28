import { Download } from 'lucide-react'
import { useState } from 'react'
import { site } from '../data/site'

const linkClass =
  'inline-flex items-center gap-2 text-mono text-small font-medium text-foreground underline underline-offset-4 decoration-1 hover:text-terminal transition-colors'

export function ResumeButton() {
  const [notice, setNotice] = useState<string | null>(null)

  if (site.resume.available) {
    return (
      <a href={site.resume.path} download className={linkClass}>
        <Download className="h-4 w-4" aria-hidden="true" />
        Download resume
      </a>
    )
  }

  const handleClick = () => {
    setNotice(site.resume.unavailableMessage)
    window.setTimeout(() => setNotice(null), 3000)
  }

  return (
    <span className="inline-flex flex-col gap-1">
      <button type="button" onClick={handleClick} className={linkClass}>
        <Download className="h-4 w-4" aria-hidden="true" />
        Download resume
      </button>
      {notice && (
        <span className="text-mono text-caption text-muted" role="status" aria-live="polite">
          {notice}
        </span>
      )}
    </span>
  )
}