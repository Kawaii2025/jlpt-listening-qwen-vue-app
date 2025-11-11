# E2E Test Documentation for JLPT Listening Training App

## Overview

This document provides comprehensive information about the End-to-End (E2E) test suite for the JLPT Listening Training Application. These tests serve as regression tests to ensure the React refactoring maintains all existing functionality.

## Test Coverage

### 📊 Test Statistics

- **Total Test Suites**: 14
- **Total Test Cases**: 80+
- **Coverage Areas**: All major features and edge cases

### 🎯 Functional Coverage

#### 1. Initial Page Load (3 tests)
- ✅ Main components rendering (header, footer, textarea, intro)
- ✅ Default sample text pre-loaded
- ✅ Auto-processing on page load

#### 2. Text Input and Processing (9 tests)
- ✅ Clear text functionality
- ✅ Process new text input
- ✅ Empty text validation
- ✅ Sentence splitting by period
- ✅ Gender prefix extraction (男/女)
- ✅ Text without gender prefixes
- ✅ Success notifications
- ✅ Auto-scroll to practice content
- ✅ Processing multiple sentences

#### 3. Sentence Card Functionality (7 tests)
- ✅ Card rendering with all elements
- ✅ Play sentence audio
- ✅ Toggle original text visibility
- ✅ User input acceptance
- ✅ Answer checking (correct)
- ✅ Answer checking (incorrect)
- ✅ Accuracy percentage display
- ✅ Incorrect character highlighting

#### 4. Error Playback Features (4 tests)
- ✅ Show error playback buttons on incorrect answer
- ✅ Play error range audio
- ✅ Play to particle audio
- ✅ Short play audio

#### 5. Edit Modal Functionality (7 tests)
- ✅ Open modal on edit button click
- ✅ Populate modal with current data
- ✅ Edit sentence in modal
- ✅ Save edited sentence
- ✅ Close modal on cancel
- ✅ Close modal on backdrop click
- ✅ Change gender in modal

#### 6. Speech Synthesis (5 tests)
- ✅ Use correct Japanese language (ja-JP)
- ✅ Female voice selection
- ✅ Male voice selection
- ✅ Multiple audio playback handling
- ✅ Speech synthesis API mocking

#### 7. Responsive Design & UI (5 tests)
- ✅ Textarea auto-resize
- ✅ Mobile viewport compatibility
- ✅ Hover effects on interactive elements
- ✅ Keyboard navigation support
- ✅ Rapid clicking resilience

#### 8. Edge Cases & Error Handling (7 tests)
- ✅ Very long sentences (500+ characters)
- ✅ Special characters handling
- ✅ Mixed Japanese/English text
- ✅ Empty user input
- ✅ Whitespace-only input
- ✅ Sentences without punctuation
- ✅ Graceful error handling

#### 9. Data Persistence & State Management (3 tests)
- ✅ State maintenance across cards
- ✅ Preserve checked state
- ✅ Reset results on clear

#### 10. Performance & Loading (3 tests)
- ✅ Page load time (<5 seconds)
- ✅ Text processing time (<2 seconds)
- ✅ Large text input efficiency (50 sentences)

#### 11. Accessibility (3 tests)
- ✅ ARIA labels on buttons
- ✅ Keyboard tab navigation
- ✅ Color contrast verification

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Install Playwright

Playwright is already added to the project. To install browsers:

```bash
npx playwright install
```

## Running Tests

### Command Reference

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Debug tests
npm run test:e2e:debug

# Show test report
npm run test:e2e:report
```

### Running Specific Tests

```bash
# Run specific test file
npx playwright test e2e/app.spec.js

# Run specific test suite
npx playwright test -g "Text Input and Processing"

# Run specific test case
npx playwright test -g "should clear text when clear button is clicked"
```

### Running on Different Browsers

```bash
# Run on Chrome only
npx playwright test --project=chromium

# Run on Firefox only
npx playwright test --project=firefox

# Run on Safari only
npx playwright test --project=webkit
```

## Test Structure

### Directory Structure

```
jlpt-listening-qwen-vue-app/
├── e2e/
│   ├── app.spec.js          # Main test suite
│   └── test-utils.js        # Helper functions and utilities
├── playwright.config.js      # Playwright configuration
└── package.json             # Test scripts
```

### Test File Organization

```javascript
test.describe('Feature Group', () => {
  test.beforeEach(async ({ page }) => {
    // Setup code
  });

  test('should do something', async ({ page }) => {
    // Test implementation
  });
});
```

## Key Test Utilities

### Speech Synthesis Mocking

```javascript
import { mockSpeechSynthesis } from './test-utils.js';

test.beforeEach(async ({ page }) => {
  await mockSpeechSynthesis(page);
  await page.goto('/');
});
```

### Getting Captured Audio

```javascript
import { getCapturedUtterances, clearUtterances } from './test-utils.js';

await clearUtterances(page);
// ... trigger audio playback
const utterances = await getCapturedUtterances(page);
expect(utterances[0].lang).toBe('ja-JP');
```

### Working with Sentence Cards

```javascript
import { getSentenceCard, getSentenceCards } from './test-utils.js';

// Get all cards
const cards = await getSentenceCards(page);

// Get specific card by index
const firstCard = await getSentenceCard(page, 0);
```

### Test Data

```javascript
import { testData } from './test-utils.js';

await fillTextarea(page, '#mixed-text', testData.sampleText);
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## React Migration Checklist

When refactoring to React, use these tests to verify:

### ✅ Core Functionality
- [ ] All tests pass without modification to test assertions
- [ ] Text processing works identically
- [ ] Gender assignment maintains same logic
- [ ] Speech synthesis integration preserved

### ✅ UI Components
- [ ] Header component renders correctly
- [ ] Footer component renders correctly
- [ ] Main content area functions properly
- [ ] Sentence cards maintain same structure
- [ ] Edit modal behavior unchanged

### ✅ User Interactions
- [ ] All button clicks work as expected
- [ ] Form inputs behave identically
- [ ] Keyboard navigation preserved
- [ ] Modal interactions unchanged

### ✅ State Management
- [ ] Sentence data persists correctly
- [ ] User input maintains state
- [ ] Edit operations update state properly
- [ ] Clear/reset operations work correctly

### ✅ Audio & Speech
- [ ] Speech synthesis API integration works
- [ ] Gender-based voice selection preserved
- [ ] Error range playback functions correctly
- [ ] Multiple audio playback handled properly

## Debugging Tests

### Visual Debugging

Use UI mode for the best debugging experience:

```bash
npm run test:e2e:ui
```

### Debug Mode

Run tests in debug mode with Playwright Inspector:

```bash
npm run test:e2e:debug
```

### Screenshots and Videos

Tests automatically capture:
- Screenshots on failure
- Videos on failure (retained)
- Trace on first retry

Access these in `test-results/` directory.

### Console Logs

Add console logs in tests:

```javascript
test('debug test', async ({ page }) => {
  console.log('Current URL:', page.url());
  const text = await page.textContent('selector');
  console.log('Text content:', text);
});
```

## Common Issues & Solutions

### Issue: Tests timing out

**Solution**: Increase timeout in `playwright.config.js`:

```javascript
use: {
  timeout: 30000, // 30 seconds
}
```

### Issue: Speech synthesis not working

**Solution**: Ensure `mockSpeechSynthesis()` is called in `beforeEach`:

```javascript
test.beforeEach(async ({ page }) => {
  await mockSpeechSynthesis(page);
  await page.goto('/');
});
```

### Issue: Selector not found

**Solution**: Add wait conditions:

```javascript
await page.waitForSelector('selector', { state: 'visible' });
```

### Issue: Flaky tests

**Solution**: Add appropriate waits:

```javascript
await page.waitForTimeout(500);
// or better:
await page.waitForLoadState('networkidle');
```

## Best Practices

### 1. Use Page Object Model (POM)

For larger test suites, consider creating page objects:

```javascript
class MainPage {
  constructor(page) {
    this.page = page;
    this.textarea = page.locator('#mixed-text');
    this.processButton = page.getByRole('button', { name: /开始练习/i });
  }

  async processText(text) {
    await this.textarea.fill(text);
    await this.processButton.click();
  }
}
```

### 2. Avoid Hard-Coded Waits

Use Playwright's built-in waiting mechanisms:

```javascript
// ❌ Bad
await page.waitForTimeout(5000);

// ✅ Good
await page.waitForSelector('.card');
await expect(page.locator('.card')).toBeVisible();
```

### 3. Use Data-Test Attributes

Add test-specific attributes to React components:

```jsx
<button data-testid="process-button">Process</button>
```

```javascript
await page.click('[data-testid="process-button"]');
```

### 4. Keep Tests Independent

Each test should be able to run independently:

```javascript
test.beforeEach(async ({ page }) => {
  // Reset to clean state
  await page.goto('/');
  await mockSpeechSynthesis(page);
});
```

### 5. Use Descriptive Test Names

```javascript
// ❌ Bad
test('test1', async ({ page }) => { ... });

// ✅ Good
test('should clear text when clear button is clicked', async ({ page }) => { ... });
```

## Performance Considerations

- Tests run in parallel by default (use `fullyParallel: true`)
- Configure workers based on your machine: `workers: process.env.CI ? 1 : undefined`
- Use `test.describe.configure({ mode: 'serial' })` for dependent tests

## Maintenance

### Updating Tests

When adding new features:

1. Write E2E test first (TDD approach)
2. Ensure test fails initially
3. Implement feature
4. Verify test passes
5. Update documentation

### Regular Health Checks

Run full test suite:
- Before major refactoring
- Before releases
- After dependency updates
- Weekly in CI/CD

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)

## Support

For issues or questions:
1. Check this documentation
2. Review Playwright docs
3. Check test output and traces
4. Use debug mode for investigation

---

**Last Updated**: November 11, 2025  
**Version**: 1.0.0  
**Maintained by**: Development Team
