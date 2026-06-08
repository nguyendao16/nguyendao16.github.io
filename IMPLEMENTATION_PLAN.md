# AI Portfolio Blog Implementation Plan

> **For agentic workers:** REQUIRED: Use `$subagent-driven-development` or `$executing-plans` to implement this plan. This file is a planning artifact only; do not treat it as completed implementation.

**Goal:** Build a static Astro portfolio and technical blog for an AI / computer vision student, matching the connected Google Stitch project.

**Architecture:** Use Astro content collections for blog posts, reusable `.astro` components for all repeated UI, and Tailwind CSS tokens mapped from the visible Stitch design. Keep pages static and deployable to GitHub Pages.

**Tech Stack:** Astro, TypeScript, Tailwind CSS, MDX, Astro content collections, KaTeX or MathJax, Shiki/Astro syntax highlighting, static GitHub Pages output.

---

## Stitch Inspection Summary

### Project

- Stitch project: `Visionary Tech Portfolio`
- Project ID: `885592455936360693`
- Current visible design direction: light, minimal editorial portfolio/blog.
- Active visible design-system instance: `Minimalist White` (`assets/b2461232e183437cabd366040a30ff17`).
- Alternate/stale design-system asset: `Visionary Core` (`assets/d044be68bbcb4ab3b85147252730d077`), dark cyan/indigo glassmorphism. The project-level theme metadata still points to this dark system, but the visible screens use the light system.
- Implementation source of truth: visible Stitch screens, especially desktop screens for `>= 1024px` and mobile screens for `<= 640px`.

### Available Screens / Pages

| Screen ID | Title | Device | Size From MCP | Visibility / Role |
| --- | --- | --- | --- | --- |
| `54f9cd4f2833495fbd52ef0e3a7d60b6` | Trang chủ Portfolio & Blog - Minimalist White (No Projects) | Desktop | 2560 x 3758 | Visible current home |
| `cf539c9760ee4ac2a6f9e4dc2694e5e7` | Trang chủ - Mobile Version | Mobile | 780 x 3566 | Visible current mobile home |
| `e001a1dfee1d4c64a2e9f3869e261984` | Trang Về tôi - Portfolio AI & Computer Vision | Desktop | 2560 x 4390 | Visible about |
| `900e2983cf4c4e4892ab8996b52077ee` | Trang Về tôi - Mobile Version | Mobile | 780 x 3416 | Visible mobile about |
| `5ad8cbfbef69472ca02a4be8eaba6002` | Trang chính Blog - Kiến thức AI & Thị giác máy tính | Desktop | 2560 x 2770 | Visible blog index |
| `28d4fbdd7891462690bb73d5b88e02ac` | Trang Blog - Mobile Version | Mobile | 780 x 4222 | Visible mobile blog index |
| `b6dba89a02624edc85816059ab62213d` | Chi tiết bài viết Blog - Tương lai của Transformer trong Computer Vision | Desktop | 2560 x 6764 | Visible blog detail |
| `a8b2f5819cc341d7b5a1d3db9aa05e96` | Chi tiết bài viết Blog - Mobile Version | Mobile | 780 x 8652 | Visible mobile blog detail |
| `7ea736cf47b84f168fd963b91c16cb44` | Trang Liên hệ - Portfolio AI & Computer Vision | Desktop | 2560 x 2314 | Visible contact |
| `57b1545abe534e0994e6c8ee75a75991` | Trang Liên hệ - Mobile Version | Mobile | 780 x 3392 | Visible mobile contact |
| `2977fcb629614492948aef7802656e82` | Project PRD - AI Portfolio & Blog | Desktop/Doc | 0 x 0, markdown | Visible PRD/reference |
| `01decc2c546f4f90997ef87f95ecb436` | Trang chủ Portfolio & Blog Công nghệ | Desktop | 2560 x 6644 | Hidden alternate, dark/project-heavy |
| `f3017afd21504dcbb964af1dac619114` | Trang chủ Portfolio & Blog - Minimalist White | Desktop | 2560 x 6674 | Hidden alternate home with projects |
| `61632c6e510a4628babc0318b44cd008` | CV & AI Specialist Portfolio | Mobile | 780 x 2048 | Hidden/resized alternate mobile |

### Intended Site Structure

Stitch covers:

- `/` home
- `/about`
- `/blog`
- `/blog/[slug]`
- `/contact`

Required by `AGENTS.md` but not directly covered by current visible Stitch pages:

- `/projects`
- `/resume`

Plan for missing pages:

- Build `/projects` from the hidden home project-card section and `ProjectCard` pattern. Use the same minimalist page shell as `/blog`, with cards for traffic object detection, medical image analysis, and real-time face recognition.
- Build `/resume` as a static CV-style page derived from the about timeline, skills sections, and contact calls to action. Provide a button for a downloadable PDF if `public/resume.pdf` is later added.

### Reusable UI Components Visible In Stitch

- `Navbar`: light top bar, thin bottom border, desktop links centered/right, mobile brand + hamburger/search icons.
- `Footer`: minimal footer with brand, copyright, and small text links.
- `Hero`: desktop two-column or text/media split; mobile centered portrait-first variant.
- `Section`: constrained width, large vertical whitespace, section heading with subtle left rule/label.
- `Button`: dark slate filled primary button and white/outline secondary button.
- `BlogCard`: desktop grid cards and home list rows with date/category metadata.
- `BlogPostLayout`: article header, hero image, prose body, figure captions, code blocks, tags, related posts, comments.
- `ProjectCard`: image-led card pattern from hidden home screens.
- `Tag`: small uppercase/mono-ish chips for topic labels and technologies.
- `SocialLink`: icon + label rows in contact/footer.
- `SkillBadge`: compact chips/cards for skills.
- `TimelineItem`: about page chronological experience/education entries.
- `ContactForm`: bordered/light form panel with text inputs, select, textarea, and submit button.
- `ContactInfoCard`: mobile contact cards for direct email, location/lab, GitHub, Scholar.
- `IconButton`: RSS/theme/menu/search/share/read-more icon buttons.
- `RelatedPostCard`: image-card links below blog detail.

### Design Tokens

Use the visible `Minimalist White` design system as the Tailwind source. Keep the dark `Visionary Core` values documented only as alternate reference.

Colors:

- Page background: `#f7f9fb`
- Primary surface / card: `#ffffff`
- Muted surface: `#f8fafc` / `#f2f4f6`
- Text primary: `#0f172a` or Stitch token `on-surface #191c1e`
- Text secondary: `#44474c`
- Text muted: `#75777d`
- Border: `#e2e8f0` / token `outline-variant #c4c6cd`
- Primary action: `#475569`
- Primary action hover: `#303e51`
- Code block background: `#f8fafc` or slightly darker `#f1f5f9`
- Error/accent only when needed: `#ba1a1a`

Typography:

- Headings: `Space Grotesk`
- Body: `Inter`
- Code: prefer `JetBrains Mono` for code blocks even though `Minimalist White` labels use Space Grotesk.
- Display desktop: about `48px`, weight `500`, line-height `1.1`.
- Display mobile: about `36px`, weight `500`, line-height `1.2`.
- Heading medium: about `24px`, weight `500`, line-height `1.3`.
- Body large: `18px`, line-height `1.6`.
- Body default: `16px`, line-height `1.6`.
- Labels: `12px`, uppercase, weight `600`.
- Implementation note: use normal letter spacing in Tailwind where possible; do not introduce negative tracking.

Spacing:

- Base unit: `8px`.
- Desktop container side padding: `64px`.
- Mobile page margin: `24px` in Minimalist White; reconcile with `AGENTS.md` mobile Stitch source and keep at least `16px` usable minimum.
- Grid gutter: `24px`.
- Section gaps: `80px+` desktop, reduced on mobile.
- Max content width: use `max-w-6xl` for page shells and `max-w-3xl` / `max-w-prose` for article text.

Radius:

- Default: `4px`.
- Cards / larger containers: `8px` to `12px`.
- Pills: full radius only for tag chips if visually needed.

Borders and shadows:

- Prefer `1px` borders over shadows.
- Avoid heavy elevation.
- Use very subtle ambient shadow only for floating mobile overlays if introduced later.

### Assets, Images, And Icons

Assets seen in Stitch:

- Hero neural-network visualization: generated image hosted at `lh3.googleusercontent.com/aida-public/...`, alt: `AI Neural Network Visualization`.
- About/headshot portrait: generated grayscale professional portrait, alt: `Portrait of an AI Specialist`.
- Blog detail hero image: light technical Vision Transformer / neural node illustration, alt: `Abstract rendering of neural network nodes and connections.`
- Related post thumbnails: Unsplash images for LLM/coding examples.
- Hidden project images: traffic object detection, medical image analysis, real-time face recognition.

Implementation approach:

- Export or recreate all generated Stitch images into `public/images/` before implementation.
- Use stable local filenames rather than remote Stitch URLs:
  - `public/images/hero-neural-network.jpg`
  - `public/images/profile-portrait.jpg`
  - `public/images/blog/vision-transformer.jpg`
  - `public/images/projects/traffic-detection.jpg`
  - `public/images/projects/medical-image-analysis.jpg`
  - `public/images/projects/face-recognition.jpg`
  - `public/images/blog/llm-edge.jpg`
  - `public/images/blog/ai-learning-roadmap.jpg`
- Use `lucide-astro` or inline accessible SVG icons for menu, search, RSS, theme, arrow/right, mail, map pin, GitHub, LinkedIn, Google Scholar, external link, copy.
- Do not depend on remote Googleusercontent image URLs in production.
- If exact export is not available, recreate similar neutral/light editorial assets, not the dark Visionary Core look, except for project thumbnails if the project page uses the hidden project-card concept.

### Responsive Behavior Inferred From Stitch

- Desktop (`>= 1024px`):
  - Top navigation is horizontal with centered links and right-side actions.
  - Home hero uses a two-column layout with copy left and media right.
  - Blog index uses a 3-column card grid.
  - Contact uses a wide form and a side column for contact/social links.
  - About uses text/timeline sections with a large portrait beside intro content.
  - Article detail uses a readable centered article column, image figures, related-post grid, and comments below.

- Mobile (`<= 640px`):
  - Navigation collapses to a compact brand row with menu/search icon.
  - Home uses portrait/media first, centered copy, stacked CTAs, then a single-column latest-writing list.
  - Blog index becomes a single-column list, with category/date metadata above each title and a load-more button.
  - Contact form fields stack vertically; contact/social destinations become separate cards.
  - Article detail is single column; hero image, prose, tags, related posts, and comments stack vertically.
  - Code blocks need horizontal overflow.

- Tablet (`641px` to `1023px`):
  - No explicit Stitch source; interpolate conservatively.
  - Use 2-column grids for blog/project cards where space permits.
  - Keep article body centered and avoid wide line lengths.

## Recommended Astro Project Structure

```text
.
├── astro.config.mjs
├── package.json
├── tailwind.config.mjs
├── tsconfig.json
├── public/
│   ├── favicon.svg
│   ├── resume.pdf
│   └── images/
│       ├── hero-neural-network.jpg
│       ├── profile-portrait.jpg
│       ├── blog/
│       │   ├── vision-transformer.jpg
│       │   ├── llm-edge.jpg
│       │   └── ai-learning-roadmap.jpg
│       └── projects/
│           ├── traffic-detection.jpg
│           ├── medical-image-analysis.jpg
│           └── face-recognition.jpg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── BlogCard.astro
│   │   ├── BlogPostLayout.astro
│   │   ├── Button.astro
│   │   ├── ContactForm.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── Navbar.astro
│   │   ├── ProjectCard.astro
│   │   ├── Section.astro
│   │   ├── SkillBadge.astro
│   │   ├── SocialLink.astro
│   │   ├── Tag.astro
│   │   └── TimelineItem.astro
│   ├── content/
│   │   ├── blog/
│   │   │   └── transformer-computer-vision.mdx
│   │   └── config.ts
│   ├── data/
│   │   ├── navigation.ts
│   │   ├── profile.ts
│   │   ├── projects.ts
│   │   └── skills.ts
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── PageLayout.astro
│   ├── pages/
│   │   ├── about.astro
│   │   ├── blog/
│   │   │   ├── [slug].astro
│   │   │   └── index.astro
│   │   ├── contact.astro
│   │   ├── index.astro
│   │   ├── projects.astro
│   │   └── resume.astro
│   ├── styles/
│   │   └── global.css
│   └── utils/
│       ├── formatDate.ts
│       └── seo.ts
└── IMPLEMENTATION_PLAN.md
```

## Component List

- `BaseLayout.astro`: document shell, font loading, metadata, global nav/footer.
- `PageLayout.astro`: standard page header spacing and content container.
- `Navbar.astro`: active route highlighting, responsive collapse state if needed.
- `Footer.astro`: brand, copyright, social/profile links.
- `Hero.astro`: home/about hero variants with image slot support.
- `Section.astro`: heading, optional eyebrow, constrained layout.
- `Button.astro`: `primary`, `secondary`, `ghost`, external-link variants.
- `BlogCard.astro`: grid-card and compact-list variants.
- `BlogPostLayout.astro`: article wrapper with title metadata, TOC slot/aside, tags, prose, related posts.
- `ProjectCard.astro`: image, title, description, tags, links.
- `Tag.astro`: blog/project tag chip.
- `SocialLink.astro`: icon + label/link rows.
- `SkillBadge.astro`: skill chip or skill-card label.
- `TimelineItem.astro`: date/title/org/description.
- `ContactForm.astro`: static accessible form markup. Since no backend is allowed, set action to `mailto:` or document a future static-form option without adding backend code.

## Page List

- `/`: home hero, latest writing, concise CTA links to resume/contact.
- `/about`: biography, research focus, timeline, skills.
- `/projects`: project grid inferred from hidden Stitch project section.
- `/blog`: archive/index with cards, tags/categories, date, descriptions.
- `/blog/[slug]`: MDX blog detail with TOC, LaTeX, code blocks, figures, related posts.
- `/resume`: static resume page with education, experience, skills, links, optional PDF download.
- `/contact`: contact intro, form UI, direct contact/social links.

## Blog Content Model

Create `src/content/config.ts` with a `blog` collection schema:

```ts
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    category: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});
```

MDX posts should support:

- Local images and GIFs from `public/images/blog`.
- Embedded videos using plain HTML/iframe components only when needed.
- LaTeX equations through KaTeX or MathJax.
- Syntax-highlighted code blocks through Astro/Shiki.
- Table of contents generated from headings in `[slug].astro` or a small utility.
- Tags, publication date, description, and SEO metadata.

## Styling Strategy With Tailwind

- Configure Tailwind tokens from `Minimalist White`.
- Use CSS custom properties in `global.css` for colors, then expose them via Tailwind theme extension.
- Load fonts with `@fontsource/inter`, `@fontsource/space-grotesk`, and optionally `@fontsource/jetbrains-mono`.
- Prefer semantic component classes over copying Stitch-generated utility soup.
- Keep all repeated spacing patterns in components (`Section`, `PageLayout`) instead of page-by-page ad hoc styling.
- Use typography plugin for blog prose if added deliberately; otherwise define focused `.prose` styles in `global.css`.
- Preserve accessibility:
  - Semantic landmarks: `header`, `nav`, `main`, `section`, `article`, `footer`.
  - Visible focus states.
  - Alt text for all images.
  - Proper labels for contact form controls.
  - Sufficient color contrast on slate buttons and muted text.

## GitHub Pages Deployment Plan

- Use static output only.
- Configure `astro.config.mjs`:
  - `site`: final GitHub Pages URL.
  - `base`: repository name if deployed to `https://<user>.github.io/<repo>/`; omit or `/` for user/org site.
  - `output: 'static'`.
- Add a GitHub Actions workflow later:
  - Install dependencies with `npm ci`.
  - Run `npm run build`.
  - Upload `dist`.
  - Deploy to Pages.
- Avoid backend form handling, databases, server routes, or Cloudflare Worker features.

## Implementation Milestones

### Milestone 1: Scaffold And Tooling

- Initialize Astro with TypeScript.
- Add Tailwind, MDX, sitemap if desired, and font packages.
- Add global styles and Tailwind theme tokens.
- Verify `npm install`, `npm run dev`, and `npm run build`.

### Milestone 2: Data And Content Model

- Create `src/content/blog` and collection schema.
- Add starter MDX posts matching Stitch examples.
- Add shared data files for profile, navigation, skills, projects, and social links.
- Add representative images under `public/images`.

### Milestone 3: Layout And Core Components

- Build `BaseLayout`, `Navbar`, `Footer`, `Section`, `Button`, `Tag`.
- Implement responsive page shell behavior for desktop/mobile.
- Verify keyboard focus, active navigation, and mobile layout.

### Milestone 4: Home, About, Contact

- Implement `/` from visible home desktop/mobile.
- Implement `/about` from visible about desktop/mobile.
- Implement `/contact` from visible contact desktop/mobile.
- Keep contact static and accessible.

### Milestone 5: Blog

- Implement `/blog` archive from visible blog index.
- Implement `/blog/[slug]` with MDX rendering, TOC, code blocks, LaTeX, tags, related posts.
- Verify long-form article readability and code overflow on mobile.

### Milestone 6: Projects And Resume

- Implement `/projects` from hidden project-card pattern.
- Implement `/resume` from about/timeline content plus downloadable PDF placeholder.
- Verify both pages match the minimalist visual system.

### Milestone 7: SEO, Accessibility, And Deployment

- Add reusable SEO metadata helpers.
- Add Open Graph metadata and canonical URLs.
- Run accessibility checks manually and through build/lint where available.
- Add GitHub Pages workflow.
- Final verification: `npm install`, `npm run dev`, `npm run build`.

## Known Gaps And Risks

- Stitch does not include dedicated `/projects` or `/resume` visible pages; these must be inferred from hidden home/project patterns and about/resume content.
- The Stitch project contains conflicting design-system metadata: visible screens are light, while the project theme metadata is dark. Use visible screens as source of truth unless the owner explicitly changes the design direction.
- Exact image exports from Stitch are not yet in the repo. Implementation should replace all remote generated-image URLs with local assets.
- Contact form cannot submit without an external static form provider or backend. The first implementation should be static/accessible and avoid pretending submission works.
- The PRD screen mentions comments on blog detail, but the deployment target has no backend. Treat comments as non-functional UI only or omit them unless a static-compatible service is approved.
