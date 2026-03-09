# ChemCore ⚗️
**The complete Chemical Engineering student hub** — hianime-style UI with AI tutor, calculators, formula reference, and physical constants.

---

## Features
- 🤖 **AI Tutor** — powered by Claude (Anthropic), expert in all ChemE subjects
- 🧮 **6 Calculators** — Ideal Gas, Reynolds, Heat Duty, Arrhenius, LMTD, CSTR
- 📐 **27+ Formulas** — across Thermodynamics, Fluids, Heat/Mass Transfer, Reaction Engg, Control
- 📊 **18 Physical Constants** — NIST-standard, filterable by category
- 📚 **9 Subject pages** — Thermo, Fluids, Heat Transfer, Mass Transfer, Reaction Engg, Control, Unit Ops, Safety, Numerics
- 🔍 **Global search** — across all formulas, constants, and subjects
- 📱 **Fully responsive** — desktop hianime-style layout + mobile-first with bottom nav
- 🎨 **hianime-inspired UI** — left icon sidebar, hero spotlight slider, horizontal card rows, ranked sidebar panels

---

## Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy from project directory**
```bash
cd e:\download\mods\chemcore-fullstack\chemcore
vercel --prod
```

### Environment Variables
Add these in Vercel dashboard under Settings → Environment Variables:
- `OPENAI_API_KEY` (optional)
- `GEMINI_API_KEY` (optional)
- `OPENROUTER_API_KEY` (optional)
- `OPENROUTER_API_KEY_2` (optional)

---

## Stack
| Layer | Tech |
|-------|------|
| Frontend | Vanilla HTML/CSS/JS (SPA, no framework) |
| Backend | Node.js + Express |
| AI | Anthropic Claude (claude-sonnet-4-20250514) |
| Fonts | Outfit + JetBrains Mono (Google Fonts) |

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set your API key
Create a `.env` file:
```
ANTHROPIC_API_KEY=your_api_key_here
PORT=3000
```

### 3. Run the server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

### 4. Open the app
Visit `http://localhost:3000`

---

## Project Structure
```
chemcore/
├── server.js              # Express backend + API proxy
├── package.json
├── .env                   # Your API key (not committed)
└── public/
    ├── index.html         # SPA entry point
    ├── styles/
    │   ├── main.css       # Layout, nav, sidebar, chatbot
    │   ├── components.css # Cards, tables, calculators, hero
    │   └── mobile.css     # Responsive breakpoints
    └── js/
        ├── data.js        # All formulas, constants, subjects
        ├── chat.js        # AI chatbot logic
        ├── calculators.js # Calculator functions
        ├── pages.js       # Page renderers (Home, Subjects, etc.)
        └── app.js         # Router, search, navigation
```

---

## Pages
| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero spotlight, subject cards, formula row, quick calcs |
| Subjects | click nav | All 9 subjects with study AI button |
| Calculators | click nav | 6 process calculators |
| Formulas | click nav | 27+ equations with AI explain button |
| Reference | click nav | Physical constants table (filterable) |

---

## Mobile Layout
On screens ≤ 768px:
- Left sidebar hidden, hamburger menu appears
- Bottom navigation bar (5 tabs)
- Hero resizes to 310px
- Calc grid collapses to single column
- Chat panel expands to fill screen width
- Right sidebar hidden (accessible via AI button)

---

## Deployment

### Vercel / Render / Railway
Set environment variable `ANTHROPIC_API_KEY` in your dashboard and deploy.

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```
