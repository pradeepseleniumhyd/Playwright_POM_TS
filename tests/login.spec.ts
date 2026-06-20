import { test, expect } from '../fixtures/pageFixtures';
import { TestData } from '../utils/testData';
import * as allure from 'allure-js-commons';

test.describe('Login Functionality Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await allure.epic('SauceDemo Authentication');
    await allure.feature('Login Functionality');
    await loginPage.goto();
  });

  test('[Critical] Successful login with valid credentials', async ({ loginPage, inventoryPage, page }) => {
    await allure.story('Positive Login Flow');
    await allure.severity('blocker');
    await allure.description('Verify user can login with valid credentials and access inventory page');
    
    await test.step('Login with valid credentials', async () => {
      await loginPage.login(
        TestData.users.standard.username,
        TestData.users.standard.password
      );
    });

    await test.step('Verify user is on inventory page', async () => {
      await expect(inventoryPage.primaryHeader).toBeVisible();
      await expect(inventoryPage.inventoryTitle).toHaveText('Products');
    });

    // Attach screenshot for successful login
    const screenshot = await page.screenshot({ path: 'test-results/screenshots/successful-login.png', fullPage: true });
    await allure.attachment('Successful Login Screenshot', screenshot, 'image/png');
  });

  test('[Critical] Login fails with empty username', async ({ loginPage, page }) => {
    await allure.story('Negative Login - Empty Username');
    await allure.severity('critical');
    await allure.description('Verify error message when username field is empty');
    
    await test.step('Click login without entering username', async () => {
      await loginPage.clickLogin();
    });

    await test.step('Verify error message is displayed', async () => {
      const errorText = await loginPage.getErrorMessage();
      expect(errorText).toContain(TestData.errorMessages.usernameRequired);
      await allure.attachment('Error Message', errorText, 'text/plain');
    });

    // Screenshot showing the error
    const screenshot = await page.screenshot({ path: 'test-results/screenshots/empty-username-error.png', fullPage: true });
    await allure.attachment('Empty Username Error', screenshot, 'image/png');
  });

  test('[Critical] Login fails with empty password', async ({ loginPage, page }) => {
    await allure.story('Negative Login - Empty Password');
    await allure.severity('critical');
    await allure.description('Verify error message when password field is empty');
    
    await test.step('Enter username only', async () => {
      await loginPage.enterUsername(TestData.users.standard.username);
      await loginPage.clickLogin();
    });

    await test.step('Verify password required error', async () => {
      const errorText = await loginPage.getErrorMessage();
      expect(errorText).toContain(TestData.errorMessages.passwordRequired);
      await allure.attachment('Error Message', errorText, 'text/plain');
    });

    const screenshot = await page.screenshot({ path: 'test-results/screenshots/empty-password-error.png', fullPage: true });
    await allure.attachment('Empty Password Error', screenshot, 'image/png');
  });

  test('[Critical] Login fails with invalid credentials', async ({ loginPage, page }) => {
    await allure.story('Negative Login - Invalid Credentials');
    await allure.severity('critical');
    await allure.description('Verify error message with incorrect username and password');
    
    await test.step('Login with invalid credentials', async () => {
      await loginPage.login('invalid_user', 'invalid_password');
    });

    await test.step('Verify invalid credentials error', async () => {
      const errorText = await loginPage.getErrorMessage();
      expect(errorText).toContain(TestData.errorMessages.invalidCredentials);
      await allure.attachment('Error Message', errorText, 'text/plain');
    });

    const screenshot = await page.screenshot({ path: 'test-results/screenshots/invalid-credentials-error.png', fullPage: true });
    await allure.attachment('Invalid Credentials Error', screenshot, 'image/png');
  });

  test('[Normal] Error message can be dismissed', async ({ loginPage, page }) => {
    await allure.story('Error Handling');
    await allure.severity('normal');
    await allure.description('Verify error message can be dismissed by clicking close button');
    
    await test.step('Trigger error message', async () => {
      await loginPage.clickLogin();
      await expect(loginPage.errorMessage).toBeVisible();
    });

    await test.step('Dismiss error message', async () => {
      await loginPage.clickErrorButton();
      await expect(loginPage.errorMessage).not.toBeVisible();
    });

    const screenshot = await page.screenshot({ path: 'test-results/screenshots/error-dismissed.png', fullPage: true });
    await allure.attachment('Error Dismissed', screenshot, 'image/png');
  });
});
