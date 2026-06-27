# Theemaas — Test & Backlog

**App:** Theemaas Dagboek · **Live:** https://theetracker.netlify.app
**Vaste statusplek:** dit bestand (`docs/backlog.md`) — werk de **Status**-kolom bij bij elke release.
**Laatst bijgewerkt:** 27 juni 2026

Bevindingen van een QA-tester, de UX/visual designer, de motion designer en 5 gebruikers,
geprioriteerd met een **Impact × Effort-matrix**. Quick wins (hoge impact / lage inspanning)
staan bovenaan.

> **Status:** ✅ gedaan · 🔄 mee bezig · ⬜️ open
> **Impact:** H / M / L · **Effort:** L (< ½ dag) / M (½–2 dagen) / H (> 2 dagen of backend-werk).
> "Backend" = wijziging in het Google Apps Script achter de Sheet (zit nog niet in deze repo).

---

## 1. Hoe er getest is

| Tester | Focus |
| --- | --- |
| **QA** | Functioneel gedrag, edge cases, dataintegriteit, offline, toegankelijkheid, cross-device |
| **UX/Visual designer** | Hiërarchie, leesbaarheid, flow, consistentie, contrast |
| **Motion designer** | Timing, fysica, gesture, perceived performance, reduced-motion |
| **5 gebruikers** | Mara (casual, mobiel) · Jeroen (theekenner) · Wen (100+ entries) · Sofie (slechtziend) · Diego (onderweg/offline) |

---

## 2. Voortgang

**Afgerond:** 9 van de 29 items.

- **Sprint 1** (PR #3): FE-1, FE-3, QA-2, UX-1, A11Y-1, A11Y-2, A11Y-4, INF-1
- **Los** (PR #4): MO-2 drag-to-dismiss · + copy-fix sheettitel ("proeven" → "toevoegen")

---

## 3. Impact × Effort-matrix (✅ = gedaan)

```
   IMPACT
     ▲
   H │  QUICK WINS  (doe eerst)          │  BIG BETS  (plan in)
     │  ✅ FE-1 Zoeken                    │  ⬜️ QA-1 Betrouwbare schrijfbevestiging
     │  ✅ QA-2 Undo bij verwijderen      │  ⬜️ FE-2 Bewerken van entries
     │  ✅ FE-3 Sorteren                  │  ⬜️ QA-3 Datum als ISO opslaan
     │  ✅ A11Y-2 Pinch-zoom toestaan     │
     │ ─────────────────────────────────┼───────────────────────────────
   M │  ✅ A11Y-1 Datumcontrast           │  ⬜️ A11Y-3 Focus-trap in sheet
     │  ✅ A11Y-4 Toast aankondigen       │  ✅ MO-2 Drag-to-dismiss
     │  ✅ UX-1 Wis-filters-knop          │  ⬜️ MO-3 FLIP-filtertransities
     │  ✅ INF-1 SW-cacheversie bumpen    │  ⬜️ FE-10 Dark mode
     │  ⬜️ FE-4 Rijkere statistieken      │  ⬜️ FE-6 Brouwparameters
     │  ⬜️ MO-1 FAB → × morph             │  ⬜️ FE-7 Subscores / 5-sterren
     │                                   │  ⬜️ FE-5 Wishlist · ⬜️ FE-8 Foto
     │ ─────────────────────────────────┼───────────────────────────────
   L │  FILL-INS  (tussendoor)           │  LATER  (lage prioriteit)
     │  ⬜️ UX-2 Scroll-fade soortenrij    │  ⬜️ FE-8 Foto bij thee
     │  ⬜️ MO-4 Haptische feedback        │  ⬜️ FE-11 Engelse vertaling (i18n)
     │  ⬜️ A11Y-5 Tablist-semantiek       │
     │  ⬜️ QA-5 Duplicaatdetectie         │
     │  ⬜️ QA-4 Refocus-reload temmen     │
     └─────────────────────────────────────────────────────────────────▶ EFFORT
          L                    M                    H
```

---

## 4. Backlog — gesorteerd (quick wins bovenaan)

### 🟢 Quick wins · hoge/middel impact, lage effort

| # | Status | ID | Item | Scope | Impact | Effort | Bron |
|---|:------:|----|------|-------|:------:|:------:|------|
| 1 | ✅ | FE-1 | **Zoeken op naam/notitie** (client-side, met wis-knop) | Feature | H | L | Wen |
| 2 | ✅ | QA-2 | **Undo bij verwijderen** (actie-toast, herstelt item + positie) | Bug/UX | H | L | QA |
| 3 | ✅ | FE-3 | **Sorteren** (nieuwste/oudste/naam/beoordeling), onthouden | Feature | M-H | L | Wen |
| 4 | ✅ | A11Y-2 | **Pinch-zoom toestaan** (`user-scalable=no` verwijderd) | A11y | M-H | L | Sofie |
| 5 | ✅ | A11Y-1 | **Datumcontrast** ≥ WCAG AA (muted 5.3:1, faint 4.85:1) | A11y | M | L | UX/Sofie |
| 6 | ✅ | A11Y-4 | **Toast aankondigen** (`role="status"` / `aria-live`) | A11y | M | L | Sofie |
| 7 | ✅ | UX-1 | **"Wis filters"-knop** in de lege staat | UX | M | L | UX |
| 8 | ✅ | INF-1 | **SW-cacheversie per release bumpen** | Infra | M | L | QA |
| 9 | ⬜️ | FE-4 | **Rijkere statistieken** (favoriete soort, gemiddelde per soort) | Feature | M | L-M | UX |
| 10 | ⬜️ | MO-1 | **FAB → × morph** bij openen sheet (continuïteit) | Motion | M | L | Motion |

### 🔵 Big bets · hoge impact, meer effort (vaak backend)

| # | Status | ID | Item | Scope | Impact | Effort | Bron |
|---|:------:|----|------|-------|:------:|:------:|------|
| 11 | ⬜️ | QA-1 | **Betrouwbare schrijfbevestiging** — Apps Script CORS/JSONP-respons i.p.v. blind "opgeslagen" | Data/Bug | H | M | QA |
| 12 | ⬜️ | FE-2 | **Bewerken van entries** (`update`-actie in backend + edit-sheet) | Feature | H | M-H | Diego |
| 13 | ⬜️ | QA-3 | **Datum als ISO opslaan** (enabler voor echte sortering/tijdlijn) | Data | M-H | M | QA |
| 14 | ⬜️ | A11Y-3 | **Focus-trap + focus-return** in de bottom-sheet | A11y | M | M | QA |
| 15 | ✅ | MO-2 | **Drag-to-dismiss** op de sheet (gesture met velocity) | Motion | M | M | Motion |

### ⚪ Fill-ins · lage effort, lagere impact (pak tussendoor mee)

| # | Status | ID | Item | Scope | Impact | Effort | Bron |
|---|:------:|----|------|-------|:------:|:------:|------|
| 16 | ⬜️ | UX-2 | Scroll-fade/affordance op de soort-filterrij | UX | L-M | L | UX |
| 17 | ⬜️ | MO-4 | Haptische feedback (`navigator.vibrate`) bij opslaan/verwijderen | Motion | L | L | Mara |
| 18 | ⬜️ | UX-3 | Rijkere lege/onboarding-staat eerste keer | UX | M | L-M | UX |
| 19 | ⬜️ | A11Y-5 | Rating-filter correcte `role="tab"`/`aria-selected` | A11y | L | L | QA |
| 20 | ⬜️ | QA-5 | Duplicaatwaarschuwing bij gelijke naam | Bug | L | L | QA |
| 21 | ⬜️ | QA-4 | Refocus-reload temmen (debounce / niet her-animeren) | Bug/Perf | L-M | L | Diego |

### 🟠 Later · plan bewust in of parkeer

| # | Status | ID | Item | Scope | Impact | Effort | Bron |
|---|:------:|----|------|-------|:------:|:------:|------|
| 22 | ⬜️ | FE-10 | Dark mode | Feature | M | M-H | — |
| 23 | ⬜️ | MO-3 | FLIP-positietransities bij filteren | Motion | M | M-H | Motion |
| 24 | ⬜️ | FE-6 | Brouwparameters (temp/tijd/hoeveelheid) | Feature | M | M | Jeroen |
| 25 | ⬜️ | FE-7 | Subscores / 5-sterren (aroma, smaak) | Feature | M | M | Jeroen |
| 26 | ⬜️ | FE-5 | Wishlist — "nog te proberen" | Feature | M | M | — |
| 27 | ⬜️ | FE-9 | Export (CSV) / delen | Feature | L-M | L-M | — |
| 28 | ⬜️ | FE-8 | Foto bij de thee (verpakking) | Feature | M | H | — |
| 29 | ⬜️ | FE-11 | Engelse vertaling (i18n) | Feature | L-M | M | — |

---

## 5. Per scope (samenvatting)

- **Bugs / dataintegriteit:** ✅ QA-2 · ⬜️ QA-1, QA-3, QA-4, QA-5
- **Toegankelijkheid:** ✅ A11Y-1, A11Y-2, A11Y-4 · ⬜️ A11Y-3, A11Y-5
- **UX / visueel:** ✅ UX-1 · ⬜️ UX-2, UX-3, FE-4
- **Motion:** ✅ MO-2 · ⬜️ MO-1, MO-3, MO-4
- **Infra:** ✅ INF-1
- **Nieuwe features:** ✅ FE-1, FE-3 · ⬜️ FE-2, FE-4, FE-5, FE-6, FE-7, FE-8, FE-9, FE-10, FE-11

---

## 6. Aanbevolen volgorde

- **Nu (sprint 1):** ✅ afgerond — FE-1, QA-2, FE-3, A11Y-2, A11Y-1, A11Y-4, UX-1, INF-1.
- **Next (sprint 2):** QA-1 Schrijfbevestiging · FE-2 Bewerken · QA-3 ISO-datum · A11Y-3 Focus-trap · MO-1 FAB-morph. *Het backend-trio (QA-1/FE-2/QA-3) vergt Apps Script-werk; bundel dat.*
- **Later:** Dark mode, FLIP, brouwparameters/subscores, foto, export, i18n — op basis van wat gebruikers daarna het meest vragen.

> De meeste **quick wins zijn puur front-end** (één `index.html`) en gaan direct; `main` → Netlify deployt automatisch.
> De **big bets raken de Apps Script-backend** achter de Google Sheet — die code staat nog niet in versiebeheer; overweeg die eerst in de repo te zetten.

---

## Changelog

| Datum | Release | Items |
|-------|---------|-------|
| 2026-06-27 | PR #4 | MO-2 drag-to-dismiss op de bottom-sheet · copy-fix sheettitel ("proeven" → "toevoegen") |
| 2026-06-27 | PR #3 | Sprint 1 quick wins: FE-1, FE-3, QA-2, UX-1, A11Y-1, A11Y-2, A11Y-4, INF-1 · + dit backlog-document |
| 2026-06-27 | PR #2 | Design-overhaul (FAB + bottom-sheet, stats-band, samengevoegde filters, motion) |
| 2026-06-27 | PR #1 | Broncode-recovery + UX-polish, offline-cache & PWA |
