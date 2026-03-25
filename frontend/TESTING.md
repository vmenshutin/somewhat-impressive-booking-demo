# Testing Guide

This frontend uses **Vitest** + **React Testing Library** with a **jsdom** environment.

## Current Status (Latest Verified)

- **Test files:** 18 passed (18 total)
- **Tests:** 183 passed (183 total)
- **Last verified with:** `npm test -- --run`
- **Known non-failing warnings:**
  - Some `act(...)` warnings in checkout/review form interaction tests
  - React Router v7 future-flag warnings in checkout tests

## Test Stack

- `vitest` (runner)
- `@testing-library/react` (render + queries)
- `@testing-library/user-event` (user interactions)
- `@testing-library/jest-dom` (DOM matchers)
- `jsdom` (browser-like test environment)

## Configuration

- Vitest config: `vitest.config.ts`
  - `environment: "jsdom"`
  - `globals: true`
  - `setupFiles: ["./src/test/setup.ts"]`
- Global setup: `src/test/setup.ts`
  - imports `@testing-library/jest-dom/vitest`
  - mocks `window.matchMedia`

## Test Inventory

### Store / Utils

- `src/store/staysSlice.test.ts`
- `src/utils/dateAvailability.test.ts`

### Components

- `src/components/AvailabilityDateCalendar/AvailabilityDateCalendar.test.tsx`
- `src/components/BookingForm/BookingForm.test.tsx`
- `src/components/EmptyState/EmptyState.test.tsx`
- `src/components/FilterPanel/FilterPanel.test.tsx`
- `src/components/Reviews/Reviews.test.tsx`
- `src/components/Reviews/components/ReviewCard/ReviewCard.test.tsx`
- `src/components/Reviews/components/ReviewForm/ReviewForm.test.tsx`
- `src/components/StayCard/StayCard.test.tsx`
- `src/components/StayCard/components/StayCardSkeleton/StayCardSkeleton.test.tsx`

### Pages

- `src/pages/CheckoutPage/CheckoutPage.test.tsx`
- `src/pages/CheckoutPage/components/AddressSection/AddressSection.test.tsx`
- `src/pages/CheckoutPage/components/CardSection/CardSection.test.tsx`
- `src/pages/CheckoutPage/components/ContactSection/ContactSection.test.tsx`
- `src/pages/ConfirmationPage/ConfirmationPage.test.tsx`
- `src/pages/StayDetailsPage/StayDetailsPage.test.tsx`
- `src/pages/StaysListPage/StaysListPage.test.tsx`

## Commands

### Run all tests (watch)

```bash
npm test
```

### Run all tests once (CI style)

```bash
npm test -- --run
```

### Run one test file

```bash
npm test -- src/components/Reviews/Reviews.test.tsx --run
```

### Run Vitest UI

```bash
npm run test:ui
```

### Run coverage

```bash
npm run test:coverage
```

## Lint/Format for Test Workflows

```bash
npm run lint
npm run format:check
```

Auto-fix formatting:

```bash
npm run format
```

## Authoring Guidelines

- Prefer semantic queries (`getByRole`, `getByLabelText`, `getByText`) over `getByTestId` when practical.
- Use `userEvent` for interactions instead of low-level event dispatching.
- Keep tests behavior-focused (user-visible outcomes) instead of implementation details.
- Co-locate tests with feature/component/page files.
- Keep mocks narrow and typed (avoid `any` when possible).
- For async UI updates, use `await` + `waitFor` patterns.

## Quick Debug Tips

```ts
screen.debug();
screen.logTestingPlaygroundURL();
```

If a test fails only in full runs, rerun it in isolation first:

```bash
npm test -- path/to/file.test.tsx --run
```
