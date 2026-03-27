# egebicakci.com

Dark, cinematic personal website built with Next.js, TypeScript, Tailwind CSS, and a responsive component-based architecture prepared for Vercel.

## Stack

- Next.js 16 App Router with TypeScript
- Tailwind CSS 4
- Framer Motion for smooth reveal and hover animation
- `react-globe.gl` + `three` for the interactive 3D globe
- Next Image for optimized local media

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Edit content

Most content is intentionally centralized in:

- `data/site-content.ts`

That file controls:

- name and subtitle
- profile image path
- social links
- visited countries and cities
- globe pins and coordinates
- gallery items and filters
- Instagram fallback profile and posts

Replace placeholder images in:

- `public/images/profile`
- `public/images/gallery`

If you replace an image path, update the matching entry in `data/site-content.ts`.

## Project structure

```text
app/
  api/instagram/route.ts   # JSON endpoint ready for live Instagram data
  layout.tsx
  page.tsx
components/
  sections/                # Page sections
  ui/                      # Shared UI pieces and interactive globe
data/
  site-content.ts          # Main editable content file
lib/
  instagram.ts             # Server-side Instagram fetching logic
public/
  images/
  textures/
```

## Instagram: what is actually possible

This project does not fake a live Instagram feed.

What works automatically:

- If valid Instagram Graph API credentials are configured, the site can fetch recent posts on the server.
- The site revalidates the feed every 30 minutes.
- New posts can then appear automatically without manual code edits.
- If Graph API credentials are not configured, the site now also attempts a public-profile scrape fallback for basic profile information and, when Instagram allows it, recent post media.

What is required for true automatic updates:

- An Instagram professional account (business or creator)
- A Facebook app with Instagram Graph API access
- A long-lived access token
- The Instagram user ID for the connected account

Environment variables expected by the current implementation:

```bash
INSTAGRAM_ACCESS_TOKEN=your_long_lived_token
INSTAGRAM_USER_ID=your_instagram_user_id
GMAIL_USER=your_gmail_address
GMAIL_APP_PASSWORD=your_gmail_app_password
```

## Lucky spin + planning form

The "BUGÜN KENDİNİZİ ŞANSLI MI HİSSEDİYORSUNUZ?" section opens a spin-wheel modal and then a planning form.

How mail delivery works:

- The form posts to `app/api/beer-plan/route.ts`
- Mail is sent with Gmail SMTP using `nodemailer`
- Messages are delivered to `ege.bicakci54@gmail.com`
- The form currently asks for:
  - email
  - phone number

To make this work on Vercel:

1. Enable 2-Step Verification on the Gmail account you will send from.
2. Create a Gmail App Password.
3. Add these environment variables in Vercel Project Settings:
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`

If these variables are missing, the UI stays functional but the form will return a configuration error instead of silently pretending the message was sent.

How the current implementation behaves:

- If both environment variables exist and the API request succeeds, the Instagram section runs in `live` mode.
- If Graph API is unavailable, the app tries a `public_scrape` mode using the public Instagram profile HTML and web endpoints.
- If credentials are missing, invalid, or the API request fails, the section clearly shows `fallback` mode and uses local placeholder posts from `data/site-content.ts`.
- The fallback is intentional so the site remains polished in production instead of showing broken empty states.

Notes:

- The current code calls `graph.instagram.com` server-side from `lib/instagram.ts`.
- It also includes an experimental public scrape path in `lib/instagram.ts`. This can partially work for public accounts but is inherently brittle and may fail due to rate limits, markup changes, or anti-bot protections.
- Depending on your Instagram setup, you may want to expand the profile fetch to use a Meta Graph endpoint for richer account fields.
- If you prefer a third-party embeddable feed service later, you can swap the internals of `lib/instagram.ts` and keep the section UI unchanged.

## Deployment on Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add the environment variables shown above if you want live Instagram updates.
4. Deploy.

Recommended Vercel settings:

- Framework preset: Next.js
- Node version: current Vercel default is fine
- No custom server required

## Notes for future updates

- The globe texture files are stored locally in `public/textures` so runtime does not depend on external CDNs.
- The gallery uses a responsive masonry-style layout with a built-in lightbox.
- The globe is dynamically imported on the client so the main server render stays safe and lean.
- SEO basics are already included through `app/layout.tsx`, `app/robots.ts`, and `app/sitemap.ts`.
