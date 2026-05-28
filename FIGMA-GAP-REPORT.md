# Figma Gap Report - Storefront Audit

Project: `D:\Projects\Medical`  
Figma file: `I1yxSeUAawgY1YKYefLj47`  
Requested node: `4229:2564`  
Audit mode: read-only source inspection plus Figma MCP inspection  
Report date: 2026-05-22

## Figma Evidence Status

The supplied Figma node does not expose named storefront page frames through the MCP tools.

- `get_metadata` resolved node `4229:2564` as canvas `Full Dashboard`.
- That canvas contains one giant child symbol: `4252:8096`, named `Frame 1171275398`, size `33333 x 43801`.
- `get_design_context` for `4229:2564` returned a selection error from Figma.
- `get_design_context` for `4252:8096` timed out after 120 seconds because the overview frame is extremely large.
- A direct Figma Plugin API search over `4252:8096` found admin ecommerce, clinic, and Website Setup frames, including `All Products`, `POS System`, `New Product`, `Product price + stock`, `Files & Media`, `SEO`, `Shipping`, `Marketing`, `Delivery Boy`, `Reports`, clinic `Desktop - X` frames, and Website Setup frames.
- Exact storefront phrases such as `Jordan Hearing`, `Jordanian Center`, `Book Appointment`, `Our Blogs`, `Subscribe now`, and storefront page titles were not found as public storefront frames. Some text hits like `Contact Us`, `Our Services`, and `Latest Technology` were found inside admin/CMS/Website Setup contexts, not as standalone public page designs.

Because of that, this report does not claim pixel-perfect storefront-to-Figma comparison. Each page below records:

1. What the current code implements.
2. Which requested Figma comparison could not be verified.
3. Visible implementation gaps and functional risks discovered while reading the storefront code.

---

## HEADER / NAVBAR
**Figma node:** Not found as a public header component. Supplied node `4229:2564` maps to `Full Dashboard`, not a storefront header.  
**Code file:** `src/components/store/header.tsx`

### ✅ Matching
- Sticky white header exists.
- Logo area exists with icon plus `Jordan Hearing` and `& Speech Therapy`.
- Desktop nav links exist for Home, About Us, Services, Team, Blog, Contact Us, Evaluation, and Shop.
- Wishlist, cart, Book Appointment, and mobile menu controls exist.
- Cart badge is wired to cart context count.

### ❌ Gaps Found
| # | Element | Figma Design | Current Code | Priority |
|---|---------|--------------|--------------|----------|
| 1 | Figma reference | No storefront header node discoverable from supplied Figma node | Header cannot be verified against exact Figma spacing, color, height, or component states | HIGH |
| 2 | Logo mark | Public clinic logo asset not discoverable in Figma MCP result | Uses a generic inline SVG mark that visually resembles a code/GitHub-style icon, not a hearing clinic logo | HIGH |
| 3 | Active nav state | Not verifiable from Figma | Header links have hover color only; no active current-page state | MEDIUM |
| 4 | Header layout | Not verifiable from Figma | Desktop nav uses fixed `gap-5`; may overflow before `lg` with long labels like `Book Appointment` | MEDIUM |
| 5 | Mobile menu | Not verifiable from Figma | Mobile drawer is a simple vertical list; no richer mobile header/footer/contact content is present | LOW |

### 🔧 Missing Functionality
- Pixel-accurate public header reference is missing from the supplied Figma node.
- Active route highlighting is missing.

---

## FOOTER
**Figma node:** Not found as a public footer component. Supplied node `4229:2564` maps to admin/CMS overview frames.  
**Code file:** `src/components/store/footer.tsx`

### ✅ Matching
- Newsletter subscribe section exists.
- Main footer uses a purple brand gradient and a wave divider.
- Quick links, contact info, social icons, Shop Now CTA, and copyright area exist.

### ❌ Gaps Found
| # | Element | Figma Design | Current Code | Priority |
|---|---------|--------------|--------------|----------|
| 1 | Figma reference | No storefront footer node discoverable | Footer cannot be checked for exact layout, wave shape, column widths, or colors | HIGH |
| 2 | Contact details | Public clinic footer details not verifiable | Uses placeholder/non-Jordan data: `3B- sector, chowk`, `Ahmedabad, Gujarat`, `93928767` | HIGH |
| 3 | Newsletter | Not verifiable from Figma | Form prevents default only; no success state, validation message, or API integration | MEDIUM |
| 4 | Social links | Not verifiable from Figma | Social icons use `href="#"`, so they are decorative/incomplete | MEDIUM |
| 5 | Text quality | Not verifiable from Figma | Copyright renders as `© 2024 .clinic All Rights Reserved`, which looks unfinished | MEDIUM |

### 🔧 Missing Functionality
- Functional newsletter submission is missing.
- Real social links are missing.
- Verified clinic contact/copyright copy is missing.

---

## HOMEPAGE
**Figma node:** Public homepage / landing frame not found. Supplied Figma search did not find exact homepage copy such as `Jordan Hearing` or `Jordanian Center`.  
**Code file:** `src/app/(store)/page.tsx`

### ✅ Matching
- Hero, Services, About, Team, Blog, and CTA-style buttons are implemented.
- Purple gradient hero and wave divider align with the general brand direction visible elsewhere in the codebase.
- Services, doctors, and blog-card sections are present.

### ❌ Gaps Found
| # | Element | Figma Design | Current Code | Priority |
|---|---------|--------------|--------------|----------|
| 1 | Figma reference | Homepage frame not discoverable from supplied node | Cannot verify hero composition, exact image, typography scale, spacing, or section order | HIGH |
| 2 | Hero copy | Not found in Figma MCP text search | Uses a long heading: `At The Jordanian Center for Hearing, Speech, and Occupational Therapy.` | HIGH |
| 3 | Hero image | Not verifiable | Uses remote Unsplash doctor photo; no Figma-provided asset or local optimized asset | MEDIUM |
| 4 | Services eyebrow | Not verifiable | Uses `JFEM`, while About page copy uses `JOFM`; naming is inconsistent | MEDIUM |
| 5 | Team cards | Not verifiable | All three team members are named `Dr. Krystel Jung`; looks like placeholder content | HIGH |
| 6 | Blog cards | Not verifiable | Blog cards show excerpt and read-more but no visible title in the card body | MEDIUM |
| 7 | About CTA | Not verifiable | Button text is `Contact Us` but link target is `/about`, not `/contact` | MEDIUM |

### 🔧 Missing Functionality
- Figma homepage frame is missing from the accessible Figma node.
- Real team data is missing.
- Blog title visibility is missing in homepage blog cards.
- Some CTA/link relationships need correction after design confirmation.

---

## SHOP PAGE
**Figma node:** Shop / product listing frame not found. Figma search found admin product screens, not public shop listing.  
**Code file:** `src/app/(store)/shop/page.tsx`

### ✅ Matching
- Shop hero exists.
- Search input, category select, sort select, product grid, loading/empty states, and Load More button exist.
- Product data is fetched from `/api/products`.

### ❌ Gaps Found
| # | Element | Figma Design | Current Code | Priority |
|---|---------|--------------|--------------|----------|
| 1 | Figma reference | Public shop listing node not discoverable | Cannot verify product card sizing, filter placement, pagination, or hero design | HIGH |
| 2 | Search behavior | Not verifiable | Search runs on every query change; visible `Search` button has no distinct submit action | MEDIUM |
| 3 | Category source | Not verifiable | Category options are derived from currently loaded products, so categories can disappear after search/filter | HIGH |
| 4 | Grid density | Not verifiable | Grid is `grid-cols-2 md:grid-cols-3`; no large desktop 4-column layout | MEDIUM |
| 5 | Filters | Not verifiable | No price range, brand filter, rating filter, availability filter, or reset filter button | MEDIUM |
| 6 | Pagination | Not verifiable | Uses client-side `Load More`; no numbered pagination or URL-preserved paging | LOW |

### 🔧 Missing Functionality
- Exact Figma shop frame is missing.
- Search button is visually present but functionally redundant.
- Global category/brand filter state is incomplete.
- Advanced filters/pagination are not implemented.

---

## PRODUCT DETAIL PAGE
**Figma node:** Product detail frame not found. Figma search found admin product-edit frames only.  
**Code file:** `src/app/(store)/product/[slug]/page.tsx`

### ✅ Matching
- Breadcrumb, product title area, gallery, price, description, quantity stepper, Add to Cart, share icons, shipping/returns notes, and related products exist.
- Product data is fetched from `/api/products/[slug]`.
- Related products are fetched by category.

### ❌ Gaps Found
| # | Element | Figma Design | Current Code | Priority |
|---|---------|--------------|--------------|----------|
| 1 | Figma reference | Public product detail node not discoverable | Cannot verify product detail layout, gallery behavior, card radius, or CTA design | HIGH |
| 2 | Gallery | Not verifiable | Uses a fixed 2x2 image grid; no primary image plus selectable thumbnails/lightbox | MEDIUM |
| 3 | Product metadata | Not verifiable | Does not display brand, category, rating, review count, stock count, SKU, or badges | MEDIUM |
| 4 | Wishlist | Not verifiable | Heart button has no state or persistence | MEDIUM |
| 5 | Share | Not verifiable | Social icons are decorative; no links or share behavior | LOW |
| 6 | Related products | Not verifiable | Shows up to 3 products only; no fallback message when none exist | LOW |

### 🔧 Missing Functionality
- Pixel reference for public PDP is missing.
- Interactive gallery is missing.
- Wishlist and share actions are incomplete.
- Review/rating/stock metadata is not surfaced.

---

## CART PAGE
**Figma node:** Cart frame not found. Figma search only found admin marketing text such as `Add Your Cart Base Coupon`.  
**Code file:** `src/app/(store)/cart/page.tsx`

### ✅ Matching
- Empty cart state exists.
- Cart item list, quantity controls, remove, clear cart, coupon input, order summary, shipping form, payment method toggle, card fields, and pay button exist.
- Successful pay action shows a toast and clears the cart.

### ❌ Gaps Found
| # | Element | Figma Design | Current Code | Priority |
|---|---------|--------------|--------------|----------|
| 1 | Figma reference | Public cart node not discoverable | Cannot verify cart/checkout split, order summary position, or form styling | HIGH |
| 2 | Cart vs checkout flow | Not verifiable | Cart page includes shipping and payment fields directly, while the app also has `/checkout` elsewhere | HIGH |
| 3 | Shipping text | Not verifiable | Summary says shipping is calculated at next step, but payment happens on same page | MEDIUM |
| 4 | Coupon | Not verifiable | Coupon input has no apply button, validation, discount, or error/success state | MEDIUM |
| 5 | Payment validation | Not verifiable | Card fields are plain text inputs with limited validation and no formatting | MEDIUM |
| 6 | Persistence | Not verifiable | Uses cart context behavior; final pay clears cart but does not show order confirmation or route transition | HIGH |

### 🔧 Missing Functionality
- Exact cart/checkout Figma flow is missing.
- Coupon application is missing.
- Payment validation is incomplete.
- Order confirmation route/receipt transition is missing from this page.

---

## BLOG PAGE
**Figma node:** Blog listing frame not found. Exact `Our Blogs` storefront listing did not resolve as a public frame.  
**Code file:** `src/app/(store)/blog/page.tsx`

### ✅ Matching
- Blog hero exists.
- Article grid with images, date, read time, title, excerpt, and read-more link exists.
- Blog posts are fetched from `/api/blog`.

### ❌ Gaps Found
| # | Element | Figma Design | Current Code | Priority |
|---|---------|--------------|--------------|----------|
| 1 | Figma reference | Blog listing node not discoverable | Cannot verify hero image, article card layout, category pills, or spacing | HIGH |
| 2 | Featured content | Not verifiable | No featured/lead article section; all posts are rendered in a uniform grid | MEDIUM |
| 3 | Categories | Not verifiable | Category exists in data type but is not displayed in listing cards | MEDIUM |
| 4 | Filtering/search | Not verifiable | No blog category filter, search, archive, or pagination | LOW |
| 5 | CTA | Not verifiable | `All Blogs` button has no action/link | LOW |
| 6 | Text rendering | Not verifiable | Some source output shows mojibake for separators/arrows in terminal, which should be visually checked in browser | LOW |

### 🔧 Missing Functionality
- Exact Figma blog listing frame is missing.
- Featured article layout is missing.
- Blog search/filter/pagination are missing.
- `All Blogs` button is inert.

---

## BLOG DETAIL PAGE
**Figma node:** Blog detail / single post frame not found.  
**Code file:** `src/app/(store)/blog/[slug]/page.tsx`

### ✅ Matching
- Back to blog link, gradient hero, category badge, read-time/date metadata, article body, related posts, and subscribe card exist.
- Dynamic metadata is implemented from post data.
- Blog post is fetched from `/api/blog/[slug]`.

### ❌ Gaps Found
| # | Element | Figma Design | Current Code | Priority |
|---|---------|--------------|--------------|----------|
| 1 | Figma reference | Blog detail node not discoverable | Cannot verify post header, sidebar width, author block, image treatment, or comments section | HIGH |
| 2 | Hero media | Not verifiable | Uses abstract gradient and BookOpen icon; no article hero image | MEDIUM |
| 3 | Author info | Not verifiable | No author/avatar/byline block | LOW |
| 4 | Comments | Requested check includes comments section | Current page has no comments section | MEDIUM |
| 5 | Subscribe | Not verifiable | Subscribe form is visual only; no submit handler or success state | LOW |
| 6 | Article typography | Not verifiable | Body uses plain paragraphs; no rich prose hierarchy, pull quote, lists, or headings | LOW |

### 🔧 Missing Functionality
- Exact blog-detail Figma frame is missing.
- Comments section is missing.
- Subscribe action is incomplete.
- Article hero image/author treatment is missing.

---

## CONTACT PAGE
**Figma node:** Public contact page not found. Figma search found repeated `Contact Us` text inside clinic/admin frames, not a storefront contact screen.  
**Code file:** `src/app/(store)/contact/page.tsx`

### ✅ Matching
- Contact hero exists.
- Form includes first name, last name, email, phone, message, consent checkbox, and success state.
- Contact info sidebar, map placeholder, and working-hours overlay exist.

### ❌ Gaps Found
| # | Element | Figma Design | Current Code | Priority |
|---|---------|--------------|--------------|----------|
| 1 | Figma reference | Public contact node not discoverable | Cannot verify two-column ratio, exact form spacing, map layout, or contact-card design | HIGH |
| 2 | Map | Not verifiable | Uses a gray placeholder instead of a real/static map image | MEDIUM |
| 3 | Contact data | Not verifiable | Uses placeholder location/address and phone data inconsistent with Jordan clinic branding | HIGH |
| 4 | Form fields | Requested check includes subject in earlier storefront specs | Current form has no subject/select field | MEDIUM |
| 5 | Consent copy | Not verifiable | Checkbox text is lorem ipsum placeholder | HIGH |
| 6 | Success copy | Not verifiable | Success state is generic: `We'll get back to you soon.` | LOW |

### 🔧 Missing Functionality
- Exact contact Figma frame is missing.
- Real map/contact details are missing.
- Consent/legal copy is missing.
- Subject/inquiry routing is missing.

---

## ABOUT PAGE
**Figma node:** About page frame not found.  
**Code file:** `src/app/(store)/about/page.tsx`

### ✅ Matching
- Hero, specialist team, latest technology, and testimonials sections exist.
- Team cards include images, names, roles, social icons, and More Detail buttons.
- Technology section links to Shop.

### ❌ Gaps Found
| # | Element | Figma Design | Current Code | Priority |
|---|---------|--------------|--------------|----------|
| 1 | Figma reference | Public about node not discoverable | Cannot verify section order, hero art, typography, or testimonial layout | HIGH |
| 2 | Hero title | Not verifiable | Hero heading is `Our Team`, which conflicts with About page purpose | HIGH |
| 3 | Copy quality | Not verifiable | Hero copy is very long and includes inconsistent naming (`JOFM`) | MEDIUM |
| 4 | Team data | Not verifiable | All team members are named `Dr. Krystel Jung` | HIGH |
| 5 | Buttons | Not verifiable | `More Detail` and `All Doctors` buttons are not links/actions | MEDIUM |
| 6 | Testimonials | Not verifiable | Testimonials use lorem ipsum-style placeholder copy | MEDIUM |

### 🔧 Missing Functionality
- Exact About Figma frame is missing.
- Real doctor/testimonial content is missing.
- Team detail navigation is missing.
- About-specific hero/story structure needs confirmation.

---

## SERVICES PAGE
**Figma node:** Public services page frame not found. Text search found admin/service and Website Setup section labels, not a storefront services page.  
**Code file:** `src/app/(store)/services/page.tsx`

### ✅ Matching
- Services hero exists.
- Six service cards exist.
- CTA section with Book Appointment button exists.

### ❌ Gaps Found
| # | Element | Figma Design | Current Code | Priority |
|---|---------|--------------|--------------|----------|
| 1 | Figma reference | Public services page node not discoverable | Cannot verify card count, icon style, hero image, or CTA design | HIGH |
| 2 | Service cards | Not verifiable | Cards are static and do not link to service details | MEDIUM |
| 3 | Content depth | Not verifiable | No duration, department, doctor, price, or booking metadata per service | LOW |
| 4 | Visual richness | Not verifiable | No service imagery or alternating feature sections | LOW |
| 5 | CTA | Not verifiable | CTA is generic and does not preselect service context | LOW |

### 🔧 Missing Functionality
- Exact services Figma frame is missing.
- Service detail pages/actions are missing.
- Service-aware booking handoff is missing.

---

## TEAM PAGE
**Figma node:** Public team page frame not found.  
**Code file:** `src/app/(store)/team/page.tsx`

### ✅ Matching
- Team hero exists.
- Six doctor cards exist.
- Cards include image, name, specialty, bio, social icons, and Book Appointment button.

### ❌ Gaps Found
| # | Element | Figma Design | Current Code | Priority |
|---|---------|--------------|--------------|----------|
| 1 | Figma reference | Public team page node not discoverable | Cannot verify doctor card design, social icon placement, or page hero | HIGH |
| 2 | Team data | Not verifiable | Every doctor is named `Dr. Krystel Jung` | HIGH |
| 3 | Social links | Not verifiable | Social icons are decorative; no anchors or URLs | MEDIUM |
| 4 | Doctor detail | Not verifiable | No doctor profile/detail route or modal | LOW |
| 5 | Booking context | Not verifiable | Book Appointment does not pass/preselect doctor or service | MEDIUM |

### 🔧 Missing Functionality
- Exact team Figma frame is missing.
- Real doctor data is missing.
- Doctor detail and contextual booking are missing.

---

## BOOK APPOINTMENT PAGE
**Figma node:** Public book appointment page frame not found. Figma has admin appointment list/new-form frames, not the storefront booking screen.  
**Code file:** `src/app/(store)/book-appointment/page.tsx`

### ✅ Matching
- Appointment form exists.
- Calendar-like date selector and time slots exist.
- Department/service selects, confirmation method radio buttons, special requests, and API submit exist.
- Success/error toasts exist.

### ❌ Gaps Found
| # | Element | Figma Design | Current Code | Priority |
|---|---------|--------------|--------------|----------|
| 1 | Figma reference | Public booking screen not discoverable | Cannot verify calendar layout, form order, time-slot styling, or confirmation design | HIGH |
| 2 | Calendar labels | Not verifiable | Day labels are ordered `Mon`, `Tue`, `Thu`, `Wed`, `Fri`, `Sta`; Wednesday/Thursday order and Saturday spelling are wrong | HIGH |
| 3 | Time labels | Not verifiable | Afternoon slots are labeled `02:30 am` through `05:00 am` instead of PM | HIGH |
| 4 | Calendar behavior | Not verifiable | Static February picker only; previous/next chevrons do not change month | MEDIUM |
| 5 | Required fields | Not verifiable | Emergency phone is required; may not match public booking UX | LOW |
| 6 | Submit outcome | Not verifiable | After success, form clears but user remains on same page with no confirmation summary | MEDIUM |

### 🔧 Missing Functionality
- Exact public booking Figma frame is missing.
- Real calendar month navigation is missing.
- Correct day/time labels are needed.
- Confirmation summary/receipt is missing.

---

## EVALUATION PAGE
**Figma node:** Public evaluation / hearing test page frame not found. Figma contains admin evaluation-related frames, not this storefront questionnaire.  
**Code file:** `src/app/(store)/evaluation/page.tsx`

### ✅ Matching
- Hearing Evaluation hero exists.
- Personal information form exists.
- Six hearing questions exist with selectable answers.
- Submit posts to `/api/appointments` and shows success state/toast.

### ❌ Gaps Found
| # | Element | Figma Design | Current Code | Priority |
|---|---------|--------------|--------------|----------|
| 1 | Figma reference | Public hearing-test/evaluation screen not discoverable | Cannot verify question layout, progress, scoring, or success screen | HIGH |
| 2 | Data model | Not verifiable | Evaluation submits to appointments API rather than a dedicated evaluations endpoint | MEDIUM |
| 3 | Results flow | Not verifiable | No score, risk level, recommendation, or next-step explanation after submit | MEDIUM |
| 4 | Form validation | Not verifiable | UI relies on select `required`; no explicit completion progress or per-question validation message | LOW |
| 5 | Success visual | Not verifiable | Success icon is a raw check character rather than an icon/component; visual polish may differ from design system | LOW |

### 🔧 Missing Functionality
- Exact public evaluation Figma frame is missing.
- Dedicated evaluation persistence/results flow is missing.
- Progress/scoring/recommendation UX is missing.
- Stronger answer-completion validation is missing.

---

## Summary

| Page | Gaps Found | Missing Features | Priority |
|------|------------|------------------|----------|
| Header / Navbar | 5 | 2 | HIGH |
| Footer | 5 | 3 | HIGH |
| Homepage | 7 | 4 | HIGH |
| Shop Page | 6 | 4 | HIGH |
| Product Detail Page | 6 | 4 | HIGH |
| Cart Page | 6 | 4 | HIGH |
| Blog Page | 6 | 4 | HIGH |
| Blog Detail Page | 6 | 4 | HIGH |
| Contact Page | 6 | 4 | HIGH |
| About Page | 6 | 4 | HIGH |
| Services Page | 5 | 3 | HIGH |
| Team Page | 5 | 3 | HIGH |
| Book Appointment Page | 6 | 4 | HIGH |
| Evaluation Page | 5 | 4 | HIGH |

**Total gaps: 80**  
**Total missing features: 51**  
**Pages with HIGH priority issues: 14**

## Overall Findings

1. The largest blocker is Figma traceability: the supplied Figma node is not a public storefront page set. It is a large dashboard/admin/CMS overview, so exact storefront pixel comparison is not possible from the provided node.
2. The current storefront code has broad page coverage and many expected sections, but many pages still use placeholder content, repeated doctor names, placeholder contact details, decorative social icons, and static/mock interactions.
3. The most urgent implementation corrections discovered during source review are:
   - Fix storefront data/content placeholders: clinic address, phone, team names, testimonials, legal consent text, footer copyright.
   - Fix appointment calendar labels and AM/PM slot labels.
   - Add real active header state and complete social/newsletter/form actions.
   - Separate or reconcile cart vs checkout flow.
   - Add missing detailed interactions: wishlist state, share links, blog subscribe, coupon apply, doctor/service-aware booking.
4. Before visual implementation work, the owner/design team should provide direct node IDs for the public storefront frames or move/storefront frames into an accessible Figma page with names matching the audited routes.

✅ AUDIT COMPLETE — FIGMA-GAP-REPORT.md saved to `D:\Projects\Medical\`
