import { apiClient } from "./client";
import { Booking } from "../store/bookingSlice";
import { getErrorMessage, ERROR_MESSAGES } from "./utils";

export interface BookingInput {
  stayId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

/**
 * Create a new booking
 */
export const createNewBooking = async (
  booking: BookingInput,
): Promise<Booking> => {
  try {
    const response = await apiClient.post<Booking>("/bookings", booking);
    return response.data;
  } catch (error) {
    throw getErrorMessage(error, ERROR_MESSAGES.CREATE_BOOKING);
  }
};
