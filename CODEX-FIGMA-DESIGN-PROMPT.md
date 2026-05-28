# Codex Prompt — Figma Design Pixel-Perfect Implementation
**Project:** D:\Projects\Medical (Jordan Hearing & Speech Therapy)
**Stack:** Next.js 14 App Router · TypeScript · Tailwind CSS · shadcn/ui · Poppins font
**Goal:** Implement exact Figma storefront designs from file `bxDk2gJUL4FPwPtxkKxdo6`

---

## DESIGN TOKENS (from Figma — use everywhere)

```
GRADIENTS:
  Hero/page background:  linear-gradient(175deg, #ca79c6 15%, #9b1fe1 68%)
  Button fill:           linear-gradient(82deg, #ec74e7 45%, #8468f5 74%)
  Button blur shadow:    same gradient at 70% opacity, blur-[5.8px], behind every button
  Text gradient:         linear-gradient(257deg, #9b1fe1 0%, #ca79c6 75%)
  Alt text gradient:     linear-gradient(247deg, #9b1fe1 0%, #ca79c6 75%)

TYPOGRAPHY:
  Font family:   Poppins (already wired via next/font/google in layout.tsx)
  Heading:       Poppins SemiBold / Medium, 30px, gradient fill
  Body:          Poppins Light, 20–24px, #1e1e1e
  Subtext:       Poppins Light, 14–16px, #42526b

COLORS:
  Brand purple:  #9b1fe1
  Brand pink:    #ca79c6
  Button purple: #8468f5
  Dark text:     #061c3d
  Body text:     #1e1e1e
  Subtle text:   #42526b

SHADOWS:
  Card:          0 11px 26px rgba(6,28,61,0.1)
  Team card:    -7px 4.6px 4.6px rgba(236,180,233,0.2)
  Photo inner:   0 0 21px rgba(0,0,0,0.07)
```

---

## TASK LIST

### TASK 1 — Hero Section (src/app/(store)/page.tsx)

**Figma node 2:27882 — Hero**
Current: white/35 glassmorphism card LEFT + doctor photo RIGHT.
Figma shows:
- Background: `linear-gradient(175deg, #ca79c6 15%, #9b1fe1 68%)`
- LEFT col: white text heading (Poppins SemiBold 30px), light body text, gradient pill button "Book Appointment →"
- RIGHT col: doctor photo ~408×612px, rounded-[26px], with two rotated square border decorations (white/40, white/30)
- Wave SVG at bottom curving into white background

**Fix:**
- The glass card wrapping the left text should remain but ensure it has `bg-white/35 backdrop-blur-md rounded-[20px] p-10 shadow-[0_24px_60px_rgba(6,28,61,0.12)]`
- Heading text `text-white` font-semibold Poppins 30px
- Body text `text-white/80` font-light 20px
- Button variant="gradient" (already implemented)
- Wave divider SVG at bottom: `<path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />`

### TASK 2 — Services Section (src/app/(store)/page.tsx)

**Figma node 2:28006 — Services**
Confirmed specs:
- Layout: 2-col. LEFT col has text block, RIGHT col has 3 staggered white cards.
- LEFT:
  - Heading: "Our Services" — gradient text, Poppins SemiBold 30px
  - Body: Poppins Light 20px, #1e1e1e, line-height 1.8
  - Button: "All Services" gradient pill → /services
- RIGHT cards (3 cards staggered — NOT a grid):
  - Card 1: `lg:absolute lg:right-0 lg:top-0` — "Hearing and Their Treatments"
  - Card 2: `lg:absolute lg:left-0 lg:top-[170px]` — "Speech and its Treatment"
  - Card 3: `lg:absolute lg:right-0 lg:bottom-0` — "Occupational Therapy"
  - Each card: `w-[296px] rounded-[12px] bg-white p-5 shadow-[0_11px_26px_rgba(6,28,61,0.1)]`
  - Each card has: gradient circle icon div (h-9 w-9) + gradient title h3 + light description p

**File:** `src/app/(store)/page.tsx` — Services section already updated. Verify the stagger at `lg:min-h-[480px]` on the right column.

### TASK 3 — About Us Section (src/app/(store)/page.tsx)

**Figma node 2:28332 — About Us**
Confirmed specs:
- Layout: 2-col. LEFT col = mock dashboard card. RIGHT col = text.
- LEFT (dashboard mockup):
  - Outer accent square: `left-0 top-6 h-[220px] w-[220px] rounded-[28px] bg-[rgba(202,121,198,0.08)]`
  - Main card: `w-[300px] rounded-[20px] bg-white shadow-[0_18px_45px_rgba(6,28,61,0.12)] overflow-hidden`
  - Pink header bar (52px tall): `linear-gradient(175deg, #ca79c6 15%, #9b1fe1 68%)`
  - Inside card: patient avatar row (4 doctor images `-space-x-3` rounded-full border-white, h-10 w-10) + "+6" badge
  - Skeleton lines: w-40 h-2.5 + w-28 h-2.5
  - 3-col mini stats: "142 Patients" / "98% Success" / "5★ Rating" (rounded-[12px] h-[60px] colored bg)
- RIGHT:
  - Heading: "About Us" — gradient text Poppins SemiBold 30px
  - Body: Poppins Light 20px, #1e1e1e, line-height 1.75
  - Button: "Contact Us" gradient pill → /contact

**File:** `src/app/(store)/page.tsx` — Already updated. Verify the card offset `left-12 top-4` looks good at desktop.

### TASK 4 — Team Cards (src/components/store/team-card.tsx)

**Figma node 2:28113 — Team card**
Confirmed specs:
- Card shape: `rounded-tl-[42px] rounded-tr-[42px] rounded-bl-[8px] rounded-br-[8px]` bg-white
- Outer shadow: `-7px 4.6px 4.6px rgba(236,180,233,0.2)`
- Photo: sits inside `rounded-[17px]` div with shadow `0 0 21px rgba(0,0,0,0.07)`, `offset: left-[11.6px] top-[21px]`, h-[362px] object-cover object-top
- Experience badge: `absolute left-[25px] top-[82px]` — white/85 bg, backdrop-blur, Briefcase icon (pink), "5 Years" + "Experiences"
- Glassmorphism bottom bar: `background: linear-gradient(108deg, rgba(202,121,198,0.18) 0%, rgba(202,121,198,0.001) 100%)` + backdrop-blur-[50px], rounded-[10px]
  - Doctor name (opacity-70, 13.4px)
  - Specialty: gradient text 13.4px
  - Bottom row: "About Doctor" gradient pill button (LEFT) + Instagram/Facebook/Twitter icons (RIGHT, 18px, pink)

**File:** `src/components/store/team-card.tsx` — Already updated.

**Verify the card total height:** The Figma card is ~531px. The current implementation uses `relative` positioning without explicit height. Ensure:
```tsx
// Wrap the whole card in a container with relative + explicit min-height
<article className="relative mx-auto w-full max-w-[360px]" style={{ minHeight: '531px' }}>
```

### TASK 5 — Blog Cards (src/components/store/blog-card.tsx)

**Figma node 2:28254 — Blog card**
Confirmed specs:
- Card: `h-[501px] w-[391px] rounded-[15px] bg-white shadow-[0_11px_26px_rgba(6,28,61,0.1)]`
- Photo zone: `h-[288px] bg-white rounded-t-[15px]` — circular image `size-[234px] rounded-full absolute left-1/2 top-[17px] -translate-x-1/2 object-cover`
- Content zone px-[29px]:
  - Date row: pink date text (Poppins Medium 16px #ca79c6) + MessageCircle icon + "273 Comments" (Poppins Medium #42526b)
  - Title: Poppins Regular 16.6px, color #061c3d, line-height 24px, 3-line clamp
  - READ MORE: `absolute bottom-8 left-[29px]` — pink uppercase text 9px bold tracking-widest + ArrowRight 18px pink

**File:** `src/components/store/blog-card.tsx` — Already updated. Remove the `readTime` prop display (not in Figma).

### TASK 6 — Subscribe Section (src/app/(store)/page.tsx)

**Figma — Subscribe section (between Blog and Footer)**
Confirmed specs from context:
- Background: `bg-[rgba(255,53,245,0.04)]` or similar light pink
- Heading: "Subscribe now" — gradient text Poppins SemiBold 30px
- Subtext: "Subscribe to get our Newsletter" — Poppins Light 20px #1e1e1e
- Form: white rounded-[20px] p-2 shadow-sm, max-w-[590px]
  - Email input: h-[60px] rounded-[20px] flex-1 px-5 border-white text-[15px]
  - Subscribe button: h-[60px] gradient variant, "Subscribe" + Send icon

**File:** `src/app/(store)/page.tsx` — Already in place. Ensure `Send` icon is from lucide-react and the form row is `flex flex-col gap-3 sm:flex-row`.

### TASK 7 — Blog Listing Page Improvements (src/app/(store)/blog/page.tsx)

Fix these items visible in screenshots:
1. Blog cards on listing page should use the same `BlogCard` component updated in Task 5
2. The blog listing should show date + comments count (use `id` as seed for comments variety)
3. Remove `readTime` display from blog cards — not in Figma
4. `src/app/(store)/blog/blog-list-client.tsx` — verify it passes `id` prop to BlogCard

### TASK 8 — Product Card Figma Alignment (src/components/store/product-card.tsx)

Fix related products section on product detail page:
1. `src/app/(store)/product/[slug]/page.tsx` — "Related Products" section shows test data names like "Test Product 17794..."
2. Fix: filter related products to only show products with proper names (not starting with "Test Product")
3. Or better: use the static mock products array directly instead of API call for related products

```tsx
// In product/[slug]/page.tsx — use static mock products for related
import { MOCK_PRODUCTS } from "@/data/products"; // or similar
const related = MOCK_PRODUCTS.filter(p => p.slug !== slug).slice(0, 3);
```

### TASK 9 — Team Section heading + description font (src/app/(store)/page.tsx)

The Team section heading text:
```tsx
// Current:
<p className="mx-auto mt-4 max-w-3xl text-[18px] font-light leading-8 text-[#42526b]">
// Figma says 24px text, capitalize, Poppins Light, #1e1e1e, text-center, max-w-[958px]:
<p className="mx-auto mt-4 max-w-[958px] text-[24px] font-light capitalize leading-[1.6] text-[#1e1e1e] text-center">
```

### TASK 10 — Blog Section heading + description font (src/app/(store)/page.tsx)

Same fix for Blog section description:
```tsx
// Current:
<p className="mx-auto mt-4 max-w-2xl text-[18px] font-light leading-8 text-[#42526b]">
// Figma says 24px text, capitalize, Poppins Light, #1e1e1e, text-center:
<p className="mx-auto mt-4 max-w-[958px] text-[24px] font-light capitalize leading-[1.6] text-[#1e1e1e] text-center">
```

### TASK 11 — Run Validation

After all changes:
```bash
npm run typecheck
npm run lint
npm run build
```
Expected: 0 type errors, 0 lint errors, build passes.

---

## FILES TO MODIFY

| File | Tasks |
|------|-------|
| `src/app/(store)/page.tsx` | Tasks 1, 2, 3, 6, 9, 10 |
| `src/components/store/team-card.tsx` | Task 4 |
| `src/components/store/blog-card.tsx` | Task 5 |
| `src/app/(store)/blog/page.tsx` | Task 7 |
| `src/app/(store)/blog/blog-list-client.tsx` | Task 7 |
| `src/app/(store)/product/[slug]/page.tsx` | Task 8 |

---

## RULES

- Do NOT delete files
- Do NOT run git reset / git clean
- Do NOT push / deploy
- Do NOT edit .env* files
- Do NOT upgrade major dependencies
- Make MINIMAL required changes only
- Reuse existing components and utility classes
- Keep `bg-button-gradient` Tailwind utility from globals.css for icon circle backgrounds
- Keep `gradient-text` utility class from globals.css for all gradient headings
- Keep `variant="gradient"` on Button component (already implemented in button.tsx)
