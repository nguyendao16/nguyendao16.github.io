export const profile = {
  name: 'Đào Khôi Nguyên',
  title: 'Machine Learning and Computer Vision Student',
  headline: 'Building practical computer vision systems.',
  intro:
    'I design and ship applied machine learning projects, technical writeups, and portfolio work that is easy to review and easy to maintain.',
  bio:
    'My focus is practical computer vision, model evaluation, and technical communication. I like turning research ideas into clean, explainable systems that can be presented clearly to recruiters, collaborators, and instructors.',
  email: 'hello@example.com',
  githubUrl: 'https://github.com/username',
  linkedinUrl: 'https://linkedin.com/in/username',
  location: 'Hanoi, Vietnam',
  education: [
    {
      period: '2022 - 2026',
      title: 'Bachelor of Science, Computer Science',
      institution: 'University of Technology',
      description:
        'Coursework in machine learning, computer vision, statistics, and software engineering.',
    },
  ],
  researchInterests: [
    'Computer vision',
    'Model evaluation',
    'Edge inference',
    'Data visualization',
  ],
  skills: [
    'Python',
    'PyTorch',
    'TensorFlow',
    'OpenCV',
    'scikit-learn',
    'MLOps',
    'Data Analysis',
    'Research Writing',
  ],
  timeline: [
    {
      period: '2026',
      title: 'KNN handwriting classification',
      description:
        'Built a compact benchmark comparing cosine and Euclidean distance for handwritten digit recognition.',
    },
    {
      period: '2025',
      title: 'Model comparison study',
      description:
        'Evaluated a set of classical ML models under the same preprocessing and validation pipeline.',
    },
    {
      period: '2024',
      title: 'Data visualization project',
      description:
        'Created an exploratory dashboard to present key patterns in a tabular dataset clearly.',
    },
  ],
  resumeHighlights: [
    'Hands-on experience with applied ML and computer vision workflows',
    'Clear documentation for projects, experiments, and technical findings',
    'Strong emphasis on evaluation, reproducibility, and presentation',
    'Comfortable moving between research ideas and production-minded implementation',
  ],
} as const;
