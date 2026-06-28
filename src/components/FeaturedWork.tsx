import { ArrowUpRight } from 'lucide-react'
import { projects } from '../data/projects'
import { site } from '../data/site'

export function FeaturedWork() {
  return (
    <section
      id="projects"
      aria-label="Projects"
      className="page-section border-t border-border"
    >
      <div className="mx-auto max-w-6xl page-inner flex flex-col gap-6 sm:gap-10">
        <div className="flex max-w-2xl flex-col gap-3">
          <h2 className="text-title">{site.home.projectsTitle}</h2>
          <p className="text-body text-muted">{site.home.projectsHint}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.id}
              id={project.id}
              className="group relative flex flex-col gap-4 border border-border bg-background p-4 transition-colors hover:border-foreground focus-within:border-foreground sm:gap-5 sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-headline transition-colors group-hover:text-foreground">
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="outline-none after:absolute after:inset-0 after:content-['']"
                  >
                    {project.title}
                  </a>
                </h3>
                <ArrowUpRight
                  className="h-4 w-4 shrink-0 text-muted transition-all group-hover:text-terminal group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </div>

              <p className="text-body text-muted line-clamp-3">
                {project.description}
              </p>

              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
                <ul className="flex flex-wrap gap-2" aria-label="Tags">
                  {project.tags.slice(0, 3).map((tag) => (
                    <li
                      key={tag}
                      className="text-mono text-caption border border-border px-2 py-0.5 text-muted whitespace-nowrap"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                <span className="text-mono text-caption text-muted">GitHub</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}