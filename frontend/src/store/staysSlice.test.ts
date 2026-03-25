import { describe, it, expect } from "vitest";
import dayjs from "dayjs";
import type { RootState } from "./store";
import staysReducer, {
  setFilters,
  setSortBy,
  clearListError,
  clearDetailsError,
  clearAllErrors,
  resetFilters,
  clearSelectedStay,
  selectHasActiveFilters,
  FiltersState,
  SortOption,
} from "./staysSlice";
import { StaysState } from "./staysSlice";

describe("staysSlice", () => {
  const initialState: StaysState = {
    items: [],
    selectedStay: null,
    listLoading: false,
    detailsLoading: false,
    listError: null,
    detailsError: null,
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

  describe("reducers", () => {
    it("should return initial state", () => {
      const state = staysReducer(undefined, { type: "unknown" });
      expect(state).toEqual(initialState);
    });

    describe("setFilters", () => {
      it("should update filters correctly", () => {
        const newFilters: FiltersState = {
          minPrice: 100,
          maxPrice: 500,
          minRating: 4,
          location: "Paris",
          checkIn: dayjs("2026-04-10"),
          checkOut: dayjs("2026-04-15"),
        };

        const state = staysReducer(initialState, setFilters(newFilters));

        expect(state.filters).toEqual(newFilters);
        expect(state.sortBy).toBe("name"); // Other state unchanged
      });

      it("should only update specified filter fields", () => {
        const newFilters: FiltersState = {
          minPrice: 50,
          maxPrice: 1000,
          minRating: 0,
          location: "",
          checkIn: null,
          checkOut: null,
        };

        const state = staysReducer(initialState, setFilters(newFilters));

        expect(state.filters.minPrice).toBe(50);
        expect(state.filters.maxPrice).toBe(1000);
      });
    });

    describe("setSortBy", () => {
      it("should update sort order", () => {
        const sortOption: SortOption = "price-asc";
        const state = staysReducer(initialState, setSortBy(sortOption));

        expect(state.sortBy).toBe("price-asc");
        expect(state.filters).toEqual(initialState.filters); // Filters unchanged
      });

      it("should handle different sort options", () => {
        const sortOptions: SortOption[] = [
          "name",
          "price-asc",
          "price-desc",
          "rating-asc",
          "rating-desc",
        ];

        sortOptions.forEach((option) => {
          const state = staysReducer(initialState, setSortBy(option));
          expect(state.sortBy).toBe(option);
        });
      });
    });

    describe("clearListError", () => {
      it("should clear list error", () => {
        const stateWithError = {
          ...initialState,
          listError: "Some error occurred",
        };

        const state = staysReducer(stateWithError, clearListError());

        expect(state.listError).toBeNull();
        expect(state.detailsError).toBeNull(); // Other error unchanged
      });
    });

    describe("clearDetailsError", () => {
      it("should clear details error", () => {
        const stateWithError = {
          ...initialState,
          detailsError: "Failed to load details",
        };

        const state = staysReducer(stateWithError, clearDetailsError());

        expect(state.detailsError).toBeNull();
      });
    });

    describe("clearAllErrors", () => {
      it("should clear both list and details errors", () => {
        const stateWithErrors = {
          ...initialState,
          listError: "List failed",
          detailsError: "Details failed",
        };

        const state = staysReducer(stateWithErrors, clearAllErrors());

        expect(state.listError).toBeNull();
        expect(state.detailsError).toBeNull();
      });
    });

    describe("resetFilters", () => {
      it("should reset filters to default values", () => {
        const modifiedState = {
          ...initialState,
          filters: {
            minPrice: 100,
            maxPrice: 500,
            minRating: 4,
            location: "Bali",
            checkIn: dayjs("2026-04-12"),
            checkOut: dayjs("2026-04-20"),
          },
        };

        const state = staysReducer(modifiedState, resetFilters());

        expect(state.filters).toEqual(initialState.filters);
        expect(state.filters.minPrice).toBe(0);
        expect(state.filters.maxPrice).toBe(1000);
        expect(state.filters.location).toBe("");
        expect(state.filters.checkIn).toBeNull();
        expect(state.filters.checkOut).toBeNull();
      });
    });

    describe("clearSelectedStay", () => {
      it("should set selectedStay to null", () => {
        const mockStay = {
          id: "1",
          name: "Test Stay",
          description: "Test",
          location: "Test Location",
          price: 100,
          rating: 5,
          image: "url",
          amenities: [],
          latitude: 0,
          longitude: 0,
          availability: [],
        };

        const stateWithStay = {
          ...initialState,
          selectedStay: mockStay,
        };

        const state = staysReducer(stateWithStay, clearSelectedStay());

        expect(state.selectedStay).toBeNull();
      });
    });
  });

  describe("state immutability", () => {
    it("should not mutate original state when updating filters", () => {
      const originalFilters = { ...initialState.filters };
      const newFilters = {
        minPrice: 200,
        maxPrice: 800,
        minRating: 3,
        location: "Tokyo",
        checkIn: dayjs("2026-05-01"),
        checkOut: dayjs("2026-05-06"),
      };

      staysReducer(initialState, setFilters(newFilters));

      expect(initialState.filters).toEqual(originalFilters);
    });
  });

  describe("selectors", () => {
    it("returns false when no filters are active", () => {
      const state = { stays: { filters: initialState.filters } };
      expect(selectHasActiveFilters(state as unknown as RootState)).toBe(false);
    });

    it("returns true when date filters are active", () => {
      const state = {
        stays: {
          filters: {
            ...initialState.filters,
            checkIn: dayjs("2026-06-01"),
            checkOut: dayjs("2026-06-05"),
          },
        },
      };

      expect(selectHasActiveFilters(state as unknown as RootState)).toBe(true);
    });

    it("returns true when any non-date filter is active", () => {
      const state = {
        stays: {
          filters: {
            ...initialState.filters,
            minRating: 4,
          },
        },
      };

      expect(selectHasActiveFilters(state as unknown as RootState)).toBe(true);
    });
  });
});
