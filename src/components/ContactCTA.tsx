import { ArrowRight, ExternalLink } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { site } from '../data/site'

const MAX_MESSAGE_LENGTH = 4000
const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${encodeURIComponent(site.email)}`

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const directLinks = [
  {
    label: 'Email',
    value: site.email,
    href: `mailto:${site.email}`,
    external: false,
  },
  {
    label: 'GitHub',
    value: 'github.com/snehnada123',
    href: site.links.github,
    external: true,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/snehnada',
    href: site.links.linkedin,
    external: true,
  },
  {
    label: 'X',
    value: 'x.com/SnehNada',
    href: site.links.x,
    external: true,
  },
]

export function ContactCTA() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [company, setCompany] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    if (company.trim()) return

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedMessage = message.trim()

    if (trimmedName.length < 2 || trimmedName.length > 80) {
      setErrorMessage('Name must be between 2 and 80 characters.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    if (!trimmedMessage) {
      setErrorMessage('Message cannot be empty.')
      return
    }

    setStatus('submitting')

    try {
      const response = await fetch(FORMSUBMIT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
          _subject: `Portfolio message from ${trimmedName}`,
          _captcha: 'false',
        }),
      })

      if (!response.ok) {
        throw new Error('Request failed')
      }

      setStatus('success')
      setName('')
      setEmail('')
      setMessage('')
    } catch {
      setStatus('error')
      setErrorMessage('Something went wrong. Please email me directly instead.')
    }
  }

  return (
    <section
      id="contact"
      aria-label="Contact"
      className="page-section border-t border-border"
    >
      <div className="mx-auto max-w-6xl page-inner flex flex-col gap-6 sm:gap-10">
        <div className="flex max-w-2xl flex-col gap-3">
          <h2 className="text-title">{site.home.ctaTitle}</h2>
          <p className="text-body text-muted leading-relaxed">
            <span className="sm:hidden">Open to AI products, dev tools, and niche workflows.</span>
            <span className="hidden sm:inline">{site.home.ctaBody}</span>
          </p>
        </div>

        <div className="grid min-w-0 gap-8 sm:gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div className="contact-form-shell min-w-0 flex flex-col gap-5 sm:gap-6">
            <h3 className="text-headline">
              <span className="text-terminal" aria-hidden="true">
                →
              </span>{' '}
              send a message
            </h3>

            {status === 'success' ? (
              <div className="flex flex-col gap-4">
                <p className="text-body text-foreground">Message sent successfully.</p>
                <p className="text-body text-muted">
                  Thanks for reaching out — I&apos;ll get back to you at the email you provided.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="inline-flex w-fit items-center gap-2 text-mono text-small text-muted underline underline-offset-4 decoration-1 hover:text-foreground transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex w-full min-w-0 flex-col gap-5" noValidate>
                <div className="sr-only" aria-hidden="true">
                  <label htmlFor="company">Company</label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-mono text-caption text-muted">
                    Name
                    <span className="hidden normal-case tracking-normal text-muted sm:inline">
                      {' '}
                      · 2–80 characters
                    </span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={80}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="contact-input"
                    disabled={status === 'submitting'}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-mono text-caption text-muted">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="contact-input"
                    disabled={status === 'submitting'}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="message" className="text-mono text-caption text-muted">
                      Message
                    </label>
                    <span className="text-mono text-caption text-muted">
                      {message.length} / {MAX_MESSAGE_LENGTH}
                    </span>
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    maxLength={MAX_MESSAGE_LENGTH}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    className="contact-input contact-textarea"
                    disabled={status === 'submitting'}
                  />
                </div>

                {errorMessage && (
                  <p className="text-mono text-caption text-terminal" role="alert">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="inline-flex w-full items-center justify-center gap-2 border border-foreground bg-foreground px-5 py-3.5 text-mono text-small font-medium text-background transition-colors hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit sm:justify-start"
                >
                  {status === 'submitting' ? 'Sending...' : 'Send message'}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </form>
            )}
          </div>

          <div className="contact-direct-shell min-w-0 flex flex-col gap-5 border-t border-border pt-6 sm:gap-6 sm:pt-8 lg:border-t-0 lg:pt-0">
            <h3 className="text-headline">
              <span className="text-terminal" aria-hidden="true">
                →
              </span>{' '}
              or reach out directly
            </h3>

            <ul className="contact-direct-grid sm:hidden" aria-label="Direct contact links">
              {directLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="contact-direct-link"
                  >
                    {link.external ? (
                      <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                    ) : (
                      <span className="text-terminal" aria-hidden="true">
                        $
                      </span>
                    )}
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <ul className="hidden flex-col gap-4 sm:flex" aria-label="Direct contact links">
              {directLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    className="group inline-flex items-start gap-3 text-mono text-small text-muted transition-colors hover:text-foreground"
                  >
                    {link.external ? (
                      <ExternalLink
                        className="mt-0.5 h-4 w-4 shrink-0 transition-colors group-hover:text-terminal"
                        aria-hidden="true"
                      />
                    ) : (
                      <span className="text-terminal mt-0.5" aria-hidden="true">
                        $
                      </span>
                    )}
                    <span>
                      <span className="text-caption text-muted">{link.label}</span>
                      <span className="block text-foreground underline underline-offset-4 decoration-1 transition-colors group-hover:text-terminal">
                        {link.value}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}