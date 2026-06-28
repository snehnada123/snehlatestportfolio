export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  href: string
  category: string
}

export const projects: Project[] = [
  {
    id: 'knovara',
    title: 'Knovara',
    description:
      'Full-stack AI knowledge base — FastAPI backend, React frontend, RAG search, and chat over your own documents.',
    tags: ['FastAPI', 'React', 'RAG', 'Python', 'TypeScript'],
    href: 'https://github.com/snehnada123/knovara',
    category: 'software',
  },
  {
    id: 'multi-agent-workspace',
    title: 'Multi-Agent Research Workspace',
    description:
      'Python experiments with autonomous agent workflows for research tasks and strategy planning.',
    tags: ['Python', 'LLMs', 'Agents', 'Automation'],
    href: 'https://github.com/snehnada123/Multi-Agent-AI-Workspace-for-Autonomous-Research-and-Strategy-Planning',
    category: 'ai-ml',
  },
  {
    id: 'indian-startup-analysis',
    title: 'Indian Startup Analysis',
    description:
      'Streamlit app that explores Indian startup funding data with company and investor views, charts, and sector breakdowns.',
    tags: ['Streamlit', 'Pandas', 'Python', 'Data'],
    href: 'https://github.com/snehnada123/Indian-Startup-Analysis',
    category: 'research',
  },
  {
    id: 'yt-sentiment',
    title: 'YouTube Comment Sentiment',
    description:
      'ML project that classifies YouTube comment sentiment — built to learn end-to-end NLP pipelines on real messy text.',
    tags: ['Python', 'ML', 'NLP', 'Classification'],
    href: 'https://github.com/snehnada123/yt-comment-sentiment-analysis',
    category: 'experiments',
  },
]