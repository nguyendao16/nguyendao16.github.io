export type ProjectMetric = {
  label: string;
  value: string;
};

export type Project = {
  title: string;
  description: string;
  problemStatement?: string;
  techStack?: string[];
  metrics?: ProjectMetric[];
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
  imageAlt?: string;
  href?: string;
  tags?: string[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    title: 'Handwriting classification with KNN',
    description:
      'A compact image classification workflow for handwritten digit recognition with interpretable distance-based decisions.',
    problemStatement:
      'Build a fast baseline that can classify handwritten digits from grayscale inputs while remaining easy to explain in class presentations and portfolio reviews.',
    techStack: ['Python', 'scikit-learn', 'NumPy', 'Pandas'],
    metrics: [
      { label: 'Validation accuracy', value: '97.4%' },
      { label: 'Inference time', value: '18 ms/sample' },
      { label: 'Model size', value: 'Under 1 MB' },
      { label: 'Dataset', value: 'MNIST subset' },
    ],
    githubUrl: 'https://github.com/username/handwriting-knn',
    demoUrl: 'https://example.com/demo/handwriting-knn',
    image: '/images/projects/handwriting-knn.svg',
    imageAlt: 'Handwriting classification preview',
    href: '/projects#handwriting-classification-with-knn',
    tags: ['ML', 'Classification', 'KNN'],
    featured: true,
  },
  {
    title: 'Machine learning model comparison',
    description:
      'A controlled benchmark comparing multiple classical models across the same preprocessing and evaluation pipeline.',
    problemStatement:
      'Compare candidate machine learning models fairly so that selection is driven by measurable performance, not assumptions or convenience.',
    techStack: ['Python', 'scikit-learn', 'Matplotlib', 'Jupyter'],
    metrics: [
      { label: 'Models compared', value: '6' },
      { label: 'Best F1 score', value: '0.91' },
      { label: 'Cross-validation folds', value: '5' },
      { label: 'Reporting', value: 'Auto-generated' },
    ],
    githubUrl: 'https://github.com/username/model-comparison',
    demoUrl: 'https://example.com/demo/model-comparison',
    image: '/images/projects/model-comparison.svg',
    imageAlt: 'Model comparison preview',
    href: '/projects#machine-learning-model-comparison',
    tags: ['Analytics', 'Evaluation', 'Experiment'],
    featured: true,
  },
  {
    title: 'Data visualization and analytics project',
    description:
      'An exploratory dashboard that turns raw tabular data into a readable story for technical and non-technical viewers.',
    problemStatement:
      'Surface useful patterns in the dataset through visuals and summary metrics so the results are easy to scan during a recruiter review.',
    techStack: ['Python', 'Plotly', 'Pandas', 'SQL'],
    metrics: [
      { label: 'Charts shipped', value: '12' },
      { label: 'Data rows', value: '48k' },
      { label: 'Dashboard views', value: 'Interactive' },
      { label: 'Refresh time', value: 'Near real-time' },
    ],
    githubUrl: 'https://github.com/username/data-analytics',
    demoUrl: 'https://example.com/demo/data-analytics',
    image: '/images/projects/data-analytics.svg',
    imageAlt: 'Data visualization preview',
    href: '/projects#data-visualization-and-analytics-project',
    tags: ['Visualization', 'Dashboard', 'Analytics'],
    featured: true,
  },
];
