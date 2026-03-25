import { apiClient } from "./client";
import { Review } from "../store/reviewsSlice";
import { getErrorMessage, ERROR_MESSAGES } from "./utils";

export interface ReviewInput {
  author: string;
  rating: number;
  comment: string;
}

/**
 * Fetch all reviews for a specific stay
 */
export const fetchStayReviews = async (stayId: string): Promise<Review[]> => {
  try {
    const response = await apiClient.get<Review[]>(`/stays/${stayId}/reviews`);
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, ERROR_MESSAGES.FETCH_REVIEWS);
  }
};

/**
 * Add a new review to a stay
 */
export const addStayReview = async (
  stayId: string,
  review: ReviewInput,
): Promise<Review> => {
  try {
    const response = await apiClient.post<Review>(
      `/stays/${stayId}/reviews`,
      review,
    );
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, ERROR_MESSAGES.ADD_REVIEW);
  }
};
