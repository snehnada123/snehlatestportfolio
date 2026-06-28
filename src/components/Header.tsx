import { site } from '../data/site'
import { ThemeToggle } from './ThemeToggle'

const navClass =
  'px-2 py-1 transition-colors text-muted hover:text-foreground'

export function Header() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only text-mono text-small"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <a
              aria-label={`${site.shortName} — home`}
              href="#hero"
              className="text-mono text-small font-medium tracking-tight text-foreground transition-colors hover:text-terminal"
            >
              <span className="text-terminal" aria-hidden="true">
                ~/
              </span>
              {site.shortName}
            </a>

            <div className="flex items-center gap-3 sm:gap-3">
              <ThemeToggle />

              <nav aria-label="Primary" className="hidden md:block">
                <ul className="flex items-center gap-2 whitespace-nowrap">
                  {site.nav.map((item) => (
                    <li key={item.href}>
                      <a href={item.href} className={navClass}>
                        {item.label}
                      </a>
                    </li>
                  ))}
                  <li>
                    <details className="group relative">
                      <summary className={`${navClass} cursor-pointer list-none transition-colors group-open:text-foreground`}>
                        MORE
                      </summary>
                      <ul className="absolute right-0 top-full z-50 mt-2 min-w-40 border border-border bg-background p-1">
                        {site.navMore.map((item) => (
                          <li key={item.href}>
                            <a href={item.href} className={`block w-full ${navClass}`}>
                              {item.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                </ul>
              </nav>

              <details className="group relative md:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-center border border-border px-3 py-1.5 text-mono text-caption text-muted transition-colors hover:text-foreground group-open:border-foreground group-open:text-foreground">
                  Menu
                </summary>
                <nav
                  aria-label="Primary"
                  className="absolute right-0 top-full z-50 mt-2 min-w-48 border border-border bg-background p-1 shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
                >
                  <ul className="flex flex-col gap-0.5">
                    {[...site.nav, ...site.navMore].map((item) => (
                      <li key={item.href}>
                        <a href={item.href} className={`block w-full ${navClass}`}>
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </details>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}