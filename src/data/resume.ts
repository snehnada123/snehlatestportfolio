export interface EducationEntry {
  id: string
  school: string
  period: string
  detail: string
}

export interface ExperienceEntry {
  id: string
  company: string
  role: string
  type: string
  description: string
  tags: string[]
}

export const education: EducationEntry[] = [
  {
    id: 'gcet',
    school: 'G.H. Patel College of Engineering and Technology, Anand',
    period: '2022–2026',
    detail: "Bachelor's in Information Technology",
  },
  {
    id: 'allen',
    school: 'Allen Career Institute',
    period: '2019–2022',
    detail: 'Higher secondary preparation',
  },
  {
    id: 'radiant',
    school: 'Radiant English Academy',
    period: '2010–2019',
    detail: 'Schooling',
  },
]

export const experience: ExperienceEntry[] = [
  {
    id: 'destinova',
    company: 'Destinova AI Labs',
    role: 'Backend Engineer / AI Engineer',
    type: 'Internship',
    description:
      'Built and maintained backend systems and AI workflows, working across API development, model integration, and deployment pipelines.',
    tags: ['FastAPI', 'Python', 'Git', 'GitHub', 'Docker'],
  },
]