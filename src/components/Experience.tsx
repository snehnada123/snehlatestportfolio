import { experience } from '../data/resume'

export function Experience() {
  return (
    <section
      id="experience"
      aria-label="Experience"
      className="page-section border-t border-border"
    >
      <div className="mx-auto max-w-6xl page-inner flex flex-col gap-6 sm:gap-10">
        <div className="flex max-w-2xl flex-col gap-3">
          <h2 className="text-title">Experience</h2>
          <p className="text-body text-muted">
            The experience that got my hands dirty.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {experience.map((entry) => (
            <article
              key={entry.id}
              className="flex flex-col gap-4 border border-border p-4 sm:p-6"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex flex-col gap-1">
                  <h3 className="text-headline">{entry.company}</h3>
                  <p className="text-mono text-caption text-muted">{entry.role}</p>
                </div>
                <span className="text-mono text-caption text-terminal">{entry.type}</span>
              </div>

              <p className="text-body text-muted max-w-3xl">{entry.description}</p>

              <ul className="flex flex-wrap gap-1.5 sm:gap-2" aria-label="Technologies">
                {entry.tags.map((tag) => (
                  <li key={tag} className="tag-pill max-sm:text-[0.625rem] max-sm:px-2 max-sm:py-0.5">
                    {tag}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}