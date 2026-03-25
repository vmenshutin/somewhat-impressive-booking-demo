import { configureStore, isPlain } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import staysReducer from "./staysSlice";
import reviewsReducer from "./reviewsSlice";
import bookingReducer from "./bookingSlice";

const isSerializableValue = (value: unknown): boolean => {
  if (dayjs.isDayjs(value)) {
    return true;
  }

  if (value === null || typeof value !== "object") {
    return true;
  }

  return Array.isArray(value) || isPlain(value);
};

const getSerializableEntries = (value: unknown): [string, unknown][] => {
  if (dayjs.isDayjs(value)) {
    return [];
  }

  return Object.entries(value as Record<string, unknown>);
};

export const store = configureStore({
  reducer: {
    stays: staysReducer,
    reviews: reviewsReducer,
    booking: bookingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        isSerializable: isSerializableValue,
        getEntries: getSerializableEntries,
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
