import type { ReactNode } from 'react'

function isMobilePreview(): boolean {
  return new URLSearchParams(window.location.search).get('mobile') === 'preview'
}

interface MobilePreviewShellProps {
  children: ReactNode
}

export function MobilePreviewShell({ children }: MobilePreviewShellProps) {
  if (!isMobilePreview()) return <>{children}</>

  return (
    <div className="mobile-preview-shell">
      <p className="mobile-preview-shell__label" aria-live="polite">
        Mobile preview — iPhone 13 Pro Max (428px) · remove{' '}
        <code className="mobile-preview-shell__code">?mobile=preview</code> from the URL
      </p>

      <div className="mobile-preview-shell__device" aria-label="Mobile preview frame">
        <div className="mobile-preview-shell__screen">{children}</div>
      </div>
    </div>
  )
}