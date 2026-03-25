![Demo GIF 1](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTYxMmoycnk5OG12MHlqcmVmbmgwcTU2dWRqNzF3OWlnMnprMnZ3YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/s8H4mOlLBGeHGXnkf4/giphy.gif)

![Demo GIF 23](https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmoweG5kaWlldjFpa3A1ZmRhMXlmcWx5MjRrZXluY3pnOW5rc25udSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/bavMT8gUrs1EhNlpHA/giphy.gif)

![Demo GIF 3](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXF1OWh2M2JycjF6ODNzczNneDJ4bmRyaXZsazBmMDFteW1uN25nMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/g7XMj2RwNQd17myneI/giphy.gif)

![Demo GIF 4](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGJnemRiY2swZ3hkYjhxOG15YXJoZzQ2bnVtcmdjZW1zdXJsb3ZkNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QvMntU44SrmxTmqNDF/giphy.gif)

# 🏨 Somewhat Impressive Booking Demo

A full-stack booking demo with a React + TypeScript frontend and an Express + TypeScript backend. The app supports stay discovery, map-assisted browsing, date-aware availability filtering, reviews, and a multi-step checkout flow.

## LLM Usage

Used for backend logic, Redux reducers, and unit tests

## Future Roadmap

1. Persist data with a real database (PostgreSQL + Prisma) instead of in-memory arrays.
2. Add authentication (guest + host/admin roles) and protect booking/review actions.
3. Strengthen checkout backend validation for `street/state/zipCode` and card tokenization (never store raw card data).
4. Integrate payments with Stripe test mode and webhook-based confirmation states.
5. Add end-to-end tests (Playwright/Cypress) for search → booking → confirmation flow.
6. Add API docs with OpenAPI/Swagger and request/response schemas.
7. Add caching/pagination for stays and reviews to scale list performance.
8. Improve accessibility: keyboard map interactions, focus management, and screen-reader labels.
9. Add observability (request logging, error tracking, metrics dashboards).
10. Set up CI (lint, test, build) and deployment previews.
11. Add user profiles/wishlist and richer rating analytics.
12. Add real-time notifications for booking/review updates.

## Getting Started in 60 Seconds

```bash
# terminal 1
cd backend
npm install
npm run dev

# terminal 2
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` and start browsing stays.

## What’s Included

### Frontend (React + Vite)

- Stays listing page with sorting, filtering, skeleton loading, empty state, and map markers.
- Stay details page with hero image, amenities, availability calendar, booking form, and reviews.
- Checkout flow with 3 sections:
  - Contact details
  - Address (street, city, state/province, ZIP/postal code, country)
  - Card details
- Confirmation page with booking summary and confirmation ID.
- Redux Toolkit slices for stays, reviews, and bookings.
- Optimistic review posting with rollback on failure.

### Backend (Express)

- In-memory mock API for stays, reviews, and bookings.
- Date-range availability filtering with validation.
- Sorting support for stays.
- Health endpoint.

### Code Quality Tooling

- ESLint (flat config, TypeScript + React + hooks rules).
- Prettier scripts and staged formatting.
- Husky + lint-staged pre-commit hook for staged lint/format checks.
- Vitest + React Testing Library test setup.

### Stays

- `GET /stays`
  - Optional query params:
    - `minPrice`, `maxPrice`, `minRating`, `location`
    - `checkIn`, `checkOut` (must both be present, ISO `YYYY-MM-DD`, `checkIn < checkOut`)
    - `sortBy`: `name`, `price-asc`, `price-desc`, `rating-asc`, `rating-desc`
- `GET /stays/:id`
- `GET /stays/:id/reviews`
- `POST /stays/:id/reviews`

### Bookings

- `POST /bookings`
  - Current checkout payload includes guest/contact/address/card fields from the frontend.
  - Backend currently stores bookings in memory and validates required booking/contact/payment basics.


## Testing

- Testing details live in [frontend/TESTING.md](frontend/TESTING.md).
- Existing tests cover key Redux slice behavior and selected UI components/pages.

## Development Notes

- Data is in-memory only (`backend/src/data/mockData.ts`), so reviews/bookings reset when backend restarts.
- Frontend routing:
  - `/` stays list
  - `/stays/:id` stay details
  - `/checkout` checkout flow
  - `/confirmation` booking confirmation

## Styling

The application uses Material UI theming

## License

MIT
