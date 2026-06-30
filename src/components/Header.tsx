import { site } from '../data/site'
import { ThemeToggle } from './ThemeToggle'

const navClass =
  'nav-link px-3 py-2 transition-colors text-muted hover:text-foreground'

const navItems = [...site.nav, ...site.navMore]

function closeMobileMenu() {
  const menu = document.getElementById('mobile-nav')
  if (menu instanceof HTMLDetailsElement) menu.open = false
}

export function Header() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only text-mono text-small">
        Skip to content
      </a>

      <header className="site-header sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
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

            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />

              <nav aria-label="Primary" className="hidden md:block">
                <ul className="flex items-center gap-0.5 whitespace-nowrap">
                  {site.nav.map((item) => (
                    <li key={item.href}>
                      <a href={item.href} className={navClass}>
                        {item.label}
                      </a>
                    </li>
                  ))}
                  <li>
                    <details className="group relative">
                      <summary
                        className={`${navClass} cursor-pointer list-none transition-colors group-open:text-foreground`}
                      >
                        MORE
                      </summary>
                      <ul className="nav-dropdown absolute right-0 top-full z-50 mt-2 min-w-40 p-1">
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

              <details id="mobile-nav" className="group relative md:hidden">
                <summary className="mobile-menu-btn">
                  Menu
                </summary>
                <div
                  className="mobile-nav-backdrop fixed inset-0 z-40 bg-background/70 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-150 group-open:opacity-100 group-open:pointer-events-auto"
                  onClick={closeMobileMenu}
                  aria-hidden="true"
                />
                <nav
                  aria-label="Primary"
                  className="mobile-nav-panel nav-dropdown z-50 p-1 shadow-lg"
                >
                  <ul className="flex flex-col">
                    {navItems.map((item) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          className={`mobile-nav-link ${navClass}`}
                          onClick={closeMobileMenu}
                        >
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