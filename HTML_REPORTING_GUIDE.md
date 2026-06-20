# Playwright HTML Reporting Guide

## Overview

This framework uses Playwright's built-in HTML reporter with enhanced configuration for beautiful, interactive test reports with automatic screenshot integration.

## Why Playwright HTML Reporter?

✅ **Modern & Attractive**: Clean, professional UI  
✅ **No Extra Dependencies**: Built into Playwright  
✅ **Automatic Screenshot Embedding**: Screenshots appear inline  
✅ **Interactive**: Filter, search, and explore results  
✅ **Trace Viewer Integration**: Debug failures with trace viewer  
✅ **Video Playback**: Watch test videos directly in the report  
✅ **Test Steps**: Organized, collapsible test steps  
✅ **Multiple Export Formats**: HTML, JSON, JUnit XML  

---

## Report Features

### 1. Dashboard View
The main dashboard shows:
- Total tests run
- Pass/Fail/Flaky/Skipped counts
- Total duration
- Browser breakdown
- Quick filters

### 2. Test Results
Each test shows:
- ✅ Pass/❌ Fail/⚠️ Flaky status
- Test name with tags (e.g., [Critical])
- Duration
- Browser used
- Retry information

### 3. Test Details
Click any test to see:
- **Test Steps**: Each `test.step()` appears as a collapsible section
- **Screenshots**: All screenshots embedded inline (clickable for full view)
- **Videos**: Video player for failed tests
- **Traces**: Download trace files for debugging
- **Console Output**: All console.log() messages
- **Network Requests**: HTTP requests made during test
- **Test Source**: Link to test file and line number

### 4. Filtering & Search
- Filter by test status (passed, failed, flaky, skipped)
- Filter by browser (Chrome, Firefox, Safari)
- Search by test name
- Filter by test tags from test names

---

## How to Use

### View Report After Tests
```bash
# Run tests
npm test

# Open report
npm run report
```

### Report Opens Automatically
The report opens in your default browser showing:
- Summary statistics
- All test results
- Interactive filters

---

## Taking Screenshots

### Automatic Screenshots
Screenshots are automatically taken when tests fail:
```typescript
test('[Critical] My test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('.header')).toBeVisible(); // If this fails, screenshot is automatic
});
```

### Manual Screenshots
Take screenshots at any point - they automatically appear in the report:

```typescript
test('[Critical] User login flow', async ({ loginPage, page }) => {
  await test.step('Navigate to login page', async () => {
    await loginPage.goto();
    // Screenshot appears in report under this step
    await page.screenshot({ 
      path: 'test-results/screenshots/login-page.png', 
      fullPage: true 
    });
  });

  await test.step('Enter credentials', async () => {
    await loginPage.login('user', 'pass');
    // Another screenshot
    await page.screenshot({ 
      path: 'test-results/screenshots/after-login.png', 
      fullPage: true 
    });
  });
});
```

**Important**: Save screenshots to `test-results/screenshots/` directory for proper linking.

---

## Organizing Tests with Steps

Use `test.step()` to organize tests - each step appears separately in the report:

```typescript
test('[Critical] Complete user journey', async ({ loginPage, inventoryPage, page }) => {
  await test.step('Step 1: Login', async () => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.screenshot({ 
      path: 'test-results/screenshots/step1-login.png', 
      fullPage: true 
    });
  });

  await test.step('Step 2: Navigate to inventory', async () => {
    await expect(inventoryPage.primaryHeader).toBeVisible();
    await page.screenshot({ 
      path: 'test-results/screenshots/step2-inventory.png', 
      fullPage: true 
    });
  });

  await test.step('Step 3: Logout', async () => {
    await inventoryPage.logout();
    await page.screenshot({ 
      path: 'test-results/screenshots/step3-logout.png', 
      fullPage: true 
    });
  });
});
```

**Report Output:**
```
✅ [Critical] Complete user journey (2.5s)
  ├── Step 1: Login (0.8s)
  │   └── 📸 step1-login.png
  ├── Step 2: Navigate to inventory (0.9s)
  │   └── 📸 step2-inventory.png
  └── Step 3: Logout (0.8s)
      └── 📸 step3-logout.png
```

---

## Using Test Tags

Add tags to test names for easy filtering in reports:

```typescript
// Critical tests
test('[Critical] Payment processing', async ({ page }) => { ... });
test('[Critical] User authentication', async ({ page }) => { ... });

// Normal tests
test('[Normal] Footer links', async ({ page }) => { ... });
test('[Normal] Image loading', async ({ page }) => { ... });

// Minor tests
test('[Minor] Tooltip display', async ({ page }) => { ... });
```

In the report, you can:
- Search for `[Critical]` to see all critical tests
- See tags in test names for quick identification
- Use them as part of your test organization strategy

---

## Report File Formats

### 1. HTML Report (Primary)
**Location**: `playwright-report/index.html`
**Features**: Interactive, screenshots, videos, traces
**View**: `npm run report`

### 2. JSON Report
**Location**: `test-results/test-results.json`
**Features**: Structured data for CI/CD integration
**View**: `npm run report:json`

### 3. JUnit XML
**Location**: `test-results/junit.xml`
**Features**: Standard XML format for CI tools
**Use**: For Jenkins, Azure DevOps, etc.

---

## Screenshot Best Practices

### 1. Name Screenshots Descriptively
```typescript
// ❌ Bad
await page.screenshot({ path: 'test-results/screenshots/1.png' });

// ✅ Good
await page.screenshot({ 
  path: 'test-results/screenshots/login-page-loaded.png' 
});
```

### 2. Take Full-Page Screenshots
```typescript
await page.screenshot({ 
  path: 'test-results/screenshots/my-screenshot.png', 
  fullPage: true  // Captures entire page, not just viewport
});
```

### 3. Screenshot Key Moments
```typescript
// Before action
await page.screenshot({ 
  path: 'test-results/screenshots/before-click.png', 
  fullPage: true 
});

// Perform action
await page.click('.button');

// After action
await page.screenshot({ 
  path: 'test-results/screenshots/after-click.png', 
  fullPage: true 
});
```

### 4. Organize Screenshots by Test
```typescript
const testName = 'login-flow';
await page.screenshot({ 
  path: `test-results/screenshots/${testName}-step1.png`, 
  fullPage: true 
});
```

---

## Viewing Videos

Videos are automatically recorded for failed tests:

1. Run tests: `npm test`
2. Open report: `npm run report`
3. Click on a failed test
4. Video player shows automatically
5. Click play to watch the test execution

**Video Settings** (in playwright.config.ts):
- Resolution: 1920x1080
- Mode: `retain-on-failure` (only failed tests)
- Format: WebM

---

## Using Trace Viewer

For failed tests, trace files are available:

1. Open report: `npm run report`
2. Click on a failed test
3. Click "Trace" tab or download trace
4. Trace viewer shows:
   - DOM snapshots at each step
   - Network activity
   - Console logs
   - Screenshots
   - Actions timeline

---

## CI/CD Integration

### GitHub Actions
```yaml
- name: Run Playwright tests
  run: npm test

- name: Upload HTML Report
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: playwright-report
    path: playwright-report/

- name: Upload Test Results
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: test-results
    path: test-results/
```

### Viewing Reports in CI
1. Download the `playwright-report` artifact
2. Extract and open `index.html`
3. All screenshots, videos, and traces are included

---

## Customizing the Report

### Configuration Options

In `playwright.config.ts`:

```typescript
reporter: [
  ['html', { 
    outputFolder: 'playwright-report',  // Report directory
    open: 'never',                      // Don't auto-open
    host: 'localhost',                  // Server host
    port: 9223,                         // Server port
    attachmentsBaseURL: 'file://',      // Base URL for attachments
  }],
],
```

### Screenshot Configuration

```typescript
use: {
  screenshot: {
    mode: 'only-on-failure',  // or 'on', 'off'
    fullPage: true,
  },
}
```

### Video Configuration

```typescript
use: {
  video: {
    mode: 'retain-on-failure',  // or 'on', 'off', 'on-first-retry'
    size: { width: 1920, height: 1080 }
  },
}
```

---

## Troubleshooting

### Screenshots not appearing?
✅ Ensure screenshots are saved to `test-results/screenshots/`
✅ Use full paths: `test-results/screenshots/name.png`
✅ Check file actually exists after test runs

### Report not opening?
✅ Run: `npm run report`
✅ Or manually open: `playwright-report/index.html`
✅ Check browsers are installed: `npx playwright install`

### Videos not recording?
✅ Videos only record on failure by default
✅ Check `playwright.config.ts` video settings
✅ Make sure test actually failed

### Report looks broken?
✅ Clean and regenerate: `npm run clean && npm test`
✅ Update Playwright: `npm install @playwright/test@latest`

---

## Report Examples

### Successful Test
```
✅ [Critical] User login flow (2.3s)
  ├── Step 1: Navigate to login (0.5s)
  │   └── 📸 login-page.png
  ├── Step 2: Enter credentials (0.8s)
  ├── Step 3: Click login (1.0s)
  │   └── 📸 after-login.png
  └── ✅ All assertions passed
```

### Failed Test
```
❌ [Critical] Payment processing (3.1s)
  ├── Step 1: Add item to cart (0.6s)
  │   └── 📸 cart-with-item.png
  ├── Step 2: Proceed to checkout (0.8s)
  ├── Step 3: Enter payment info (1.2s)
  └── ❌ Expected payment success page, but got error (0.5s)
      ├── 📸 Screenshot (auto-captured on failure)
      ├── 🎥 Video
      ├── 📊 Trace
      └── 📝 Console output
```

---

## Summary

The Playwright HTML reporter provides:

✅ **Beautiful UI** - Modern, professional appearance  
✅ **All-in-One** - Screenshots, videos, traces in one place  
✅ **Interactive** - Filter, search, explore  
✅ **Easy Integration** - No extra dependencies  
✅ **CI/CD Ready** - Exportable artifacts  
✅ **Automatic** - Failure captures happen automatically  
✅ **Flexible** - Manual screenshots whenever needed  

**View your reports**: `npm run report`

Happy Testing! 🚀
