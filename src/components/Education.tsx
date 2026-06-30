import { education } from '../data/resume'

export function Education() {
  return (
    <section
      id="education"
      aria-label="Education"
      className="page-section border-t border-border"
    >
      <div className="mx-auto max-w-6xl page-inner flex flex-col gap-6 sm:gap-10">
        <div className="flex max-w-2xl flex-col gap-3">
          <h2 className="text-title">Education</h2>
          <p className="text-body text-muted">
            My formal education path.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {education.map((entry) => (
            <article
              key={entry.id}
              className="flex flex-col gap-2 border border-border p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:p-6"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <h3 className="text-headline text-balance max-sm:text-[1.125rem]">{entry.school}</h3>
                <p className="text-body text-muted">{entry.detail}</p>
              </div>
              <span className="text-mono text-caption text-muted shrink-0 sm:whitespace-nowrap">
                {entry.period}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}