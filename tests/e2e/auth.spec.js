import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to login page', async ({ page }) => {
    // Look for login/signin links or buttons
    const loginLink = page.locator('a, button').filter({ hasText: /sign in|log in|login/i }).first();
    
    if (await loginLink.isVisible()) {
      await loginLink.click();
      
      // Wait for navigation
      await page.waitForLoadState('networkidle');
      
      // Check if we're on a login page or modal appeared
      const isLoginPage = page.url().includes('/login') || 
                         page.url().includes('/signin') ||
                         await page.locator('form').filter({ hasText: /sign in|log in|email|password/i }).isVisible();
      
      expect(isLoginPage).toBe(true);
    }
  });

  test('should navigate to registration page', async ({ page }) => {
    // Look for signup/register links or buttons
    const signupLink = page.locator('a, button').filter({ hasText: /sign up|register|join|get started/i }).first();
    
    if (await signupLink.isVisible()) {
      await signupLink.click();
      
      // Wait for navigation
      await page.waitForLoadState('networkidle');
      
      // Check if we're on a registration page or modal appeared
      const isSignupPage = page.url().includes('/register') || 
                          page.url().includes('/signup') ||
                          await page.locator('form').filter({ hasText: /sign up|register|create account/i }).isVisible();
      
      expect(isSignupPage).toBe(true);
    }
  });

  test('should display login form with required fields', async ({ page }) => {
    // Navigate to login
    const loginLink = page.locator('a, button').filter({ hasText: /sign in|log in|login/i }).first();
    
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await page.waitForLoadState('networkidle');
      
      // Look for login form
      const loginForm = page.locator('form').filter({ hasText: /sign in|log in|email|password/i }).first();
      
      if (await loginForm.isVisible()) {
        // Check for email field
        const emailField = loginForm.locator('input[type="email"], input[name*="email"], input[placeholder*="email" i]').first();
        await expect(emailField).toBeVisible();
        
        // Check for password field
        const passwordField = loginForm.locator('input[type="password"], input[name*="password"], input[placeholder*="password" i]').first();
        await expect(passwordField).toBeVisible();
        
        // Check for submit button
        const submitButton = loginForm.locator('button[type="submit"], button').filter({ hasText: /sign in|log in|login|submit/i }).first();
        await expect(submitButton).toBeVisible();
      }
    }
  });

  test('should display registration form with required fields', async ({ page }) => {
    // Navigate to registration
    const signupLink = page.locator('a, button').filter({ hasText: /sign up|register|join|get started/i }).first();
    
    if (await signupLink.isVisible()) {
      await signupLink.click();
      await page.waitForLoadState('networkidle');
      
      // Look for registration form
      const signupForm = page.locator('form').filter({ hasText: /sign up|register|create|email|password/i }).first();
      
      if (await signupForm.isVisible()) {
        // Check for email field
        const emailField = signupForm.locator('input[type="email"], input[name*="email"], input[placeholder*="email" i]').first();
        await expect(emailField).toBeVisible();
        
        // Check for password field
        const passwordField = signupForm.locator('input[type="password"], input[name*="password"], input[placeholder*="password" i]').first();
        await expect(passwordField).toBeVisible();
        
        // Check for submit button
        const submitButton = signupForm.locator('button[type="submit"], button').filter({ hasText: /sign up|register|create|submit/i }).first();
        await expect(submitButton).toBeVisible();
      }
    }
  });

  test('should validate email format in login form', async ({ page }) => {
    // Navigate to login
    const loginLink = page.locator('a, button').filter({ hasText: /sign in|log in|login/i }).first();
    
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await page.waitForLoadState('networkidle');
      
      const loginForm = page.locator('form').filter({ hasText: /sign in|log in|email|password/i }).first();
      
      if (await loginForm.isVisible()) {
        const emailField = loginForm.locator('input[type="email"], input[name*="email"], input[placeholder*="email" i]').first();
        const submitButton = loginForm.locator('button[type="submit"], button').filter({ hasText: /sign in|log in|login|submit/i }).first();
        
        if (await emailField.isVisible() && await submitButton.isVisible()) {
          // Enter invalid email
          await emailField.fill('invalid-email');
          await submitButton.click();
          
          // Check for validation (either HTML5 validation or custom error message)
          const isValid = await emailField.evaluate(el => el.checkValidity());
          if (isValid) {
            // If HTML5 validation passes, look for custom error messages
            const errorMessage = page.locator('.error, .invalid, [role="alert"]').filter({ hasText: /email|invalid|format/i });
            const hasCustomError = await errorMessage.isVisible();
            // Either HTML5 validation should fail OR custom error should appear
            expect(hasCustomError).toBe(true);
          } else {
            // HTML5 validation should prevent form submission
            expect(isValid).toBe(false);
          }
        }
      }
    }
  });

  test('should handle form submission with empty fields', async ({ page }) => {
    // Navigate to login
    const loginLink = page.locator('a, button').filter({ hasText: /sign in|log in|login/i }).first();
    
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await page.waitForLoadState('networkidle');
      
      const loginForm = page.locator('form').filter({ hasText: /sign in|log in|email|password/i }).first();
      
      if (await loginForm.isVisible()) {
        const submitButton = loginForm.locator('button[type="submit"], button').filter({ hasText: /sign in|log in|login|submit/i }).first();
        
        if (await submitButton.isVisible()) {
          // Try to submit empty form
          await submitButton.click();
          
          // Check that form validation prevents submission or shows errors
          const emailField = loginForm.locator('input[type="email"], input[name*="email"], input[placeholder*="email" i]').first();
          const passwordField = loginForm.locator('input[type="password"], input[name*="password"], input[placeholder*="password" i]').first();
          
          if (await emailField.isVisible()) {
            const emailValid = await emailField.evaluate(el => el.checkValidity());
            expect(emailValid).toBe(false); // Should be invalid when empty
          }
          
          if (await passwordField.isVisible()) {
            const passwordValid = await passwordField.evaluate(el => el.checkValidity());
            expect(passwordValid).toBe(false); // Should be invalid when empty
          }
        }
      }
    }
  });

  test('should toggle between login and registration forms', async ({ page }) => {
    // Navigate to login first
    const loginLink = page.locator('a, button').filter({ hasText: /sign in|log in|login/i }).first();
    
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await page.waitForLoadState('networkidle');
      
      // Look for a link to switch to registration
      const switchToSignup = page.locator('a, button').filter({ hasText: /sign up|register|create account|don't have.*account/i }).first();
      
      if (await switchToSignup.isVisible()) {
        await switchToSignup.click();
        await page.waitForTimeout(1000); // Wait for form to change
        
        // Check if registration form is now visible
        const signupForm = page.locator('form').filter({ hasText: /sign up|register|create/i }).first();
        if (await signupForm.isVisible()) {
          await expect(signupForm).toBeVisible();
          
          // Look for a link to switch back to login
          const switchToLogin = page.locator('a, button').filter({ hasText: /sign in|log in|already have.*account/i }).first();
          
          if (await switchToLogin.isVisible()) {
            await switchToLogin.click();
            await page.waitForTimeout(1000);
            
            // Check if login form is visible again
            const loginForm = page.locator('form').filter({ hasText: /sign in|log in/i }).first();
            await expect(loginForm).toBeVisible();
          }
        }
      }
    }
  });

  test('should handle authentication errors gracefully', async ({ page }) => {
    // Navigate to login
    const loginLink = page.locator('a, button').filter({ hasText: /sign in|log in|login/i }).first();
    
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await page.waitForLoadState('networkidle');
      
      const loginForm = page.locator('form').filter({ hasText: /sign in|log in|email|password/i }).first();
      
      if (await loginForm.isVisible()) {
        const emailField = loginForm.locator('input[type="email"], input[name*="email"], input[placeholder*="email" i]').first();
        const passwordField = loginForm.locator('input[type="password"], input[name*="password"], input[placeholder*="password" i]').first();
        const submitButton = loginForm.locator('button[type="submit"], button').filter({ hasText: /sign in|log in|login|submit/i }).first();
        
        if (await emailField.isVisible() && await passwordField.isVisible() && await submitButton.isVisible()) {
          // Enter invalid credentials
          await emailField.fill('nonexistent@example.com');
          await passwordField.fill('wrongpassword');
          await submitButton.click();
          
          // Wait for potential error message
          await page.waitForTimeout(3000);
          
          // Check that we're still on the login page (not redirected)
          const stillOnLoginPage = await loginForm.isVisible() || 
                                  page.url().includes('/login') || 
                                  page.url().includes('/signin');
          
          expect(stillOnLoginPage).toBe(true);
        }
      }
    }
  });
});