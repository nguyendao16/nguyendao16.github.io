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

## FPT chart on the homepage

The chart appears above “Bài viết mới nhất”. It shows 60 sessions of actual closing prices; the latest close compared with that session's official reference sets the whole history region's color. The dashed tail shows only the model's direction, without inventing a target price or return. “Không tăng” includes both a decline and an unchanged price.

The private `nguyendao16/stock-predict` workflow renders desktop/mobile PNGs and publishes only these files to `public/fpt/`:

- `history.png`, `history-mobile.png`: history without a forecast.
- `forecast.png`, `forecast-mobile.png`: history with the direction marker.
- `summary.json`: the latest price/change, source/update dates, forecast direction/issue/expiry dates, and aggregate prediction counts. No price series, model files, or credentials.

The browser removes the forecast marker at the target session's close, including when returning to an old tab. New releases appear on a page load after the normal Pages deployment. A failed refresh leaves the previous published files intact. PNGs do not expose a downloadable source dataset or per-point tooltips, although visitors can still read or approximate prices from the image.

Automatic publication uses a dedicated SSH write deploy key for this repository. Its private half is stored only as `FPT_SITE_DEPLOY_KEY` in the **private stock-predict repository's Actions secrets**; the website needs no private-repository access. Do not store a personal GitHub token in the workflow. After a successful weekly CD, and at 16:30/18:30 Vietnam time on weekdays, the private workflow refreshes prices, runs inference, and commits the five public outputs. The existing Pages workflow handles that commit.

Validate chart parsing and expiry with `node --test tests/fpt-chart.test.mjs`; run `npm run build` for Astro type checking and the static build.

The counter beside the chart (below it on mobile) shows correct/incorrect totals across all forecasts actually issued by the pipeline. Pending and unscorable sessions are excluded from both totals. The private pipeline scores the original forecasts after each target session closes and its label is available, then publishes only four `performance` counts: `correct`, `incorrect`, `pending`, `unscorable`. It includes earlier model versions, never backtests or hypothetical forecasts; rerunning does not double-count records.

