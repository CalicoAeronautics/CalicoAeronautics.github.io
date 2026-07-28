# Calico Physics

A static physics/math education site. Plain HTML/CSS/JS, no build step, deploys directly to GitHub Pages.

## Deploying

1. Create a new GitHub repository (e.g. `calico-physics`).
2. Push everything in this folder to the repo root.
3. In the repo: **Settings &rarr; Pages &rarr; Source** &rarr; select the `main` branch, folder `/ (root)`.
4. Your site will be live at `https://<your-username>.github.io/calico-physics/` within a minute or two.

No Node, no npm, no build command needed - GitHub Pages serves these files as-is.

## Publishing a new article (no coding)

1. Write your article as a Markdown file and save it in `/articles/your-slug.md`.
   - Start the file with a `# Title` heading.
   - Use `##` for subheadings, normal paragraphs, and `-` for bullet lists.
2. Open `/articles/manifest.json` and add one entry:
   ```json
   {
     "slug": "your-slug",
     "title": "Your Article Title",
     "category": "Physics",
     "tags": ["Tag One", "Tag Two"],
     "readTime": 8,
     "date": "2026-08-01",
     "excerpt": "One sentence describing the article.",
     "file": "articles/your-slug.md"
   }
   ```
3. Commit and push both files. The card appears automatically on the Articles page - searchable and filterable by tag, no other changes needed.

`category` should be one of: `Physics`, `Mathematics`, `Astronomy`, `Engineering`, `Olympiads`, `Space Exploration` (or add a new one - the site adapts automatically).

## Project structure

```
index.html            Homepage
about.html            Mission / philosophy
articles.html         Article listing (search + tag filter)
article.html           Single-article template (reads ?slug=)
problem-of-week.html  Problem of the Week (hint/solution reveal)
olympiad.html         Olympiad Hub
resources.html        Digital library (placeholder)
space-explorer.html   Interactive solar system explorer (placeholder)
news.html             Science news summaries (placeholder)
calculators.html      Physics calculators (placeholder)
formulas.html         Formula library (placeholder)
simulations.html      Interactive simulations (placeholder)
timeline.html         History of physics timeline (placeholder)
map.html              Discovery map (placeholder)
scientists.html       Great Scientists profiles (placeholder)
iphyc.html            IPhyC competition section (placeholder)
contact.html          Contact links
404.html              Not-found page

css/style.css         All design tokens + styles (one file, one source of truth)
js/layout.js          Injects shared nav/footer, theme switcher, mobile menu
js/background.js      Starfield canvas (drifting stars + shooting stars every 15-20s)
js/cat.js             Wandering calico cat easter egg
js/articles.js        Article list/search/tags + single-article markdown rendering
js/problem.js         Hint/solution toggle for Problem of the Week

articles/manifest.json   Article index (edit this to publish)
articles/*.md            Article content (plain Markdown)
```

## Themes

Four themes are built in and switchable from the nav dropdown (persisted via `localStorage`):
Dark Space (default), Nebula Blue, Deep Purple, Solar Gold. All four are defined as CSS custom-property
overrides in `css/style.css` - add a new theme by adding one more `[data-theme="..."]` block and
one more `<option>` in `js/layout.js`.

## What's built vs. placeholder

**Fully built:** homepage, about, articles (search + tags + markdown rendering), problem of the week,
olympiad hub, contact, 404, shared nav/footer/theme system, starfield background, wandering cat easter egg,
calculators (7 working), formula library (5 equations), great scientists (7 bios + modal), news (manifest-driven),
resources, timeline (scroll-animated), simulations (8 interactive canvases), discovery map (interactive pins),
space explorer (click-through planets + moons), IPhyC.

**All sections from the original vision are now built.** Anything you want deepened further (more articles,
more scientists, more news items, real API integrations for Space Explorer) is just a matter of adding data,
not new code.

## Language support

A language switcher (EN/TR/FR) is built into the nav and persists via `localStorage`. It's fully wired
for the **nav, footer, homepage, and About page**. The rest of the site (articles, calculators, formula
library, etc.) stays in English when you switch languages - translating everything by hand would be a huge,
error-prone job, so the system is built to be extended gradually instead:

To translate more text on a page:
1. Add `data-i18n="section.key"` and `data-i18n-default="Original English text"` to the element.
2. Add matching `tr` / `fr` entries in `js/i18n.js` under `TRANSLATIONS`.
3. That's it - `applyPageTranslations()` picks it up automatically, including on language switch.

Thai was mentioned as a "later" language in the original vision - add it the same way: a new `th` block
in `TRANSLATIONS`, plus one more `<option>` in the `LANGUAGES` array in `js/layout.js`.

## Notes


- No dependencies except one CDN script (`marked.js`) for Markdown rendering on `article.html`, and Google Fonts.
- Everything else is vanilla JS - no framework, no build tooling.
- Mobile nav collapses under 860px; reduced-motion preference disables the starfield drift, shooting stars, and wandering cat animation.
