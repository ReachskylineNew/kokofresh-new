# Cart Implementation Plan

## Current State Analysis
- Cart API handles create, add, get operations with Wix Ecom
- Cart page displays items but shows hardcoded 0 for all calculations
- Quantity buttons and remove buttons have empty onClick handlers
- Product prices available via /api/products endpoint
- Cart lineItems have catalogItemId but no price data

## Implementation Steps

### 1. Enhance Cart API to Include Product Prices
- Modify cart API to fetch product details for each lineItem
- Add price information to cart response
- Ensure prices are included in create, add, and get operations

### 2. Implement Cart Calculations in Cart Page
- Calculate subtotal: sum of (price * quantity) for all items
- Calculate shipping: free if subtotal >= $50, else $9.99
- Calculate tax: 8.25% of subtotal
- Calculate total: subtotal + shipping + tax

### 3. Add Quantity Update Functionality
- Add "update" action to cart API route
- Implement increase/decrease quantity buttons
- Update cart state after quantity changes

### 4. Add Remove Item Functionality
- Add "remove" action to cart API route
- Implement remove button functionality
- Update cart state after item removal

### 5. Update use-cart Hook
- Add updateQuantity and removeItem functions
- Ensure cart state updates properly after changes

### 6. Testing and Validation
- Test all cart operations
- Verify calculations are correct
- Ensure UI updates properly
