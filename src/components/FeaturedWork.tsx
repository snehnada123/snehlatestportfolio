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

        <div className="projects-grid grid grid-cols-1 gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.id}
              id={project.id}
              className="group relative flex flex-col gap-4 overflow-hidden border border-border bg-background p-4 transition-colors hover:border-foreground focus-within:border-foreground sm:gap-5 sm:p-6"
            >
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-terminal focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label={`View ${project.title} on GitHub`}
              />

              <div className="relative flex min-w-0 items-start justify-between gap-3">
                <h3 className="min-w-0 flex-1 text-headline text-balance transition-colors group-hover:text-foreground">
                  {project.title}
                </h3>
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center text-muted transition-colors group-hover:text-terminal"
                  aria-hidden="true"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>

              <p className="relative text-body text-muted line-clamp-3">
                {project.description}
              </p>

              <div className="relative mt-auto flex flex-wrap items-center justify-between gap-2 pt-2 sm:gap-3">
                <ul className="flex flex-wrap gap-1.5 sm:gap-2" aria-label="Tags">
                  {project.tags.slice(0, 3).map((tag) => (
                    <li key={tag} className="tag-pill max-sm:text-[0.625rem] max-sm:px-2 max-sm:py-0.5">
                      {tag}
                    </li>
                  ))}
                </ul>
                <span className="text-mono text-caption text-muted max-sm:hidden">GitHub</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}