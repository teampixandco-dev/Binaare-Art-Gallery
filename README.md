# Binaare Art Gallery

Next.js website with a local backend and an authenticated content studio at `/admin`. The original DM Sans and Cormorant Garamond fonts are bundled locally in `public/fonts/` with their licenses, so builds do not require Google Fonts downloads.

## Run locally

Use Node.js **22.18 or newer** (the backend uses Node's built-in SQLite module).

```bash
npm ci
npm run admin:setup
npm run dev
```

Open http://localhost:3000 for the website or http://localhost:3000/admin for the studio. The setup command creates an administrator and writes the username and randomly generated password to `.admin-credentials`, a private, gitignored local file. It does not overwrite an existing account.

To choose credentials, supply `ADMIN_USERNAME` and `ADMIN_PASSWORD` to the setup command. Passwords must have at least 12 characters. `npm run admin:setup -- --reset` resets the account's password and signs out its existing sessions. The database stores salted password hashes, not passwords.

## Manage content

- **Shop artworks:** add or edit titles, URL names, medium, dimensions, USD prices, descriptions and multiple photographs. The first photograph is the cover. Save as a draft or mark Published and save. Published artworks appear in the shop, have their own detail pages and work with the existing cart.
- **Blog posts:** write an excerpt and article text, choose a cover image, add article photographs and a date, then save a draft or publish. Articles appear at `/blog/[url-name]`; drafts do not appear in the public API or on public pages. The date is a displayed publication date, not a scheduling control. Article line breaks are preserved and photographs appear below the text.
- **Pages & sections:** choose an existing page to replace its hero and the images in its named sections. Gallery images, home featured works, shop collection images, about images and artist portraits are independently managed. New image sections can be added to any page. Choose a home hero photograph to replace the original video; use the restore button to switch back to that video.
- **New pages:** add page text and image sections, set a URL name, and publish at `/pages/[url-name]`. Optionally include the page in website navigation.
- **Media library:** upload JPG, PNG, WebP or AVIF images up to 10 MB / 40 megapixels. Uploads are checked, rotated, resized to at most 2400 pixels and saved as WebP. Use them in an artwork, post or page section to display them publicly. Uploading to the library alone does not place an image on a page. Images in use by saved content (including drafts) cannot be deleted.

Existing content is seeded once when the database is created. Empty collections stay empty and are not reseeded. Saved content is rendered on each new page request. Already open listing pages refresh on focus and every 30 seconds. Refresh an open article or product detail page to see changes to that article or product. If another administrator saves while you are editing, the studio rejects a stale save and asks you to reload instead of overwriting the other changes.

The existing decorative text in the built-in page layouts remains in the page components. The studio edits their hero titles/subtitles, image sections and additional page text. New pages and blog posts have fully editable body text. The cart remains a browser cart; payment processing, orders and contact/newsletter form delivery are not part of this content backend.

## Storage and hosting

`data/gallery.sqlite` stores content, admin accounts and sessions. `data/uploads/` stores images, served through `/media/[filename]`. These and `.admin-credentials` are excluded from Git. Back up the database and uploads together. Stop the app before copying the entire data directory, or use a SQLite-aware backup process when it is running.

Optional server settings:

| Variable | Purpose |
| --- | --- |
| `BINAARE_DATA_DIR` | Absolute directory for persistent database and uploads; defaults to `./data`. |
| `APP_ORIGIN` | Exact website origin, e.g. `https://gallery.example.com`, used to validate admin writes. Set this when using a reverse proxy. |
| `ADMIN_USERNAME` | Username used by the setup command; defaults to `admin`. |
| `ADMIN_PASSWORD` | Password used by the setup command; otherwise generated randomly. |
| `ADMIN_CREDENTIALS_FILE` | Setup output location; defaults to `.admin-credentials`. |

For a persistent Node.js server:

```bash
npm run build
npm start
```

Production admin cookies require HTTPS. This local storage implementation needs a persistent writable disk and a single shared database. Before deploying to an ephemeral/serverless platform, move the database and media storage to suitable hosted services. Hosting has intentionally not been provisioned yet.

## Verification

```bash
npx tsc --noEmit
npm run lint
npm run test:backend
```

The Playwright tests use installed Google Chrome, a separate development server on port 3100, `.next-test/`, and a fresh temporary database under the system temp directory. They do not modify the real gallery database or admin credentials. Tests cover authentication, invalid uploads, stale edits, persistence, shop/cart integration, blog drafts and publishing, page image placement and media reference protection. Browser screenshots and traces are written to `test-results/`.

Implementation references: [Node.js SQLite](https://nodejs.org/download/release/latest-jod/docs/api/sqlite.html) and [Next.js Route Handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route).
