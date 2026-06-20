# Quick Start Guide - Playwright POM Framework

## Getting Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Install Playwright Browsers
```bash
npx playwright install
```

### 3. Run Your First Test
```bash
# Run all tests
npm test

# Run specific test file
npx playwright test tests/login.spec.ts

# Run in headed mode (see browser)
npm run test:headed

# Run with UI mode (interactive)
npm run test:ui
```

### 4. View Test Report

After tests complete, view the interactive HTML report:
```bash
npm run report
```

## Framework Structure at a Glance

```
Playwright_POM/
├── pages/               # Page Objects
│   ├── BasePage.ts     # Common methods for all pages
│   ├── LoginPage.ts    # Login page interactions
│   └── InventoryPage.ts # Inventory page interactions
│
├── tests/              # Test specifications
│   ├── login.spec.ts   # Login tests
│   ├── navigation.spec.ts # Navigation tests
│   └── test-1.spec.ts  # Original refactored test
│
├── fixtures/           # Custom fixtures
│   └── pageFixtures.ts # Page object fixtures
│
├── utils/              # Utilities
│   ├── testData.ts    # Test data constants
│   └── helpers.ts     # Helper functions
│
└── playwright.config.ts # Configuration
```

## Writing Your First Test

### Step 1: Import Required Modules
```typescript
import { test, expect } from '../fixtures/pageFixtures';
import { TestData } from '../utils/testData';
```

### Step 2: Create Test Suite
```typescript
test.describe('My Test Suite', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('[Critical] My first test', async ({ loginPage, inventoryPage, page }) => {
    await test.step('Login to application', async () => {
      await loginPage.login(
        TestData.users.standard.username,
        TestData.users.standard.password
      );
    });
    
    await test.step('Verify successful login', async () => {
      await expect(inventoryPage.primaryHeader).toBeVisible();
    });

    // Take screenshot that will appear in the report
    await page.screenshot({ 
      path: 'test-results/screenshots/my-first-test.png', 
      fullPage: true 
    });
  });
});
```

### Step 3: Run Your Test
```bash
npx playwright test tests/your-test.spec.ts
```

### Step 4: View Results
```bash
npm run report
```

## Key Features

### 1. Page Object Pattern
Never use locators directly in tests. Use page objects:

```typescript
// ❌ Bad - Don't do this
await page.locator('[data-test="username"]').fill('user');

// ✅ Good - Use page objects
await loginPage.enterUsername('user');
```

### 2. Custom Fixtures
Page objects are available as fixtures:

```typescript
test('My test', async ({ loginPage, inventoryPage, page }) => {
  // loginPage, inventoryPage, and page are ready to use
});
```

### 3. Test Data Management
Keep test data separate:

```typescript
// Use from testData.ts
await loginPage.login(
  TestData.users.standard.username,
  TestData.users.standard.password
);
```

### 4. Test Steps
Organize tests with steps for better reporting:

```typescript
test('[Critical] My test', async ({ loginPage, page }) => {
  await test.step('Step 1: Login', async () => {
    await loginPage.login('user', 'pass');
  });
  
  await test.step('Step 2: Verify success', async () => {
    await expect(page.locator('.header')).toBeVisible();
  });
});
```

### 5. Test Tags
Tag tests with severity levels:

```typescript
test('[Critical] Important test', async ({ page }) => { ... });
test('[Normal] Standard test', async ({ page }) => { ... });
test('[Minor] Low priority test', async ({ page }) => { ... });
```

These tags help filter tests in the HTML report!

### 6. Screenshots in Reports
Take screenshots that automatically appear in the HTML report:

```typescript
// This screenshot will be embedded in the HTML report
await page.screenshot({ 
  path: 'test-results/screenshots/my-screenshot.png', 
  fullPage: true 
});
```

## Common Commands

```bash
# Run tests
npm test                    # All tests
npm run test:chromium       # Chrome only
npm run test:firefox        # Firefox only
npm run test:webkit         # Safari only
npm run test:headed         # With visible browser
npm run test:debug          # Debug mode
npm run test:ui             # UI mode

# Reports
npm run report              # Open HTML report
npm run report:json         # View JSON results
npm run clean               # Clean test results

# Specific test file
npx playwright test tests/login.spec.ts

# Specific test by name
npx playwright test -g "Successful login"

# Run in specific browser
npx playwright test --project=chromium
```

## Test Execution Modes

### Headless Mode (Default)
Fast execution, no visible browser:
```bash
npm test
```

### Headed Mode
See the browser:
```bash
npm run test:headed
```

### Debug Mode
Step through tests:
```bash
npm run test:debug
```

### UI Mode
Interactive test runner:
```bash
npm run test:ui
```

## Understanding the HTML Report

After running tests, open the report with `npm run report`. The report shows:

### Main Dashboard
- **Test Results**: Pass/Fail/Flaky/Skipped counts
- **Duration**: Total test execution time
- **Filter Options**: Filter by status, browser, test name
- **Search**: Search tests by name

### Test Details
Click any test to see:
- **Test Steps**: Collapsible steps showing what happened
- **Screenshots**: All screenshots (failure + manual) embedded inline
- **Videos**: Video playback for failed tests
- **Traces**: Downloadable trace files
- **Console Logs**: Full console output
- **Network**: HTTP requests made during the test
- **Test Info**: Browser, duration, retries

### Screenshots
The report automatically embeds:
1. **Failure Screenshots**: Automatically captured when tests fail
2. **Manual Screenshots**: Screenshots you take during the test

Example in report:
```
✅ [Critical] Login test
  📸 Screenshot: successful-login.png
  📸 Screenshot: after-navigation.png
```

### Filtering Tests
Use the filter bar to:
- View only failed tests
- Filter by browser (Chrome, Firefox, Safari)
- Filter by test tags ([Critical], [Normal], [Minor])
- Search by test name

## Creating New Page Objects

### 1. Create Page Class
```typescript
// pages/MyPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyPage extends BasePage {
  readonly myLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.myLocator = page.locator('#my-id');
  }

  async myMethod(): Promise<void> {
    await this.click(this.myLocator);
  }
}
```

### 2. Add to Fixtures
```typescript
// fixtures/pageFixtures.ts
import { MyPage } from '../pages/MyPage';

export const test = base.extend<PageFixtures>({
  // ... existing fixtures
  myPage: async ({ page }, use) => {
    const myPage = new MyPage(page);
    await use(myPage);
  },
});
```

### 3. Use in Tests
```typescript
test('[Normal] My test', async ({ myPage, page }) => {
  await test.step('Perform action', async () => {
    await myPage.myMethod();
  });
  
  await page.screenshot({ 
    path: 'test-results/screenshots/my-page.png', 
    fullPage: true 
  });
});
```

## Best Practices for Attractive Reports

### 1. Use Descriptive Test Names
```typescript
// ❌ Bad
test('test1', async () => { ... });

// ✅ Good
test('[Critical] User can login with valid credentials', async () => { ... });
```

### 2. Organize with Test Steps
```typescript
// ✅ Each step appears separately in the report
await test.step('Navigate to login page', async () => { ... });
await test.step('Enter credentials', async () => { ... });
await test.step('Verify successful login', async () => { ... });
```

### 3. Take Strategic Screenshots
```typescript
// Take screenshots at key moments
await test.step('Login', async () => {
  await loginPage.login(user, pass);
  await page.screenshot({ 
    path: 'test-results/screenshots/after-login.png', 
    fullPage: true 
  });
});
```

### 4. Use Test Tags
```typescript
test('[Critical] Payment processing works', async () => { ... });
test('[Normal] Footer links are correct', async () => { ... });
```

## Troubleshooting

### Tests not running?
```bash
# Reinstall dependencies
npm install

# Reinstall browsers
npx playwright install
```

### Report not showing screenshots?
```bash
# Make sure screenshots directory exists
mkdir -p test-results/screenshots

# Ensure screenshots are saved to test-results/screenshots/
await page.screenshot({ 
  path: 'test-results/screenshots/my-screenshot.png', 
  fullPage: true 
});
```

### TypeScript errors?
```bash
# Check TypeScript configuration
npx tsc --noEmit
```

## Next Steps

1. Explore the example tests in `tests/` folder
2. Create your own page objects
3. Write tests using the POM pattern
4. Add test steps for better organization
5. Take screenshots at key points
6. View the beautiful HTML reports
7. Customize `playwright.config.ts` for your needs

## Report Features Summary

✅ **Interactive Dashboard**: Filter and search tests  
✅ **Test Steps**: Organized, collapsible test steps  
✅ **Embedded Screenshots**: All screenshots visible inline  
✅ **Video Playback**: Watch failed test videos  
✅ **Trace Viewer**: Debug with Playwright trace viewer  
✅ **Console Logs**: Full console output  
✅ **Network Tab**: See all HTTP requests  
✅ **Test Tags**: Filter by severity ([Critical], [Normal])  
✅ **Multi-Format**: HTML, JSON, JUnit XML  
✅ **Mobile Friendly**: Responsive report UI  

## Support

- Playwright Docs: https://playwright.dev
- HTML Reporter: https://playwright.dev/docs/test-reporters#html-reporter
- Project README: See `README.md`

Happy Testing with Beautiful Reports! 🚀
