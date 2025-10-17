# Homepage Performance Optimization TODO

## Completed Tasks
- [ ] Analyze codebase and create optimization plan

## Pending Tasks
- [ ] Update next.config.mjs for static export with required optimizations
- [ ] Optimize fonts - Replace Google Fonts with next/font and system fonts
- [ ] Convert homepage to server component where possible to enable static generation
- [ ] Optimize images - Convert to Next.js Image component with WebP/AVIF, lazy loading, priority for hero
- [ ] Dynamically import heavy components (framer-motion animations, ProcessSection)
- [ ] Remove console logs and unused imports
- [ ] Add prefetch={false} to below-fold links
- [ ] Optimize CSS purging in Tailwind config
- [ ] Move analytics to client-only loading
- [ ] Remove unused dependencies if possible

## Followup Steps
- [ ] Run `npx next build` to check bundle sizes
- [ ] Test Lighthouse scores
- [ ] Verify static export works
