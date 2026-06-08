# AI CV Portfolio Blog

Astro site for a machine learning and computer vision portfolio with a technical blog.

## Local development

```bash
npm install
npm run dev
```

Open the local URL shown by Astro in your browser.

## Build

```bash
npm run build
```

This runs Astro type checking and produces the static site in `dist/`.

## Add a blog post

1. Create a new `.mdx` file in `src/content/blog/`.
2. Add frontmatter with at least:
   - `title`
   - `description`
   - `date`
   - `tags`
3. Optional frontmatter fields:
   - `updatedDate`
   - `coverImage`
   - `draft`
   - `seoTitle`
   - `seoDescription`
4. Write the post in Markdown or MDX.
5. Use these supported features directly in the post:
   - images
   - GIFs
   - embedded videos
   - LaTeX equations with `$$ ... $$`
   - syntax-highlighted code blocks

The blog index and dynamic post routes update automatically from the content collection.

## Update projects

Edit `src/data/projects.ts` to change the project list shown on the Projects page and homepage preview.

Each project supports:
- title
- description
- problem statement
- tech stack
- metrics/results
- GitHub link
- demo link
- image
- tags

## Deployment to GitHub Pages

This repository is configured as a **GitHub user site**:

`https://USERNAME.github.io`

Deployment is handled by the workflow in `.github/workflows/deploy.yml`.

### Required GitHub setup

1. Push the repository to GitHub.
2. In the repository settings, enable GitHub Pages.
3. Set the Pages source to **GitHub Actions**.
4. Push to `main` or run the workflow manually.

### Important config values

The Astro config in `astro.config.mjs` is already set for a user site:

```js
site: 'https://USERNAME.github.io'
base: '/'
```

If you deploy as a **project site** instead of a user site, change these values:

```js
site: 'https://USERNAME.github.io/REPO_NAME'
base: '/REPO_NAME/'
```

If you change `base`, update any hardcoded root-relative links or asset paths that should live under the new base path.

### Deployment flow

The GitHub Actions workflow:
1. checks out the repo
2. installs dependencies with `npm ci`
3. runs `npm run build`
4. uploads the `dist/` folder
5. deploys the artifact to GitHub Pages

