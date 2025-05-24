# foggymtndrifter.com

My personal website built with Astro, React, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework:** [Astro](https://astro.build) with React components
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Icons:** [Astro Icon](https://github.com/natemoo-re/astro-icon) with Heroicons
- **Search:** [Fuse.js](https://fusejs.io) for fuzzy search
- **Payments:** [Stripe](https://stripe.com) integration
- **Deployment:** [Vercel](https://vercel.com)

## 🛠️ Development

All commands are run from the root of the project:

| Command       | Action                                     |
| :------------ | :----------------------------------------- |
| `bun install` | Install dependencies                       |
| `bun dev`     | Start local dev server at `localhost:4321` |
| `bun build`   | Build production site to `./dist/`         |
| `bun preview` | Preview build locally before deploying     |

## 📁 Project Structure

```text
/
├── public/          # Static assets
├── src/
│   ├── components/  # React/Astro components
│   ├── layouts/     # Page layouts
│   └── pages/       # Routes (file-based routing)
├── astro.config.mjs # Astro configuration
└── package.json
```

## 🎨 Features

- Modern, responsive design with Tailwind CSS
- Fast static site generation with Astro
- Interactive React components where needed
- Typography enhancements with @tailwindcss/typography
- Icon system with Heroicons
- Search functionality
- Stripe integration for payments

---

Built with ❤️ using Astro
