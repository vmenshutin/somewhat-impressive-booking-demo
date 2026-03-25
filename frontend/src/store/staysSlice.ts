import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchAllStays, fetchStayById, FiltersParams } from "../api/stays";
import { Dayjs } from "dayjs";
import type { RootState } from "./store";

export interface Availability {
  startDate: string;
  endDate: string;
}

export interface Stay {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  amenities: string[];
  latitude: number;
  longitude: number;
  availability: Availability[];
}

// Filter state type
export interface FiltersState {
  minPrice: number;
  maxPrice: number;
  minRating: number;
  location: string;
  checkIn: Dayjs | null;
  checkOut: Dayjs | null;
}

// Sort options
export type SortOption =
  | "name"
  | "price-asc"
  | "price-desc"
  | "rating-asc"
  | "rating-desc";

// Redux state for stays
export interface StaysState {
  // Data
  items: Stay[];
  selectedStay: Stay | null;

  // Loading states (separate for list vs details)
  listLoading: boolean;
  detailsLoading: boolean;

  // Error states
  listError: string | null;
  detailsError: string | null;

  // Filter & Sort
  filters: FiltersState;
  sortBy: SortOption;
}

// API Thunk: Fetch all stays with optional filters
// Filters include: price, rating, location, and date availability
// dates: checkIn and checkOut are only used if both are provided
const toApiFilters = (
  filters: FiltersState,
  sortBy: SortOption,
): FiltersParams => ({
  minPrice: filters.minPrice,
  maxPrice: filters.maxPrice,
  minRating: filters.minRating,
  location: filters.location,
  checkIn: filters.checkIn ? filters.checkIn.format("YYYY-MM-DD") : undefined,
  checkOut: filters.checkOut
    ? filters.checkOut.format("YYYY-MM-DD")
    : undefined,
  sortBy,
});

interface FetchStaysParams {
  filters?: FiltersState;
  sortBy?: SortOption;
}

export const fetchStays = createAsyncThunk<
  Stay[],
  FetchStaysParams | undefined
>("stays/fetchStays", async (params, { rejectWithValue, getState }) => {
  try {
    const state = getState() as { stays: StaysState };
    const activeSortBy = params?.sortBy ?? state.stays.sortBy;
    const activeFilters = params?.filters;
    const data = await fetchAllStays(
      activeFilters
        ? toApiFilters(activeFilters, activeSortBy)
        : { sortBy: activeSortBy },
    );
    return data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch stays",
    );
  }
});

// API Thunk: Fetch single stay details
export const fetchStayDetails = createAsyncThunk<Stay, string>(
  "stays/fetchStayDetails",
  async (id, { rejectWithValue }) => {
    try {
      const data = await fetchStayById(id);
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch stay details",
      );
    }
  },
);

// Initial state
const initialState: StaysState = {
  // Data
  items: [],
  selectedStay: null,

  // Loading states
  listLoading: false,
  detailsLoading: false,

  // Error states
  listError: null,
  detailsError: null,

  // Filter & Sort
  filters: {
    minPrice: 0,
    maxPrice: 1000,
    minRating: 0,
    location: "",
    checkIn: null,
    checkOut: null,
  },
  sortBy: "name",
};

const staysSlice = createSlice({
  name: "stays",
  initialState,
  reducers: {
    // Update filters (all filters including checkIn/checkOut)
    // Components should call fetchStays() after this to refetch with new filters
    setFilters: (state, action: PayloadAction<FiltersState>) => {
      state.filters = action.payload;
    },

    // Change sort order
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload;
    },

    // Clear list error
    clearListError: (state) => {
      state.listError = null;
    },

    // Clear details error
    clearDetailsError: (state) => {
      state.detailsError = null;
    },

    // Clear all errors
    clearAllErrors: (state) => {
      state.listError = null;
      state.detailsError = null;
    },

    // Reset filters to default
    resetFilters: (state) => {
      state.filters = {
        minPrice: 0,
        maxPrice: 1000,
        minRating: 0,
        location: "",
        checkIn: null,
        checkOut: null,
      };
    },

    // Clear selected stay
    clearSelectedStay: (state) => {
      state.selectedStay = null;
    },
  },

  extraReducers: (builder) => {
    // Fetch stays (list) handlers
    builder
      .addCase(fetchStays.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchStays.fulfilled, (state, action) => {
        state.listLoading = false;
        state.items = action.payload;
        state.listError = null;
      })
      .addCase(fetchStays.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = (action.payload as string) || "Failed to fetch stays";
      });

    // Fetch stay details handlers
    builder
      .addCase(fetchStayDetails.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(fetchStayDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedStay = action.payload;
        state.detailsError = null;
      })
      .addCase(fetchStayDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError =
          (action.payload as string) || "Failed to fetch stay details";
      });
  },
});

// Export actions
export const {
  setFilters,
  setSortBy,
  clearListError,
  clearDetailsError,
  clearAllErrors,
  resetFilters,
  clearSelectedStay,
} = staysSlice.actions;

/**
 * Helper selector: Check if any filters are currently active
 * Used to determine if initial data fetch should use filters or not
 */
export const selectHasActiveFilters = (state: RootState): boolean => {
  const { filters } = state.stays;
  return (
    filters.minPrice > 0 ||
    filters.maxPrice < 1000 ||
    filters.minRating > 0 ||
    !!filters.location.trim() ||
    (!!filters.checkIn && !!filters.checkOut)
  );
};

// Export reducer
export default staysSlice.reducer;
