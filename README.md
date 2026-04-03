# Refactored Personal Site

This refactor keeps the same HTML structure, class names, and page layout while moving repeated JavaScript logic into shared modules:

- `assets/js/lib/data.js` — shared JSON loading with caching
- `assets/js/lib/components.js` — shared card renderers
- `assets/js/lib/utils.js` — escaping, sorting, and date helpers

The page entry files remain:
- `assets/js/home.js`
- `assets/js/about.js`
- `assets/js/projects.js`
- `assets/js/experience.js`
- `assets/js/shared.js`
