# More Money for Schools — static site

Rebuild of https://www.moremoneyforschools.co.uk/ as a plain static site (no build step, no CMS). Content sourced from the Wix migration export; images and logos from the Wix Media Manager. Deployed on Vercel.

## Structure

- `index.html` — homepage (includes the "The evidence" section at `/#evidence`)
- `how-you-can-help/index.html`
- `solutions-for-balancing-budgets/index.html`
- `addressing-disparities-in-education/index.html`
- `privacy-policy/index.html`
- `404.html` — not-found page (served automatically by Vercel)
- `css/styles.css` — shared stylesheet
- `images/` — site images and logos (AVIF + JPEG)
- `vercel.json` — trailing-slash and header config for Vercel (current host, used for stakeholder sharing)
- `staticwebapp.config.json` — equivalent config for Azure Static Web Apps (the planned eventual production host); ignored by Vercel
- `sitemap.xml`, `robots.txt`, `favicon.svg`

All five original Wix URL paths are preserved (`trailingSlash: false` keeps them extension- and slash-free, exactly as on Wix), so no redirects are needed.

## Local preview

From this folder:

```
python3 -m http.server 8000
```

Then open http://localhost:8000

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project**, import the repo.
3. Framework preset **Other**, no build command, output directory left as the root. Deploy.
4. Every push to `main` deploys automatically; branches get preview URLs.
5. Add `www.moremoneyforschools.co.uk` (and the apex) under **Settings → Domains**, then update DNS where the domain is managed. Vercel provisions SSL automatically.

Note: if the domain is *registered through* Wix (not just connected), transfer it to another registrar before cancelling the Wix subscription.

## Editing content

There is no CMS — edit the HTML files directly and push. Each page carries its own copy of the header/footer, so a nav change means updating all five pages plus `404.html`.

## Design

Palette and typography match the original Wix site: Raleway throughout; navy `#171e69`, blue `#2344c5`, bright blue `#1a6aff` (buttons/links), pink accents `#f281d9` / `#ed45a0`, body text `#333333`. Tokens live at the top of `css/styles.css`.
