# Playwright Page Object Model (POM) Framework with Enhanced HTML Reporting

A modern test automation framework using Playwright with TypeScript, implementing the Page Object Model design pattern with Playwright's enhanced HTML reporting featuring automatic screenshot integration.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Running Tests](#running-tests)
- [HTML Reporting](#html-reporting)
- [Framework Components](#framework-components)
- [Best Practices](#best-practices)
- [CI/CD Integration](#cicd-integration)

## Features

- **Page Object Model (POM)**: Clean separation of test logic and page-specific code
- **Enhanced HTML Reporting**: Rich, interactive test reports with automatic screenshot integration
- **Test Steps**: Organized test steps for better readability in reports
- **TypeScript**: Type-safe test development
- **Custom Fixtures**: Reusable page object instances across tests
- **Multi-browser Support**: Test across Chromium, Firefox, and WebKit
- **Parallel Execution**: Fast test execution with parallel test runs
- **Screenshot & Video**: Automatic capture on test failures, manual screenshots linked in reports
- **Retry Logic**: Configurable test retries for flaky test handling
- **Test Data Management**: Centralized test data in separate files
- **Helper Utilities**: Common utility functions for test development

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Playwright_POM
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## Project Structure

```
Playwright_POM/
├── pages/                      # Page Object Model classes
│   ├── BasePage.ts            # Base page with common methods
│   ├── LoginPage.ts           # Login page object
│   ├── InventoryPage.ts       # Inventory page object
│   └── index.ts               # Export all pages
├── tests/                      # Test specifications
│   ├── test-1.spec.ts         # Login and navigation tests
│   ├── login.spec.ts          # Login functionality tests
│   └── navigation.spec.ts     # Navigation tests
├── fixtures/                   # Custom test fixtures
│   └── pageFixtures.ts        # Page object fixtures
├── utils/                      # Utility functions
│   ├── testData.ts            # Test data constants
│   └── helpers.ts             # Helper functions
├── test-results/              # Test artifacts (screenshots, videos, JSON)
│   ├── screenshots/           # Manual screenshots linked in reports
│   ├── test-results.json      # JSON test results
│   └── junit.xml             # JUnit XML results
├── playwright-report/         # HTML report (generated)
├── playwright.config.ts       # Playwright configuration
├── package.json               # Project dependencies and scripts
└── README.md                  # Project documentation
```

## Running Tests

### Run all tests:
```bash
npm test
```

### Run tests in headed mode (visible browser):
```bash
npm run test:headed
```

### Run tests in a specific browser:
```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Run tests in debug mode:
```bash
npm run test:debug
```

### Run tests with UI mode:
```bash
npm run test:ui
```

## HTML Reporting

### View HTML Report:
After tests complete, view the report:
```bash
npm run report
```

This opens Playwright's enhanced HTML report featuring:
- **Interactive UI**: Filter tests by status, browser, project
- **Test Steps**: Collapsible test steps for better organization
- **Screenshots**: Automatically embedded screenshots (failures + manual captures)
- **Videos**: Embedded videos for failed tests
- **Traces**: Downloadable trace files for debugging
- **Timeline**: Visual timeline of test execution
- **Console Logs**: Full console output for each test
- **Network Requests**: HTTP requests made during tests
- **Test Metadata**: Test tags (Critical, Normal), duration, retries

### Report Features:
- **Automatic Screenshots on Failure**: Full-page screenshots automatically captured
- **Manual Screenshots**: Screenshots taken during test execution are linked in the report
- **Test Steps**: Each test is organized into logical steps using `test.step()`
- **Test Tags**: Tests tagged with severity levels `[Critical]`, `[Normal]` for easy filtering
- **Multiple Formats**: HTML, JSON, and JUnit XML reports generated
- **Trace Viewer**: Integrated Playwright trace viewer for debugging
- **Search & Filter**: Quickly find tests by name, status, or browser

### Screenshot Management:
All screenshots are automatically linked in the HTML report:

1. **Failure Screenshots**: Automatically captured on test failure
2. **Manual Screenshots**: Captured during test execution using:
```typescript
await page.screenshot({ 
  path: 'test-results/screenshots/my-screenshot.png', 
  fullPage: true 
});
```

Both types are automatically embedded and viewable in the HTML report!

## Framework Components

### Base Page
The `BasePage` class contains common methods used across all page objects:
- Navigation methods
- Element interaction methods (click, fill, getText)
- Wait methods
- Screenshot utilities

### Page Objects
Each page in the application has a corresponding page object class:
- **LoginPage**: Handles login page interactions
- **InventoryPage**: Handles inventory/products page interactions

### Fixtures
Custom fixtures provide reusable page object instances:
```typescript
import { test, expect } from '../fixtures/pageFixtures';

test('My test', async ({ loginPage, inventoryPage, page }) => {
  // Use page objects and page directly
  await loginPage.goto();
  await loginPage.login('username', 'password');
  
  // Take manual screenshot that appears in report
  await page.screenshot({ 
    path: 'test-results/screenshots/after-login.png', 
    fullPage: true 
  });
});
```

### Test Data
Centralized test data management in `utils/testData.ts`:
- User credentials
- Error messages
- URLs

### Helpers
Utility functions in `utils/helpers.ts`:
- Random data generation
- Screenshot capture
- Page load waits
- Date formatting

## Best Practices

1. **Keep Tests Independent**: Each test should be able to run independently
2. **Use Page Objects**: Never use direct locators in test files
3. **Descriptive Test Names**: Use clear, descriptive test names with severity tags
4. **Test Steps**: Organize tests using `test.step()` for better reporting
5. **Wait Strategies**: Use proper wait strategies instead of hard waits
6. **Test Data**: Keep test data separate from test logic
7. **Screenshots**: Take screenshots at key points for better debugging
8. **Assertions**: Use meaningful assertion messages

## Writing New Tests

Example test using the framework:

```typescript
import { test, expect } from '../fixtures/pageFixtures';
import { TestData } from '../utils/testData';

test.describe('My Test Suite', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('[Critical] My Test Case', async ({ loginPage, inventoryPage, page }) => {
    await test.step('Login to application', async () => {
      await loginPage.login(
        TestData.users.standard.username,
        TestData.users.standard.password
      );
    });
    
    await test.step('Verify inventory page', async () => {
      await expect(inventoryPage.primaryHeader).toBeVisible();
    });

    // Take screenshot for report
    await page.screenshot({ 
      path: 'test-results/screenshots/my-test.png', 
      fullPage: true 
    });
  });
});
```

### Test Tags:
Use severity tags in test names for filtering in reports:
- `[Critical]` - Critical functionality, must work
- `[Normal]` - Standard functionality
- `[Minor]` - Low priority features

## CI/CD Integration

### GitHub Actions Example:
```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 18
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npm test
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: test-results
        path: test-results/
        retention-days: 30
```

## Configuration

### Playwright Config (`playwright.config.ts`):
- **Timeout**: 60 seconds per test
- **Retries**: 2 retries on CI, 0 locally
- **Parallel Execution**: Enabled
- **Screenshots**: Full-page screenshots on failure + manual screenshots
- **Videos**: On failure only (1920x1080)
- **Traces**: On first retry
- **Reports**: HTML (primary), JSON, JUnit XML

### Reporter Configuration:
```typescript
reporter: [
  ['html', { 
    outputFolder: 'playwright-report',
    open: 'never',
    attachmentsBaseURL: 'file://',
  }],
  ['json', { outputFile: 'test-results/test-results.json' }],
  ['junit', { outputFile: 'test-results/junit.xml' }],
  ['list'],
]
```

## Troubleshooting

### Issue: Tests failing due to timeout
**Solution**: Increase timeout in `playwright.config.ts` or use proper wait strategies

### Issue: Screenshots not appearing in report
**Solution**: Ensure screenshots are saved to `test-results/screenshots/` directory

### Issue: Page objects not found
**Solution**: Check import paths and ensure TypeScript compilation is successful

### Issue: Browser not launching
**Solution**: Run `npx playwright install` to install required browsers

### Issue: HTML report not opening
**Solution**: Run `npm run report` to open the report manually

## Contributing

1. Create a feature branch
2. Make your changes
3. Add tests for new features
4. Ensure all tests pass
5. Submit a pull request

## Support

For issues and questions:
- Open an issue in the repository
- Check Playwright documentation: https://playwright.dev
- Check HTML Reporter docs: https://playwright.dev/docs/test-reporters#html-reporter

## License

ISC License

---

**Happy Testing!** 🚀
