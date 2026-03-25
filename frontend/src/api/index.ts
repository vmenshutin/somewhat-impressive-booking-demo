// Client
export { apiClient } from "./client";

// Utilities
export { getErrorMessage, ERROR_MESSAGES } from "./utils";

// Stays API
export { fetchAllStays, fetchStayById } from "./stays";
export type { FiltersParams } from "./stays";

// Reviews API
export { fetchStayReviews, addStayReview } from "./reviews";
export type { ReviewInput } from "./reviews";

// Bookings API
export { createNewBooking } from "./bookings";
export type { BookingInput } from "./bookings";
