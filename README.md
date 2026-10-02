# Mantrac roadmap prototypes

Clickable prototypes for five improvements to mantracgroup.com/en-eg, prepared by ClerksWell.

**Phase:** 3, designed prototypes · **Version:** 0.2 · **Date:** 2 October 2026

Live site (once GitHub Pages is on): https://hrhlescargotleo.github.io/Mantrac-Roadmap/

## The prototypes

| # | Prototype | Pages |
|---|-----------|-------|
| 1 | Find the right Cat machine | `machines.html`, `machine.html`, `compare.html` |
| 2 | Used and rental you can browse | `used.html`, `used-machine.html`, `rental.html`, `sell.html` |
| 3 | One enquiry, routed to the right person | `enquiry.html` |
| 4 | Offers and finance in EGP | `offers.html`, `finance.html` |
| 5 | Mantrac near you | `branches.html`, `book-service.html` |

Start at `index.html`. The Notes switch in the top bar shows what each prototype proposes and why, with numbered behaviour notes (yellow) and open questions (red). It is off by default and remembered for the browser session.

Machines, stock, prices, rates, dates and people are sample data. Model names and branch names come from mantracgroup.com.

## Publishing on GitHub Pages

The built site is in `docs/`, with an empty `docs/.nojekyll`.

1. Push this repository to GitHub as `Mantrac-Roadmap`.
2. Settings › Pages › Build and deployment › Source: **Deploy from a branch**.
3. Branch: **main**, folder: **/docs**. Save.
4. The site appears at the address above within a minute or two.

The repository and the Pages site are public.

## Working on it

```
node build-includes.js && node validate.js
```

- `src/` is the source. `src/includes/` holds the prototype navigator (`header.html`) and pager and contact dock (`footer.html`), pulled into every page.
- `src/css/base.css`, `components.css` and `proto.css` are structural and greyscale. `theme.css` is the Mantrac design layer (tokens from the phase 1 design system, Roboto as a stand-in for the licensed Univers). Delete it to get the greyscale version back.
- `src/js/photos.js` hotlinks Mantrac photography from mantracgroup.com and Caterpillar product shots as served there. Each image is applied only after it loads; otherwise the illustrated placeholder stays. It only runs when `theme.css` is loaded. Photography © Mantrac Group; product images © Caterpillar Inc.
- Page heads are `<header class="page-head" data-photo="hero:…" data-eyebrow="…">`; cards carry `data-photo` keys that photos.js maps to images.
- `src/js/data.js` is the sample data, `proto.js` the shared behaviour (Notes switch, quote basket, compare tray, units, governorate) and `pages.js` the page behaviour. `wireframe.js` provides tabs, accordions, carousels and modals.
- `requirements/requirements.md` lists requirements R01–R47 and T01–T03, each mapped to the idea numbers in the phase 1 opportunities review. Sections in `src/` carry `<!-- Module (Rnn) -->` comments.
