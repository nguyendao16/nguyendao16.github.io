export type SeoConfig = {
  defaultTitle: string;
  titleTemplate: string;
  description: string;
  themeColor: string;
  siteUrl: string;
};

export type HeroImage = {
  src: string;
  alt: string;
};

export type HomePageContent = {
  seoTitle: string;
  eyebrow?: string;
  latestPostsTitle: string;
  contactCtaLabel: string;
  heroImages: {
    desktop: HeroImage;
    mobile: HeroImage;
  };
};

export type PageContent = {
  title: string;
  description?: string;
};

export type AboutPageContent = PageContent & {
  eyebrow?: string;
  educationTitle: string;
  skillsTitle: string;
  researchTitle: string;
  experienceTitle: string;
};

export type ContactSubject = {
  label: string;
  value: string;
};

export type ContactPageContent = PageContent & {
  formLabels?: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
  formPlaceholders?: {
    name?: string;
    email?: string;
    message?: string;
  };
  directTitle?: string;
  directDescription?: string;
  linksTitle?: string;
  noteTitle?: string;
  note?: string;
  formSubmitLabel?: string;
  subjects?: ContactSubject[];
};

export type ResumePageContent = PageContent & {
  downloadLabel: string;
  contactLabel: string;
  highlightsTitle: string;
  summaryLabel: string;
  tagsTitle: string;
  tags?: string[];
  pdfPath: string;
  pdfDownloadName: string;
  pdfTitle: string;
};

export type FooterContent = {
  brand: string;
  description?: string;
  copyright: string;
};

export type SiteContent = {
  brand: string;
  seo: SeoConfig;
  blogPost: {
    eyebrow: string;
    previousLabel: string;
    nextLabel: string;
    noPreviousLabel: string;
    noNextLabel: string;
    tocLabel: string;
    tocEmptyLabel: string;
    backLabel: string;
  };
  pages: {
    home: HomePageContent;
    about: AboutPageContent;
    projects: PageContent & {
      ctaResumeLabel: string;
      ctaContactLabel: string;
      featuredTitle: string;
      featuredDescription?: string;
    };
    blog: PageContent & {
      eyebrow?: string;
      emptyState?: string;
    };
    resume: ResumePageContent;
    contact: ContactPageContent;
  };
  footer: FooterContent;
};

export const site: SiteContent = {
  brand: 'AI CV Portfolio',
  seo: {
    defaultTitle: 'AI CV Portfolio',
    titleTemplate: '%s | AI CV Portfolio',
    description: 'AI and computer vision portfolio and technical blog.',
    themeColor: '#ffffff',
    siteUrl: 'https://USERNAME.github.io',
  },
  blogPost: {
    eyebrow: 'Technical blog',
    previousLabel: 'Previous post',
    nextLabel: 'Next post',
    noPreviousLabel: 'No earlier post available.',
    noNextLabel: 'No newer post available.',
    tocLabel: 'Table of contents',
    tocEmptyLabel: 'Headings will appear here when the article includes sections.',
    backLabel: 'Back to blog',
  },
  pages: {
    home: {
      seoTitle: 'Home',
      eyebrow: 'AI CV Portfolio',
      latestPostsTitle: 'Bài viết mới nhất',
      contactCtaLabel: 'Liên hệ',
      heroImages: {
        desktop: {
          src: '/images/home/hero-desktop.svg',
          alt: 'AI Neural Network Visualization',
        },
        mobile: {
          src: '/images/home/hero-mobile.svg',
          alt: 'Portrait of an AI Specialist',
        },
      },
    },
    about: {
      title: 'About',
      eyebrow: 'About me',
      description: 'Profile, education, skills, research interests, and experience.',
      educationTitle: 'Education',
      skillsTitle: 'Skills',
      researchTitle: 'Research interests',
      experienceTitle: 'Experience',
    },
    projects: {
      title: 'Projects',
      description:
        'Selected projects that show problem framing, model selection, evaluation, and presentation.',
      ctaResumeLabel: 'Resume',
      ctaContactLabel: 'Contact',
      featuredTitle: 'Featured projects',
      featuredDescription:
        'Each project includes the problem statement, tech stack, results, and links for deeper review.',
    },
    blog: {
      title: 'Blog',
      description: 'Technical notes, project writeups, and machine learning articles.',
      eyebrow: 'Blog',
      emptyState: 'Blog posts will appear here once they are added to src/content/blog.',
    },
    resume: {
      title: 'Resume',
      description: 'Download the PDF or review the key points that appear in the portfolio summary.',
      downloadLabel: 'Download PDF',
      contactLabel: 'Contact',
      highlightsTitle: 'Key highlights',
      summaryLabel: 'Summary',
      tagsTitle: 'Selected tags',
      tags: ['Machine learning', 'Computer vision', 'Evaluation', 'Technical writing'],
      pdfPath: '/resume/resume.pdf',
      pdfDownloadName: 'resume.pdf',
      pdfTitle: 'Resume PDF preview',
    },
    contact: {
      title: 'Liên hệ',
      description:
        'Get in touch for collaborations, internships, project feedback, or research discussions.',
      formLabels: {
        name: 'Name',
        email: 'Email',
        subject: 'Subject',
        message: 'Message',
      },
      formPlaceholders: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'How can I help?',
      },
      directTitle: 'Direct',
      directDescription:
        'Fastest way to reach me for project questions or collaboration ideas.',
      linksTitle: 'Links',
      noteTitle: 'Note',
      note:
        'I do not use a backend contact form. This page opens your mail client so messages stay simple and portable.',
      formSubmitLabel: 'Send message',
      subjects: [
        { label: 'Collaboration', value: 'Collaboration' },
        { label: 'Internship', value: 'Internship' },
        { label: 'Project feedback', value: 'Project feedback' },
        { label: 'Research discussion', value: 'Research discussion' },
      ],
    },
  },
  footer: {
    brand: 'AI CV Portfolio',
    description: 'Machine learning and computer vision portfolio for recruiters and collaborators.',
    copyright: '© 2026 AI CV Portfolio. All rights reserved.',
  },
};
