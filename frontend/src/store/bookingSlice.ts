import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createNewBooking } from "../api/bookings";

export interface Booking {
  id: string;
  confirmationId?: string;
  stayId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "completed" | "pending" | "cancelled";
}

// Redux state for booking
export interface BookingState {
  booking: Booking | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

// API Thunk: Create a new booking
export const createBooking = createAsyncThunk<
  Booking,
  {
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
>(
  "booking/createBooking",
  async (
    {
      stayId,
      checkIn,
      checkOut,
      guests,
      firstName,
      lastName,
      email,
      street,
      city,
      state,
      zipCode,
      country,
      cardNumber,
      expiry,
      cvv,
    },
    { rejectWithValue },
  ) => {
    try {
      const data = await createNewBooking({
        stayId,
        checkIn,
        checkOut,
        guests,
        firstName,
        lastName,
        email,
        street,
        city,
        state,
        zipCode,
        country,
        cardNumber,
        expiry,
        cvv,
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to create booking",
      );
    }
  },
);

// Initial state
const initialState: BookingState = {
  booking: null,
  loading: false,
  error: null,
  success: false,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    // Clear the booking
    clearBooking: (state) => {
      state.booking = null;
      state.success = false;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Reset entire booking state
    resetBooking: (state) => {
      state.booking = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    // Create booking handlers
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.booking = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create booking";
        state.success = false;
      });
  },
});

// Export actions
export const { clearBooking, clearError, resetBooking } = bookingSlice.actions;

// Export reducer
export default bookingSlice.reducer;
