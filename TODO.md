# Performance Optimization Tasks

## API Endpoint Updates
- [x] Update /api/products to support limit and pagination query params
- [x] Return only minimal fields: id, name, price, image, stock
- [x] Add ISR caching with revalidate: 3600
- [x] Optimize mock data to match minimal fields

## Shop Page (/shop/page.tsx)
- [x] Implement pagination to fetch 8-12 products initially
- [x] Add lazy loading to product images with loading="lazy" and placeholder="blur"
- [x] Defer product grid loading with React.lazy or next/dynamic (SSR false)
- [x] Add lightweight skeleton loader for products before data appears
- [x] Prioritize hero rendering, fetch products after mount with useEffect delay
- [x] Optimize image URLs to smaller CDN versions (w_400,h_400,q_80)
- [x] Ensure images below fold are not preloaded
- [x] Preload only hero and critical fonts/scripts

## Home Page (/page.tsx)
- [x] Add lazy loading to product images
- [x] Defer product grid with dynamic import
- [x] Add skeleton loader
- [x] Fetch products after mount with delay
- [x] Optimize image URLs
- [x] Add ISR caching to fetch calls

## Testing & Verification
- [ ] Test pagination and loading
- [ ] Verify Lighthouse scores (Desktop ≥95, LCP <2s)
- [ ] Ensure design remains identical
- [ ] Check minimal unused image/data loads
- [ ] Confirm smooth skeleton animations
