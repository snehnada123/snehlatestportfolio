import { site } from '../data/site'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border" aria-label="Site footer">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 sm:px-6 sm:py-10">
        {site.availability.open && (
          <p className="inline-flex items-center gap-2 text-mono text-caption text-muted">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 rounded-full bg-terminal"
            />
            <span className="sm:hidden">Open to work</span>
            <span className="hidden sm:inline">{site.availability.label}</span>
          </p>
        )}
        <p className="text-mono text-caption text-muted">
          <span aria-hidden="true" className="text-terminal">
            $
          </span>{' '}
          <a
            href={`mailto:${site.email}`}
            className="text-foreground underline underline-offset-4 decoration-1 hover:text-terminal transition-colors"
          >
            {site.email}
          </a>
        </p>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:gap-2 sm:px-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-mono text-caption text-muted">
            © {year} {site.author}. All rights reserved.
          </p>
          <p className="footer-blessing text-mono text-caption text-muted">
            Built with love and with the blessings of my mom (Nita)
          </p>
        </div>
      </div>
    </footer>
  )
}