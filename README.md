# 🌙 NIGHTDROP

Late-night delivery webshop voor Nijmegen. Bier · Sterke drank · Snacks · WhatsApp-only ordering met cash bij levering.

## ⚡ Quick start

Geen build, geen dependencies — gewoon open `index.html`.

```bash
# lokaal serveren (optioneel, anders dubbelklik index.html)
npx serve .
# of
python -m http.server 8000
```

## 🔧 Configuratie

Open `app.js` en pas het `CONFIG` object aan (regel ~12):

```js
const CONFIG = {
  whatsapp:    '31612345678',  // ← jouw WhatsApp nummer (zonder +)
  minOrder:    20,             // minimum bestelwaarde
  deliveryFee: 5,              // bezorgkosten
  freeFrom:    50,             // gratis vanaf
  openHour:    22,             // 22:00
  closeHour:   4,              // 04:00
  city:        'Nijmegen',
};
```

## 📦 Producten aanpassen

In `app.js` staan 4 catalogi:

| Variabele  | Type                | Tip                                            |
|------------|---------------------|------------------------------------------------|
| `BUNDLES`  | hero bundels        | Houd ≤ 4 stuks; minstens 1 met `badge: 'best'` |
| `QUICK`    | snel-kiezen combos  | Onder de €30 voor impulskopen                  |
| `DRANK`    | losse drank         | Voeg `flag: 'hot' / 'deal' / 'new'` toe        |
| `SNACKS`   | snacks & extras     | Lage marges, hoge AOV-impact                   |

Velden:
- `id` (uniek), `name`, `emoji`, `price` (verplicht)
- `oldPrice` → toont doorgestreepte prijs + besparing
- `stock` ≤ 8 → toont "Nog X beschikbaar" scarcity-pill
- `flag` → label op de afbeelding

## 🚀 Bestel-flow (2 klikken naar WhatsApp)

Hero CTA `⚡ Bestel in 30 seconden` → opent een bottom-sheet met:

1. **Bundle** (verplicht, default Party Starter): Quick Fix €29 · Party Starter €49 🔥 · Afterparty Box €69
2. **Extra's** (optioneel) met +/− knoppen: Chips €4,95 · Fris €3,95 · Bier €5,95
3. **⭐ Neem meest gekozen** knop = Party Starter + Chips + Bier (€59,90, 1 tik)
4. `Ga door naar WhatsApp` → opent `wa.me` met volledig ingevuld bericht (bundle + extra's + totaal + adres-veld + Tikkie/contant)

De sticky cart-bar's `Bestel`-knop opent ook automatisch deze builder als de cart leeg is, zodat één entry-point altijd werkt.

## 🧪 Testmodus

Twee manieren om te activeren:

- **URL-param**: voeg `?test=1` toe (bv. `http://localhost:5173/?test=1`)
- **Logo 5× tappen** binnen 1.8 sec — werkt ook live in productie

Wanneer actief:
- Geel/rode 🧪 TEST MODUS-banner bovenaan de builder
- Het WhatsApp-bericht krijgt prefix `🧪 TEST BESTELLING`
- Adres wordt vervangen door `Teststraat 123, Nijmegen`
- CTA-label verandert naar `Verstuur TEST naar WhatsApp`

Test scenario's:
- alleen bundle (extras allemaal 0)
- bundle + extra's (gebruik "Neem meest gekozen")
- elke bundle om te checken dat totalen kloppen

## 🎯 Conversion features (al ingebouwd)

- **Sticky urgency bar** met live countdown naar 04:00
- **Live ticker** met "Lisa uit Lent bestelde…" social proof
- **Dynamische drukte counter** ("12 mensen bestellen nu")
- **Scarcity** — voorraad daalt over tijd ("Nog 6 beschikbaar")
- **Sticky cart bar** met progress naar gratis bezorging
- **AOV upsells** in cart drawer onder €50
- **1-click WhatsApp** vanaf elke knop met vooraf-ingevulde bestelling
- **Anchor pricing** (oude prijs doorgestreept + procent korting)
- **Trust badges** (cash bij levering, 4.8/5, 30 min)
- **Open/Closed status pill** synced met openingstijden
- **App-level UX** — pop-animaties, glow CTAs, bump-effect, smooth tabs
- **Persistent cart** via `localStorage`

## 📂 Files

```
NIGHTDROP/
├── index.html    # structuur
├── style.css     # dark neon theme + animaties
├── app.js        # producten, cart, WhatsApp, urgency
└── README.md     # dit bestand
```

## 🚀 Deploy

Werkt overal als statische site (Netlify, Vercel, Cloudflare Pages, GitHub Pages). Zip en upload, of `git push`.

## ⚠️ Disclaimer

Dit project promoot legit late-night delivery. Pas de copy aan op jouw lokale wetgeving (verkoop alcohol aan 18+, identiteitsverificatie, etc.).
