export const profile = {
  name: 'Đào Khôi Nguyên',
  title: 'Artificial Intelligence Student',
  headline: 'Bridging fundamental mathematics, AI models, and robust system architecture.',
  intro:
    'I design and implement AI solutions with a strong focus on first-principles understanding, mathematical logic, and building practical systems from the ground up.',
  bio:
    'With a foundational background transitioning from medicine to Artificial Intelligence, my core focus lies in Deep Learning, Reinforcement Learning, and Computer Vision. I am passionate about understanding the mathematical core of algorithms—from linear algebra to statistical distributions—and translating them into robust software. Beyond training models, I actively manage Linux environments, build backend middleware, and work with low-level data structures to ensure my systems run on solid infrastructure.',
  email: 'daokhoinguyen.go@gmail.com',
  githubUrl: 'https://github.com/nguyendao16',
  linkedinUrl: 'https://www.linkedin.com/in/nguyendao16/',
  location: 'Hanoi, Vietnam',
  education: [
    {
      period: '2024 - 2028',
      title: 'Bachelor of Artificial Intelligence',
      institution: 'FPT University',
      description:
        'Rigorous coursework in Deep Learning, Computer Vision, and core mathematics. Actively preparing for the National Mathematics Olympiad.',
    },
    {
      period: 'Previous',
      title: 'Medical Studies (Foundation)',
      institution: 'Thai Nguyen University of Medicine and Pharmacy',
      description:
        'Completed foundational medical studies, providing a unique perspective for handling and authenticating healthcare datasets in AI research.',
    }
  ],
  researchInterests: [
    'Deep Learning & Reinforcement Learning',
    'Computer Vision',
    'Healthcare Datasets & Medical AI',
    'Mathematical Modeling'
  ],
  skills: [
    'Python',
    'C++',
    'Linux/Debian System Admin',
    'Docker',
    'Calculus & Linear Algebra',
    'Deep Learning Frameworks'
  ],
  workExperience: [
    {
      company: '10 Group Vietnam Technology And Education Company Limited',
      type: 'Part-time',
      location: 'Remote',
      overallPeriod: 'Jun 2025 - Dec 2025',
      overallDuration: '7 mos',
      roles: [
        {
          title: 'Automation Architect',
          period: 'Jun 2025 - Dec 2025',
          duration: '7 mos',
          skills: ['Python (Programming Language)', 'n8n'],
          description: '' // Optional description for this specific role
        },
        {
          title: 'AI Engineer',
          period: 'Jul 2025 - Dec 2025',
          duration: '6 mos',
          skills: ['LangChain', 'Git'],
          description: '' // Optional description for this specific role
        }
      ]
    },
  ],
  resumeHighlights: [
    'Strong mathematical foundation with active preparation for national-level Olympiad competitions.',
    'Practical experience managing Linux servers, Docker containers, and Nginx reverse proxies.',
    'Unique interdisciplinary background combining medical knowledge with advanced artificial intelligence research.'
  ],
} as const;