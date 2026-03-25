import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchStayReviews, addStayReview } from "../api/reviews";

export interface Review {
  id: string;
  stayId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

// Redux state for reviews
export interface ReviewsState {
  items: Review[];
  optimisticIds: string[]; // Track optimistically added review IDs for rollback

  // Loading states (separate for list vs adding)
  listLoading: boolean;
  addingLoading: boolean;

  // Error states
  listError: string | null;
  addingError: string | null;
}

// API Thunk: Fetch reviews for a stay
export const fetchReviews = createAsyncThunk<Review[], string>(
  "reviews/fetchReviews",
  async (stayId, { rejectWithValue }) => {
    try {
      const data = await fetchStayReviews(stayId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch reviews",
      );
    }
  },
);

// API Thunk: Add a new review
export const addReview = createAsyncThunk<
  Review,
  { stayId: string; author: string; rating: number; comment: string }
>(
  "reviews/addReview",
  async ({ stayId, author, rating, comment }, { rejectWithValue }) => {
    try {
      const data = await addStayReview(stayId, {
        author,
        rating,
        comment,
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to add review",
      );
    }
  },
);

// Initial state
const initialState: ReviewsState = {
  items: [],
  optimisticIds: [],
  listLoading: false,
  addingLoading: false,
  listError: null,
  addingError: null,
};

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    // Optimistic: Add review immediately and track its ID for rollback
    addReviewOptimistic: (
      state,
      action: {
        payload: { review: Review; optimisticId: string };
      },
    ) => {
      const { review, optimisticId } = action.payload;
      state.items.push(review);
      state.optimisticIds.push(optimisticId);
    },

    // Rollback: Remove optimistically added review if API call fails
    removeReviewOptimistic: (state, action: { payload: string }) => {
      const optimisticId = action.payload;
      state.items = state.items.filter((review) => review.id !== optimisticId);
      state.optimisticIds = state.optimisticIds.filter(
        (id) => id !== optimisticId,
      );
    },

    // Clear list error
    clearListError: (state) => {
      state.listError = null;
    },

    // Clear adding error
    clearAddingError: (state) => {
      state.addingError = null;
    },

    // Clear all errors
    clearAllErrors: (state) => {
      state.listError = null;
      state.addingError = null;
    },
  },

  extraReducers: (builder) => {
    // Fetch reviews handlers
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.listLoading = false;
        state.items = action.payload;
        state.listError = null;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.listLoading = false;
        state.listError =
          (action.payload as string) || "Failed to fetch reviews";
      });

    // Add review handlers
    builder
      .addCase(addReview.pending, (state) => {
        state.addingLoading = true;
        state.addingError = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.addingLoading = false;
        // Replace the optimistic review with the real one from the server
        const optimisticIndex = state.items.findIndex((r) =>
          state.optimisticIds.includes(r.id),
        );
        if (optimisticIndex >= 0) {
          state.items[optimisticIndex] = action.payload;
          state.optimisticIds = state.optimisticIds.filter(
            (id) => id !== state.items[optimisticIndex].id,
          );
        } else {
          // If no optimistic review found, just add the server response
          state.items.push(action.payload);
        }
        state.addingError = null;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.addingLoading = false;
        state.addingError =
          (action.payload as string) || "Failed to add review";
        // Optimistic removal will be handled by the component dispatching the action
      });
  },
});

// Export actions
export const {
  addReviewOptimistic,
  removeReviewOptimistic,
  clearListError,
  clearAddingError,
  clearAllErrors,
} = reviewsSlice.actions;

// Export reducer
export default reviewsSlice.reducer;
