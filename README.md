# MuleFinds Premium Site

React/Vite rebuild of the MuleBuy spreadsheet directory. The content model uses public information from `https://ogmulebuy.com/`: 10,000 product links, 30 sellers, daily updates, official spreadsheet CTA, Discord/community CTA, registration CTA, Android app CTA, category-led browsing, product lanes, QC guidance, agent comparison, FAQ structure, and the public OGMulebuy category/card image URLs.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Main files

- `src/App.jsx` - React interface and interactions
- `src/data.js` - category, product, product page, FAQ, CTA, and guide data
- `src/styles.css` - responsive visual system
- `products.html`, `guide.html`, `agents.html`, `faq.html`, `spreadsheet.html`, `mulebuy-spreadsheet.html` - legacy redirects into the React app
- `products/*.html` - individual product detail pages with gallery pictures and Ghana cedi pricing

## Launch notes

Replace source/referral URLs in `src/data.js` before launch if you want traffic and attribution to use your own accounts. Product prices are displayed in Ghana cedis (`GH₵`). The footer credits Nhyira and Ernest as requested.
