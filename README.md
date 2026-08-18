# Calico Aeronautics

A static aeronautics/aerospace education site. Plain HTML/CSS/JS, no build step, deploys directly to GitHub Pages.

## Deploying

1. Create a new GitHub repository (e.g. `calico-aeronautics`).
2. Push everything in this folder to the repo root.
3. In the repo: **Settings -> Pages -> Source** -> select the `main` branch, folder `/ (root)`.
4. Your site will be live at `https://<your-username>.github.io/calico-aeronautics/` within a minute or two.

No Node, no npm, no build command needed - GitHub Pages serves these files as-is.

## Publishing news

1. Open `/news/news-manifest.json` and add one entry with `title`, `category`, `date`, `summary`, `link` (a real source URL), and optionally `wikiImage` (a Wikipedia page title to pull a photo from).
2. Commit and push. The card appears automatically on the News page.

## Project structure

```
index.html               Homepage
about.html                Mission / philosophy
news.html                 Aviation news (manifest-driven)
competitions.html         Real aerospace/aviation competitions
iconic-aircraft.html      Click-through fact sheets for legendary aircraft
scientists.html           Aviation & aerospace pioneers
calculators.html          23 flight-mechanics calculators
formulas.html             Aeronautics + core mechanics formula library (LaTeX)
simulations.html          12 real physics simulations
timeline.html             History of Aeronautics (34 milestones)
map.html                  Interactive map of real aviation history locations
aircraft-anatomy.html     Parts of an aircraft, explained
aircraft-database.html    Fastest/most-produced aircraft + performance chart
resources.html            Aviation books, courses, videos, Python notebook
periodic-table.html       Interactive periodic table
si-units.html              SI unit reference
quizzes.html               Quizzes & flashcards
astronomy-tools.html       Astrophysics calculators
iphyc.html                  IPhyC competition page
contact.html                Contact links
404.html                    Not-found page

css/style.css              All design tokens + styles
js/layout.js                Shared nav/footer, theme switcher, mobile menu
js/background.js            Sky background (Day: sun+clouds, Night: stars), drifting plane silhouette
js/cat.js                   Wandering calico cat easter egg
js/i18n.js                  EN/TR/FR translations for nav, footer, homepage, About

news/news-manifest.json     News index (edit this to publish)
notebooks/                  Python notebook covering the physics behind flight
```

## Themes

Two themes: **Night** (default, dark sky with stars) and **Day** (light sky with sun and clouds), switchable from
the nav dropdown and persisted via `localStorage`. Both are full palette flips defined via CSS custom properties
in `css/style.css` under `:root` (Night) and `[data-theme="day"]` (Day).

## Notes

- No dependencies except KaTeX (formula rendering), Leaflet (the aviation map), `marked.js` was removed along with
  the Articles section, and Google Fonts. Everything else is vanilla JS.
- Live data comes from free, no-API-key sources: Wikipedia's summary API (photos throughout the site) and
  OpenStreetMap/CARTO tiles (the map).
- Mobile nav collapses under 860px; reduced-motion preference disables background animation.
