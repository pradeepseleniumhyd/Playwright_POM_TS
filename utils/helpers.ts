import { Page } from '@playwright/test';

export class Helpers {
  static async waitForPageLoad(page: Page, timeout: number = 30000): Promise<void> {
    await page.waitForLoadState('domcontentloaded', { timeout });
    await page.waitForLoadState('networkidle', { timeout });
  }

  static generateRandomEmail(): string {
    const timestamp = Date.now();
    return `test.user${timestamp}@example.com`;
  }

  static generateRandomString(length: number = 10): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  static async takeScreenshotOnFailure(page: Page, testName: string): Promise<void> {
    const sanitizedTestName = testName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const timestamp = Date.now();
    await page.screenshot({
      path: `./test-results/screenshots/${sanitizedTestName}_${timestamp}.png`,
      fullPage: true,
    });
  }

  static formatDate(date: Date = new Date()): string {
    return date.toISOString().split('T')[0];
  }

  static async scrollToElement(page: Page, selector: string): Promise<void> {
    await page.locator(selector).scrollIntoViewIfNeeded();
  }
}
