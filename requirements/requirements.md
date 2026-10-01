# Mantrac Egypt — prototype requirements

Phase 2 (greyscale prototypes), version 0.1, 1 October 2026.
Source: ClerksWell phase 1 review of mantracgroup.com/en-eg (Mantrac Website Opportunities, ideas 1–57).
Each requirement maps to the idea numbers it delivers. Sections in `src/` carry `<!-- Module (Rnn) -->` comments.

## Global

| ID | Requirement | Ideas |
|----|-------------|-------|
| R01 | Prototype navigator: pack name, Overview, numbered links 1–5, current highlighted, Notes switch | — |
| R02 | Notes switch off by default, remembered for the session; shows "What we're proposing / Why" panel and numbered annotations | — |
| R03 | Previous / next pager as the footer of every prototype page | — |
| R04 | One set of approved figures used everywhere (countries, branches, technicians) | 39 |
| R05 | Numbers formatted with commas for thousands; US/Metric choice remembered across pages | 3 |
| R06 | One stock and availability vocabulary across new, used and rental, shown as text badges | 7 |
| R07 | Mobile contact dock: Call 19266, WhatsApp, Branch, Chat — replaces four floating widgets | 26 |
| R08 | Visible labels on every field; consent wording wherever marketing is involved | 20, 47, 48 |
| R09 | Context carried between pages with `?param=` links and a sessionStorage fallback | — |
| R10 | Governorate chosen once and remembered, used to pick the nearest branch | 11, 24 |

## 1 — Find the right Cat machine

| ID | Requirement | Ideas |
|----|-------------|-------|
| R11 | Listing shows current range by default; previous models behind a toggle labelled for parts and service | 1 |
| R12 | Three specs per family with the same labels on every card | 2 |
| R13 | Filters by size class, dig depth, application, emissions and availability, with counts; no single-option filters | 4 |
| R14 | Three-question machine finder (job, material, site) that ends in two or three suggested models | 5 |
| R15 | Sticky compare tray (up to 3), kept across pages; compare page side by side | 6 |
| R16 | Product card action reads "Add to quote" and adds to the enquiry basket | 8 |
| R17 | Clean product URLs under the family path (shown in prototype as the address pattern) | 9 |
| R18 | Price guidance: "from" price or finance from, labelled indicative, and "Ask for today's price on WhatsApp" | 10 |
| R19 | Product page shows the nearest branch and the product line contact for the chosen governorate | 11 |

## 2 — Used and rental you can browse

| ID | Requirement | Ideas |
|----|-------------|-------|
| R20 | Used listing with photo count, branch, year, hours, tier badge and price band, filterable by family, tier and branch | 13 |
| R21 | One name per certification tier with a link to what it covers | 14 |
| R22 | Used machine page with gallery, inspection summary, tier cover and enquire / add to quote | 13, 14 |
| R23 | Rental: choose dates and location, see what's free, rates and hire periods, send a booking request | 16 |
| R24 | Link to Mantrac's Cat Rentals store | 15 |
| R25 | Intros describe what can be arranged, not "the widest range" | 17 |
| R26 | Sell or trade in: short valuation request with photos | 18 |
| R27 | Stock alerts with explicit consent | 19 |
| R28 | No app promotion until an app exists | 12 |

## 3 — One enquiry, routed to the right person

| ID | Requirement | Ideas |
|----|-------------|-------|
| R29 | Enquiry basket: machines, used, rental, attachments and services in one enquiry with quantities and needed-by date | 23 |
| R30 | Five-field labelled form: what you need, name, mobile (WhatsApp OK), company, message | 20 |
| R31 | Clean dropdowns from CRM picklists, no duplicates | 21 |
| R32 | Native form on mantracgroup.com (no iframe) | 22 |
| R33 | Route by governorate and product line; confirmation with reference, team and reply time | 24 |
| R34 | WhatsApp prefilled with the machine or basket | 25 |
| R35 | Hotline link uses the number that works from Egyptian mobiles | 27 |

## 4 — Offers and finance in EGP

| ID | Requirement | Ideas |
|----|-------------|-------|
| R36 | Promotions hub with current offers; empty state if none | 28 |
| R37 | Offers carry start and end dates and drop off automatically; terms link; machines they apply to | 29 |
| R38 | Finance estimator in EGP (machine, deposit, term) labelled indicative, sent to the finance team | 30 |
| R39 | Finance options named, with who qualifies and what to prepare | 31 |
| R40 | Running cost calculator in EGP with assumptions shown | 32 |
| R41 | Newsletter sign-up with consent, content, frequency and privacy link | 48 |

## 5 — Mantrac near you

| ID | Requirement | Ideas |
|----|-------------|-------|
| R42 | Branch finder filtered by service and governorate, map and list, open now, phone, WhatsApp, directions | 33 |
| R43 | Book a service visit: machine, hours, problem, location, urgency, date; reference on confirmation | 34 |
| R44 | One measurable service promise | 35 |
| R45 | Parts help: the right online store, account setup, parts counter and hotline | 36 |
| R46 | "My Mantrac" entry point for customer tools | 37 |
| R47 | Correct branch names (Abu Simbel, Marsa Alam) | 38 |

## Technical

| ID | Requirement | Ideas |
|----|-------------|-------|
| T01 | Every page at 1440px and 390px with no horizontal overflow and no script errors | 49, 55 |
| T02 | Keyboard operable, Escape closes overlays, visible focus | 51 |
| T03 | Build to `docs/` with `docs/.nojekyll` for GitHub Pages | — |
