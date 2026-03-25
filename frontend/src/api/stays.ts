import { apiClient } from "./client";
import { Stay } from "../store/staysSlice";
import { getErrorMessage, ERROR_MESSAGES } from "./utils";

export interface FiltersParams {
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  location?: string;
  checkIn?: string;
  checkOut?: string;
  sortBy?: "name" | "price-asc" | "price-desc" | "rating-asc" | "rating-desc";
}

/**
 * Fetch all stays with optional filters
 */
export const fetchAllStays = async (
  filters?: FiltersParams,
): Promise<Stay[]> => {
  try {
    const params = new URLSearchParams();

    if (filters) {
      // Price filter
      if (filters.minPrice && filters.minPrice > 0) {
        params.append("minPrice", filters.minPrice.toString());
      }
      if (filters.maxPrice && filters.maxPrice > 0) {
        params.append("maxPrice", filters.maxPrice.toString());
      }

      // Rating filter
      if (filters.minRating && filters.minRating > 0) {
        params.append("minRating", filters.minRating.toString());
      }

      // Location filter
      if (filters.location && filters.location.trim()) {
        params.append("location", filters.location);
      }

      // Date filters (only include both if both are provided)
      const checkInTrimmed = filters.checkIn?.trim();
      const checkOutTrimmed = filters.checkOut?.trim();
      if (checkInTrimmed && checkOutTrimmed) {
        params.append("checkIn", checkInTrimmed);
        params.append("checkOut", checkOutTrimmed);
      }

      // Sorting
      if (filters.sortBy) {
        params.append("sortBy", filters.sortBy);
      }
    }

    const response = await apiClient.get<Stay[]>(`/stays?${params}`);
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, ERROR_MESSAGES.FETCH_STAYS);
  }
};

/**
 * Fetch a single stay by ID
 */
export const fetchStayById = async (id: string): Promise<Stay> => {
  try {
    const response = await apiClient.get<Stay>(`/stays/${id}`);
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, ERROR_MESSAGES.FETCH_STAY_DETAILS);
  }
};
