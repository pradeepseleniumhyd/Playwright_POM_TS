import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartTitle: Locator;
  readonly cartItems: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;
  readonly cartQuantity: Locator;

  constructor(page: Page) {
    super(page);
    this.cartTitle = page.locator('[data-test="title"]');
    this.cartItems = page.locator('.cart_item');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartQuantity = page.locator('.cart_quantity');
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async removeItemFromCart(productName: string): Promise<void> {
    const productId = this.getProductId(productName);
    const removeButton = this.page.locator(`[data-test="remove-${productId}"]`);
    await this.click(removeButton);
  }

  async continueShopping(): Promise<void> {
    await this.click(this.continueShoppingButton);
  }

  async proceedToCheckout(): Promise<void> {
    await this.click(this.checkoutButton);
  }

  async getCartItemNames(): Promise<string[]> {
    const items = await this.cartItems.all();
    const names: string[] = [];
    for (const item of items) {
      const name = await item.locator('[data-test="inventory-item-name"]').textContent();
      if (name) names.push(name);
    }
    return names;
  }

  async getCartItemPrice(productName: string): Promise<string> {
    const item = this.page.locator('.cart_item', { hasText: productName });
    const price = item.locator('[data-test="inventory-item-price"]');
    return await this.getText(price);
  }

  async isCartEmpty(): Promise<boolean> {
    const count = await this.getCartItemCount();
    return count === 0;
  }

  async isProductInCart(productName: string): Promise<boolean> {
    const items = await this.getCartItemNames();
    return items.includes(productName);
  }

  private getProductId(productName: string): string {
    const productMap: { [key: string]: string } = {
      'Sauce Labs Backpack': 'sauce-labs-backpack',
      'Sauce Labs Bike Light': 'sauce-labs-bike-light',
      'Sauce Labs Bolt T-Shirt': 'sauce-labs-bolt-t-shirt',
      'Sauce Labs Fleece Jacket': 'sauce-labs-fleece-jacket',
      'Sauce Labs Onesie': 'sauce-labs-onesie',
      'Test.allTheThings() T-Shirt (Red)': 'test.allthethings()-t-shirt-(red)',
    };
    return productMap[productName] || productName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
}
