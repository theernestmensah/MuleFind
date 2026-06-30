# MuleFinds MuleBuy Spreadsheet

React/Vite rebuild of the OGMulebuy products directory as a clean MuleBuy spreadsheet site. The local snapshot is based on `https://ogmulebuy.com/products.html` and its public config data: 3,593 MuleBuy product rows, 16 category lanes, category spreadsheet shortcuts, direct MuleBuy product links, OGMulebuy-used product/category images, QC guidance, CSV export, and Ghana cedi pricing.

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

- `src/App.jsx` - React interface, search, category filters, spreadsheet table, CSV export, and footer credits
- `src/data.js` - maps the OGMulebuy snapshot into category cards, CTAs, guide copy, and FAQ content
- `src/mulebuySnapshot.json` - local MuleBuy product/category snapshot from OGMulebuy
- `src/styles.css` - responsive visual system
- `products.html`, `guide.html`, `faq.html`, `spreadsheet.html`, `mulebuy-spreadsheet.html` - legacy entry pages into the React app

## GitHub

Push the source files, including `package.json`, `package-lock.json`, `vite.config.js`, the HTML files, `src/`, and this README. Do not push `node_modules/` or `dist/`; they are generated locally.

## Launch notes

Replace source/referral URLs before launch if you want traffic and attribution to use your own accounts. Product prices are shown in Ghana cedis (`GH₵`) using the exchange-rate note stored in `src/mulebuySnapshot.json`. The footer credits Nhyira and Ernest as requested.
