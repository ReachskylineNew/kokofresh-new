# Performance Optimization Tasks

## API Endpoint Updates
- [ ] Update /api/products to support limit and pagination query params
- [ ] Return only minimal fields: id, name, price, image, stock
- [ ] Add ISR caching with revalidate: 3600
- [ ] Optimize mock data to match minimal fields

## Shop Page (/shop/page.tsx)
- [ ] Implement pagination to fetch 8-12 products initially
- [ ] Add lazy loading to product images with loading="lazy" and placeholder="blur"
- [ ] Defer product grid loading with React.lazy or next/dynamic (SSR false)
- [ ] Add lightweight skeleton loader for products before data appears
- [ ] Prioritize hero rendering, fetch products after mount with useEffect delay
- [ ] Optimize image URLs to smaller CDN versions (w_400,h_400,q_80)
- [ ] Ensure images below fold are not preloaded
- [ ] Preload only hero and critical fonts/scripts

## Home Page (/page.tsx)
- [ ] Add lazy loading to product images
- [ ] Defer product grid with dynamic import
- [ ] Add skeleton loader
- [ ] Fetch products after mount with delay
- [ ] Optimize image URLs
- [ ] Add ISR caching to fetch calls

## Testing & Verification
- [ ] Test pagination and loading
- [ ] Verify Lighthouse scores (Desktop ≥95, LCP <2s)
- [ ] Ensure design remains identical
- [ ] Check minimal unused image/data loads
- [ ] Confirm smooth skeleton animations
