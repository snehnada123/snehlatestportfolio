import { skills } from '../data/skills'

export function Skills() {
  return (
    <section
      id="skills"
      aria-label="Skills"
      className="page-section border-t border-border"
    >
      <div className="mx-auto max-w-6xl page-inner flex flex-col gap-6 sm:gap-10">
        <div className="flex max-w-2xl flex-col gap-3">
          <h2 className="text-title">Skills</h2>
          <p className="text-body text-muted">
            Languages, infrastructure, and frameworks I use to build backend systems and AI
            applications.
          </p>
        </div>

        <ul className="flex flex-wrap gap-2" aria-label="Skills">
          {skills.map((skill) => (
            <li
              key={skill}
              className="text-mono text-caption border border-border px-3 py-1.5 text-muted"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}