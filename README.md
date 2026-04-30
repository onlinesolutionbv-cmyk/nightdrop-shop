# NachtDrop - Drank & Snacks Nachtbezorging Nijmegen

Mobile-first webshop voor nachtbezorging in Nijmegen. Bier, wijn, shots en snacks. Bezorgd binnen 30-60 min via WhatsApp checkout.

## Features

- **App-style multi-page navigation** - bottom tab bar met 6 categorien (Home, Deals, Drank, Snacks, Fris, Meer)
- **Cart systeem** - localStorage persistence, quantity controls, live totals
- **WhatsApp checkout** - automatisch ingevuld bericht met items, aantallen, totaal
- **Live opening status** - real-time countdown en gesloten/open badge
- **Flash bar** - urgentie banner als < 60 min tot sluiten
- **Progress bar** - moedig aan om over te boeken naar gratis bezorging
- **JSON-LD structured data** - `FoodEstablishment` schema voor Google
- **SEO geoptimaliseerd** - meta tags, OpenGraph, alt teksten, canonical URL
- **Responsive** - mobile-first, schalt naar desktop met float button

## Files

- `index.html` - structuur + JSON-LD
- `style.css` - alle styling
- `app.js` - cart logica, rendering, navigatie, countdown
- `netlify.toml` - deployment config

## Pages

| Tab     | Inhoud                                        |
|---------|-----------------------------------------------|
| Home    | Hero, menu cards, top bundles, top bier, FAQ  |
| Deals   | Alle bundels (Quick Fix, Party Starter, etc)  |
| Drank   | Bier, wijn, prosecco, shots, sterke drank     |
| Snacks  | Chips, chocolade, snoep, ijs                  |
| Fris    | Frisdrank, water, energy drinks               |
| Meer    | Accessoires, info, FAQ, bezorggebied          |

## Bedrijfsregels

- Min. order: EUR 30
- Bezorgkosten: EUR 5 (gratis vanaf EUR 50)
- Openingstijden: Ma-Do 20:00-04:00 / Vr-Za 20:00-05:30 / Zo 20:00-04:00
- Bezorggebied: Heel Nijmegen + omliggende wijken
- Betaling: cash of pin bij de deur
- 18+ verplicht voor alcohol (ID controle)
- Geen afhaallocatie - alleen bezorging

## Configuratie

In `app.js` bovenaan:

```js
var WA_NUMBER = '31612345678';  // WhatsApp nummer (zonder +)
var MIN_ORDER = 30;             // Min. bestelbedrag
var FREE_SHIP = 50;             // Gratis bezorging vanaf
var SHIP_COST = 5;              // Bezorgkosten standaard
```

## Lokaal draaien

```bash
# Geen build nodig - puur statische HTML/CSS/JS
# Open een lokale server, bijv:
python -m http.server 5173
# of
npx http-server -p 5173
```

Open `http://localhost:5173` in je browser.

## Deployment

Push naar GitHub en koppel aan Netlify, Vercel of Cloudflare Pages voor auto-deploy.

```bash
git push origin main
```

## SEO checklist

- [x] Meta title + description
- [x] OpenGraph tags
- [x] Canonical URL
- [x] JSON-LD FoodEstablishment schema
- [x] Semantic HTML (article, nav, section, footer)
- [x] Mobile-first responsive
- [x] Geen console errors
- [x] Geen broken characters
- [x] Aria labels op alle interactive buttons

## Te doen voor live

1. Vervang `WA_NUMBER` met echt WhatsApp nummer
2. Vervang `https://nachtdrop.nl` placeholder met echte domein in `index.html` (3 plekken: canonical, og:url, JSON-LD url)
3. Voeg een echte `og.jpg` toe (1200x630) voor social previews
4. Update prijzen / producten in `app.js` (BUNDLES, BIER, WIJN, etc.)
5. Test WhatsApp link op mobiel + desktop
