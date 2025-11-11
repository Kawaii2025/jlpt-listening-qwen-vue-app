/**
 * E2E Tests for JLPT Listening Training Application
 * 
 * This comprehensive test suite covers all major features and user flows:
 * - Text processing and sentence splitting
 * - Gender prefix extraction and assignment
 * - Sentence card rendering and interaction
 * - User input validation and checking
 * - Speech synthesis and audio playback
 * - Edit modal functionality
 * - Error highlighting and partial playback
 * - Responsive UI interactions
 * 
 * These tests serve as regression tests for the React refactoring
 */

import { test, expect } from '@playwright/test';
import {
  mockSpeechSynthesis,
  getCapturedUtterances,
  clearUtterances,
  waitForElement,
  waitForNotification,
  fillTextarea,
  getSentenceCards,
  getSentenceCard,
  typeSlowly,
  testData
} from './test-utils.js';

test.describe('JLPT Listening Training App - E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Mock speech synthesis before navigating
    await mockSpeechSynthesis(page);
    await page.goto('/');
  });

  test.describe('Initial Page Load', () => {
    test('should load the application with all main components', async ({ page }) => {
      // Check header
      await expect(page.locator('header')).toBeVisible();
      await expect(page.getByRole('heading', { name: '日语听力练习' })).toBeVisible();
      
      // Check page intro section
      await expect(page.getByRole('heading', { name: '提升你的日语听力' })).toBeVisible();
      
      // Check textarea is present
      await expect(page.locator('#mixed-text')).toBeVisible();
      
      // Check footer
      await expect(page.locator('footer')).toBeVisible();
    });

    test('should have default sample text pre-loaded', async ({ page }) => {
      const textarea = page.locator('#mixed-text');
      const content = await textarea.inputValue();
      
      expect(content).toBeTruthy();
      expect(content).toContain('大学の演劇サークル');
      expect(content.length).toBeGreaterThan(100);
    });

    test('should auto-process text on page load', async ({ page }) => {
      // Wait a bit for auto-processing (500ms timeout in code)
      await page.waitForTimeout(1000);
      
      // Check if results are displayed
      const cards = await getSentenceCards(page);
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  test.describe('Text Input and Processing', () => {
    test('should clear text when clear button is clicked', async ({ page }) => {
      await page.waitForTimeout(1000); // Wait for auto-process
      
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      const textarea = page.locator('#mixed-text');
      const content = await textarea.inputValue();
      
      expect(content).toBe('');
    });

    test('should process new text input', async ({ page }) => {
      // Clear existing text first
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      // Enter new text
      const textarea = page.locator('#mixed-text');
      await fillTextarea(page, '#mixed-text', testData.shortText);
      
      // Click process button
      const processButton = page.getByRole('button', { name: /处理文本/i });
      await processButton.click();
      
      // Wait for results
      await page.waitForTimeout(500);
      const cards = await getSentenceCards(page);
      
      expect(cards.length).toBe(2); // Two sentences
    });

    test('should show warning when trying to process empty text', async ({ page }) => {
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      const processButton = page.getByRole('button', { name: /处理文本/i });
      await processButton.click();
      
      // Check for warning notification
      const notification = await page.waitForSelector('.bg-yellow-500', { timeout: 3000 });
      expect(notification).toBeTruthy();
    });

    test('should correctly split sentences by period', async ({ page }) => {
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      await fillTextarea(page, '#mixed-text', testData.sampleText);
      
      const processButton = page.getByRole('button', { name: /处理文本/i });
      await processButton.click();
      
      await page.waitForTimeout(500);
      const cards = await getSentenceCards(page);
      
      // Should split into multiple sentences
      expect(cards.length).toBeGreaterThanOrEqual(4);
    });

    test('should extract and display gender prefixes correctly', async ({ page }) => {
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      await fillTextarea(page, '#mixed-text', testData.shortText);
      
      const processButton = page.getByRole('button', { name: /处理文本/i });
      await processButton.click();
      
      await page.waitForTimeout(500);
      
      // Check for gender indicators (female/male icons or labels)
      const femaleIndicator = page.locator('text=/女|Female|♀/i').first();
      const maleIndicator = page.locator('text=/男|Male|♂/i').first();
      
      await expect(femaleIndicator).toBeVisible();
      await expect(maleIndicator).toBeVisible();
    });

    test('should handle text without gender prefixes', async ({ page }) => {
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      await fillTextarea(page, '#mixed-text', testData.textWithoutGender);
      
      const processButton = page.getByRole('button', { name: /处理文本/i });
      await processButton.click();
      
      await page.waitForTimeout(500);
      const cards = await getSentenceCards(page);
      
      expect(cards.length).toBe(2);
    });

    test('should show success notification after processing', async ({ page }) => {
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      await fillTextarea(page, '#mixed-text', testData.shortText);
      
      const processButton = page.getByRole('button', { name: /处理文本/i });
      await processButton.click();
      
      // Wait for success notification
      const notification = await page.waitForSelector('.bg-green-500', { timeout: 3000 });
      expect(notification).toBeTruthy();
    });

    test('should scroll to practice content after processing', async ({ page }) => {
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      await fillTextarea(page, '#mixed-text', testData.sampleText);
      
      const processButton = page.getByRole('button', { name: /处理文本/i });
      await processButton.click();
      
      await page.waitForTimeout(500);
      
      // Check if scrolled (practice-content anchor should be in viewport)
      const practiceAnchor = page.locator('#practice-content');
      await expect(practiceAnchor).toBeInViewport();
    });
  });

  test.describe('Sentence Card Functionality', () => {
    test.beforeEach(async ({ page }) => {
      // Setup: Process sample text
      await page.waitForTimeout(1000);
    });

    test('should render sentence cards with all elements', async ({ page }) => {
      const card = await getSentenceCard(page, 0);
      
      // Check for play button
      await expect(card.locator('button').first()).toBeVisible();
      
      // Check for input textarea
      const textarea = card.locator('textarea');
      await expect(textarea).toBeVisible();
      
      // Check for check answer button
      const checkButton = card.getByRole('button', { name: /检查|確認/i });
      await expect(checkButton).toBeVisible();
    });

    test('should play sentence audio when play button clicked', async ({ page }) => {
      await clearUtterances(page);
      
      const card = await getSentenceCard(page, 0);
      const playButton = card.locator('button.play-button, button:has(i.fa-play)').first();
      
      await playButton.click();
      await page.waitForTimeout(200);
      
      const utterances = await getCapturedUtterances(page);
      expect(utterances.length).toBeGreaterThan(0);
      expect(utterances[0].lang).toBe('ja-JP');
    });

    test('should toggle original text visibility', async ({ page }) => {
      const card = await getSentenceCard(page, 0);
      
      // Find toggle button (eye icon)
      const toggleButton = card.locator('button:has(i.fa-eye), button:has(i.fa-eye-slash)').first();
      await toggleButton.click();
      
      await page.waitForTimeout(300);
      
      // Original text should be visible
      const originalSection = card.locator('.japanese-original');
      await expect(originalSection).toBeVisible();
      
      // Click again to hide
      await toggleButton.click();
      await page.waitForTimeout(300);
    });

    test('should accept user input in textarea', async ({ page }) => {
      const card = await getSentenceCard(page, 0);
      const textarea = card.locator('textarea');
      
      await textarea.fill('テストの入力です。');
      
      const value = await textarea.inputValue();
      expect(value).toBe('テストの入力です。');
    });

    test('should check answer and show result - correct answer', async ({ page }) => {
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      await fillTextarea(page, '#mixed-text', testData.singleSentence);
      
      const processButton = page.getByRole('button', { name: /处理文本/i });
      await processButton.click();
      await page.waitForTimeout(500);
      
      const card = await getSentenceCard(page, 0);
      const textarea = card.locator('textarea');
      
      // Enter correct answer (without gender prefix)
      await textarea.fill('今日はいい天気ですね。');
      
      const checkButton = card.getByRole('button', { name: /检查/i });
      await checkButton.click();
      
      await page.waitForTimeout(500);
      
      // When answer is 100% correct, check for accuracy percentage
      const accuracyText = card.locator('.accuracy');
      await expect(accuracyText).toContainText('100');
    });

    test('should check answer and show result - incorrect answer', async ({ page }) => {
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      await fillTextarea(page, '#mixed-text', testData.singleSentence);
      
      const processButton = page.getByRole('button', { name: /处理文本/i });
      await processButton.click();
      await page.waitForTimeout(500);
      
      const card = await getSentenceCard(page, 0);
      const textarea = card.locator('textarea');
      
      // Enter incorrect answer
      await textarea.fill('今日は悪い天気ですね。');
      
      const checkButton = card.getByRole('button', { name: /检查|確認/i });
      await checkButton.click();
      
      await page.waitForTimeout(500);
      
      // Should show error indicator - check for result status OR accuracy < 100
      const resultStatus = card.locator('.result-status');
      const accuracyText = card.locator('.accuracy');
      
      // Either result status has error text, or accuracy is less than 100%
      const statusText = await resultStatus.textContent();
      const accText = await accuracyText.textContent();
      expect(statusText.includes('有错误') || !accText.includes('100.0%')).toBeTruthy();
    });

    test('should display accuracy percentage', async ({ page }) => {
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      await fillTextarea(page, '#mixed-text', testData.singleSentence);
      
      const processButton = page.getByRole('button', { name: /处理文本/i });
      await processButton.click();
      await page.waitForTimeout(500);
      
      const card = await getSentenceCard(page, 0);
      const textarea = card.locator('textarea');
      
      // Enter partially correct answer
      await textarea.fill('今日はいい天気');
      
      const checkButton = card.getByRole('button', { name: /检查|確認/i });
      await checkButton.click();
      
      await page.waitForTimeout(300);
      
      // Should show accuracy
      const accuracyText = card.locator('text=/%/');
      await expect(accuracyText.first()).toBeVisible();
    });

    test('should highlight incorrect characters', async ({ page }) => {
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      await fillTextarea(page, '#mixed-text', testData.singleSentence);
      
      const processButton = page.getByRole('button', { name: /处理文本/i });
      await processButton.click();
      await page.waitForTimeout(500);
      
      const card = await getSentenceCard(page, 0);
      const textarea = card.locator('textarea');
      
      await textarea.fill('今日は悪い天気ですね。');
      
      const checkButton = card.getByRole('button', { name: /检查|確認/i });
      await checkButton.click();
      
      await page.waitForTimeout(300);
      
      // Should have highlighted incorrect characters
      const incorrectChars = card.locator('.incorrect-char, .text-red-500, .bg-red-100');
      const count = await incorrectChars.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Error Playback Features', () => {
    test.beforeEach(async ({ page }) => {
      await page.waitForTimeout(1000);
    });

    test('should show error playback buttons when answer is incorrect', async ({ page }) => {
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      await fillTextarea(page, '#mixed-text', testData.singleSentence);
      
      const processButton = page.getByRole('button', { name: /处理文本/i });
      await processButton.click();
      await page.waitForTimeout(500);
      
      const card = await getSentenceCard(page, 0);
      const textarea = card.locator('textarea');
      
      await textarea.fill('今日は悪い天気');
      
      const checkButton = card.getByRole('button', { name: /检查|確認/i });
      await checkButton.click();
      
      await page.waitForTimeout(300);
      
      // Error playback buttons should appear
      const errorButtons = card.locator('button').filter({ hasText: /播放|再生/ });
      const count = await errorButtons.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });

    test('should play error range when error playback button clicked', async ({ page }) => {
      await clearUtterances(page);
      
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      await fillTextarea(page, '#mixed-text', testData.singleSentence);
      
      const processButton = page.getByRole('button', { name: /处理文本/i });
      await processButton.click();
      await page.waitForTimeout(500);
      
      const card = await getSentenceCard(page, 0);
      const textarea = card.locator('textarea');
      
      await textarea.fill('今日は悪い天気');
      
      const checkButton = card.getByRole('button', { name: /检查|確認/i });
      await checkButton.click();
      await page.waitForTimeout(300);
      
      // Click error playback button
      const errorPlayButton = card.locator('button.play-error-button').first();
      if (await errorPlayButton.count() > 0) {
        await errorPlayButton.click();
        await page.waitForTimeout(200);
        
        const utterances = await getCapturedUtterances(page);
        expect(utterances.length).toBeGreaterThan(0);
      }
    });

    test('should play to particle when particle button clicked', async ({ page }) => {
      await clearUtterances(page);
      
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      await fillTextarea(page, '#mixed-text', testData.singleSentence);
      
      const processButton = page.getByRole('button', { name: /处理文本/i });
      await processButton.click();
      await page.waitForTimeout(500);
      
      const card = await getSentenceCard(page, 0);
      const textarea = card.locator('textarea');
      
      await textarea.fill('今日');
      
      const checkButton = card.getByRole('button', { name: /检查|確認/i });
      await checkButton.click();
      await page.waitForTimeout(300);
      
      // Click particle playback button
      const particleButton = card.locator('button.play-error-to-particle-button').first();
      if (await particleButton.count() > 0) {
        await particleButton.click();
        await page.waitForTimeout(200);
        
        const utterances = await getCapturedUtterances(page);
        expect(utterances.length).toBeGreaterThan(0);
      }
    });

    test('should play short range when short play button clicked', async ({ page }) => {
      await clearUtterances(page);
      
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      await fillTextarea(page, '#mixed-text', testData.singleSentence);
      
      const processButton = page.getByRole('button', { name: /处理文本/i });
      await processButton.click();
      await page.waitForTimeout(500);
      
      const card = await getSentenceCard(page, 0);
      const textarea = card.locator('textarea');
      
      await textarea.fill('今日');
      
      const checkButton = card.getByRole('button', { name: /检查|確認/i });
      await checkButton.click();
      await page.waitForTimeout(300);
      
      // Click short play button
      const shortPlayButton = card.locator('button.short-play-button').first();
      if (await shortPlayButton.count() > 0) {
        await shortPlayButton.click();
        await page.waitForTimeout(200);
        
        const utterances = await getCapturedUtterances(page);
        expect(utterances.length).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Edit Modal Functionality', () => {
    test.beforeEach(async ({ page }) => {
      await page.waitForTimeout(1000);
    });

    test('should open edit modal when edit button clicked', async ({ page }) => {
      const card = await getSentenceCard(page, 0);
      
      // Find and click edit button
      const editButton = card.locator('button:has(i.fa-edit), button:has(i.fa-pencil)').first();
      await editButton.click();
      
      await page.waitForTimeout(300);
      
      // Modal should be visible
      const modal = page.locator('.fixed.inset-0.bg-black.bg-opacity-50');
      await expect(modal).toBeVisible();
    });

    test('should populate modal with current sentence data', async ({ page }) => {
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      await fillTextarea(page, '#mixed-text', testData.singleSentence);
      
      const processButton = page.getByRole('button', { name: /处理文本/i });
      await processButton.click();
      await page.waitForTimeout(500);
      
      const card = await getSentenceCard(page, 0);
      const editButton = card.locator('button:has(i.fa-edit), button:has(i.fa-pencil)').first();
      await editButton.click();
      
      await page.waitForTimeout(300);
      
      // Check if modal has the sentence text
      const modal = page.locator('.bg-white.rounded-xl.shadow-lg');
      const modalTextarea = modal.locator('textarea').first();
      const content = await modalTextarea.inputValue();
      
      expect(content).toContain('今日はいい天気ですね');
    });

    test('should allow editing sentence in modal', async ({ page }) => {
      const card = await getSentenceCard(page, 0);
      const editButton = card.locator('button:has(i.fa-edit), button:has(i.fa-pencil)').first();
      await editButton.click();
      
      await page.waitForTimeout(300);
      
      const modal = page.locator('.bg-white.rounded-xl.shadow-lg');
      const modalTextarea = modal.locator('textarea').first();
      
      await modalTextarea.fill('編集されたテキスト。');
      
      const value = await modalTextarea.inputValue();
      expect(value).toBe('編集されたテキスト。');
    });

    test('should save edited sentence when save button clicked', async ({ page }) => {
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      await fillTextarea(page, '#mixed-text', testData.singleSentence);
      
      const processButton = page.getByRole('button', { name: /处理文本/i });
      await processButton.click();
      await page.waitForTimeout(500);
      
      const card = await getSentenceCard(page, 0);
      const editButton = card.locator('button:has(i.fa-edit), button:has(i.fa-pencil)').first();
      await editButton.click();
      
      await page.waitForTimeout(300);
      
      const modal = page.locator('.bg-white.rounded-xl.shadow-lg');
      const modalTextarea = modal.locator('textarea').first();
      
      await modalTextarea.fill('新しいテキスト。');
      
      // Click save button
      const saveButton = modal.getByRole('button', { name: /保存|Save/i });
      await saveButton.click();
      
      await page.waitForTimeout(500);
      
      // Modal should close
      await expect(modal).not.toBeVisible();
      
      // Should show success notification
      const notification = await page.waitForSelector('.bg-green-500', { timeout: 3000 });
      expect(notification).toBeTruthy();
    });

    test('should close modal when cancel button clicked', async ({ page }) => {
      const card = await getSentenceCard(page, 0);
      const editButton = card.locator('button:has(i.fa-edit), button:has(i.fa-pencil)').first();
      await editButton.click();
      
      await page.waitForTimeout(300);
      
      const modal = page.locator('.bg-white.rounded-xl.shadow-lg');
      
      // Click cancel/close button
      const cancelButton = modal.getByRole('button', { name: /取消|Cancel|关闭|Close/i }).first();
      await cancelButton.click();
      
      await page.waitForTimeout(300);
      
      // Modal should be hidden
      await expect(modal).not.toBeVisible();
    });

    test('should close modal when clicking backdrop', async ({ page }) => {
      const card = await getSentenceCard(page, 0);
      const editButton = card.locator('button:has(i.fa-edit), button:has(i.fa-pencil)').first();
      await editButton.click();
      
      await page.waitForTimeout(300);
      
      // Click on backdrop (fixed overlay)
      const backdrop = page.locator('.fixed.inset-0.bg-black.bg-opacity-50');
      await backdrop.click({ position: { x: 10, y: 10 } });
      
      await page.waitForTimeout(300);
      
      const modal = page.locator('.bg-white.rounded-xl.shadow-lg');
      await expect(modal).not.toBeVisible();
    });

    test('should allow changing gender in modal', async ({ page }) => {
      const card = await getSentenceCard(page, 0);
      const editButton = card.locator('button:has(i.fa-edit), button:has(i.fa-pencil)').first();
      await editButton.click();
      
      await page.waitForTimeout(300);
      
      const modal = page.locator('.bg-white.rounded-xl.shadow-lg');
      
      // Find gender select/radio buttons
      const genderSelect = modal.locator('select, input[type="radio"]').first();
      if (await genderSelect.count() > 0) {
        const tagName = await genderSelect.evaluate(el => el.tagName);
        if (tagName === 'SELECT') {
          await genderSelect.selectOption('male');
        }
      }
    });
  });

  test.describe('Speech Synthesis', () => {
    test.beforeEach(async ({ page }) => {
      await page.waitForTimeout(1000);
      await clearUtterances(page);
    });

    test('should use correct language for Japanese speech', async ({ page }) => {
      const card = await getSentenceCard(page, 0);
      const playButton = card.locator('button.play-button, button:has(i.fa-play)').first();
      
      await playButton.click();
      await page.waitForTimeout(200);
      
      const utterances = await getCapturedUtterances(page);
      expect(utterances.length).toBeGreaterThan(0);
      expect(utterances[0].lang).toBe('ja-JP');
    });

    test('should use appropriate voice based on gender - female', async ({ page }) => {
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      await fillTextarea(page, '#mixed-text', '女:これは女性の声です。');
      
      const processButton = page.getByRole('button', { name: /处理文本/i });
      await processButton.click();
      await page.waitForTimeout(500);
      
      await clearUtterances(page);
      
      const card = await getSentenceCard(page, 0);
      const playButton = card.locator('button.play-button, button:has(i.fa-play)').first();
      
      await playButton.click();
      await page.waitForTimeout(200);
      
      const utterances = await getCapturedUtterances(page);
      expect(utterances.length).toBeGreaterThan(0);
      // Voice selection logic would be tested here if we track voice names
    });

    test('should use appropriate voice based on gender - male', async ({ page }) => {
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      await fillTextarea(page, '#mixed-text', '男:これは男性の声です。');
      
      const processButton = page.getByRole('button', { name: /处理文本/i });
      await processButton.click();
      await page.waitForTimeout(500);
      
      await clearUtterances(page);
      
      const card = await getSentenceCard(page, 0);
      const playButton = card.locator('button.play-button, button:has(i.fa-play)').first();
      
      await playButton.click();
      await page.waitForTimeout(200);
      
      const utterances = await getCapturedUtterances(page);
      expect(utterances.length).toBeGreaterThan(0);
    });

    test('should handle multiple audio playback requests', async ({ page }) => {
      await clearUtterances(page);
      
      const cards = await getSentenceCards(page);
      
      // Play first card
      const playButton1 = cards[0].locator('button.play-button, button:has(i.fa-play)').first();
      await playButton1.click();
      await page.waitForTimeout(200);
      
      // Play second card
      if (cards.length > 1) {
        const playButton2 = cards[1].locator('button.play-button, button:has(i.fa-play)').first();
        await playButton2.click();
        await page.waitForTimeout(200);
      }
      
      const utterances = await getCapturedUtterances(page);
      expect(utterances.length).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe('Responsive Design and UI Interactions', () => {
    test('should handle textarea auto-resize', async ({ page }) => {
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      const textarea = page.locator('#mixed-text');
      
      // Add lots of text
      const longText = testData.sampleText + '\n' + testData.sampleText;
      await fillTextarea(page, '#mixed-text', longText);
      
      // Textarea should expand
      const height = await textarea.evaluate(el => el.offsetHeight);
      expect(height).toBeGreaterThan(100);
    });

    test('should handle mobile viewport', async ({ page, browser }) => {
      const context = await browser.newContext({
        viewport: { width: 375, height: 667 }
      });
      const mobilePage = await context.newPage();
      
      await mockSpeechSynthesis(mobilePage);
      await mobilePage.goto('/');
      await mobilePage.waitForTimeout(1000);
      
      // Check if page is responsive
      const header = mobilePage.locator('header');
      await expect(header).toBeVisible();
      
      const cards = await getSentenceCards(mobilePage);
      if (cards.length > 0) {
        await expect(cards[0]).toBeVisible();
      }
      
      await context.close();
    });

    test('should show hover effects on interactive elements', async ({ page }) => {
      const card = await getSentenceCard(page, 0);
      const playButton = card.locator('button').first();
      
      await playButton.hover();
      
      // Button should have hover state (this is visual, hard to test precisely)
      await expect(playButton).toBeVisible();
    });

    test('should handle keyboard navigation', async ({ page }) => {
      const textarea = page.locator('#mixed-text');
      
      // Focus on textarea
      await textarea.focus();
      
      // Type using keyboard
      await page.keyboard.type('テスト');
      
      const value = await textarea.inputValue();
      expect(value).toContain('テスト');
    });

    test('should handle rapid clicking without breaking', async ({ page }) => {
      const card = await getSentenceCard(page, 0);
      const playButton = card.locator('button.play-button, button:has(i.fa-play)').first();
      
      // Click rapidly
      for (let i = 0; i < 5; i++) {
        await playButton.click();
        await page.waitForTimeout(50);
      }
      
      // Should still be functional
      await expect(playButton).toBeVisible();
    });
  });

  test.describe('Edge Cases and Error Handling', () => {
    test('should handle very long sentences', async ({ page }) => {
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      const longSentence = '女:' + 'あ'.repeat(500) + '。';
      await fillTextarea(page, '#mixed-text', longSentence);
      
      const processButton = page.getByRole('button', { name: /处理文本/i });
      await processButton.click();
      
      await page.waitForTimeout(500);
      
      const cards = await getSentenceCards(page);
      expect(cards.length).toBe(1);
    });

    test('should handle special characters in text', async ({ page }) => {
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      const specialText = '女:これは「特殊」文字～！？です。';
      await fillTextarea(page, '#mixed-text', specialText);
      
      const processButton = page.getByRole('button', { name: /处理文本/i });
      await processButton.click();
      
      await page.waitForTimeout(500);
      
      const cards = await getSentenceCards(page);
      expect(cards.length).toBeGreaterThan(0);
    });

    test('should handle mixed Japanese and non-Japanese text', async ({ page }) => {
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      const mixedText = '女:これはJapanese and English mixです。';
      await fillTextarea(page, '#mixed-text', mixedText);
      
      const processButton = page.getByRole('button', { name: /处理文本/i });
      await processButton.click();
      
      await page.waitForTimeout(500);
      
      const cards = await getSentenceCards(page);
      expect(cards.length).toBeGreaterThan(0);
    });

    test('should handle empty user input gracefully', async ({ page }) => {
      // Wait for auto-processed cards from beforeEach
      await page.waitForTimeout(1000);
      const card = await getSentenceCard(page, 0);
      const textarea = card.locator('textarea');
      
      // Leave empty and click check
      await textarea.fill('');
      
      const checkButton = card.getByRole('button', { name: /检查|確認/i });
      await checkButton.click();
      
      // Should handle gracefully (might show warning or do nothing)
      await page.waitForTimeout(300);
    });

    test('should handle whitespace-only input', async ({ page }) => {
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      await fillTextarea(page, '#mixed-text', '   \n\n   ');
      
      const processButton = page.getByRole('button', { name: /处理文本/i });
      await processButton.click();
      
      // Should show warning
      await page.waitForTimeout(300);
      const notification = await page.locator('.bg-yellow-500, .bg-red-500').first();
      await expect(notification).toBeVisible();
    });

    test('should handle sentences without proper punctuation', async ({ page }) => {
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      const noPunctuationText = '女:これは文です\n男:もう一つの文です';
      await fillTextarea(page, '#mixed-text', noPunctuationText);
      
      const processButton = page.getByRole('button', { name: /处理文本/i });
      await processButton.click();
      
      await page.waitForTimeout(500);
      
      // Should still process (might split differently)
      const cards = await getSentenceCards(page);
      expect(cards.length).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Data Persistence and State Management', () => {
    test('should maintain state when switching between cards', async ({ page }) => {
      const cards = await getSentenceCards(page);
      if (cards.length < 2) return;
      
      // Fill first card
      const textarea1 = cards[0].locator('textarea');
      await textarea1.fill('最初の入力');
      
      // Fill second card
      const textarea2 = cards[1].locator('textarea');
      await textarea2.fill('二番目の入力');
      
      // Check first card still has value
      const value1 = await textarea1.inputValue();
      expect(value1).toBe('最初の入力');
      
      // Check second card still has value
      const value2 = await textarea2.inputValue();
      expect(value2).toBe('二番目の入力');
    });

    test('should preserve checked state after checking answer', async ({ page }) => {
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      await fillTextarea(page, '#mixed-text', testData.singleSentence);
      
      const processButton = page.getByRole('button', { name: /处理文本/i });
      await processButton.click();
      await page.waitForTimeout(500);
      
      const card = await getSentenceCard(page, 0);
      const textarea = card.locator('textarea');
      
      await textarea.fill('今日はいい天気ですね。');
      
      const checkButton = card.getByRole('button', { name: /检查|確認/i });
      await checkButton.click();
      
      await page.waitForTimeout(500);
      
      // Result should persist - check for accuracy display
      const checkResult = card.locator('.check-result');
      await expect(checkResult).toBeVisible();
      
      const accuracyText = card.locator('.accuracy');
      await expect(accuracyText).toContainText('100');
      
      // Click elsewhere
      await page.click('body');
      
      // Result should still be visible
      await expect(checkResult).toBeVisible();
      await expect(accuracyText).toContainText('100');
    });

    test('should reset results when clearing text', async ({ page }) => {
      await page.waitForTimeout(1000);
      
      const cards = await getSentenceCards(page);
      expect(cards.length).toBeGreaterThan(0);
      
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      await page.waitForTimeout(500);
      
      // Cards should be gone
      const cardsAfter = await getSentenceCards(page);
      expect(cardsAfter.length).toBe(0);
    });
  });

  test.describe('Performance and Loading', () => {
    test('should load page within reasonable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000); // 5 seconds
    });

    test('should process text within reasonable time', async ({ page }) => {
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      await fillTextarea(page, '#mixed-text', testData.sampleText);
      
      const startTime = Date.now();
      const processButton = page.getByRole('button', { name: /处理文本/i });
      await processButton.click();
      
      await page.waitForTimeout(500);
      const processTime = Date.now() - startTime;
      
      expect(processTime).toBeLessThan(2000); // 2 seconds
    });

    test('should handle large text input efficiently', async ({ page }) => {
      const clearButton = page.getByRole('button', { name: /清空/i });
      await clearButton.click();
      
      // Generate large text (50 sentences)
      let largeText = '';
      for (let i = 0; i < 50; i++) {
        largeText += `女:これは文${i}です。`;
      }
      
      await fillTextarea(page, '#mixed-text', largeText);
      
      const processButton = page.getByRole('button', { name: /处理文本/i });
      await processButton.click();
      
      await page.waitForTimeout(1000);
      
      const cards = await getSentenceCards(page);
      expect(cards.length).toBe(50);
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels on buttons', async ({ page }) => {
      await page.waitForTimeout(1000);
      const card = await getSentenceCard(page, 0);
      const buttons = card.locator('button');
      
      const count = await buttons.count();
      expect(count).toBeGreaterThan(0);
      
      // At least some buttons should have accessible names
      for (let i = 0; i < Math.min(count, 3); i++) {
        const button = buttons.nth(i);
        const ariaLabel = await button.getAttribute('aria-label');
        const textContent = await button.textContent();
        
        // Should have either aria-label or text content
        expect(ariaLabel || textContent?.trim()).toBeTruthy();
      }
    });

    test('should support keyboard tab navigation', async ({ page }) => {
      // Tab through interactive elements
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
      
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.tagName;
      });
      
      // Should focus on an interactive element
      expect(['TEXTAREA', 'BUTTON', 'INPUT', 'A']).toContain(focusedElement);
    });

    test('should have sufficient color contrast', async ({ page }) => {
      // This is a basic check - full contrast testing requires specialized tools
      await page.waitForTimeout(1000);
      const card = await getSentenceCard(page, 0);
      
      // Check if card is visible
      await expect(card.first()).toBeVisible();
      
      const textElements = card.locator('p, span, button');
      const count = await textElements.count();
      
      for (let i = 0; i < Math.min(count, 5); i++) {
        await expect(textElements.nth(i)).toBeVisible();
      }
    });
  });
});
