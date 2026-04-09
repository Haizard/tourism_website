import { test, expect } from '@playwright/test';

test('verify cinematic ui enhancements', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Verify Stats Section
  const statsSection = page.locator('div:has-text("Happy Travelers")');
  await expect(statsSection).toBeVisible();

  // Verify Navbar Scrolled State (Mock Scroll)
  await page.evaluate(() => window.scrollTo(0, 100));
  const navbar = page.locator('nav');
  await expect(navbar).toHaveClass(/bg-slate-900/);

  // Take screenshot
  await page.screenshot({ path: 'redesign-verification.png', fullPage: true });
});
