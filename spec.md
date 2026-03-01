# Marvellmarbles

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full luxury landing page for Marvellmarbles, a premium Makrana marble brand by Lalit Prajapat
- Sticky header with logo "MARVELLMARBLES" and nav links: About, Collection, Gallery, Contact
- Hero section with headline "Timeless Marble. Eternal Luxury." and subtext "Handcrafted Makrana Marble Creations" plus a Download Catalogue CTA button
- About / Heritage section describing Lalit Prajapat and Makrana craftsmanship
- Signature Collection grid with 4 cards: Marble Statues, Puja Essentials, Luxury Decor, Corporate Gifts
- Instagram Gallery section embedding https://www.instagram.com/marvellmarbles/embed
- Testimonials slider with 3 rotating quotes
- Contact / Inquiry form (Name, Email, Phone, Requirement textarea, Submit) — stored in backend
- Contact info: phone numbers 7878899189 and 7878750071
- Floating WhatsApp button linking to https://wa.me/917878899189
- Footer: "© 2026 Marvellmarbles | Global Luxury Marble Brand"
- Scroll-based fade-in animations
- Backend canister to store submitted inquiries

### Modify
- None

### Remove
- None

## Implementation Plan
1. Select no additional Caffeine components (standard backend sufficient)
2. Generate Motoko backend with an `Inquiry` data type and `submitInquiry` / `getInquiries` endpoints
3. Generate hero image (marble texture background) and collection card images
4. Build React frontend matching all sections above, wiring inquiry form to backend
