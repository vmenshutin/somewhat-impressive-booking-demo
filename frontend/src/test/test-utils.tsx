import { configureStore, PreloadedState } from "@reduxjs/toolkit";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { RootState } from "../store/store";
import staysReducer from "../store/staysSlice";
import reviewsReducer from "../store/reviewsSlice";
import bookingReducer from "../store/bookingSlice";

/**
 * Create a test store with initial state
 */
export function createTestStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: {
      stays: staysReducer,
      reviews: reviewsReducer,
      booking: bookingReducer,
    },
    preloadedState,
  });
}

/**
 * Test provider wrapper component
 */
export function TestProvider({
  children,
  preloadedState,
}: {
  children: ReactNode;
  preloadedState?: PreloadedState<RootState>;
}) {
  const store = createTestStore(preloadedState);
  return <Provider store={store}>{children}</Provider>;
}
