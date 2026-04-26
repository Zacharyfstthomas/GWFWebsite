# Gamecock Wrestling Foundation — Website

A static Astro site for the Gamecock Wrestling Foundation with a public, CSV-driven ledger.

## Quick start

```bash
# 1. Install dependencies (one-time)
npm install

# 2. Run the dev server
npm run dev
# → http://localhost:4321/GWFWebsite

# 3. Build for production
npm run build
```

## Project structure

```
.
├── public/
│   ├── data/
│   │   ├── ledger.csv        ← edit this to add transactions
│   │   └── categories.json   ← edit to add/rename categories
│   └── favicon.svg
├── src/
│   ├── components/           ← Header, Footer, LedgerTable, etc.
│   ├── layouts/              ← BaseLayout
│   ├── lib/
│   │   └── ledger.ts         ← CSV parser + summarizer
│   ├── pages/                ← index, about, staff, ledger
│   └── styles/
│       └── global.css        ← design tokens, typography
├── .github/workflows/
│   └── deploy.yml            ← auto-deploys on push to main
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Adding a transaction

Open `public/data/ledger.csv` and add a row. Columns:

| column        | notes                                                 |
|---------------|-------------------------------------------------------|
| `date`        | ISO format: `YYYY-MM-DD`                              |
| `description` | Short plain-English description                       |
| `category`    | Must match a `label` in `categories.json`             |
| `type`        | `income` or `expense`                                 |
| `amount`      | Positive number (no dollar sign, no commas)           |
| `method`      | `Card`, `Check`, `Cash`, `Wire`, `Online`, etc.       |
| `notes`       | Optional extra context                                |

Commit and push — the site rebuilds automatically.

The parser in `src/lib/ledger.ts` will **fail the build** if an amount is not a valid number, which means a malformed row can never ship to the live ledger.

## Deploying to GitHub Pages

One-time setup on GitHub:

1. Go to **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. Push to `main` — the workflow in `.github/workflows/deploy.yml` builds and deploys automatically

Your site goes live at:
**https://zacharyfstthomas.github.io/GWFWebsite/**

### Moving to a custom domain later

1. In `astro.config.mjs`, set `site` to your domain (e.g. `'https://gamecockwrestling.org'`) and **delete** the `base: '/GWFWebsite'` line.
2. Add a `public/CNAME` file containing just your bare domain name.
3. Configure the domain in **Settings → Pages → Custom domain**.

## Placeholder content

All body copy, names, and figures are **templates**. Most prose is in pig-Latin so
it's visually obvious at a glance that a section has not been written yet.

Replace, in order:

1. Landing hero copy (`src/pages/index.astro`)
2. About mission / story (`src/pages/about.astro`)
3. Board and staff names / bios (`src/pages/staff.astro`)
4. Footer EIN, address, email (`src/components/Footer.astro`)
5. Category descriptions (`public/data/categories.json`)

## Design notes

- **Typography:** Fraunces (display), Figtree (body), JetBrains Mono (ledger figures)
- **Palette:** deep garnet, bone cream, charcoal ink, muted gold accent
- **Colors live** in CSS variables at the top of `src/styles/global.css`

## License

Private — internal foundation use.
