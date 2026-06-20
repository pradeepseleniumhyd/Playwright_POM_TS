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
    await allure.story('Login Page Verification');
    await allure.severity('normal');
    await allure.description('Verify all login page elements are displayed correctly');
    
    await test.step('Verify all login page elements are visible', async () => {
      await expect(loginPage.loginButton).toContainText('Login');
      await expect(loginPage.loginCredentials.getByRole('heading')).toContainText('Accepted usernames are:');
      await expect(loginPage.loginPassword.getByRole('heading')).toContainText('Password for all users:');
      await expect(loginPage.title).toContainText('Swag Labs');
    });

    const screenshot = await page.screenshot({ path: 'test-results/screenshots/login-page-elements.png', fullPage: true });
    await allure.attachment('Login Page Elements', screenshot, 'image/png');
  });

  test('[Critical] Login with Empty Credentials - Username Required', async ({ loginPage, page }) => {
    await allure.story('Negative Login - Empty Credentials');
    await allure.severity('critical');
    await allure.description('Verify error message when attempting login without credentials');
    
    await test.step('Click login without credentials', async () => {
      await loginPage.clickLogin();
    });

    await test.step('Verify username required error and dismiss', async () => {
      await expect(loginPage.errorMessage).toContainText(TestData.errorMessages.usernameRequired);
      await loginPage.clickErrorButton();
    });

    const screenshot = await page.screenshot({ path: 'test-results/screenshots/username-required-error.png', fullPage: true });
    await allure.attachment('Username Required Error', screenshot, 'image/png');
  });

  test('[Critical] Login with Username Only - Password Required', async ({ loginPage, page }) => {
    await allure.story('Negative Login - Missing Password');
    await allure.severity('critical');
    await allure.description('Verify error message when password is missing');
    
    await test.step('Enter username only', async () => {
      await loginPage.enterUsername(TestData.users.standard.username);
      await loginPage.clickLogin();
    });

    await test.step('Verify password required error', async () => {
      await expect(loginPage.errorMessage).toContainText(TestData.errorMessages.passwordRequired);
    });

    const screenshot = await page.screenshot({ path: 'test-results/screenshots/password-required-error.png', fullPage: true });
    await allure.attachment('Password Required Error', screenshot, 'image/png');
  });

  test('[Critical] Login with Invalid Credentials', async ({ loginPage, page }) => {
    await allure.story('Negative Login - Invalid Credentials');
    await allure.severity('critical');
    await allure.description('Verify error message with incorrect username and password');
    
    await test.step('Enter invalid credentials', async () => {
      await loginPage.enterUsername('standard_use');
      await loginPage.enterPassword('secret)sauce');
      await loginPage.clickLogin();
    });

    await test.step('Verify invalid credentials error', async () => {
      await expect(loginPage.errorMessage).toContainText(TestData.errorMessages.invalidCredentials);
    });

    const screenshot = await page.screenshot({ path: 'test-results/screenshots/invalid-creds-error.png', fullPage: true });
    await allure.attachment('Invalid Credentials Error', screenshot, 'image/png');
  });

  test('[Critical] Successful Login and Verify Navigation', async ({ loginPage, inventoryPage, page }) => {
    await allure.story('Positive Login and Navigation');
    await allure.severity('blocker');
    await allure.description('Verify successful login and navigation to inventory with menu verification');
    
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

    const screenshot = await page.screenshot({ path: 'test-results/screenshots/successful-navigation.png', fullPage: true });
    await allure.attachment('Successful Navigation', screenshot, 'image/png');
  });

  test('[Critical] Complete User Journey - Login and Logout', async ({ loginPage, inventoryPage, page }) => {
    await allure.story('Complete User Flow');
    await allure.severity('blocker');
    await allure.description('Verify complete user journey from login to logout');
    
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

    const screenshot = await page.screenshot({ path: 'test-results/screenshots/complete-user-journey.png', fullPage: true });
    await allure.attachment('Complete Journey', screenshot, 'image/png');
  });
});
