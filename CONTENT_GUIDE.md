# Content Guide

This site keeps editable content in typed data files and MDX blog posts. The visual components read from these files, so most updates do not require editing page templates.

## 1. Edit Your Name/Bio

Edit `src/data/profile.ts`.

```ts
export const profile: Profile = {
  name: 'Your Name',
  title: 'Artificial Intelligence Student',
  headline: 'Short homepage headline.',
  intro: 'Short homepage introduction.',
  bio: 'Longer About page biography.',
  location: 'Hanoi, Vietnam',
};
```

Optional profile fields include `title`, `headline`, `intro`, `bio`, `location`, `avatar`, `education`, `researchInterests`, `skills`, `experience`, and `resumeHighlights`.

To update experience, keep the company-level structure and add roles underneath it:

```ts
experience: [
  {
    company: 'Company Name',
    type: 'Part-time',
    location: 'Remote',
    overallPeriod: 'Jun 2025 - Dec 2025',
    overallDuration: '7 mos',
    roles: [
      {
        title: 'AI Engineer',
        period: 'Jul 2025 - Dec 2025',
        duration: '6 mos',
        skills: ['LangChain', 'Git'],
        description: 'Optional role description.',
      },
    ],
  },
],
```

## 2. Update Projects

Edit `src/data/projects.ts`.

```ts
export const projects: Project[] = [
  {
    title: 'Project title',
    description: 'Short summary.',
    problemStatement: 'What problem this solves.',
    techStack: ['Python', 'PyTorch'],
    metrics: [{ label: 'Accuracy', value: '97%' }],
    githubUrl: 'https://github.com/username/repo',
    demoUrl: 'https://example.com',
    image: '/images/projects/example.svg',
    imageAlt: 'Project screenshot description',
    tags: ['ML', 'Computer Vision'],
    featured: true,
  },
];
```

Only `title` and `description` are required. URLs, images, metrics, tags, and tech stack are optional.

## 3. Add A Blog Post

Create a new `.mdx` file in `src/content/blog/`.

````mdx
---
title: My New Technical Post
description: Short SEO and listing description.
date: 2026-06-09
updatedDate: 2026-06-10
tags:
  - machine learning
  - python
coverImage: /images/blog/my-post-cover.svg
draft: false
seoTitle: Optional SEO title
seoDescription: Optional SEO description
---

Write the post content here.

$$
y = Wx + b
$$

```python
print("hello")
```
````

Required frontmatter: `title`, `description`, and `date`. Optional frontmatter: `updatedDate`, `tags`, `coverImage`, `draft`, `seoTitle`, and `seoDescription`.

## 4. Add Images

Put static images in `public/images/`.

Examples:
- Blog images: `public/images/blog/my-image.png`
- Project images: `public/images/projects/my-project.svg`
- Profile images: `public/images/profile/avatar.png`

Reference them with root-relative paths:

```ts
image: '/images/projects/my-project.svg'
```

```mdx
![Alt text](/images/blog/my-image.png)
```

## 5. Update `resume.pdf`

Replace this file:

`public/resume/resume.pdf`

If you rename the file, update `src/data/site.ts`:

```ts
resume: {
  pdfPath: '/resume/resume.pdf',
  pdfDownloadName: 'resume.pdf',
  pdfTitle: 'Resume PDF preview',
}
```

## 6. Test Locally

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Run the production build:

```bash
npm run build
```

## 7. Deploy To GitHub Pages

This repo is configured for a GitHub user site:

`https://USERNAME.github.io`

Deployment runs from `.github/workflows/deploy.yml` when you push to `main`.

In GitHub:
1. Open repository settings.
2. Go to Pages.
3. Set the source to GitHub Actions.
4. Push to `main` or run the workflow manually.

If you deploy as a project site, update `astro.config.mjs`:

```js
site: 'https://USERNAME.github.io/REPO_NAME',
base: '/REPO_NAME/',
```

Then review root-relative image, resume, and internal links before deploying.

## Other Editable Data

Site labels, SEO defaults, page copy, resume labels, contact form labels, and footer text live in `src/data/site.ts`.

Social/contact links live in `src/data/socials.ts`.

Navigation labels live in `src/data/navigation.ts`.
