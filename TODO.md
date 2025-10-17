# Homepage Speed Optimization Plan

## Information Gathered
- Homepage (app/page.tsx) has multiple images: hero backgrounds, product images, and ProcessSection images.
- next.config.mjs has `unoptimized: true`, disabling Next.js image optimization.
- Images are from external domains (static.wixstatic.com), not whitelisted.
- ProcessSection.tsx uses regular `<img>` tags instead of Next.js `<Image>`.
- Proxy-image API exists for caching external images.
- Goal: Achieve Lighthouse scores of 80+ mobile, 90+ desktop.

## Plan
1. **Enable Next.js Image Optimization**
   - Update `next.config.mjs` to remove `unoptimized: true` and add `images.domains` for external sources.
2. **Optimize Hero Images in app/page.tsx**
   - Change `unoptimized` to `false` for hero background images.
   - Ensure proper sizing and loading attributes.
3. **Optimize Product Images in app/page.tsx**
   - Already using Next.js Image with lazy loading; ensure `unoptimized` is false.
4. **Optimize ProcessSection Images**
   - Replace `<img>` with Next.js `<Image>` in `components/ProcessSection.tsx`.
   - Add proper width/height for optimization.
5. **Use Proxy-Image for External Images (Optional)**
   - Update image sources to use `/api/proxy-image?url=...` for better caching and performance.

## Dependent Files to Edit
- `next.config.mjs`
- `app/page.tsx`
- `components/ProcessSection.tsx`

## Followup Steps
- Test Lighthouse scores after changes.
- Run build and check for errors.
- If needed, implement proxy-image usage for all external images.
