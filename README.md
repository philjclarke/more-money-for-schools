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
- `server.js` + `package.json` — zero-dependency Node server for Azure App Service (production host, Node 22); `npm start` runs it, serving the static files with extensionless routes and the 404 page
- `vercel.json` — trailing-slash and header config for Vercel (used for stakeholder sharing; Vercel ignores server.js for a static deploy)
- `staticwebapp.config.json` — config kept in case of a move to Azure Static Web Apps; ignored by App Service and Vercel
- `sitemap.xml`, `robots.txt`, `favicon.svg`

All five original Wix URL paths are preserved (`trailingSlash: false` keeps them extension- and slash-free, exactly as on Wix), so no redirects are needed.

## Local preview

From this folder:

```
python3 -m http.server 8000
```

Then open http://localhost:8000

## Deploying to Azure App Service (production)

The live app is `moremoneyforschools-live` (North Europe), running Node 22 on Linux.

1. In the Azure Portal, open the Web App → **Deployment Center** → connect this GitHub repo/branch. Azure's build (Oryx) detects `package.json` and starts the app with `npm start` — no startup command needed.
2. Each push to `main` then deploys automatically via the generated GitHub Actions workflow.
3. When ready to go live: **Custom domains** → add `www.moremoneyforschools.co.uk` (and apex), repoint DNS from Wix, and let App Service issue the managed certificate.

To test the server locally: `npm start` then open http://localhost:8080.

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
