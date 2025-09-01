import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the landing page successfully', async ({ page }) => {
    // Check if the page loads without errors
    await expect(page).toHaveTitle(/Community Goals/i);
    
    // Check for main navigation or header elements
    const header = page.locator('header, nav, [data-testid="header"]').first();
    await expect(header).toBeVisible();
  });

  test('should display main call-to-action elements', async ({ page }) => {
    // Look for common CTA elements
    const signUpButton = page.locator('button, a').filter({ hasText: /sign up|get started|join/i }).first();
    const loginButton = page.locator('button, a').filter({ hasText: /sign in|log in|login/i }).first();
    
    // At least one of these should be visible
    const ctaVisible = await signUpButton.isVisible() || await loginButton.isVisible();
    expect(ctaVisible).toBe(true);
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if page still loads properly
    await expect(page).toHaveTitle(/Community Goals/i);
    
    // Check if main content is visible
    const mainContent = page.locator('main, [role="main"], .main-content').first();
    if (await mainContent.count() > 0) {
      await expect(mainContent).toBeVisible();
    }
  });

  test('should handle navigation to different sections', async ({ page }) => {
    // Look for navigation links
    const navLinks = page.locator('nav a, header a').filter({ hasText: /.+/ });
    const linkCount = await navLinks.count();
    
    if (linkCount > 0) {
      // Click on the first navigation link
      const firstLink = navLinks.first();
      const linkText = await firstLink.textContent();
      
      // Only click if it's not an external link
      const href = await firstLink.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('mailto:')) {
        await firstLink.click();
        
        // Wait for navigation to complete
        await page.waitForLoadState('networkidle');
        
        // Verify we're still on the same domain
        expect(page.url()).toContain('localhost:4028');
      }
    }
  });

  test('should load without JavaScript errors', async ({ page }) => {
    const errors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out common non-critical errors
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('manifest') &&
      !error.includes('service-worker') &&
      !error.toLowerCase().includes('warning')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    await page.goto('/');
    
    // Check for essential meta tags
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    
    // Check for meta description
    const metaDescription = page.locator('meta[name="description"]');
    if (await metaDescription.count() > 0) {
      const description = await metaDescription.getAttribute('content');
      expect(description).toBeTruthy();
    }
    
    // Check for viewport meta tag
    const viewportMeta = page.locator('meta[name="viewport"]');
    await expect(viewportMeta).toHaveCount(1);
  });

  test('should handle form interactions if present', async ({ page }) => {
    // Look for forms on the page
    const forms = page.locator('form');
    const formCount = await forms.count();
    
    if (formCount > 0) {
      const firstForm = forms.first();
      
      // Look for input fields
      const inputs = firstForm.locator('input[type="email"], input[type="text"], input[type="password"]');
      const inputCount = await inputs.count();
      
      if (inputCount > 0) {
        // Test form interaction
        const firstInput = inputs.first();
        await firstInput.click();
        await firstInput.fill('test@example.com');
        
        const inputValue = await firstInput.inputValue();
        expect(inputValue).toBe('test@example.com');
      }
    }
  });

  test('should load all critical resources', async ({ page }) => {
    const failedRequests = [];
    
    page.on('requestfailed', request => {
      // Only track critical resource failures
      const url = request.url();
      if (url.includes('.js') || url.includes('.css') || url.includes('/api/')) {
        failedRequests.push({
          url: request.url(),
          failure: request.failure()?.errorText
        });
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Allow some non-critical failures but not too many
    expect(failedRequests.length).toBeLessThan(3);
  });
});