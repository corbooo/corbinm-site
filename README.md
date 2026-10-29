# Corbin Moseman — Portfolio

A static portfolio built with HTML, CSS, JavaScript, and JSON.

Run a local server from this folder (for example, VS Code Live Server or `python3 -m http.server 8000`). The Projects page fetches JSON, so open the site through the server rather than double-clicking an HTML file.

## Structure

- `index.html`, `about/`, `projects/`, `experience/` — page markup
- `assets/css/styles.css` — shared layout, typography, navigation, footer, and hero components
- `assets/css/pages/` — page-specific layout and interactions
- `assets/js/shared.js` — footer year
- `assets/js/` — each page's behavior
- `assets/data/` — project, work, and education data
- `assets/img/` and `assets/Resume.pdf` — existing assets

## Naming

- CSS uses `block__element--modifier`, with simple standalone classes such as `section-title` and `editorial-link`.
- Shared hero elements use `hero__…`; page-specific elements use `home__…`, `about__…`, or `projects__…`.
- IDs use kebab-case and a page prefix, except the existing `#chapters` anchor and shared `#year` hook.
- JavaScript variables and functions use camelCase; state classes use `is-…` or `has-…`.

Experience is still in progress. Its markup, stylesheet, script, and data were excluded from this refinement.
