# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Register Page >> shows create account title
- Location: e2e\auth.spec.ts:38:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Create Account')
Expected: visible
Error: strict mode violation: getByText('Create Account') resolved to 2 elements:
    1) <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">Create Account</h1> aka getByRole('heading', { name: 'Create Account' })
    2) <button type="submit" class="bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 mt-2">Create Account</button> aka getByRole('button', { name: 'Create Account' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Create Account')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e3]:
      - heading "Create Account" [level=1] [ref=e4]
      - generic [ref=e5]:
        - generic [ref=e6]:
          - generic [ref=e7]: Name
          - textbox "Ali Ahmad" [ref=e8]
        - generic [ref=e9]:
          - generic [ref=e10]: Email
          - textbox "ali@gmail.com" [ref=e11]
        - generic [ref=e12]:
          - generic [ref=e13]: Password
          - textbox "••••••••" [ref=e14]
        - generic [ref=e15]:
          - generic [ref=e16]: Confirm Password
          - textbox "••••••••" [ref=e17]
        - button "Create Account" [ref=e18]
      - paragraph [ref=e19]:
        - text: Already have an account?
        - link "Login" [ref=e20] [cursor=pointer]:
          - /url: /login
  - button "Open Next.js Dev Tools" [ref=e26] [cursor=pointer]:
    - img [ref=e27]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Login Page', () => {
  4  | 
  5  |   test('shows welcome message', async ({ page }) => {
  6  |     // go to login page
  7  |     await page.goto('/login');
  8  | 
  9  |     // check 'Welcome Back' is visible
  10 |     await expect(
  11 |       page.getByText('Welcome Back')
  12 |     ).toBeVisible();
  13 |   });
  14 | 
  15 |   test('has correct inputs', async ({ page }) => {
  16 |     await page.goto('/login');
  17 | 
  18 |     // check email input visible
  19 |     await expect(
  20 |       page.getByPlaceholder('ali@gmail.com')
  21 |     ).toBeVisible();
  22 | 
  23 |     // check password input visible
  24 |     await expect(
  25 |       page.getByPlaceholder('••••••••')
  26 |     ).toBeVisible();
  27 | 
  28 |     // check login button visible
  29 |     await expect(
  30 |       page.getByRole('button', { name: 'Login' })
  31 |     ).toBeVisible();
  32 |   });
  33 | 
  34 | });
  35 | 
  36 | test.describe('Register Page', () => {
  37 | 
  38 |   test('shows create account title', async ({ page }) => {
  39 |     await page.goto('/register');
  40 | 
  41 |     await expect(
  42 |       page.getByText('Create Account')
> 43 |     ).toBeVisible();
     |       ^ Error: expect(locator).toBeVisible() failed
  44 |   });
  45 | 
  46 |   test('has correct inputs', async ({ page }) => {
  47 |     await page.goto('/register');
  48 | 
  49 |     // check name input
  50 |     await expect(
  51 |       page.getByPlaceholder('Ali Ahmad')
  52 |     ).toBeVisible();
  53 | 
  54 |     // check email input
  55 |     await expect(
  56 |       page.getByPlaceholder('ali@gmail.com')
  57 |     ).toBeVisible();
  58 | 
  59 |     // check password input
  60 |     await expect(
  61 |       page.getByPlaceholder('••••••••').first()
  62 |       // .first() because there are TWO password inputs
  63 |       // (password + confirm password)
  64 |     ).toBeVisible();
  65 | 
  66 |     // check submit button
  67 |     await expect(
  68 |       page.getByRole('button', { name: 'Create Account' })
  69 |     ).toBeVisible();
  70 |   });
  71 | 
  72 | });
```