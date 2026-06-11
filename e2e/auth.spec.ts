import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {

  test('shows welcome message', async ({ page }) => {
    // go to login page
    await page.goto('/login');

    // check 'Welcome Back' is visible
    await expect(
      page.getByText('Welcome Back')
    ).toBeVisible();
  });

  test('has correct inputs', async ({ page }) => {
    await page.goto('/login');

    // check email input visible
    await expect(
      page.getByPlaceholder('ali@gmail.com')
    ).toBeVisible();

    // check password input visible
    await expect(
      page.getByPlaceholder('••••••••')
    ).toBeVisible();

    // check login button visible
    await expect(
      page.getByRole('button', { name: 'Login' })
    ).toBeVisible();
  });

});

test.describe('Register Page', () => {

  test('shows create account title', async ({ page }) => {
    await page.goto('/register');

    await expect(
      page.getByText('Create Account')
    ).toBeVisible();
  });

  test('has correct inputs', async ({ page }) => {
    await page.goto('/register');

    // check name input
    await expect(
      page.getByPlaceholder('Ali Ahmad')
    ).toBeVisible();

    // check email input
    await expect(
      page.getByPlaceholder('ali@gmail.com')
    ).toBeVisible();

    // check password input
    await expect(
      page.getByPlaceholder('••••••••').first()
      // .first() because there are TWO password inputs
      // (password + confirm password)
    ).toBeVisible();

    // check submit button
    await expect(
      page.getByRole('button', { name: 'Create Account' })
    ).toBeVisible();
  });

});