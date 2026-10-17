export type EducationItem = {
  period?: string;
  title: string;
  institution?: string;
  description?: string;
};

export type ExperienceRole = {
  title?: string;
  period?: string;
  duration?: string;
  skills?: string[];
  description?: string;
  highlights?: string[];
};

export type ExperienceItem = {
  company?: string;
  type?: string;
  location?: string;
  overallPeriod?: string;
  overallDuration?: string;
  roles?: ExperienceRole[];
};

export type ProfileProjectItem = {
  title: string;
  highlights: string[];
  technologies: string[];
  githubUrl?: string;
};

export type SkillGroup = {
  category: string;
  items: string[];
};

export type CertificationItem = {
  title: string;
  date: string;
  url?: string;
};

export type Profile = {
  name: string;
  title?: string;
  headline?: string;
  intro?: string;
  bio?: string;
  location?: string;
  avatar?: {
    src: string;
    alt?: string;
  };
  education?: EducationItem[];
  experience?: ExperienceItem[];
  projects?: ProfileProjectItem[];
  skillGroups?: SkillGroup[];
  skills?: string[];
  certifications?: CertificationItem[];
  resumeHighlights?: string[];
};

export const profile: Profile = {
  name: 'Đào Khôi Nguyên',
  title: 'Computer Science Student | AI Engineer',
  headline: 'Bridging fundamental mathematics, AI models, and robust system architecture.',
  intro:
    'I design and implement AI solutions with a strong focus on first-principles understanding, mathematical logic, and building practical systems from the ground up.',
  bio:
    'I build practical AI systems and end-to-end applications, with hands-on experience in Large Language Models, Retrieval-Augmented Generation (RAG), and stateful multi-channel AI agents. My work spans designing conversational pipelines with LangChain and LangGraph, training custom computer vision models in PyTorch, and integrating scalable backend services using FastAPI, Redis, and PostgreSQL.',
  location: 'Hanoi, Vietnam',
  avatar: {
    src: '/images/profile/avatar.svg',
    alt: 'Đào Khôi Nguyên portrait',
  },
  education: [
    {
      period: '2024 – 2028',
      title: 'Bachelor of Computer Science',
      institution: 'FPT University',
      description:
        'Recognized as "Honorable Student of the Trimester" for 3 trimesters.',
    },
  ],
  experience: [
    {
      company: 'IO Group Vietnam Technology and Education Company Limited',
      overallPeriod: 'July 2025 – December 2025',
      roles: [
        {
          title: 'AI Engineer',
          period: 'July 2025 – December 2025',
          highlights: [
            'Led the design and development of AI chatbot solutions and coordinated technical implementation across the project.',
            'Designed and optimized Retrieval-Augmented Generation (RAG) pipelines to improve retrieval relevance, response accuracy, and system performance.',
            'Deployed scalable multi-channel chatbots using LangChain, LangGraph, FastAPI, Redis, PostgreSQL, REST APIs, and WebSocket.',
          ],
          skills: [
            'LangChain',
            'LangGraph',
            'FastAPI',
            'Redis',
            'PostgreSQL',
            'REST APIs',
            'WebSocket',
          ],
        },
      ],
    },
  ],
  projects: [
    {
      title: 'Personal Hana - Voice-Enabled AI Companion',
      highlights: [
        'Developed a stateful AI companion using LangChain and LangGraph.',
        'Implemented speech-to-text, text-to-speech, and contextual conversations.',
        'Integrated Redis and PostgreSQL for conversation state, persistent data, and vector-based retrieval.',
        'Designed a modular agent architecture supporting persona configuration, tool integration, and future multi-channel deployment.',
      ],
      technologies: [
        'Python',
        'LangChain',
        'LangGraph',
        'Redis',
        'PostgreSQL',
        'RealtimeSTT',
        'TTS',
      ],
    },
    {
      title: 'Personal Custom Multi-Scale Face Detector',
      highlights: [
        'Built and trained a lightweight multi-scale face detector on the WIDER FACE dataset using PyTorch.',
        'Implemented a training pipeline with target encoding, custom loss functions, AdamW optimization, gradient clipping, and checkpointing.',
        'Developed real-time inference using OpenCV, confidence filtering, custom Non-Maximum Suppression, and GPU acceleration.',
      ],
      technologies: [
        'Python',
        'PyTorch',
        'Torchvision',
        'OpenCV',
        'NumPy',
        'CUDA',
      ],
    },
  ],
  skillGroups: [
    {
      category: 'Programming Languages',
      items: ['Python', 'C++'],
    },
    {
      category: 'AI and Machine Learning',
      items: [
        'Large Language Models (LLMs)',
        'Retrieval-Augmented Generation (RAG)',
        'Vector Databases',
        'LangChain',
        'LangGraph',
        'Prompt Engineering',
        'PyTorch',
        'OpenCV',
      ],
    },
    {
      category: 'Backend and Infrastructure',
      items: [
        'FastAPI',
        'Redis',
        'PostgreSQL',
        'REST APIs',
        'WebSocket',
        'Docker',
        'Git',
      ],
    },
  ],
  certifications: [
    {
      title: 'NVIDIA Fundamentals of Deep Learning',
      date: 'August 2026',
    },
    {
      title: 'IBM Introduction to Machine Learning Specialization',
      date: 'July 2026',
    },
    {
      title: 'Software Development Lifecycle Specialization',
      date: 'July 2026',
    },
    {
      title: 'Data Analysis with Python',
      date: 'February 2026',
    },
  ],
  resumeHighlights: [
    'Strong mathematical foundation with active preparation for national-level Olympiad competitions.',
    'Practical experience managing Linux servers, Docker containers, and Nginx reverse proxies.',
    'Unique interdisciplinary background combining medical knowledge with advanced artificial intelligence research.',
  ],
};
