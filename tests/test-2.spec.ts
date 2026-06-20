import { test, expect } from '../fixtures/pageFixtures';
import { TestData } from '../utils/testData';
import * as allure from 'allure-js-commons';

test.describe('Product Selection and Cart Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await allure.epic('SauceDemo E-commerce');
    await allure.feature('Product Selection and Shopping Cart');
    await loginPage.goto();
    await loginPage.login(
      TestData.users.standard.username,
      TestData.users.standard.password
    );
  });

  test('[Critical] Add single product to cart', async ({ inventoryPage, page }) => {
    await allure.story('Product Addition');
    await allure.severity('blocker');
    await allure.description('Verify user can add a single product to the shopping cart');
    
    await test.step('Add Sauce Labs Backpack to cart', async () => {
      await inventoryPage.addProductToCart('Sauce Labs Backpack');
    });

    await test.step('Verify product is added to cart', async () => {
      const cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(1);
      
      const isInCart = await inventoryPage.isProductInCart('Sauce Labs Backpack');
      expect(isInCart).toBeTruthy();
    });

    const screenshot = await page.screenshot({ 
      path: 'test-results/screenshots/single-product-added.png', 
      fullPage: true 
    });
    await allure.attachment('Single Product Added', screenshot, 'image/png');
  });

  test('[Critical] Add multiple products to cart', async ({ inventoryPage, page }) => {
    await allure.story('Multiple Product Addition');
    await allure.severity('critical');
    await allure.description('Verify user can add multiple products to cart and cart count updates correctly');
    
    await test.step('Add multiple products to cart', async () => {
      await inventoryPage.addProductToCart('Sauce Labs Backpack');
      await inventoryPage.addProductToCart('Sauce Labs Bike Light');
      await inventoryPage.addProductToCart('Sauce Labs Bolt T-Shirt');
    });

    await test.step('Verify all products are added', async () => {
      const cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(3);
    });

    const screenshot = await page.screenshot({ 
      path: 'test-results/screenshots/multiple-products-added.png', 
      fullPage: true 
    });
    await allure.attachment('Multiple Products', screenshot, 'image/png');
  });

  test('[Normal] Add and remove product from inventory page', async ({ inventoryPage, page }) => {
    await test.step('Add product to cart', async () => {
      await inventoryPage.addProductToCart('Sauce Labs Fleece Jacket');
      const cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(1);
    });

    await test.step('Remove product from cart', async () => {
      await inventoryPage.removeProductFromCart('Sauce Labs Fleece Jacket');
      const cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(0);
    });

    await page.screenshot({ 
      path: 'test-results/screenshots/product-removed.png', 
      fullPage: true 
    });
  });

  test('[Critical] View product details and add to cart', async ({ inventoryPage, productDetailPage, page }) => {
    await test.step('Click on product to view details', async () => {
      await inventoryPage.clickProductTitle('Sauce Labs Backpack');
    });

    await test.step('Verify product details page', async () => {
      const productName = await productDetailPage.getProductName();
      expect(productName).toBe('Sauce Labs Backpack');
      
      const price = await productDetailPage.getProductPrice();
      expect(price).toBeTruthy();
    });

    await page.screenshot({ 
      path: 'test-results/screenshots/product-details-page.png', 
      fullPage: true 
    });

    await test.step('Add product from details page', async () => {
      await productDetailPage.addToCart();
      const isInCart = await productDetailPage.isProductInCart();
      expect(isInCart).toBeTruthy();
    });

    await test.step('Navigate back to products', async () => {
      await productDetailPage.backToProducts();
      await expect(inventoryPage.inventoryTitle).toHaveText('Products');
    });
  });

  test('[Critical] Add multiple products using helper method', async ({ inventoryPage, page }) => {
    const products = [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie'
    ];

    await test.step('Add multiple products at once', async () => {
      await inventoryPage.addMultipleProductsToCart(products);
    });

    await test.step('Verify cart count', async () => {
      const cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(4);
    });

    await page.screenshot({ 
      path: 'test-results/screenshots/bulk-products-added.png', 
      fullPage: true 
    });
  });

  test('[Critical] Navigate to cart and verify products', async ({ inventoryPage, cartPage, page }) => {
    const productsToAdd = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'];

    await test.step('Add products to cart', async () => {
      await inventoryPage.addMultipleProductsToCart(productsToAdd);
      const cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(2);
    });

    await test.step('Navigate to cart', async () => {
      await inventoryPage.goToCart();
      await expect(cartPage.cartTitle).toHaveText('Your Cart');
    });

    await test.step('Verify products in cart', async () => {
      const itemsInCart = await cartPage.getCartItemCount();
      expect(itemsInCart).toBe(2);
      
      const cartItems = await cartPage.getCartItemNames();
      expect(cartItems).toContain('Sauce Labs Backpack');
      expect(cartItems).toContain('Sauce Labs Bike Light');
    });

    await page.screenshot({ 
      path: 'test-results/screenshots/cart-with-products.png', 
      fullPage: true 
    });
  });

  test('[Normal] Remove product from cart page', async ({ inventoryPage, cartPage, page }) => {
    await test.step('Add products and go to cart', async () => {
      await inventoryPage.addMultipleProductsToCart([
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light',
        'Sauce Labs Bolt T-Shirt'
      ]);
      await inventoryPage.goToCart();
    });

    await test.step('Verify initial cart count', async () => {
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(3);
    });

    await test.step('Remove one product from cart', async () => {
      await cartPage.removeItemFromCart('Sauce Labs Bike Light');
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(2);
    });

    await page.screenshot({ 
      path: 'test-results/screenshots/product-removed-from-cart.png', 
      fullPage: true 
    });
  });

  test('[Normal] Continue shopping from cart', async ({ inventoryPage, cartPage, page }) => {
    await test.step('Add product and go to cart', async () => {
      await inventoryPage.addProductToCart('Sauce Labs Backpack');
      await inventoryPage.goToCart();
    });

    await test.step('Continue shopping', async () => {
      await cartPage.continueShopping();
      await expect(inventoryPage.inventoryTitle).toHaveText('Products');
    });

    await page.screenshot({ 
      path: 'test-results/screenshots/continue-shopping.png', 
      fullPage: true 
    });
  });

  test('[Critical] Add all available products to cart', async ({ inventoryPage, cartPage, page }) => {
    const allProducts = [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)'
    ];

    await test.step('Add all products to cart', async () => {
      await inventoryPage.addMultipleProductsToCart(allProducts);
    });

    await test.step('Verify cart count on inventory page', async () => {
      const cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(6);
    });

    await test.step('Navigate to cart and verify all products', async () => {
      await inventoryPage.goToCart();
      const itemsInCart = await cartPage.getCartItemCount();
      expect(itemsInCart).toBe(6);
      
      const cartItems = await cartPage.getCartItemNames();
      for (const product of allProducts) {
        expect(cartItems).toContain(product);
      }
    });

    await page.screenshot({ 
      path: 'test-results/screenshots/all-products-in-cart.png', 
      fullPage: true 
    });
  });

  test('[Normal] Verify product prices', async ({ inventoryPage, page }) => {
    await test.step('Get product price from inventory', async () => {
      const price = await inventoryPage.getProductPrice('Sauce Labs Backpack');
      expect(price).toContain('$');
      expect(price).toBeTruthy();
    });

    await page.screenshot({ 
      path: 'test-results/screenshots/product-prices.png', 
      fullPage: true 
    });
  });

  test('[Critical] Complete product selection workflow', async ({ inventoryPage, productDetailPage, cartPage, page }) => {
    await test.step('Add first product from inventory', async () => {
      await inventoryPage.addProductToCart('Sauce Labs Backpack');
    });

    await test.step('View details and add second product', async () => {
      await inventoryPage.clickProductTitle('Sauce Labs Bike Light');
      await productDetailPage.addToCart();
      await productDetailPage.backToProducts();
    });

    await test.step('Add third product from inventory', async () => {
      await inventoryPage.addProductToCart('Sauce Labs Fleece Jacket');
    });

    await test.step('Verify cart count', async () => {
      const cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(3);
    });

    await test.step('Go to cart and verify all products', async () => {
      await inventoryPage.goToCart();
      const cartItems = await cartPage.getCartItemNames();
      expect(cartItems).toHaveLength(3);
      expect(cartItems).toContain('Sauce Labs Backpack');
      expect(cartItems).toContain('Sauce Labs Bike Light');
      expect(cartItems).toContain('Sauce Labs Fleece Jacket');
    });

    await page.screenshot({ 
      path: 'test-results/screenshots/complete-workflow.png', 
      fullPage: true 
    });
  });
});
