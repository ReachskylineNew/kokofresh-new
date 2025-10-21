# Performance Refactoring Plan for HomePage

## ✅ Completed Tasks
- [x] Analyze current HomePage component and identify performance issues
- [x] Review API routes for ISR compatibility
- [x] Examine components to be lazy-loaded

## 🔄 In Progress Tasks
- [ ] Create new server component page.tsx with getStaticProps equivalent (ISR)
- [ ] Create new client HomePage component that receives props
- [ ] Optimize fonts in layout.tsx using next/font/google
- [ ] Add lazy loading for ManufacturingProcess and Footer components
- [ ] Optimize all Image components with sizes, quality, and loading attributes
- [ ] Reduce bundle size with selective lucide-react imports
- [ ] Ensure SSG with revalidate works correctly
- [ ] Test mobile performance improvements (target LCP < 2.5s)

## 📋 Detailed Steps

### 1. Server-Side Data Fetching with ISR
- Convert app/page.tsx to server component
- Implement getStaticProps equivalent with revalidate: 60
- Preload only first 6 products
- Remove client-side fetching for products and reels

### 2. Font Optimization
- Replace Google Fonts links in layout.tsx with next/font/google
- Use Inter for body text with display: 'swap'
- Use Playfair_Display for headings with display: 'swap'

### 3. Component Lazy Loading
- Import ManufacturingProcess with next/dynamic and ssr: false
- Import Footer with next/dynamic and ssr: false

### 4. Image Optimization
- Hero section: Conditional loading based on viewport (mobile vs desktop)
- Add sizes and quality={70} to hero images
- Add sizes and quality={75} to all other images
- Set loading="lazy" for non-hero images
- Ensure proper width/height or aspect ratio

### 5. Bundle Size Reduction
- Import only required lucide-react icons individually
- Remove unused icon imports

### 6. Client Component Refactoring
- Create new HomePage client component
- Receive products and reels as props
- Maintain all existing styling and functionality
- Ensure cart hook still works

### 7. Testing and Validation
- Verify SSG generation
- Test mobile performance metrics
- Ensure design remains identical
- Check hydration compatibility
