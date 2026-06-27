# Theemaas — Test & Backlog

**App:** Theemaas Dagboek · **Live:** https://theetracker.netlify.app
**Geteste versie:** `039879c` (overhaul: FAB + bottom-sheet, stats-band, samengevoegde filters, verfijnde kaarten + motion)
**Datum testronde:** 27 juni 2026

Bevindingen van een QA-tester, de UX/visual designer, de motion designer en 5 gebruikers,
geprioriteerd met een **Impact × Effort-matrix**. Quick wins (hoge impact / lage inspanning)
staan bovenaan de backlog.

> Schaal — **Impact:** H (hoog) / M (midden) / L (laag) · **Effort:** L (< ½ dag) / M (½–2 dagen) / H (> 2 dagen, of backend-werk in Apps Script).
> "Backend" = wijziging nodig in het Google Apps Script achter de Sheet (zit niet in deze repo).

---

## 1. Hoe er getest is

| Tester | Focus |
| --- | --- |
| **QA** | Functioneel gedrag, edge cases, dataintegriteit, offline, toegankelijkheid, cross-device |
| **UX/Visual designer** | Hiërarchie, leesbaarheid, flow, consistentie, contrast |
| **Motion designer** | Timing, fysica, gesture, perceived performance, reduced-motion |
| **5 gebruikers** | Mara (casual, mobiel) · Jeroen (theekenner) · Wen (100+ entries) · Sofie (slechtziend) · Diego (onderweg/offline) |

---

## 2. Bevindingen per tester

### 🔍 QA-tester
- **QA-1** Schrijfacties gebruiken `mode:'no-cors'`; de app kan een serverfout niet zien en toont **altijd "opgeslagen"**. Bij een falende Apps Script gaat data stil verloren. *(Dataintegriteit)*
- **QA-2** Verwijderen is definitief; na de bevestiging is er **geen undo**. Eén misklik = weg.
- **QA-3** `datum` wordt opgeslagen als gelokaliseerde **tekst** ("12 mei 2026"), niet als sorteerbare datum → echte chronologie/sortering onmogelijk.
- **QA-4** Bij elke terugkeer naar het tabblad (`visibilitychange`) volgt een **volledige reload + her-animatie** van de lijst; voelt onrustig bij vaak wisselen.
- **QA-5** Geen **duplicaatdetectie** — dezelfde thee kan ongemerkt twee keer in de lijst komen.

### 🎨 UX / Visual designer
- **A11Y-1** Datumtekst (`--faint #B7AEA1` op wit) heeft een contrast van ~2:1 — **faalt WCAG AA** voor kleine tekst.
- **UX-1** Bij een lege filtercombinatie is er **geen "wis filters"-knop**; de gebruiker moet zelf twee filters terugzetten.
- **UX-2** De soort-filterrij scrollt horizontaal maar mist een **fade/affordance** aan de rand → niet duidelijk dat er meer staat.
- **UX-3** Eerste-keer-ervaring is mager; de lege staat kan rijker/uitnodigender (onboarding-hint).
- **FE-4** De stats-band toont alleen `% lekker`; vraagt om **meer inzicht** (favoriete soort, gemiddelde per soort).

### 🎞️ Motion designer
- **MO-1** De FAB **verdwijnt** bij het openen van de sheet i.p.v. te **morphen** naar een sluit-icoon (+ → ×). Gemiste continuïteit.
- **MO-2** De bottom-sheet heeft **geen drag-to-dismiss**; op mobiel verwacht je 'm weg te kunnen vegen.
- **MO-3** Bij elke filterwissel **re-cascaden alle kaarten**; voelt zwaar bij grote lijsten. FLIP-positietransities zouden eleganter zijn.
- **MO-4** Geen **haptische feedback** (`navigator.vibrate`) bij opslaan/verwijderen op mobiel.
- ✅ `prefers-reduced-motion`-fallback is aanwezig en correct.

### 👥 Gebruikers
- **Mara (casual):** "Toevoegen via de + is fijn en snel." → wil wél **haptische tik** (MO-4) en mist soms dat de toast iets zei.
- **Jeroen (kenner):** "Ik wil **brouwparameters** (temp/tijd/hoeveelheid) en **subscores** voor aroma/smaak, niet alleen duim op/neer." → FE-6, FE-7.
- **Wen (100+ theeën):** "Ik kan niet **zoeken** of **sorteren** — scrollen door honderden kaarten is niet te doen." → FE-1, FE-3.
- **Sofie (slechtziend):** "Ik kon **niet inzoomen** (`user-scalable=no`), en de datums zijn te licht." → A11Y-2, A11Y-1. Screenreader kondigt de toast niet aan → A11Y-4.
- **Diego (onderweg/offline):** "Offline opslaan werkt top." → ergernis: bij elke app-switch springt de lijst opnieuw in beeld (QA-4); en hij wil een **typefout kunnen corrigeren** zonder verwijderen → FE-2.

---

## 3. Impact × Effort-matrix

```
   IMPACT
     ▲
   H │  QUICK WINS  (doe eerst)        │  BIG BETS  (plan in)
     │  FE-1 Zoeken                    │  QA-1 Betrouwbare schrijfbevestiging
     │  QA-2 Undo bij verwijderen      │  FE-2 Bewerken van entries
     │  FE-3 Sorteren                  │  QA-3 Datum als ISO opslaan
     │  A11Y-2 Pinch-zoom toestaan     │
     │ ───────────────────────────────┼───────────────────────────────
   M │  A11Y-1 Datumcontrast           │  A11Y-3 Focus-trap in sheet
     │  A11Y-4 Toast aankondigen       │  MO-2 Drag-to-dismiss
     │  UX-1 Wis-filters-knop          │  MO-3 FLIP-filtertransities
     │  INF-1 SW-cacheversie bumpen    │  FE-10 Dark mode
     │  FE-4 Rijkere statistieken      │  FE-6 Brouwparameters
     │  MO-1 FAB → × morph             │  FE-7 Subscores / 5-sterren
     │                                 │  FE-5 Wishlist · FE-8 Foto
     │ ───────────────────────────────┼───────────────────────────────
   L │  FILL-INS  (tussendoor)         │  LATER  (lage prioriteit)
     │  UX-2 Scroll-fade soortenrij    │  FE-8 Foto bij thee
     │  MO-4 Haptische feedback        │  FE-11 Engelse vertaling (i18n)
     │  A11Y-5 Tablist-semantiek       │  MO-3 (zie boven)
     │  QA-5 Duplicaatdetectie         │
     │  QA-4 Refocus-reload temmen     │
     └───────────────────────────────────────────────────────────────▶ EFFORT
          L                    M                    H
```

---

## 4. Backlog — gesorteerd (quick wins bovenaan)

### 🟢 Quick wins · hoge/middel impact, lage effort

| # | ID | Item | Scope | Impact | Effort | Bron |
|---|----|------|-------|:------:|:------:|------|
| 1 | FE-1 | **Zoeken op naam** (client-side filter over `allTeas`) | Feature | H | L | Wen |
| 2 | QA-2 | **Undo bij verwijderen** (toast met "Ongedaan maken" i.p.v. directe wis) | Bug/UX | H | L | QA |
| 3 | FE-3 | **Sorteren** (nieuwste/oudste/naam/beoordeling), client-side | Feature | M-H | L | Wen |
| 4 | A11Y-2 | **Pinch-zoom toestaan** (`user-scalable=no` verwijderen) | A11y | M-H | L | Sofie |
| 5 | A11Y-1 | **Datumcontrast** ophogen naar ≥ WCAG AA | A11y | M | L | UX/Sofie |
| 6 | A11Y-4 | **Toast aankondigen** (`role="status"` / `aria-live="polite"`) | A11y | M | L | Sofie |
| 7 | UX-1 | **"Wis filters"-knop** in de lege staat | UX | M | L | UX |
| 8 | INF-1 | **SW-cacheversie per release bumpen** (anders verouderde assets) | Infra | M | L | QA |
| 9 | FE-4 | **Rijkere statistieken** (favoriete soort, gemiddelde per soort) | Feature | M | L-M | UX |
| 10 | MO-1 | **FAB → × morph** bij openen sheet (continuïteit) | Motion | M | L | Motion |

### 🔵 Big bets · hoge impact, meer effort (vaak backend)

| # | ID | Item | Scope | Impact | Effort | Bron |
|---|----|------|-------|:------:|:------:|------|
| 11 | QA-1 | **Betrouwbare schrijfbevestiging** — Apps Script CORS/JSONP-respons, zodat de app echte fouten ziet i.p.v. blind "opgeslagen" | Data/Bug | H | M | QA |
| 12 | FE-2 | **Bewerken van entries** (`update`-actie in backend + edit-sheet) | Feature | H | M-H | Diego |
| 13 | QA-3 | **Datum als ISO opslaan** (enabler voor echte sortering/tijdlijn) | Data | M-H | M | QA |
| 14 | A11Y-3 | **Focus-trap + focus-return** in de bottom-sheet | A11y | M | M | QA |
| 15 | MO-2 | **Drag-to-dismiss** op de sheet (gesture met velocity) | Motion | M | M | Motion |

### ⚪ Fill-ins · lage effort, lagere impact (pak tussendoor mee)

| # | ID | Item | Scope | Impact | Effort | Bron |
|---|----|------|-------|:------:|:------:|------|
| 16 | UX-2 | Scroll-fade/affordance op de soort-filterrij | UX | L-M | L | UX |
| 17 | MO-4 | Haptische feedback (`navigator.vibrate`) bij opslaan/verwijderen | Motion | L | L | Mara |
| 18 | UX-3 | Rijkere lege/onboarding-staat eerste keer | UX | M | L-M | UX |
| 19 | A11Y-5 | Rating-filter correcte `role="tab"`/`aria-selected` | A11y | L | L | QA |
| 20 | QA-5 | Duplicaatwaarschuwing bij gelijke naam | Bug | L | L | QA |
| 21 | QA-4 | Refocus-reload temmen (debounce / niet her-animeren) | Bug/Perf | L-M | L | Diego |

### 🟠 Later · plan bewust in of parkeer

| # | ID | Item | Scope | Impact | Effort | Bron |
|---|----|------|-------|:------:|:------:|------|
| 22 | FE-10 | Dark mode | Feature | M | M-H | — |
| 23 | MO-3 | FLIP-positietransities bij filteren | Motion | M | M-H | Motion |
| 24 | FE-6 | Brouwparameters (temp/tijd/hoeveelheid) | Feature | M | M | Jeroen |
| 25 | FE-7 | Subscores / 5-sterren (aroma, smaak) | Feature | M | M | Jeroen |
| 26 | FE-5 | Wishlist — "nog te proberen" | Feature | M | M | — |
| 27 | FE-9 | Export (CSV) / delen | Feature | L-M | L-M | — |
| 28 | FE-8 | Foto bij de thee (verpakking) | Feature | M | H | — |
| 29 | FE-11 | Engelse vertaling (i18n) | Feature | L-M | M | — |

---

## 5. Per scope (samenvatting)

- **Bugs / dataintegriteit:** QA-1, QA-2, QA-3, QA-4, QA-5
- **Toegankelijkheid:** A11Y-1, A11Y-2, A11Y-3, A11Y-4, A11Y-5
- **UX / visueel:** UX-1, UX-2, UX-3, FE-4
- **Motion:** MO-1, MO-2, MO-3, MO-4
- **Infra:** INF-1
- **Nieuwe features:** FE-1 Zoeken · FE-2 Bewerken · FE-3 Sorteren · FE-4 Stats · FE-5 Wishlist · FE-6 Brouwparameters · FE-7 Subscores · FE-8 Foto · FE-9 Export · FE-10 Dark mode · FE-11 i18n

---

## 6. Aanbevolen volgorde

- **Nu (sprint 1):** FE-1 Zoeken · QA-2 Undo · FE-3 Sorteren · A11Y-2 Zoom · A11Y-1 Contrast · A11Y-4 Toast · UX-1 Wis-filters · INF-1 SW-versie. *Allemaal lage effort, samen een grote sprong — en geen backend nodig.*
- **Next (sprint 2):** QA-1 Schrijfbevestiging · FE-2 Bewerken · QA-3 ISO-datum · A11Y-3 Focus-trap · MO-1/MO-2 motion-polish. *Vergt Apps Script-werk; bundel het backend-werk.*
- **Later:** Dark mode, FLIP, brouwparameters/subscores, foto, export, i18n — op basis van wat gebruikers daarna het meest vragen.

> De meeste **quick wins zijn puur front-end** (één `index.html`) en kunnen direct; `main` → Netlify deployt automatisch.
> De **big bets raken de Apps Script-backend** achter de Google Sheet — die code staat nog niet in versiebeheer; overweeg die eerst in de repo te zetten.
