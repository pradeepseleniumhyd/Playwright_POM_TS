import { test, expect } from '../fixtures/pageFixtures';
import { TestData } from '../utils/testData';
import * as allure from 'allure-js-commons';

test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await allure.epic('SauceDemo');
    await allure.feature('Navigation');
    await loginPage.goto();
    await loginPage.login(
      TestData.users.standard.username,
      TestData.users.standard.password
    );
  });

  test('[Normal] Verify inventory page header', async ({ inventoryPage, page }) => {
    await allure.story('Page Elements Verification');
    await allure.severity('normal');
    await allure.description('Verify inventory page header displays correctly');
    
    await test.step('Get header text', async () => {
      const headerText = await inventoryPage.getHeaderText();
      expect(headerText).toContain('Swag Labs');
    });

    const screenshot = await page.screenshot({ path: 'test-results/screenshots/inventory-header.png', fullPage: true });
    await allure.attachment('Inventory Header', screenshot, 'image/png');
  });

  test('[Normal] Verify inventory page title', async ({ inventoryPage, page }) => {
    await allure.story('Page Elements Verification');
    await allure.severity('normal');
    await allure.description('Verify inventory page title is Products');
    
    await test.step('Verify Products title', async () => {
      const titleText = await inventoryPage.getTitleText();
      expect(titleText).toBe('Products');
    });

    const screenshot = await page.screenshot({ path: 'test-results/screenshots/inventory-title.png', fullPage: true });
    await allure.attachment('Inventory Title', screenshot, 'image/png');
  });

  test('[Normal] Verify menu items are displayed', async ({ inventoryPage, page }) => {
    await allure.story('Menu Navigation');
    await allure.severity('normal');
    await allure.description('Verify all menu items are present and visible');
    
    await test.step('Open menu and verify all items', async () => {
      const menuItems = await inventoryPage.getAllMenuItems();
      
      expect(menuItems.allItems).toBeTruthy();
      expect(menuItems.about).toBeTruthy();
      expect(menuItems.logout).toBeTruthy();
      expect(menuItems.resetAppState).toBeTruthy();
      
      await allure.attachment('Menu Items', JSON.stringify(menuItems, null, 2), 'application/json');
    });

    const screenshot = await page.screenshot({ path: 'test-results/screenshots/menu-items.png', fullPage: true });
    await allure.attachment('Menu Items Screenshot', screenshot, 'image/png');
  });

  test('[Critical] User can logout successfully', async ({ inventoryPage, loginPage, page }) => {
    await allure.story('Logout Functionality');
    await allure.severity('blocker');
    await allure.description('Verify user can logout and is redirected to login page');
    
    await test.step('Logout from application', async () => {
      await inventoryPage.logout();
    });

    await test.step('Verify redirected to login page', async () => {
      await expect(loginPage.loginButton).toBeVisible();
      await expect(loginPage.title).toContainText('Swag Labs');
      
      const isLoginVisible = await loginPage.isLoginButtonVisible();
      expect(isLoginVisible).toBeTruthy();
    });

    const screenshot = await page.screenshot({ path: 'test-results/screenshots/after-logout.png', fullPage: true });
    await allure.attachment('After Logout', screenshot, 'image/png');
  });
});
