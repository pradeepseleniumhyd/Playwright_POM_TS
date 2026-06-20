import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly primaryHeader: Locator;
  readonly inventoryTitle: Locator;
  readonly menuButton: Locator;
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;
  readonly inventoryItems: Locator;

  constructor(page: Page) {
    super(page);
    this.primaryHeader = page.locator('[data-test="primary-header"]');
    this.inventoryTitle = page.locator('[data-test="title"]');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]');
    this.aboutLink = page.locator('[data-test="about-sidebar-link"]');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.resetAppStateLink = page.locator('[data-test="reset-sidebar-link"]');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.inventoryItems = page.locator('.inventory_item');
  }

  async openMenu(): Promise<void> {
    await this.click(this.menuButton);
  }

  async logout(): Promise<void> {
    await this.openMenu();
    await this.click(this.logoutLink);
  }

  async getHeaderText(): Promise<string> {
    return await this.getText(this.primaryHeader);
  }

  async getTitleText(): Promise<string> {
    return await this.getText(this.inventoryTitle);
  }

  async isAllItemsLinkVisible(): Promise<boolean> {
    return await this.isVisible(this.allItemsLink);
  }

  async isAboutLinkVisible(): Promise<boolean> {
    return await this.isVisible(this.aboutLink);
  }

  async isLogoutLinkVisible(): Promise<boolean> {
    return await this.isVisible(this.logoutLink);
  }

  async isResetAppStateLinkVisible(): Promise<boolean> {
    return await this.isVisible(this.resetAppStateLink);
  }

  async getAllMenuItems(): Promise<{
    allItems: boolean;
    about: boolean;
    logout: boolean;
    resetAppState: boolean;
  }> {
    await this.openMenu();
    return {
      allItems: await this.isAllItemsLinkVisible(),
      about: await this.isAboutLinkVisible(),
      logout: await this.isLogoutLinkVisible(),
      resetAppState: await this.isResetAppStateLinkVisible(),
    };
  }

  // Product Selection Methods
  async addProductToCart(productName: string): Promise<void> {
    const productId = this.getProductId(productName);
    const addButton = this.page.locator(`[data-test="add-to-cart-${productId}"]`);
    await this.click(addButton);
  }

  async removeProductFromCart(productName: string): Promise<void> {
    const productId = this.getProductId(productName);
    const removeButton = this.page.locator(`[data-test="remove-${productId}"]`);
    await this.click(removeButton);
  }

  async addMultipleProductsToCart(productNames: string[]): Promise<void> {
    for (const productName of productNames) {
      await this.addProductToCart(productName);
    }
  }

  async clickProductTitle(productName: string): Promise<void> {
    const productLink = this.page.locator(`[data-test*="title-link"]`, { hasText: productName });
    await this.click(productLink.first());
  }

  async getCartItemCount(): Promise<number> {
    const isVisible = await this.shoppingCartBadge.isVisible();
    if (!isVisible) return 0;
    const count = await this.getText(this.shoppingCartBadge);
    return parseInt(count);
  }

  async goToCart(): Promise<void> {
    await this.click(this.shoppingCartLink);
  }

  async getProductPrice(productName: string): Promise<string> {
    const item = this.page.locator('.inventory_item', { hasText: productName });
    const price = item.locator('.inventory_item_price');
    return await this.getText(price);
  }

  async isProductInCart(productName: string): Promise<boolean> {
    const productId = this.getProductId(productName);
    const removeButton = this.page.locator(`[data-test="remove-${productId}"]`);
    return await removeButton.isVisible();
  }

  async getInventoryItemCount(): Promise<number> {
    return await this.inventoryItems.count();
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
