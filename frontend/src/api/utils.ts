import { AxiosError } from "axios";

/**
 * Extract error message from axios error or custom error object
 */
export const getErrorMessage = (
  error: unknown,
  defaultMessage: string,
): string => {
  if (error instanceof AxiosError) {
    // Handle axios error responses
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
  }

  // Handle custom error objects
  if (error instanceof Error) {
    return error.message;
  }

  return defaultMessage;
};

/**
 * Common error messages
 */
export const ERROR_MESSAGES = {
  FETCH_STAYS: "Failed to fetch stays. Please try again.",
  FETCH_STAY_DETAILS: "Failed to fetch stay details. Please try again.",
  FETCH_REVIEWS: "Failed to fetch reviews. Please try again.",
  ADD_REVIEW: "Failed to add review. Please try again.",
  CREATE_BOOKING: "Failed to create booking. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNKNOWN_ERROR: "Something went wrong. Please try again.",
};
