# Allure Reporting with New Format Guide

## Overview

This framework now supports **both** Playwright HTML reports AND Allure reports using the new format with `allure-js-commons`.

---

## Installation

Dependencies installed:
```json
{
  "allure-commandline": "^2.32.1",
  "allure-js-commons": "^3.5.2",
  "allure-playwright": "^3.5.2"
}
```

---

## New Import Format

### Old Format (Deprecated)
```typescript
import { allure } from 'allure-playwright';  // ❌ Old way
```

### New Format (Current)
```typescript
import * as allure from 'allure-js-commons';  // ✅ New way
```

---

## Available Allure Annotations

### 1. Epic
Groups tests at the highest level (e.g., major features)
```typescript
await allure.epic('E-commerce Platform');
await allure.epic('SauceDemo');
```

### 2. Feature
Groups tests by functionality
```typescript
await allure.feature('Authentication');
await allure.feature('Product Selection');
await allure.feature('Shopping Cart');
```

### 3. Story
Describes user story or test scenario
```typescript
await allure.story('Positive Login Flow');
await allure.story('Negative Login - Empty Credentials');
await allure.story('Product Addition to Cart');
```

### 4. Severity
Indicates test priority
```typescript
await allure.severity('blocker');   // Critical path, blocks release
await allure.severity('critical');  // Major functionality
await allure.severity('normal');    // Standard functionality
await allure.severity('minor');     // Low priority
await allure.severity('trivial');   // Cosmetic issues
```

### 5. Description
Detailed test description
```typescript
await allure.description('Verify user can login with valid credentials');
await allure.description(`
  Test Steps:
  1. Navigate to login page
  2. Enter valid credentials
  3. Click login button
  4. Verify successful login
`);
```

### 6. Attachments
Attach screenshots, logs, or data to reports
```typescript
// Screenshot
const screenshot = await page.screenshot({ fullPage: true });
await allure.attachment('Screenshot Name', screenshot, 'image/png');

// Text
await allure.attachment('Error Message', errorText, 'text/plain');

// JSON
await allure.attachment('Data', JSON.stringify(data, null, 2), 'application/json');

// HTML
await allure.attachment('HTML Content', htmlString, 'text/html');
```

---

## Complete Test Example

```typescript
import { test, expect } from '../fixtures/pageFixtures';
import { TestData } from '../utils/testData';
import * as allure from 'allure-js-commons';

test.describe('Login Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await allure.epic('SauceDemo E-commerce');
    await allure.feature('Authentication');
    await loginPage.goto();
  });

  test('[Critical] Successful login', async ({ loginPage, inventoryPage, page }) => {
    // Test metadata
    await allure.story('Positive Login Flow');
    await allure.severity('blocker');
    await allure.description('Verify user can login with valid credentials');
    
    // Test steps
    await test.step('Enter credentials and login', async () => {
      await loginPage.login(
        TestData.users.standard.username,
        TestData.users.standard.password
      );
    });

    await test.step('Verify successful login', async () => {
      await expect(inventoryPage.primaryHeader).toBeVisible();
      await expect(inventoryPage.inventoryTitle).toHaveText('Products');
    });

    // Attachments
    const screenshot = await page.screenshot({ 
      path: 'test-results/screenshots/login-success.png', 
      fullPage: true 
    });
    await allure.attachment('Login Success', screenshot, 'image/png');
  });
});
```

---

## Test Organization Pattern

### Pattern 1: Test Suite Structure
```typescript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ loginPage }) => {
    // Epic and Feature - applies to all tests in suite
    await allure.epic('Your Epic Name');
    await allure.feature('Your Feature Name');
    // Setup code
  });

  test('Test name', async ({ page }) => {
    // Story and Severity - specific to this test
    await allure.story('Your Story');
    await allure.severity('critical');
    await allure.description('Test description');
    
    // Test steps
    await test.step('Step 1', async () => { ... });
    await test.step('Step 2', async () => { ... });
    
    // Attachments
    const screenshot = await page.screenshot({ fullPage: true });
    await allure.attachment('Screenshot', screenshot, 'image/png');
  });
});
```

### Pattern 2: Attachment Pattern
```typescript
// Always capture screenshot first, then attach
const screenshot = await page.screenshot({ 
  path: 'test-results/screenshots/my-screenshot.png', 
  fullPage: true 
});
await allure.attachment('Description', screenshot, 'image/png');

// For text attachments
const errorText = await page.locator('.error').textContent();
await allure.attachment('Error Message', errorText || '', 'text/plain');

// For data attachments
const cartData = await cartPage.getCartItemNames();
await allure.attachment('Cart Items', JSON.stringify(cartData, null, 2), 'application/json');
```

---

## Running Tests with Allure

### 1. Run Tests
```bash
npm test
```
This generates results in `allure-results/` folder.

### 2. Generate and View Report
```bash
npm run report:allure
```
This:
- Generates HTML report in `allure-report/`
- Opens the report in your browser

### 3. View Existing Report
```bash
npm run allure:open
```

### 4. Clean Allure Data
```bash
npm run allure:clean
```

---

## Reports Available

### 1. Playwright HTML Report
```bash
npm run report
```
- Interactive HTML report
- Screenshots embedded inline
- Test steps visible
- Fast and modern

### 2. Allure Report
```bash
npm run report:allure
```
- Rich visual dashboard
- Graphs and statistics
- Historical trends
- Epic/Feature/Story organization
- Severity-based filtering

---

## Allure Report Features

### Dashboard
- Overview statistics
- Success rate
- Duration
- Flaky tests
- Test trends

### Suites
- Organized by Epic → Feature → Story
- Filter by severity
- Search functionality
- Test case details

### Graphs
- Status distribution
- Severity distribution
- Duration trends
- Success rate over time

### Timeline
- Test execution timeline
- Parallel execution visualization
- Duration per test

### Behaviors
- Organized by Epic
- Grouped by Feature
- Listed by Story

### Packages
- Tests organized by file structure

### Categories
- Auto-categorization of failures
- Product defects
- Test defects
- System issues

---

## Configuration

### playwright.config.ts
```typescript
reporter: [
  ['html', { 
    outputFolder: 'playwright-report',
    // HTML report config
  }],
  ['allure-playwright', {
    outputFolder: 'allure-results',
    detail: true,
    suiteTitle: true,
    environmentInfo: {
      'Node Version': process.version,
      'OS': process.platform,
      'Test Environment': process.env.TEST_ENV || 'QA',
      'Browser': 'Chromium, Firefox, WebKit',
    },
  }],
  ['list'],
],
```

---

## Best Practices

### 1. Use Hierarchical Organization
```typescript
// ✅ Good - Clear hierarchy
Epic: 'E-commerce Platform'
  Feature: 'Shopping Cart'
    Story: 'Add Product to Cart'
    
// ❌ Bad - Flat organization
Story: 'Test cart functionality'
```

### 2. Meaningful Descriptions
```typescript
// ✅ Good
await allure.description('Verify user can add multiple products to cart and proceed to checkout');

// ❌ Bad
await allure.description('Test cart');
```

### 3. Appropriate Severity Levels
```typescript
// ✅ Good usage
await allure.severity('blocker');   // Login, payment
await allure.severity('critical');  // Core features
await allure.severity('normal');    // Standard features
await allure.severity('minor');     // Nice-to-have
await allure.severity('trivial');   // UI polish

// ❌ Bad - Everything as blocker
await allure.severity('blocker');   // For every test
```

### 4. Attach Meaningful Data
```typescript
// ✅ Good - Descriptive attachments
const screenshot = await page.screenshot({ fullPage: true });
await allure.attachment('Cart Page - After Adding 3 Products', screenshot, 'image/png');

await allure.attachment('Cart Items', JSON.stringify(items, null, 2), 'application/json');

// ❌ Bad - Generic names
await allure.attachment('Screenshot', screenshot, 'image/png');
```

---

## Troubleshooting

### Issue: Allure report not generating
**Solution**:
```bash
# Clean and regenerate
npm run allure:clean
npm test
npm run report:allure
```

### Issue: Screenshots not appearing in Allure
**Solution**: Ensure you're passing the screenshot buffer to attachment:
```typescript
// ✅ Correct
const screenshot = await page.screenshot({ fullPage: true });
await allure.attachment('Name', screenshot, 'image/png');

// ❌ Wrong - Missing return value
await page.screenshot({ path: 'screenshot.png', fullPage: true });
await allure.attachment('Name', screenshot, 'image/png'); // screenshot is undefined
```

### Issue: Tests not grouped properly
**Solution**: Add Epic and Feature in beforeEach:
```typescript
test.beforeEach(async () => {
  await allure.epic('Your Epic');
  await allure.feature('Your Feature');
});
```

---

## Comparison: Playwright HTML vs Allure

| Feature | Playwright HTML | Allure |
|---------|----------------|--------|
| Speed | ⚡ Very Fast | 🐢 Slower |
| Setup | ✅ Built-in | 📦 Requires setup |
| Screenshots | ✅ Embedded | ✅ Embedded |
| Videos | ✅ Playback | ❌ Download only |
| Trace Viewer | ✅ Integrated | ❌ Not available |
| Historical Trends | ❌ No | ✅ Yes |
| Epic/Feature/Story | ❌ No | ✅ Yes |
| Graphs & Charts | ⚠️ Basic | ✅ Rich |
| Custom Categories | ❌ No | ✅ Yes |
| Severity Filtering | ⚠️ Via tags | ✅ Native |
| Best For | Quick feedback | Detailed analysis |

---

## When to Use Which Report?

### Use Playwright HTML Report
- ✅ During development
- ✅ Quick test verification
- ✅ CI/CD pipeline feedback
- ✅ Debugging with trace viewer
- ✅ Fast test results

### Use Allure Report
- ✅ Test documentation
- ✅ Stakeholder presentations
- ✅ Historical trend analysis
- ✅ Epic/Feature tracking
- ✅ Detailed test analytics
- ✅ Test management integration

---

## Summary

Your framework now supports:
- ✅ New `import * as allure from 'allure-js-commons'` format
- ✅ Epic, Feature, Story organization
- ✅ Severity levels (blocker, critical, normal, minor, trivial)
- ✅ Rich descriptions
- ✅ Screenshot, text, JSON, HTML attachments
- ✅ Both Playwright HTML and Allure reports
- ✅ Comprehensive reporting options

**Run tests**: `npm test`

**View Playwright report**: `npm run report`

**View Allure report**: `npm run report:allure`

Happy Testing with Dual Reporting! 🚀
