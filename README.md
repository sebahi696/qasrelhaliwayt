# Qasr Al Halaweyat — website, app and staff panel

| Path | What | Stack |
|---|---|---|
| `site/` | Public website (bilingual, SEO, international shop with cart & checkout) | Astro 5, static |
| `app/` | Customer app (PWA): Lebanon delivery/pickup from 3 branches, international section, points | Vanilla JS, installable |
| `app/admin.html` (`/staff/`) | Staff panel: live orders board, menu, branches, international, marketing, customers, reports, settings | Vanilla JS |

Deployed by GitHub Actions on every push to `main`: builds `site/` and bundles `app/` + `staff/` into the same deployment.

- Website: `/en/` `/ar/` · App: `/app/` · Staff: `/staff/`
- Old Shopify URLs are mapped in `site/public/_redirects` (Cloudflare Pages format).
- Menu data: `app/data.js` (local menu, branches, intl rates) and `site/src/data/shop.json` (international products, from the Shopify export).

Local: `cd site && npm i && npm run dev` · Build: `BASE_PATH=/ SITE_URL=https://qasralhalaweyat.com npm run build`
