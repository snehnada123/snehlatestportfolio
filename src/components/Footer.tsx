import { site } from '../data/site'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border" aria-label="Site footer">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3">
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

        <nav aria-label="Footer" className="hidden sm:block">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {[...site.nav, ...site.navMore].map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-mono text-caption text-muted hover:text-foreground transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={site.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-mono text-caption text-muted hover:text-foreground transition-colors"
              >
                github
              </a>
            </li>
            <li>
              <a
                href={site.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-mono text-caption text-muted hover:text-foreground transition-colors"
              >
                linkedin
              </a>
            </li>
            <li>
              <a
                href={site.links.x}
                target="_blank"
                rel="noopener noreferrer"
                className="text-mono text-caption text-muted hover:text-foreground transition-colors"
              >
                x
              </a>
            </li>
          </ul>
        </nav>
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