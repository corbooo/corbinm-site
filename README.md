# Corbin Moseman — Portfolio

A personal portfolio built with HTML, CSS, JavaScript, and JSON.

## Development

Run the project with VS Code Live Server or:

```sh
python3 -m http.server 8000
```

The Projects and Experience pages load JSON files, so the website
should be served locally rather than opened directly as HTML files.

## Structure

- `index.html`, `about/`, `projects/`, `experience/` — page markup
- `assets/css/styles.css` — shared styling and components
- `assets/css/pages/` — page-specific styles
- `assets/js/shared.js` — JSON loading, motion preference, scroll reveals, dialog closing, and footer year
- `assets/js/` — page-specific functionality
- `assets/data/` — projects, education, work, and skills
- `assets/img/` — website assets and project screenshots
- `assets/Resume.pdf` — résumé
- `lab/` — isolated experiments with their own styles

## Conventions

Shared components live in `styles.css`; page files contain their layout and overrides. Projects and Experience use the `site-dialog` component while retaining their own dimensions and content styles.

Classes follow `block__element--modifier`; IDs use kebab-case and JavaScript uses camelCase. Use `loadData(name)` for files in `assets/data/`, and `observeReveals(elements)` for dynamically rendered reveal elements. Keep animation geometry and page-specific timing in the relevant page files.
