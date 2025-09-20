# Fix /api/products to return all fields

## Current Issue
- `/api/products` endpoint only returns specific normalized fields
- Missing important fields like region, category, rating, reviews, bestseller, limitedEdition
- Individual product endpoint `/api/products/[id]` already returns all fields correctly

## Plan Implementation

### Step 1: Update API endpoint
- [ ] Modify `app/api/products/route.ts` to return full product objects instead of normalized fields
- [ ] Remove the field filtering/normalization mapping
- [ ] Return complete Wix API response similar to individual product endpoint

### Step 2: Update shop page (if needed)
- [ ] Check if `app/shop/page.tsx` needs updates to handle new fields
- [ ] Add support for additional fields like region, category, rating, reviews, bestseller, limitedEdition

### Step 3: Testing
- [ ] Test `/api/products` endpoint to verify all fields are returned
- [ ] Test shop page functionality with additional data
- [ ] Verify product filtering and display works correctly
