# Maria's Portfolio

A clean, full-stack portfolio website for visual artists. Built with Next.js 14, Prisma + SQLite, NextAuth, and Cloudinary.

## Features

- **Public portfolio** — Browse projects with image gallery, tag filtering, and pagination
- **Admin dashboard** — Upload images, manage projects, control publishing
- **Secure auth** — Only 2 pre-configured admin accounts can access the backend
- **Cloudinary CDN** — Optimized image delivery with automatic format/quality selection
- **DDoS protection** — Netlify edge network handles rate limiting and WAF

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS, Playfair Display + Inter |
| Auth | NextAuth.js v5 (credentials, JWT) |
| Database | Prisma + SQLite |
| Images | Cloudinary (signed uploads, CDN, transformations) |
| Hosting | Netlify (edge network, DDoS protection, auto-deploy) |

## Getting Started

### 1. Prerequisites

- Node.js 18+
- A [Cloudinary](https://cloudinary.com) account (free tier is sufficient)
- A [Netlify](https://netlify.com) account (for deployment)

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in the values in `.env`:

| Variable | Where to get it |
|----------|----------------|
| `DATABASE_URL` | `file:./dev.db` (default for local dev) |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` in terminal |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary dashboard (keep secret!) |
| `CLOUDINARY_UPLOAD_PRESET` | Create a signed upload preset in Cloudinary named `maria_portfolio` |
| `ADMIN_PASSWORD` | Choose a strong password for the main admin account |
| `MARIA_PASSWORD` | Choose a password for Maria's account |

### 3. Install and set up

```bash
npm install
npx prisma generate
npx prisma db push
npm run seed
```

### 4. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000` — the public portfolio.
Visit `http://localhost:3000/admin` — log in with one of the seeded accounts.

### 5. Cloudinary upload preset

1. Go to Cloudinary dashboard → Settings → Upload
2. Create a new upload preset named `maria_portfolio`
3. Set **Signing mode** to `Signed`
4. Set **Folder** to `maria-portfolio`
5. Allowed formats: `jpg`, `png`, `webp`, `avif`

## Deployment

### Deploy to Netlify

1. Push this repo to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → Import from GitHub
3. Select this repository
4. Set the same environment variables in Netlify dashboard (site settings → environment variables)
5. The `netlify.toml` and `@netlify/plugin-nextjs` handle the build automatically
6. Deploy!

Netlify provides automatic DDoS protection, HTTPS, CDN caching, and WAF at the edge.

## Project Structure

```
src/
├── app/
│   ├── (public)/           # Public portfolio pages
│   │   ├── projects/       # Project grid + detail
│   │   ├── about/          # About page
│   │   └── contact/        # Contact page
│   ├── (admin)/            # Admin dashboard (auth-protected)
│   │   ├── admin/
│   │   │   ├── projects/   # CRUD project management
│   │   │   └── settings/   # Account settings
│   │   └── ...
│   ├── login/              # Admin login page
│   └── api/                # REST API routes
├── components/
│   ├── ui/                 # Primitive UI components
│   ├── layout/             # Header, Footer, Sidebar
│   ├── projects/           # Portfolio components
│   ├── admin/              # Admin components
│   └── auth/               # Login form, provider
└── lib/
    ├── db/                 # Database queries
    ├── auth.ts             # NextAuth configuration
    ├── cloudinary.ts       # Cloudinary utilities
    ├── validation.ts       # Zod schemas
    └── rate-limit.ts       # Rate limiter
```

## Security

- **Authentication**: JWT-based sessions with 24h expiry
- **Rate limiting**: Login endpoint (10 req/min per IP)
- **Input validation**: All API inputs validated with Zod schemas
- **Image uploads**: Signed Cloudinary uploads (server-generated signature)
- **Security headers**: HSTS, X-Frame-Options, X-Content-Type-Options, etc.
- **DDoS protection**: Netlify edge network (built-in)
