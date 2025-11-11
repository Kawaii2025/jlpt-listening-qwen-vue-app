/**
 * Smoke Test - Quick verification that E2E setup works
 * Run this first to ensure Playwright is configured correctly
 */

import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('application loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads
    await expect(page).toHaveTitle(/日语听力练习|JLPT/);
    
    // Check that main elements are present
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('#mixed-text')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    
    console.log('✅ Application loaded successfully');
  });

  test('can interact with textarea', async ({ page }) => {
    await page.goto('/');
    
    const textarea = page.locator('#mixed-text');
    await textarea.fill('テスト');
    
    const value = await textarea.inputValue();
    expect(value).toBe('テスト');
    
    console.log('✅ Textarea interaction works');
  });

  test('buttons are clickable', async ({ page }) => {
    await page.goto('/');
    
    // Find clear button
    const clearButton = page.getByRole('button', { name: /清空/i });
    await expect(clearButton).toBeVisible();
    await clearButton.click();
    
    console.log('✅ Buttons are clickable');
  });
});
