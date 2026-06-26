# Theemaas Dagboek 🍵

Een persoonlijk theejournaal als installeerbare web-app (PWA). Je houdt bij
welke theeën je hebt geproefd, met soort, beoordeling (👍 / 😐 / 👎) en een
smaaknotitie. De data wordt opgeslagen in een **Google Sheet** via een Google
**Apps Script**-webapp.

Live: https://theetracker.netlify.app

## Bestanden

| Bestand | Doel |
| --- | --- |
| `index.html` | De volledige app (HTML + CSS + JS, één bestand) |
| `manifest.json` | PWA-manifest (naam, kleuren, iconen) |
| `sw.js` | Service worker — cachet de app-shell zodat hij offline opent |
| `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | App-iconen |
| `apple-touch-icon.png`, `favicon-32.png` | iOS-/browser-iconen |

> De **backend** (het Apps Script dat naar de Google Sheet leest/schrijft) zit
> niet in deze repo — die code beheer je in de Google Apps Script-editor. De
> URL ervan staat als `SCRIPT_URL` boven in het `<script>`-blok van `index.html`.

## Functies

- Thee toevoegen met naam, soort, beoordeling en notitie.
- Filteren op beoordeling én op soort (filters blijven bewaard).
- **Offline-cache**: de laatste lijst staat in `localStorage`, dus de app toont
  direct iets en werkt zonder netwerk. Wijzigingen die je offline maakt worden
  in een wachtrij gezet en automatisch gesynct zodra je weer online bent
  (zichtbaar via de balk boven in beeld + een "niet gesynct"-label).
- **PWA**: installeerbaar op je beginscherm; opent als losse app.
- Skeleton-loading, inline verwijder-bevestiging (geen browser-pop-up),
  en alle invoer wordt veilig ge-escaped bij het tonen.

## Deployen naar Netlify

De site werd voorheen gedeployed als één los `index.html`. Nu zijn er meerdere
bestanden, dus deploy de **hele map**:

- **Drag & drop**: sleep de projectmap (met alle bestanden) naar het Netlify
  deploy-venster — niet alleen `index.html`.
- **Of koppel de repo** aan Netlify (Add new site → Import from Git → deze
  repo, geen build command, publish directory `/`). Dan deployt elke push
  automatisch.

> Upload je per ongeluk alleen `index.html`? Dan blijft de app gewoon werken,
> maar mis je de PWA-installatie en het offline openen (manifest/service worker
> worden dan niet gevonden).

## Lokaal draaien

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

Een service worker en `localStorage` werken alleen op `http://localhost` of via
HTTPS — niet als je het bestand direct met `file://` opent.
