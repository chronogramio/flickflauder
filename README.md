# Flickflauder - Astro Website

Modern, bilingual (German/English) website built with Astro, featuring a signature 3D butterfly animation and comprehensive portfolio and blog sections.

## 🦋 Features

- **Bilingual Support**: Full German (default) and English versions of all pages
- **Signature 3D Butterfly Animation**: Pure CSS 3D butterfly with customizable size and prominence
- **Animated Flower Field**: Dynamic background animation with 25 procedurally generated flowers
- **Content Collections**: Blog posts and portfolio projects with Markdown support
- **Responsive Design**: Mobile-first design that works on all devices
- **Accessibility**: Reduced motion support, semantic HTML, WCAG AA contrast ratios
- **SEO Optimized**: Meta tags, Open Graph, structured data, sitemap generation
- **Cloudflare Pages Ready**: Configured for deployment to Cloudflare Pages

## 📁 Project Structure

```
flickflauder/
├── src/
│   ├── components/
│   │   ├── animations/      # Butterfly & FlowerField components
│   │   ├── layout/          # Header, Footer, LanguagePicker
│   │   ├── sections/        # Hero, Services, Contact, etc.
│   │   └── ui/              # Button, Card, SectionHeading
│   ├── content/
│   │   ├── blog/           # Blog posts (de/ and en/)
│   │   └── portfolio/      # Portfolio projects (de/ and en/)
│   ├── i18n/               # Translation files (de.json, en.json)
│   ├── layouts/            # BaseLayout wrapper
│   ├── pages/              # All pages (German & English)
│   ├── styles/             # Global, animations, utilities CSS
│   └── utils/              # i18n helper functions
├── public/
│   ├── images/             # Images and assets
│   └── robots.txt          # SEO
└── dist/                   # Build output (generated)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:4321` to see your site.

### Build

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

## 🎨 Customization

### Colors

The color palette is defined in `src/styles/global.css`:

- `--lavender`: #b8a4d4
- `--peach`: #ffc5a8
- `--mint`: #a8e6cf
- `--coral`: #ffb3ba

### Butterfly Animation

The butterfly component accepts these props:

- `size`: 'small' | 'medium' | 'large'
- `prominent`: boolean (full animation vs subtle)

Usage:
```astro
<Butterfly size="large" prominent={true} />
```

### Translations

Edit `src/i18n/de.json` and `src/i18n/en.json` to update translations.

## 📝 Content Management

### Adding Blog Posts

Create a new Markdown file in:
- `src/content/blog/de/` for German
- `src/content/blog/en/` for English

Frontmatter:
```yaml
---
title: 'Post Title'
description: 'Brief description'
pubDate: 2025-02-16
tags: ['Tag1', 'Tag2']
lang: 'de'
---
```

### Adding Portfolio Projects

Create a new Markdown file in:
- `src/content/portfolio/de/` for German
- `src/content/portfolio/en/` for English

Frontmatter:
```yaml
---
title: 'Project Name'
description: 'Brief description'
thumbnail: '/images/project.jpg'
technologies: ['React', 'Node.js']
featured: true
order: 1
lang: 'de'
---
```

## 🖼️ Personal Photo

Add your photo to `/public/images/paroos-photo.jpg` (recommended: 400x400px, circular crop).

The About pages currently show a placeholder butterfly emoji if the photo is not found.

## 📄 Pages

### German (Default)
- `/` - Homepage
- `/uber-mich` - About Me
- `/dienstleistungen` - Services
- `/portfolio` - Portfolio listing
- `/portfolio/[slug]` - Individual projects
- `/blog` - Blog listing
- `/blog/[slug]` - Individual posts
- `/kontakt` - Contact

### English
- `/en` - Homepage
- `/en/about` - About Me
- `/en/services` - Services
- `/en/portfolio` - Portfolio listing
- `/en/portfolio/[slug]` - Individual projects
- `/en/blog` - Blog listing
- `/en/blog/[slug]` - Individual posts
- `/en/contact` - Contact

## 🌐 Deployment to Cloudflare Pages

### Option 1: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Connect your GitHub repository
4. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Deploy!

### Option 2: Wrangler CLI

```bash
npx wrangler pages deploy dist
```

### Custom Domain

After deployment, configure your custom domain in the Cloudflare Pages dashboard.

## ✅ Implementation Status

### Completed
- ✅ Astro project setup with Cloudflare adapter
- ✅ CSS extraction and organization (global, animations, utilities)
- ✅ Core animation components (Butterfly, FlowerField)
- ✅ Layout components (Header, Footer, LanguagePicker)
- ✅ UI components (Button, Card, SectionHeading)
- ✅ i18n system with German/English support
- ✅ Homepage (German & English)
- ✅ About Me pages (personal "I" voice)
- ✅ Content collections (blog & portfolio)
- ✅ Portfolio pages and dynamic routes
- ✅ Blog pages and dynamic routes
- ✅ Services pages
- ✅ Contact pages
- ✅ SEO optimization (meta tags, sitemap, robots.txt)
- ✅ Responsive design
- ✅ Accessibility features

### To Do (Content)
- 📝 Add personal photo (`/public/images/paroos-photo.jpg`)
- 📝 Write personal story in About pages (replace placeholders)
- 📝 Add 3-5 real portfolio projects with screenshots
- 📝 Write 3-5 blog posts
- 📝 Update contact email address if needed

### Optional Enhancements
- [ ] Style guide page
- [ ] Contact form with form handling
- [ ] Analytics integration
- [ ] Newsletter signup
- [ ] Performance optimizations (lazy loading, etc.)

## 🎯 Next Steps

1. **Add Personal Content**:
   - Replace placeholder photo
   - Write personal story in About page
   - Add real portfolio projects
   - Write initial blog posts

2. **Review Translations**:
   - Check all German and English translations
   - Update "Ihr Name" / "Your Name" placeholders

3. **Deploy**:
   - Push to GitHub
   - Connect to Cloudflare Pages
   - Configure custom domain

4. **Launch**:
   - Test all pages and links
   - Verify animations on different devices
   - Share your new site!

## 📚 Technologies

- [Astro](https://astro.build/) - Web framework
- [MDX](https://mdxjs.com/) - Markdown with JSX
- [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) - Sitemap generation
- [@astrojs/cloudflare](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) - Cloudflare Pages adapter
- Pure CSS animations (no JavaScript for butterfly!)
- TypeScript
- Font Awesome icons

## 📄 License

Copyright © 2025 Flickflauder. All rights reserved.

---

**Built with care 🦋**
