import { ArrowDown, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { heroQuotes } from '../data/quotes'
import { site } from '../data/site'
import { ResumeButton } from './ResumeButton'
import { TimeOnEarth } from './TimeOnEarth'
import { NameTypeWriter, QuoteTypeWriter, SimpleTypeWriter } from './TypeWriter'

const socialLinkClass =
  'text-mono text-small text-muted transition-colors hover:text-foreground'

const socialLinks = [
  { label: 'GitHub', href: site.links.github },
  { label: 'LinkedIn', href: site.links.linkedin },
  { label: 'X', href: site.links.x },
] as const

export function Hero() {
  const [nameDone, setNameDone] = useState(false)

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="page-section border-b border-border"
    >
      <div className="mx-auto max-w-6xl page-inner flex flex-col gap-5 sm:gap-8">
        <h4 className="text-mono text-caption text-muted min-h-6">
          <SimpleTypeWriter text={site.home.intro} delay={80} />
        </h4>

        <h1 className="hero-name text-display max-w-3xl min-h-[1.15em] text-foreground">
          <NameTypeWriter onComplete={() => setNameDone(true)} />
        </h1>

        <TimeOnEarth />

        <p className="max-w-2xl text-body text-muted leading-relaxed">
          {site.home.paragraph}
        </p>

        <div className="flex flex-col gap-4 sm:gap-5">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-mono text-small font-medium text-foreground underline underline-offset-4 decoration-1 hover:text-terminal transition-colors"
              >
                {site.home.exploreLabel}
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </a>

              <ResumeButton />
            </div>

            <div
              className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-3 sm:border-t-0 sm:pt-0"
              aria-label="Social links"
            >
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${socialLinkClass} inline-flex items-center gap-2 font-medium text-foreground underline underline-offset-4 decoration-1 hover:text-terminal`}
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <p className="max-w-xl min-h-[5rem] sm:min-h-[4.5rem] text-mono text-small leading-relaxed text-muted">
            <span className="text-terminal" aria-hidden="true">
              //
            </span>{' '}
            <QuoteTypeWriter quotes={heroQuotes} active={nameDone} />
          </p>
        </div>
      </div>
    </section>
  )
}