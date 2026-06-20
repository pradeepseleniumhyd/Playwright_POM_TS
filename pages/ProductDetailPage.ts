import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
  readonly productName: Locator;
  readonly productDescription: Locator;
  readonly productPrice: Locator;
  readonly productImage: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.locator('[data-test="inventory-item-name"]');
    this.productDescription = page.locator('[data-test="inventory-item-desc"]');
    this.productPrice = page.locator('[data-test="inventory-item-price"]');
    this.productImage = page.locator('.inventory_details_img');
    this.addToCartButton = page.locator('[data-test^="add-to-cart"]');
    this.removeButton = page.locator('[data-test^="remove"]');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
  }

  async getProductName(): Promise<string> {
    return await this.getText(this.productName);
  }

  async getProductDescription(): Promise<string> {
    return await this.getText(this.productDescription);
  }

  async getProductPrice(): Promise<string> {
    return await this.getText(this.productPrice);
  }

  async addToCart(): Promise<void> {
    await this.click(this.addToCartButton);
  }

  async removeFromCart(): Promise<void> {
    await this.click(this.removeButton);
  }

  async backToProducts(): Promise<void> {
    await this.click(this.backToProductsButton);
  }

  async isProductInCart(): Promise<boolean> {
    return await this.isVisible(this.removeButton);
  }
}
