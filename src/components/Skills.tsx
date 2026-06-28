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
            <span className="sm:hidden">Tools I build with.</span>
            <span className="hidden sm:inline">
              Languages, infrastructure, and frameworks I use to build backend systems and AI
              applications.
            </span>
          </p>
        </div>

        <ul className="skill-list" aria-label="Skills">
          {skills.map((skill) => (
            <li key={skill} className="tag-pill tag-pill--skill">
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}