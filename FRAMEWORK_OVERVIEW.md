# Framework Overview - Playwright POM + Allure

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Test Layer (tests/)                      │
│  - test-1.spec.ts                                           │
│  - login.spec.ts                                            │
│  - navigation.spec.ts                                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ uses
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                 Fixture Layer (fixtures/)                    │
│  - pageFixtures.ts (provides page objects to tests)         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ creates
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Page Object Layer (pages/)                      │
│  ┌───────────────────────────────────────┐                 │
│  │  BasePage (common methods)            │                 │
│  └───────────────┬───────────────────────┘                 │
│                  │ extends                                  │
│      ┌───────────┴───────────┐                             │
│      ▼                       ▼                              │
│  LoginPage              InventoryPage                       │
│  - locators             - locators                          │
│  - methods              - methods                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ uses
                       ▼
┌─────────────────────────────────────────────────────────────┐
│               Utility Layer (utils/)                         │
│  - testData.ts (test data constants)                        │
│  - helpers.ts (helper functions)                            │
└─────────────────────────────────────────────────────────────┘

                       │
                       │ reports to
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  Reporting Layer                             │
│  - Playwright HTML Report                                   │
│  - Allure Report (JSON → HTML)                             │
│  - Console Output                                           │
└─────────────────────────────────────────────────────────────┘
```

## Design Patterns

### 1. Page Object Model (POM)
**Purpose**: Separate test logic from page-specific code

**Benefits**:
- Maintainability: Changes to UI only affect page objects
- Reusability: Page methods used across multiple tests
- Readability: Tests read like business requirements

**Example**:
```typescript
// Page Object
class LoginPage {
  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }
}

// Test (readable and maintainable)
test('User can login', async ({ loginPage }) => {
  await loginPage.login('user', 'pass');
});
```

### 2. Custom Fixtures
**Purpose**: Provide pre-configured objects to tests

**Benefits**:
- Automatic setup/teardown
- Dependency injection
- Type safety
- Reusability

**Example**:
```typescript
// Fixture definition
export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});

// Automatic injection into tests
test('My test', async ({ loginPage }) => {
  // loginPage is ready to use
});
```

### 3. Base Page Pattern
**Purpose**: Share common functionality across all page objects

**Benefits**:
- DRY (Don't Repeat Yourself)
- Consistent behavior
- Easy to extend

**Structure**:
```typescript
BasePage (common methods)
    ├── navigateTo()
    ├── click()
    ├── fill()
    ├── waitForElement()
    └── screenshot()
    
LoginPage extends BasePage
    ├── Inherits all base methods
    └── Adds specific methods:
        ├── login()
        ├── enterUsername()
        └── getErrorMessage()
```

## Framework Components

### 1. Base Page (`pages/BasePage.ts`)
**Responsibility**: Common page operations

**Key Methods**:
- `navigateTo(url)` - Navigate to URL
- `click(locator)` - Click element
- `fill(locator, text)` - Fill input
- `getText(locator)` - Get element text
- `isVisible(locator)` - Check visibility
- `waitForElement(locator)` - Wait for element
- `screenshot(path)` - Take screenshot

### 2. Page Objects (`pages/*.ts`)
**Responsibility**: Page-specific interactions

**Structure**:
```typescript
export class PageName extends BasePage {
  // Locators (readonly)
  readonly element1: Locator;
  readonly element2: Locator;
  
  // Constructor (initialize locators)
  constructor(page: Page) {
    super(page);
    this.element1 = page.locator('...');
  }
  
  // Methods (business actions)
  async performAction(): Promise<void> {
    // Implementation
  }
}
```

### 3. Fixtures (`fixtures/pageFixtures.ts`)
**Responsibility**: Provide page objects to tests

**Benefits**:
- Automatic instantiation
- Type safety
- Intellisense support

### 4. Test Data (`utils/testData.ts`)
**Responsibility**: Centralized test data

**Structure**:
```typescript
export const TestData = {
  users: {
    standard: { username: '...', password: '...' }
  },
  errorMessages: {
    usernameRequired: '...'
  },
  urls: {
    baseUrl: '...'
  }
};
```

### 5. Helpers (`utils/helpers.ts`)
**Responsibility**: Utility functions

**Examples**:
- `waitForPageLoad()` - Wait for page to load
- `generateRandomEmail()` - Generate test email
- `takeScreenshotOnFailure()` - Screenshot helper
- `formatDate()` - Date formatting

## Test Organization

### Test Structure
```typescript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ loginPage }) => {
    // Setup: runs before each test
    await allure.epic('Epic Name');
    await allure.feature('Feature Name');
    await loginPage.goto();
  });

  test('Test case description', async ({ loginPage, inventoryPage }) => {
    // Arrange: setup test data
    await allure.story('User Story');
    await allure.severity('critical');
    
    // Act: perform actions
    await loginPage.login(username, password);
    
    // Assert: verify results
    await expect(inventoryPage.header).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    // Cleanup: runs after each test (if needed)
  });
});
```

### Allure Annotations Hierarchy
```
Epic (Highest level - e.g., "E-commerce")
  └── Feature (Functionality - e.g., "Authentication")
      └── Story (User story - e.g., "Login")
          └── Test (Individual test case)
```

### Severity Levels
- **blocker**: Critical functionality, blocks testing
- **critical**: Major functionality, high priority
- **normal**: Standard functionality
- **minor**: Low priority issues
- **trivial**: Cosmetic issues

## Configuration Flow

```
playwright.config.ts
    ├── testDir: './tests'
    ├── timeout: 60000
    ├── retries: 2 (CI) / 0 (local)
    ├── workers: 1 (CI) / undefined (local)
    ├── reporter:
    │   ├── html (Playwright report)
    │   ├── list (console output)
    │   └── allure-playwright (Allure report)
    ├── use:
    │   ├── baseURL
    │   ├── trace: 'retain-on-failure'
    │   ├── screenshot: 'only-on-failure'
    │   ├── video: 'retain-on-failure'
    │   └── timeouts (action, navigation)
    └── projects:
        ├── chromium
        ├── firefox
        └── webkit
```

## Execution Flow

```
1. Test Starts
   └── Playwright reads playwright.config.ts

2. Fixture Setup
   └── pageFixtures.ts creates page objects

3. Test Execution
   ├── beforeEach hooks run
   ├── Test body executes
   │   ├── Page objects interact with browser
   │   ├── Assertions verify expectations
   │   └── Allure annotations added
   └── afterEach hooks run

4. Reporting
   ├── Playwright generates HTML report
   ├── Allure generates JSON results
   └── Console shows summary

5. Report Generation (manual)
   └── allure-commandline generates HTML from JSON
```

## Reporting Architecture

### Playwright HTML Report
```
playwright-report/
├── index.html          # Main report
├── data/               # Test data
└── trace-*.zip         # Traces for failed tests
```

### Allure Report
```
allure-results/         # JSON test results (generated during test run)
├── *-result.json      # Individual test results
├── *-container.json   # Test containers (suites)
└── *-attachment.*     # Screenshots, videos, traces

allure-report/          # HTML report (generated by allure-commandline)
├── index.html         # Main dashboard
├── widgets/           # Report widgets
├── data/              # Report data
└── history/           # Historical data
```

## Data Flow

```
Test Data (testData.ts)
    ↓
Test Specification (.spec.ts)
    ↓
Page Fixtures (pageFixtures.ts)
    ↓
Page Objects (pages/*.ts)
    ↓
Base Page (BasePage.ts)
    ↓
Playwright API
    ↓
Browser
    ↓
Results
    ├→ Playwright Reporter → HTML Report
    ├→ Allure Reporter → JSON Results → HTML Report
    └→ Console → Terminal Output
```

## Best Practices Applied

1. **Separation of Concerns**
   - Tests: What to test
   - Page Objects: How to interact
   - Test Data: What data to use
   - Config: How to run

2. **DRY Principle**
   - Common methods in BasePage
   - Reusable page objects
   - Shared fixtures
   - Centralized test data

3. **Type Safety**
   - TypeScript everywhere
   - Strong typing for page objects
   - Type-safe fixtures
   - Compile-time error checking

4. **Maintainability**
   - Clear folder structure
   - Descriptive names
   - Consistent patterns
   - Comprehensive documentation

5. **Scalability**
   - Easy to add new pages
   - Easy to add new tests
   - Easy to extend functionality
   - Parallel execution support

## Framework Extension Points

### Adding New Page
1. Create `pages/NewPage.ts` extending `BasePage`
2. Add fixture in `fixtures/pageFixtures.ts`
3. Export from `pages/index.ts`
4. Use in tests via fixture

### Adding New Utility
1. Add function to `utils/helpers.ts`
2. Export function
3. Import in tests
4. Use as needed

### Adding New Test Data
1. Add data to `utils/testData.ts`
2. Organize by category
3. Import in tests
4. Reference using `TestData.category.item`

### Custom Reporter
1. Create reporter class
2. Add to `playwright.config.ts` reporters array
3. Implement required methods
4. Configure options

## Performance Considerations

1. **Parallel Execution**
   - Tests run in parallel by default
   - Configure workers in config

2. **Retry Logic**
   - Automatic retries on CI
   - Reduces flakiness

3. **Resource Optimization**
   - Headless mode by default
   - Screenshots only on failure
   - Videos only on failure

4. **Smart Waits**
   - Auto-waiting in Playwright
   - Custom wait methods in BasePage
   - Configurable timeouts

## Conclusion

This framework provides:
- ✅ Clean architecture with POM
- ✅ Type-safe development with TypeScript
- ✅ Rich reporting with Allure
- ✅ Maintainable and scalable structure
- ✅ Best practices built-in
- ✅ Easy to extend and customize

Ready to start automating! 🚀
