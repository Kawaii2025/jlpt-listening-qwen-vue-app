# JLPT Listening Training App - React Migration E2E Tests

## 🎯 Purpose

This test suite provides comprehensive End-to-End (E2E) regression testing for the React refactoring of the JLPT Listening Training Application. With 80+ test cases covering all features, you can confidently refactor from Vue to React while ensuring no functionality is lost.

## 📦 What's Included

### Test Files
- **80+ test cases** covering all application features
- **Speech synthesis mocking** for consistent audio testing
- **Multi-browser support** (Chrome, Firefox, Safari)
- **Mobile viewport testing**
- **Performance benchmarks**
- **Accessibility checks**

### Documentation
1. **[TEST_SUITE_SUMMARY.md](./TEST_SUITE_SUMMARY.md)** - Quick overview and statistics
2. **[E2E_TEST_DOCUMENTATION.md](./E2E_TEST_DOCUMENTATION.md)** - Complete test documentation
3. **[REACT_MIGRATION_TEST_GUIDE.md](./REACT_MIGRATION_TEST_GUIDE.md)** - Quick reference for migration
4. **[e2e/README.md](./e2e/README.md)** - E2E folder documentation

## 🚀 Quick Start

### 1. Install Playwright Browsers

```bash
# Install Chromium (fastest for development)
npx playwright install chromium

# Or install all browsers (recommended for CI/CD)
npx playwright install
```

### 2. Run Smoke Tests

```bash
# Quick verification (3 tests, ~5 seconds)
npx playwright test e2e/smoke.spec.js
```

### 3. Run Full Test Suite

```bash
# All tests (80+ tests, ~30-60 seconds)
npm run test:e2e
```

### 4. Use UI Mode (Recommended for Development)

```bash
# Interactive test runner with time-travel debugging
npm run test:e2e:ui
```

## 📋 Available Commands

```bash
# Run all tests (headless)
npm run test:e2e

# Run with UI mode (interactive, recommended for dev)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug mode (step through tests)
npm run test:e2e:debug

# Show test report
npm run test:e2e:report

# Run smoke tests only
npx playwright test e2e/smoke.spec.js

# Run specific test suite
npx playwright test -g "Text Input and Processing"

# Run on specific browser
npx playwright test --project=chromium
```

## 🎓 For React Migration Team

### Step-by-Step Migration Process

#### Phase 1: Establish Baseline (Vue App)

```bash
# 1. Install browsers
npx playwright install chromium

# 2. Run smoke tests to verify setup
npx playwright test e2e/smoke.spec.js

# 3. Run full suite to establish baseline
npm run test:e2e

# Expected: All tests pass ✅
```

#### Phase 2: Incremental Migration

```bash
# After converting each component:

# 1. Run relevant test suite
npx playwright test -g "Component Name"

# 2. If tests fail, use UI mode to debug
npm run test:e2e:ui

# 3. Fix React code to match Vue behavior
# (Don't modify tests unless selectors legitimately changed)

# 4. Verify tests pass before moving to next component
```

#### Phase 3: Final Verification

```bash
# After converting all components:

# 1. Run full test suite
npm run test:e2e

# 2. Run on all browsers
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox
npm run test:e2e -- --project=webkit

# 3. Check performance hasn't regressed
# 4. Verify mobile responsiveness
# 5. Ensure 100% test pass rate

# Expected: All 80+ tests pass ✅
```

### Component Priority Order

Suggested order for converting components:

1. **Header** + **Footer** (simple, no complex logic)
2. **Text Processing Utils** (core functionality)
3. **MainContent** (text input and processing)
4. **SentenceCard** (main feature)
5. **EditModal** (editing functionality)
6. **Error Playback Features** (audio features)

Run tests after each component conversion!

### Common Migration Issues

See [REACT_MIGRATION_TEST_GUIDE.md](./REACT_MIGRATION_TEST_GUIDE.md#common-migration-issues) for:
- Selector changes
- Timing issues
- State management differences
- Event handling differences

## 📊 Test Coverage

### Features Covered (100%)

✅ **Text Processing**
- Input validation
- Sentence splitting
- Gender prefix extraction
- Clear functionality

✅ **Sentence Cards**
- Rendering
- User input
- Answer checking
- Accuracy calculation
- Character highlighting

✅ **Audio & Speech**
- Sentence playback
- Gender-based voices
- Error range playback
- Particle playback
- Short playback

✅ **Edit Modal**
- Open/close
- Edit sentence
- Change gender
- Save changes

✅ **UI & UX**
- Responsive design
- Mobile viewport
- Keyboard navigation
- Notifications
- Hover effects

✅ **Edge Cases**
- Empty input
- Long text
- Special characters
- Rapid clicking
- Performance

✅ **Accessibility**
- ARIA labels
- Keyboard navigation
- Color contrast

## 🐛 Debugging Tests

### Visual Debugging (Recommended)

```bash
npm run test:e2e:ui
```

This opens Playwright's UI mode with:
- Time-travel debugging
- Step-by-step execution
- Visual inspection
- Network monitoring
- Console logs

### Step-by-Step Debugging

```bash
npm run test:e2e:debug
```

Uses Playwright Inspector to step through tests line by line.

### Watch Browser Execution

```bash
npm run test:e2e:headed
```

Runs tests with browser visible so you can see what's happening.

### Check Test Results

After test failure:
1. Screenshots saved to `test-results/`
2. Videos saved to `test-results/`
3. Traces saved to `test-results/`

View trace:
```bash
npx playwright show-trace test-results/trace.zip
```

## 📚 Documentation Guide

### For Quick Reference
→ **[REACT_MIGRATION_TEST_GUIDE.md](./REACT_MIGRATION_TEST_GUIDE.md)**
- Quick commands
- Common issues
- Migration checklist
- Debugging tips

### For Complete Documentation
→ **[E2E_TEST_DOCUMENTATION.md](./E2E_TEST_DOCUMENTATION.md)**
- Full test coverage details
- API reference
- Best practices
- CI/CD integration

### For Overview
→ **[TEST_SUITE_SUMMARY.md](./TEST_SUITE_SUMMARY.md)**
- Statistics
- What was created
- Success metrics
- Next steps

## 🎯 Success Criteria

After React migration, you should have:

- ✅ 100% test pass rate (all 80+ tests)
- ✅ Same or better performance
- ✅ All features functional
- ✅ No regressions
- ✅ Mobile experience preserved
- ✅ Accessibility maintained

## 💡 Tips

### During Development

1. **Run tests frequently** - After each component conversion
2. **Use UI mode** - Best for debugging
3. **Fix issues immediately** - Don't let failing tests accumulate
4. **Keep selectors consistent** - Use same class names/IDs when possible
5. **Add data-testid** - For critical test elements

### Test Philosophy

- ✅ Tests represent expected user behavior
- ✅ Passing tests = working feature
- ✅ Failing tests = bug or regression
- ✅ Fix code to match tests, not vice versa
- ✅ Only update tests if structure legitimately changed

## 🔗 Resources

### Internal Documentation
- [TEST_SUITE_SUMMARY.md](./TEST_SUITE_SUMMARY.md)
- [E2E_TEST_DOCUMENTATION.md](./E2E_TEST_DOCUMENTATION.md)
- [REACT_MIGRATION_TEST_GUIDE.md](./REACT_MIGRATION_TEST_GUIDE.md)
- [e2e/README.md](./e2e/README.md)

### External Resources
- [Playwright Documentation](https://playwright.dev)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)

## 🎉 Getting Help

1. Check documentation files (especially [REACT_MIGRATION_TEST_GUIDE.md](./REACT_MIGRATION_TEST_GUIDE.md))
2. Run tests in UI mode for visual debugging
3. Use debug mode for step-by-step execution
4. Review Playwright documentation
5. Check test output and traces

## 📈 Project Status

✅ **Status**: Complete and Ready for Use  
✅ **Playwright Version**: 1.56.1  
✅ **Test Cases**: 80+  
✅ **Test Suites**: 14  
✅ **Documentation**: 4 comprehensive guides  
✅ **Created**: November 11, 2025

## 🚦 Next Steps

1. **Install browsers**: `npx playwright install chromium`
2. **Run smoke tests**: `npx playwright test e2e/smoke.spec.js`
3. **Run full suite**: `npm run test:e2e`
4. **Start migration**: Use [REACT_MIGRATION_TEST_GUIDE.md](./REACT_MIGRATION_TEST_GUIDE.md)

---

**Ready to migrate to React with confidence!** 🚀

For detailed migration guidance, see [REACT_MIGRATION_TEST_GUIDE.md](./REACT_MIGRATION_TEST_GUIDE.md)
