# React Migration - E2E Test Quick Reference

## 🚀 Quick Start

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run all tests
npm run test:e2e

# Run tests in UI mode (recommended for development)
npm run test:e2e:ui
```

## 📋 Pre-Migration Checklist

1. **Run baseline tests on Vue app**
   ```bash
   npm run test:e2e
   ```
   ✅ All tests should pass - this is your baseline

2. **Document any failing tests**
   - Note which tests fail
   - Document why they fail
   - Create tracking issues

3. **Take screenshots of key flows**
   ```bash
   npm run test:e2e:headed
   ```

## 🔄 During Migration

### Test Each Feature After Converting

```bash
# Test specific feature
npx playwright test -g "Text Input and Processing"
```

### Feature Priority Order

1. **Text Processing** → Test: "Text Input and Processing"
2. **Sentence Cards** → Test: "Sentence Card Functionality"
3. **Edit Modal** → Test: "Edit Modal Functionality"
4. **Audio Playback** → Test: "Speech Synthesis"
5. **Error Playback** → Test: "Error Playback Features"

### Component Mapping Guide

| Vue Component | React Equivalent | Test Coverage |
|--------------|------------------|---------------|
| `App.vue` | `App.jsx` | Initial Page Load |
| `MainContent.vue` | `MainContent.jsx` | Text Input and Processing |
| `SentenceCard.vue` | `SentenceCard.jsx` | Sentence Card Functionality |
| `EditModal.vue` | `EditModal.jsx` | Edit Modal Functionality |
| `Header.vue` | `Header.jsx` | Initial Page Load |
| `Footer.vue` | `Footer.jsx` | Initial Page Load |

## 🎯 Critical Test Scenarios

### Must-Pass Tests (P0)

```bash
# These MUST pass before deploying React version
npx playwright test -g "should process new text input"
npx playwright test -g "should check answer and show result"
npx playwright test -g "should play sentence audio"
npx playwright test -g "should save edited sentence"
npx playwright test -g "should extract and display gender prefixes"
```

### Important Tests (P1)

```bash
# These should pass but might need minor selector adjustments
npx playwright test -g "should toggle original text visibility"
npx playwright test -g "should show error playback buttons"
npx playwright test -g "should handle mobile viewport"
```

## 🔍 Common Migration Issues

### Issue 1: Selectors Changed

**Symptom**: `Test failed: Element not found`

**Solution**: Update selectors in React components

```jsx
// Add data-testid attributes
<button data-testid="process-button" onClick={handleProcess}>
  Process
</button>
```

Update test if needed:
```javascript
await page.click('[data-testid="process-button"]');
```

### Issue 2: Timing Issues

**Symptom**: `Test failed: Timeout waiting for element`

**Solution**: React might render differently than Vue

```javascript
// Add appropriate waits
await page.waitForLoadState('networkidle');
await page.waitForSelector('.card', { state: 'visible' });
```

### Issue 3: State Management Differences

**Symptom**: `Test failed: Unexpected state`

**Solution**: Ensure React state updates complete

```javascript
// Wait for state updates
await page.waitForTimeout(100);
// or better:
await expect(page.locator('.result')).toBeVisible();
```

### Issue 4: Event Handling

**Symptom**: `Test failed: Click has no effect`

**Solution**: Ensure event handlers are properly attached

```jsx
// React onClick
<button onClick={handleClick}>Click</button>

// Not @click like Vue
```

## 🛠️ Debugging Strategy

### Step 1: Identify Failing Test

```bash
npm run test:e2e
# Note which tests fail
```

### Step 2: Run in UI Mode

```bash
npm run test:e2e:ui
# Select failing test
# Use time-travel debugger
```

### Step 3: Run in Headed Mode

```bash
npm run test:e2e:headed
# Watch browser execution
```

### Step 4: Debug Mode

```bash
npm run test:e2e:debug
# Step through test line by line
```

### Step 5: Add Console Logs

```javascript
test('debug test', async ({ page }) => {
  await page.evaluate(() => console.log('React state:', window.__REACT_STATE__));
  const text = await page.textContent('selector');
  console.log('Text:', text);
});
```

## ✅ Migration Verification Checklist

### Phase 1: Basic Rendering
- [ ] Page loads without errors
- [ ] Header displays correctly
- [ ] Footer displays correctly
- [ ] Main content area renders
- [ ] Sample text is pre-loaded

### Phase 2: Text Processing
- [ ] Can input new text
- [ ] Process button works
- [ ] Clear button works
- [ ] Sentences split correctly
- [ ] Gender prefixes extracted
- [ ] Success notification shows

### Phase 3: Sentence Cards
- [ ] Cards render for each sentence
- [ ] Play button plays audio
- [ ] Input textarea accepts text
- [ ] Check button validates answer
- [ ] Results display correctly
- [ ] Toggle original text works

### Phase 4: Edit Modal
- [ ] Edit button opens modal
- [ ] Modal displays current data
- [ ] Can edit sentence
- [ ] Save updates sentence
- [ ] Cancel closes modal
- [ ] Backdrop click closes modal

### Phase 5: Audio Features
- [ ] Main audio playback works
- [ ] Gender-based voice selection
- [ ] Error range playback
- [ ] Particle playback
- [ ] Short playback

### Phase 6: Edge Cases
- [ ] Long text handling
- [ ] Empty input validation
- [ ] Special characters
- [ ] Multiple rapid clicks
- [ ] Mobile viewport

## 📊 Test Coverage Report

Generate coverage after migration:

```bash
npm run test:e2e
npm run test:e2e:report
```

Compare with baseline to ensure no regression.

## 🎓 Learning Resources

### Key Files to Study

1. **e2e/test-utils.js** - Helper functions you can reuse
2. **e2e/app.spec.js** - All test scenarios
3. **playwright.config.js** - Test configuration

### Playwright Concepts

- **Locators**: `page.locator('selector')`
- **Actions**: `click()`, `fill()`, `type()`
- **Assertions**: `expect().toBeVisible()`, `toBe()`
- **Waits**: `waitForSelector()`, `waitForLoadState()`

## 💡 Tips for Success

1. **Convert components incrementally**
   - One component at a time
   - Run tests after each conversion
   - Fix issues immediately

2. **Keep selectors consistent**
   - Use same class names
   - Add data-testid for critical elements
   - Maintain same structure

3. **Preserve behavior exactly**
   - Same user interactions
   - Same timing
   - Same visual feedback

4. **Run tests frequently**
   - After every component conversion
   - Before committing code
   - Before creating PR

5. **Document changes**
   - Note any selector changes
   - Document behavior differences
   - Update tests if legitimately needed

## 🚨 When to Update Tests vs Fix Code

### Update Tests When:
- Selector names legitimately changed
- UI structure improved
- Better accessibility added
- Test was incorrectly written

### Fix Code When:
- Behavior differs from Vue version
- User experience degraded
- Feature missing or broken
- Performance regressed

**Default rule**: If test passed on Vue app, make React app pass same test.

## 📞 Need Help?

1. Check E2E_TEST_DOCUMENTATION.md (full docs)
2. Review test-utils.js for helper functions
3. Use Playwright UI mode for visual debugging
4. Check Playwright docs: https://playwright.dev

---

**Remember**: These tests are your safety net. Trust them!

**Goal**: 100% test pass rate after migration ✅
