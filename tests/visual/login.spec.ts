import { test, expect } from '@playwright/test';

test.describe('Login Page Visual Tests', () => {
  test('login page matches snapshot', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Optional: Set a consistent viewport size for reliable snapshots
    await page.setViewportSize({ width: 1280, height: 720 });

    // Take a screenshot and compare with baseline
    await expect(page).toHaveScreenshot('login-page.png', {
      maxDiffPixels: 100, // Allow small differences
      threshold: 0.2, // Tolerance for pixel differences
    });
  });
});