# E2E Tests

This directory contains End-to-End (E2E) tests for the JLPT Listening Training Application.

## Quick Start

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run all tests
npm run test:e2e

# Run with UI (recommended for development)
npm run test:e2e:ui
```

## Files

- **app.spec.js** - Main test suite with 80+ test cases
- **test-utils.js** - Helper functions and test utilities

## Test Suites

1. Initial Page Load
2. Text Input and Processing
3. Sentence Card Functionality
4. Error Playback Features
5. Edit Modal Functionality
6. Speech Synthesis
7. Responsive Design & UI Interactions
8. Edge Cases & Error Handling
9. Data Persistence & State Management
10. Performance & Loading
11. Accessibility

## Documentation

- **[E2E_TEST_DOCUMENTATION.md](../E2E_TEST_DOCUMENTATION.md)** - Complete test documentation
- **[REACT_MIGRATION_TEST_GUIDE.md](../REACT_MIGRATION_TEST_GUIDE.md)** - Quick reference for React migration

## Coverage

✅ 80+ test cases covering:
- All user interactions
- Text processing and sentence splitting
- Audio playback and speech synthesis
- Modal operations
- Form validations
- Error handling
- Performance benchmarks
- Accessibility requirements
- Mobile responsiveness

## Running Tests

```bash
# All tests (headless)
npm run test:e2e

# UI mode (interactive)
npm run test:e2e:ui

# Headed mode (see browser)
npm run test:e2e:headed

# Debug mode
npm run test:e2e:debug

# Show report
npm run test:e2e:report

# Specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Specific test
npx playwright test -g "should clear text"
```

## For React Migration

These tests serve as regression tests during the React refactoring:

1. Run all tests on Vue app (baseline)
2. Convert components to React incrementally
3. Run tests after each conversion
4. Fix any failing tests
5. Ensure 100% pass rate before deployment

See [REACT_MIGRATION_TEST_GUIDE.md](../REACT_MIGRATION_TEST_GUIDE.md) for detailed guidance.

## Test Utilities

### Mock Speech Synthesis

```javascript
import { mockSpeechSynthesis } from './test-utils.js';
await mockSpeechSynthesis(page);
```

### Get Sentence Cards

```javascript
import { getSentenceCard, getSentenceCards } from './test-utils.js';
const cards = await getSentenceCards(page);
const firstCard = await getSentenceCard(page, 0);
```

### Test Data

```javascript
import { testData } from './test-utils.js';
await fillTextarea(page, '#mixed-text', testData.sampleText);
```

## CI/CD

Tests can be integrated into CI/CD pipelines:

```yaml
- run: npx playwright install --with-deps
- run: npm run test:e2e
```

## Debugging

1. Use UI mode: `npm run test:e2e:ui`
2. Use debug mode: `npm run test:e2e:debug`
3. Check screenshots/videos in `test-results/`
4. View trace files with: `npx playwright show-trace trace.zip`

## Maintenance

- Update tests when adding new features
- Run tests before major refactoring
- Keep tests independent and isolated
- Use descriptive test names
- Add comments for complex assertions

---

**Maintained by**: Development Team  
**Last Updated**: November 11, 2025
