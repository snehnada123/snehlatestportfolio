import { ArrowRight, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { heroQuotes } from '../data/quotes'
import { site } from '../data/site'
import { ResumeButton } from './ResumeButton'
import { TimeOnEarth } from './TimeOnEarth'
import { NameTypeWriter, QuoteTypeWriter, SimpleTypeWriter } from './TypeWriter'

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

        <h1 className="text-display max-w-3xl min-h-[1.15em] text-foreground">
          <NameTypeWriter onComplete={() => setNameDone(true)} />
        </h1>

        <TimeOnEarth />

        <p className="max-w-2xl text-body text-muted leading-relaxed">
          {site.home.paragraph}
        </p>

        <div className="flex flex-col gap-4 sm:gap-5">
          <div className="hero-actions">
            <div className="hero-actions__primary">
              <a
                href="#contact"
                className="hero-link hero-link--primary"
              >
                {site.home.exploreLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <ResumeButton />
            </div>

            <div className="hero-actions__socials" aria-label="Social links">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-link hero-link--social"
                >
                  <ExternalLink
                    className="hero-link__icon h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <p className="hero-quote text-mono text-small leading-relaxed text-muted">
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