# Product Selection Test Guide

## Overview

This guide covers the product selection and cart functionality testing in the framework. The tests are organized using the Page Object Model pattern with enhanced page objects for inventory, product details, and cart operations.

---

## Page Objects Created

### 1. InventoryPage (Enhanced)
**Location**: `pages/InventoryPage.ts`

**New Methods**:
- `addProductToCart(productName)` - Add a single product to cart
- `removeProductFromCart(productName)` - Remove a product from cart
- `addMultipleProductsToCart(productNames[])` - Add multiple products at once
- `clickProductTitle(productName)` - Navigate to product details
- `getCartItemCount()` - Get number of items in cart badge
- `goToCart()` - Navigate to cart page
- `getProductPrice(productName)` - Get product price
- `isProductInCart(productName)` - Check if product has "Remove" button
- `getInventoryItemCount()` - Count total products on page

**Usage Example**:
```typescript
await inventoryPage.addProductToCart('Sauce Labs Backpack');
await inventoryPage.addMultipleProductsToCart([
  'Sauce Labs Backpack',
  'Sauce Labs Bike Light'
]);
const cartCount = await inventoryPage.getCartItemCount();
```

### 2. ProductDetailPage (New)
**Location**: `pages/ProductDetailPage.ts`

**Methods**:
- `getProductName()` - Get product name
- `getProductDescription()` - Get product description
- `getProductPrice()` - Get product price
- `addToCart()` - Add product from details page
- `removeFromCart()` - Remove product from details page
- `backToProducts()` - Return to inventory
- `isProductInCart()` - Check if product is in cart

**Usage Example**:
```typescript
await inventoryPage.clickProductTitle('Sauce Labs Backpack');
const productName = await productDetailPage.getProductName();
await productDetailPage.addToCart();
await productDetailPage.backToProducts();
```

### 3. CartPage (New)
**Location**: `pages/CartPage.ts`

**Methods**:
- `getCartItemCount()` - Count items in cart
- `removeItemFromCart(productName)` - Remove specific item
- `continueShopping()` - Return to inventory
- `proceedToCheckout()` - Go to checkout
- `getCartItemNames()` - Get all product names in cart
- `getCartItemPrice(productName)` - Get price of item in cart
- `isCartEmpty()` - Check if cart is empty
- `isProductInCart(productName)` - Check if specific product is in cart

**Usage Example**:
```typescript
await inventoryPage.goToCart();
const itemCount = await cartPage.getCartItemCount();
const items = await cartPage.getCartItemNames();
await cartPage.removeItemFromCart('Sauce Labs Backpack');
```

---

## Test Cases in test-2.spec.ts

### 1. Add Single Product to Cart
**Test**: `[Critical] Add single product to cart`

**Steps**:
1. Add one product to cart
2. Verify cart count is 1
3. Verify product shows "Remove" button

**Screenshot**: `single-product-added.png`

### 2. Add Multiple Products to Cart
**Test**: `[Critical] Add multiple products to cart`

**Steps**:
1. Add three different products
2. Verify cart count is 3

**Screenshot**: `multiple-products-added.png`

### 3. Add and Remove Product
**Test**: `[Normal] Add and remove product from inventory page`

**Steps**:
1. Add product to cart
2. Verify cart count is 1
3. Remove product from cart
4. Verify cart count is 0

**Screenshot**: `product-removed.png`

### 4. Product Details Page
**Test**: `[Critical] View product details and add to cart`

**Steps**:
1. Click on product to view details
2. Verify product name and price
3. Add product from details page
4. Verify product is in cart
5. Navigate back to products

**Screenshots**: `product-details-page.png`

### 5. Bulk Product Addition
**Test**: `[Critical] Add multiple products using helper method`

**Steps**:
1. Use helper method to add 4 products at once
2. Verify cart count is 4

**Screenshot**: `bulk-products-added.png`

### 6. Cart Navigation and Verification
**Test**: `[Critical] Navigate to cart and verify products`

**Steps**:
1. Add products to cart
2. Navigate to cart page
3. Verify cart title
4. Verify all products are in cart

**Screenshot**: `cart-with-products.png`

### 7. Remove from Cart Page
**Test**: `[Normal] Remove product from cart page`

**Steps**:
1. Add 3 products and go to cart
2. Verify initial count
3. Remove one product
4. Verify updated count

**Screenshot**: `product-removed-from-cart.png`

### 8. Continue Shopping
**Test**: `[Normal] Continue shopping from cart`

**Steps**:
1. Add product and go to cart
2. Click "Continue Shopping"
3. Verify back on inventory page

**Screenshot**: `continue-shopping.png`

### 9. Add All Products
**Test**: `[Critical] Add all available products to cart`

**Steps**:
1. Add all 6 products to cart
2. Verify cart count is 6
3. Navigate to cart
4. Verify all products are present

**Screenshot**: `all-products-in-cart.png`

### 10. Verify Product Prices
**Test**: `[Normal] Verify product prices`

**Steps**:
1. Get product price from inventory
2. Verify price contains "$"

**Screenshot**: `product-prices.png`

### 11. Complete Workflow
**Test**: `[Critical] Complete product selection workflow`

**Steps**:
1. Add first product from inventory
2. View details and add second product
3. Add third product from inventory
4. Verify cart count
5. Go to cart and verify all products

**Screenshot**: `complete-workflow.png`

---

## Test Data Structure

### Products in TestData
**Location**: `utils/testData.ts`

```typescript
TestData.products = {
  backpack: {
    name: 'Sauce Labs Backpack',
    id: 'sauce-labs-backpack',
    price: '$29.99',
  },
  bikeLight: {
    name: 'Sauce Labs Bike Light',
    id: 'sauce-labs-bike-light',
    price: '$9.99',
  },
  // ... more products
};

TestData.productLists = {
  all: [ /* all 6 products */ ],
  popular: [ /* 3 popular products */ ],
  budget: [ /* 2 budget products */ ],
};
```

**Usage**:
```typescript
await inventoryPage.addProductToCart(TestData.products.backpack.name);
await inventoryPage.addMultipleProductsToCart(TestData.productLists.popular);
```

---

## Running the Tests

### Run All Product Tests
```bash
npx playwright test tests/test-2.spec.ts
```

### Run Specific Test
```bash
npx playwright test tests/test-2.spec.ts -g "Add single product"
```

### Run Critical Tests Only
```bash
npx playwright test tests/test-2.spec.ts -g "Critical"
```

### Run with UI Mode
```bash
npx playwright test tests/test-2.spec.ts --ui
```

### Run in Headed Mode
```bash
npx playwright test tests/test-2.spec.ts --headed
```

---

## Test Organization

### Test Steps
Each test is organized with `test.step()` for better reporting:

```typescript
test('[Critical] My test', async ({ inventoryPage, page }) => {
  await test.step('Step 1: Add products', async () => {
    // Add products
  });
  
  await test.step('Step 2: Verify cart', async () => {
    // Verify cart count
  });
  
  await page.screenshot({ 
    path: 'test-results/screenshots/my-test.png', 
    fullPage: true 
  });
});
```

### Test Tags
- `[Critical]` - Must work, core functionality
- `[Normal]` - Standard functionality
- `[Minor]` - Nice to have features

---

## Fixtures Usage

All page objects are available as fixtures:

```typescript
test('My test', async ({ 
  loginPage, 
  inventoryPage, 
  productDetailPage, 
  cartPage, 
  page 
}) => {
  // All page objects are ready to use
});
```

---

## Best Practices

### 1. Use Page Objects
```typescript
// ✅ Good
await inventoryPage.addProductToCart('Sauce Labs Backpack');

// ❌ Bad
await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
```

### 2. Use Test Data
```typescript
// ✅ Good
await inventoryPage.addMultipleProductsToCart(TestData.productLists.popular);

// ❌ Bad
await inventoryPage.addProductToCart('Sauce Labs Backpack');
await inventoryPage.addProductToCart('Sauce Labs Bike Light');
await inventoryPage.addProductToCart('Sauce Labs Fleece Jacket');
```

### 3. Organize with Steps
```typescript
// ✅ Good - Steps appear separately in report
await test.step('Add products', async () => { ... });
await test.step('Verify cart', async () => { ... });

// ❌ Bad - Everything in one block
// All code without steps
```

### 4. Take Strategic Screenshots
```typescript
// ✅ Good - Screenshot at key moments
await page.screenshot({ 
  path: 'test-results/screenshots/cart-with-products.png', 
  fullPage: true 
});

// Take screenshot after important actions
```

---

## Common Patterns

### Pattern 1: Add Products and Verify
```typescript
await test.step('Add products', async () => {
  await inventoryPage.addMultipleProductsToCart([
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light'
  ]);
});

await test.step('Verify cart count', async () => {
  const count = await inventoryPage.getCartItemCount();
  expect(count).toBe(2);
});
```

### Pattern 2: Navigate to Cart and Verify
```typescript
await test.step('Go to cart', async () => {
  await inventoryPage.goToCart();
});

await test.step('Verify cart contents', async () => {
  const items = await cartPage.getCartItemNames();
  expect(items).toContain('Sauce Labs Backpack');
});
```

### Pattern 3: Product Details Flow
```typescript
await test.step('View product details', async () => {
  await inventoryPage.clickProductTitle('Sauce Labs Backpack');
});

await test.step('Add from details page', async () => {
  await productDetailPage.addToCart();
});

await test.step('Return to inventory', async () => {
  await productDetailPage.backToProducts();
});
```

---

## Troubleshooting

### Issue: Cart count not updating
**Solution**: Wait for the cart badge to appear
```typescript
await inventoryPage.addProductToCart('Sauce Labs Backpack');
await page.waitForTimeout(500); // Brief wait for UI update
const count = await inventoryPage.getCartItemCount();
```

### Issue: Product not found
**Solution**: Verify exact product name
```typescript
// Use exact names from TestData
await inventoryPage.addProductToCart(TestData.products.backpack.name);
```

### Issue: Element not clickable
**Solution**: Wait for element to be ready
```typescript
await inventoryPage.waitForElement(inventoryPage.inventoryTitle);
await inventoryPage.addProductToCart('Sauce Labs Backpack');
```

---

## View Test Results

After running tests:

```bash
# View HTML report
npm run report

# View JSON results
npm run report:json

# Clean results
npm run clean
```

The HTML report shows:
- All test steps
- Screenshots embedded inline
- Pass/fail status
- Duration
- Error details

---

## Summary

You now have:
- ✅ Enhanced InventoryPage with product methods
- ✅ New ProductDetailPage for product details
- ✅ New CartPage for cart operations
- ✅ 11 comprehensive test cases
- ✅ Test data for products
- ✅ Screenshots at key points
- ✅ Organized test steps
- ✅ Test tags for filtering

**Run the tests**: `npx playwright test tests/test-2.spec.ts`

**View report**: `npm run report`

Happy Testing! 🚀
