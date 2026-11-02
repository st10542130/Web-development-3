# FoodForward SA Website

A multi-page website for **FoodForward SA**, a foodbank organisation that recovers quality surplus food and helps reduce hunger in South Africa.

- **Part 2:** HTML structure, external CSS, responsive layout.
- **Part 3 (this version):** JavaScript interactivity, SEO, form validation, AJAX submission and deployment.

**Live site:** `https://yourusername.github.io/foodforward-sa/` *(replace with your deployed link)*
**Repository:** `https://github.com/yourusername/foodforward-sa` *(replace with your repository link)*

---

## Project structure

```
foodforward-sa/
|-- index.html          Home (hero, welcome cards, dynamic "Latest Updates")
|-- about.html          About Us (tabs + FAQ accordion)
|-- services.html       Products and Services (dynamic list, search, filter, sort, modal)
|-- gallery.html        Gallery (category filter + lightbox modal)
|-- enquiry.html        Service enquiry form (instant cost / availability response)
|-- contact.html        Contact form (email compilation) + Leaflet map
|-- 404.html            Custom "page not found" page
|-- style.css           Single external stylesheet
|-- favicon.svg
|-- robots.txt
|-- sitemap.xml
|-- _headers            Security headers (used automatically by Netlify)
|-- gallery/            Optimised .webp images with descriptive file names
`-- js/
    |-- main.js         Navigation, scroll animations, accordion, tabs, modal, back-to-top
    |-- data.js         Services, updates and enquiry pricing data
    |-- services.js     Dynamic services list, live search, filter, sort, details modal
    |-- updates.js      Dynamic "Latest Updates" with Load more (home page)
    |-- gallery.js      Gallery filter + lightbox
    |-- forms.js        Validation, error handling, AJAX submission, email + quote logic
    `-- map.js          Leaflet interactive map + "Find my nearest area"
```

---

## Part 3 requirements: how each one was answered

### 2.1 Interactive elements

| Requirement | Implementation | Where |
|---|---|---|
| **Accordion** | FAQ accordion with `aria-expanded`/`aria-controls`, one panel open at a time, animated height. Written in plain JavaScript (no framework needed). | `about.html`, `js/main.js` |
| **Tabs** | Four-tab "About" section using `role="tablist"`, with mouse **and** keyboard (arrow, Home, End) support. | `about.html`, `js/main.js` |
| **Modals** | One reusable modal (`FF.openModal`) used for service details and gallery lightbox. Has a focus trap, closes with Esc / overlay click / close button, and restores focus. | `js/main.js`, `js/services.js`, `js/gallery.js` |
| **Interactive map** | **Leaflet 1.9.4** with OpenStreetMap tiles, markers with popups, auto-fit bounds, and a "Find my nearest area" button using the Geolocation API. | `contact.html`, `js/map.js` |
| **Animations and transitions** | CSS: fade-up hero, card hover lift, button hover, accordion slide, tab fade, modal pop, loading skeleton shimmer. JavaScript: scroll-reveal using `IntersectionObserver`, back-to-top button, animated card entry. All animation respects `prefers-reduced-motion`. | `style.css`, `js/main.js` |
| **Advanced DOM manipulation** | Elements are built with `createElement`/`appendChild` (never `innerHTML` with user data), `<select>` options are generated from data, live character counters, classes/ARIA attributes toggled on state, URL query (`?service=`) pre-selects the enquiry form. | all `js/` files |

### 2.2 Dynamic content

| Requirement | Implementation |
|---|---|
| **Dynamically load content** | The services list is rendered from the `FF.services` data array (with a loading skeleton). "Latest Updates" on the home page are loaded from `FF.updates` three at a time with a **Load more** button. A `<noscript>` fallback keeps the service content readable without JavaScript. |
| **Search, filter and sort** | `services.html` has a live, debounced **search**, a **category filter**, **sorting** (A-Z, Z-A, by category), a result counter (`aria-live`), an empty-state message and a **Clear filters** button. The gallery also has category filter buttons. |

### 3. SEO

| Item | What was done |
|---|---|
| **Keyword research** | Primary keywords: *foodbank South Africa, surplus food recovery, reduce hunger, food donation, volunteer, FoodForward SA*. Secondary: *warehouse foodbanking, virtual foodbanking, mother and child nutrition, food gardens, corporate partnerships*. Each page targets a different keyword group (see table below) and uses it naturally in the title, H1, headings, body text and alt text. |
| **Title tags and meta descriptions** | Unique, descriptive `<title>` (under about 65 characters) and unique `<meta name="description">` (about 150 characters) on every page. |
| **Header tags** | One `<h1>` per page, followed by logical `<h2>`/`<h3>` headings. |
| **Image optimisation** | Descriptive file names (`food-gardens.webp`, not `Food Gardens.webp`), meaningful `alt` text, `width`/`height` attributes (stops layout shift), `loading="lazy"`, and modern `.webp` format. |
| **URL structure** | Clean, lowercase, descriptive names: `index.html`, `about.html`, `services.html`, `gallery.html`, `enquiry.html`, `contact.html` (no spaces). |
| **Internal linking** | Navigation on every page plus contextual links (FAQ answers link to the enquiry, services and contact pages; the services page links to enquiry; the enquiry page links to contact). |
| **Mobile-friendliness** | `viewport` meta tag, fluid grid with 900px / 700px / 600px breakpoints, hamburger menu on small screens, large touch targets. |
| **Backlinks** | Share links and an outbound link to the official organisation site. Practical plan to build backlinks: ask partner organisations, volunteer groups and the school to link to the site; list it in community directories. *(Backlinks cannot be created from the code alone.)* |
| **Social media** | Open Graph and Twitter Card meta tags (nice previews when shared) plus Facebook / X / LinkedIn / WhatsApp share links in the footer. |
| **Local SEO** | `lang="en-ZA"`, South African phone validation, `NonprofitOrganization` JSON-LD structured data with `areaServed: South Africa`, and a map of service areas. |
| **robots.txt** | Allows all crawlers and points to the sitemap. |
| **sitemap.xml** | Lists all six pages with `lastmod`, `changefreq` and `priority`. |
| **Page speed** | No frameworks (only Leaflet, loaded on the contact page only), `defer` on all scripts, lazy-loaded images, small `.webp` files, one stylesheet, no render-blocking JavaScript. |
| **Security** | Content-Security-Policy meta tag (no inline scripts), Subresource Integrity (`integrity`) on Leaflet, `rel="noopener noreferrer"` on external links, safe DOM building (`textContent`, no `innerHTML` with user input), input length limits, honeypot field against bots, `_headers` file (X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy), HTTPS provided by the host. |

Keyword targeting per page:

| Page | Focus keywords |
|---|---|
| Home | foodbank South Africa, surplus food recovery, reduce hunger |
| About | vision mission values, community development |
| Products and Services | warehouse foodbanking, virtual foodbanking, food gardens, nutrition |
| Gallery | food recovery, food distribution, volunteers |
| Enquiry | sponsor food parcels, corporate partnership cost |
| Contact | donate food, volunteer, contact FoodForward SA |

### 4. Form functionality and validation

| Requirement | Implementation |
|---|---|
| **`enquiry.html`** | Enquire about a service. After validation the page **processes the input and responds** with an estimated **cost** (quantity x unit price), **availability**, and extra notes (for example weekend dates or the next garden intake). The cost can also be seen live while typing. |
| **`contact.html`** | General message form (name, email, optional phone, reason for contact, full message). After validation the data is **compiled into an email** (To / Subject / Body preview) and the user can send it with one click to the recipient set in `js/forms.js` (`RECIPIENT`). |
| **Form elements** | `input` (text, email, tel, number, date), `select`, `textarea`, radio group in a `fieldset`/`legend`, labels linked with `for`/`id`. |
| **Validation (HTML5 + JavaScript)** | HTML5 attributes (`required`, `minlength`, `maxlength`, `min`, `max`, `type`) plus JavaScript rules: name (letters, spaces, hyphens, apostrophes, 2-60 characters), email format, **South African phone number** (`012 345 6789` or `+27 82 123 4567`), message length (10-1000), whole-number quantity (1-10 000), date (not in the past, within 12 months), required choice. `novalidate` is used so our own friendly messages are shown instead of browser pop-ups. |
| **Client-side validation and error handling** | Validates on blur, re-validates while typing, and on submit focuses the first invalid field. Messages are shown under each field (`role="alert"`), fields get red/green borders and `aria-invalid`. A summary message appears at the bottom. |
| **AJAX submission** | `fetch()` sends `FormData` asynchronously with no page reload, shows a "Sending..." state, success and error messages, and disables the button to prevent double submission. |
| **`action` attribute** | Both forms use `action="https://formspree.io/f/YOUR_FORM_ID"`. Create a free form at formspree.io and replace `YOUR_FORM_ID`. Until you do, the AJAX request is **simulated** so the page still works for demonstration. |

---

## Changelog

### [v2.0.0] - 9 October 2026 (Part 3)

**A. Changes made following feedback on Part 2**

1. **Broken navigation fixed.** The navigation linked to `index.html` and `services.html`, but the files were named `home.html` and `product and services.html`. Files were renamed to `index.html` and `services.html` so every link works and URLs are clean.
2. **Removed duplicated CSS.** Part 2 pages each contained a full copy of the stylesheet inside a `<style>` block as well as `style.css`. All pages now use the single external `style.css` only, which makes the site easier to maintain and faster to load.
3. **Inline styles moved into CSS.** Repeated inline `style="..."` attributes were replaced by reusable classes (`.lead`, `.panel`, `.page-title`, `.bullet-list`, `.form-layout`), which also allows a strict Content-Security-Policy.
4. **Heading structure corrected.** The site name was an `<h1>` on every page. It is now a normal title element and each page has one unique `<h1>`.
5. **Gallery improved.** Images were stacked vertically at 400px with `<hr>` lines and file names containing spaces (`Food recovery.webp`). They are now in a responsive grid, have clean file names (`food-recovery.webp`), more descriptive alt text, width/height attributes and lazy loading.
6. **Contact form fixed.** Radio buttons were named like checkboxes in the CSS and had no `name`/`value` data or validation; the form only showed an `alert()`. It now has a `fieldset`/`legend`, proper values, validation and a real submission flow.
7. **Accessibility.** Added skip-to-content link, visible focus outlines, `aria-current` on the active page, labelled form fields, `aria-live` regions, and darker orange (`#b85c0e`) on buttons for better text contrast.
8. **Responsive design.** Added a 700px hamburger menu and an extra tablet breakpoint (900px) alongside the existing 600px breakpoint.

> Note: if your lecturer's Part 2 feedback listed other points, add them to this list with the same level of detail.

**B. New in Part 3**

1. Added `enquiry.html` (instant cost and availability response) and linked it in the navigation.
2. Added `js/` folder with seven scripts (see structure above).
3. Added accordion and tabs on About; dynamic services with search/filter/sort and modal on Products and Services; dynamic updates on Home; filter and lightbox on Gallery; Leaflet map on Contact.
4. Added CSS animations/transitions, scroll-reveal and reduced-motion support.
5. Added full JavaScript form validation, error handling and AJAX submission.
6. Added SEO: unique titles and meta descriptions, canonical URLs, Open Graph/Twitter tags, JSON-LD, `robots.txt`, `sitemap.xml`, `404.html`, favicon.
7. Added security: CSP, SRI, `_headers`, honeypot, safe DOM methods.
8. Added `Home` text: hero section, "Our Work in Pictures" and "Latest Updates".
9. Updated this README (requirements, changelog, references, deployment).

### [v1.0.0] - September 14, 2026 (Part 2)
- Created the external stylesheet `style.css` (Section 2.1) and a global CSS reset (Section 2.2).
- Warm Orange (`#e67e22`) interaction indicators and Emerald Forest Green (`#1b4d3e`) banners are the primary colour palette.
- Added a responsive `@media` breakpoint system that adapts columns below 600px (Section 3.1).
- Added typographic scaling with `rem` and `em` and fluid layout margins (Section 3.2).
- Styled form inputs with a highlighted focus state (`input:focus`) (Section 2.5).

---

## Notes and things to replace before submitting

- **Site URL.** `https://yourusername.github.io/foodforward-sa` appears in the canonical tags, Open Graph tags, `sitemap.xml` and `robots.txt`. Search and replace it with your real deployed URL.
- **Form endpoint.** Replace `YOUR_FORM_ID` in `contact.html` and `enquiry.html` (Formspree) to receive real submissions.
- **Email recipient.** Change `RECIPIENT` at the top of `js/forms.js` to the organisation's real email address.
- **Pricing and sample posts.** Prices in `js/data.js` and the "Latest Updates" are illustrative demo data, not real FoodForward SA figures.
- **Map locations.** Markers are at city centres as examples; replace with real addresses in `js/map.js`.

---

## Deployment

**GitHub Pages**
1. Create a repository and push the project (see commands below).
2. Repository **Settings > Pages > Build and deployment > Deploy from a branch**, choose `main` and `/ (root)`.
3. After a minute the site is live at `https://yourusername.github.io/repository-name/`.

**Netlify (alternative)**
1. Log in to Netlify and choose **Add new site > Deploy manually** (drag and drop the folder) or connect the GitHub repository.
2. The `_headers` file is applied automatically.

**Git commands and suggested commit messages**

```bash
git init
git add .
git commit -m "Part 3: rename pages, remove duplicated CSS, add Part 2 feedback fixes"
git add js/
git commit -m "Add JavaScript: accordion, tabs, modal, map, search and form validation"
git add robots.txt sitemap.xml 404.html
git commit -m "Add SEO files: robots.txt, sitemap.xml, meta tags and structured data"
git commit -am "Update README with Part 3 changelog and references"
git branch -M main
git remote add origin https://github.com/yourusername/foodforward-sa.git
git push -u origin main
```

*(Commit regularly in your own repository, as the brief requires. A few separate descriptive commits show your progress better than one large one.)*

---

## References

Accessed 9 October 2026.

- Leaflet (2023) *Leaflet: an open-source JavaScript library for interactive maps*. Available at: https://leafletjs.com/
- OpenStreetMap Foundation (n.d.) *OpenStreetMap copyright and licence*. Available at: https://www.openstreetmap.org/copyright
- Mozilla (n.d.) *MDN Web Docs: JavaScript, DOM, Fetch API, IntersectionObserver, Geolocation API, Constraint validation*. Available at: https://developer.mozilla.org/
- W3C (n.d.) *WAI-ARIA Authoring Practices Guide: Tabs, Accordion and Dialog (Modal) patterns*. Available at: https://www.w3.org/WAI/ARIA/apg/
- W3C (2018) *Web Content Accessibility Guidelines (WCAG) 2.1*. Available at: https://www.w3.org/TR/WCAG21/
- Google (n.d.) *Search Engine Optimization (SEO) Starter Guide*. Available at: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Sitemaps.org (n.d.) *Sitemaps XML format*. Available at: https://www.sitemaps.org/protocol.html
- The Web Robots Pages (n.d.) *About /robots.txt*. Available at: https://www.robotstxt.org/
- Schema.org (n.d.) *NonprofitOrganization*. Available at: https://schema.org/NonprofitOrganization
- Formspree (n.d.) *Formspree: form backend*. Available at: https://formspree.io/
- U.S. Environmental Protection Agency (n.d.) *Food Recovery Hierarchy*. Available at: https://www.epa.gov/sustainable-management-food/food-recovery-hierarchy (diagram used in the gallery).
- FoodForward SA (n.d.) *FoodForward SA*. Available at: https://foodforwardsa.org
- GitHub (n.d.) *GitHub Pages documentation*. Available at: https://docs.github.com/en/pages
- Netlify (n.d.) *Netlify documentation*. Available at: https://docs.netlify.com/
- Gallery images: Community Support, Food Distribution, Food Gardens, Foodbank Warehouse and Volunteers images supplied by the student for this assignment; please add the original image sources/credits here.
