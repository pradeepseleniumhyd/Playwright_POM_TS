import { test, expect } from '../fixtures/pageFixtures';
import { TestData } from '../utils/testData';
import * as allure from 'allure-js-commons';

test.describe('SauceDemo Login and Navigation Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await allure.epic('SauceDemo E-commerce');
    await allure.feature('Authentication and Navigation');
    await loginPage.goto();
  });

  test('[Normal] Verify Login Page Elements', async ({ loginPage, page }) => {
    await test.step('Verify all login page elements are visible', async () => {
      await expect(loginPage.loginButton).toContainText('Login');
      await expect(loginPage.loginCredentials.getByRole('heading')).toContainText('Accepted usernames are:');
      await expect(loginPage.loginPassword.getByRole('heading')).toContainText('Password for all users:');
      await expect(loginPage.title).toContainText('Swag Labs');
    });

    await page.screenshot({ path: 'test-results/screenshots/login-page-elements.png', fullPage: true });
  });

  test('[Critical] Login with Empty Credentials - Username Required', async ({ loginPage, page }) => {
    await test.step('Click login without credentials', async () => {
      await loginPage.clickLogin();
    });

    await test.step('Verify username required error and dismiss', async () => {
      await expect(loginPage.errorMessage).toContainText(TestData.errorMessages.usernameRequired);
      await loginPage.clickErrorButton();
    });

    await page.screenshot({ path: 'test-results/screenshots/username-required-error.png', fullPage: true });
  });

  test('[Critical] Login with Username Only - Password Required', async ({ loginPage, page }) => {
    await test.step('Enter username only', async () => {
      await loginPage.enterUsername(TestData.users.standard.username);
      await loginPage.clickLogin();
    });

    await test.step('Verify password required error', async () => {
      await expect(loginPage.errorMessage).toContainText(TestData.errorMessages.passwordRequired);
    });

    await page.screenshot({ path: 'test-results/screenshots/password-required-error.png', fullPage: true });
  });

  test('[Critical] Login with Invalid Credentials', async ({ loginPage, page }) => {
    await test.step('Enter invalid credentials', async () => {
      await loginPage.enterUsername('standard_use');
      await loginPage.enterPassword('secret)sauce');
      await loginPage.clickLogin();
    });

    await test.step('Verify invalid credentials error', async () => {
      await expect(loginPage.errorMessage).toContainText(TestData.errorMessages.invalidCredentials);
    });

    await page.screenshot({ path: 'test-results/screenshots/invalid-creds-error.png', fullPage: true });
  });

  test('[Critical] Successful Login and Verify Navigation', async ({ loginPage, inventoryPage, page }) => {
    await test.step('Login with valid credentials', async () => {
      await loginPage.login(TestData.users.standard.username, TestData.users.standard.password);
    });

    await test.step('Verify inventory page loaded', async () => {
      await expect(inventoryPage.primaryHeader).toContainText('Swag Labs');
      await expect(inventoryPage.inventoryTitle).toContainText('Products');
    });

    await test.step('Open menu and verify all options', async () => {
      await inventoryPage.openMenu();
      await expect(inventoryPage.allItemsLink).toContainText('All Items');
      await expect(inventoryPage.aboutLink).toContainText('About');
      await expect(inventoryPage.logoutLink).toContainText('Logout');
      await expect(inventoryPage.resetAppStateLink).toContainText('Reset App State');
    });

    await page.screenshot({ path: 'test-results/screenshots/successful-navigation.png', fullPage: true });
  });

  test('[Critical] Complete User Journey - Login and Logout', async ({ loginPage, inventoryPage, page }) => {
    await test.step('Login to application', async () => {
      await loginPage.login(TestData.users.standard.username, TestData.users.standard.password);
      await expect(inventoryPage.primaryHeader).toContainText('Swag Labs');
    });

    await test.step('Logout from application', async () => {
      await inventoryPage.logout();
    });

    await test.step('Verify back on login page', async () => {
      await expect(loginPage.title).toContainText('Swag Labs');
      await expect(loginPage.loginButton).toContainText('Login');
    });

    await page.screenshot({ path: 'test-results/screenshots/complete-user-journey.png', fullPage: true });
  });
});