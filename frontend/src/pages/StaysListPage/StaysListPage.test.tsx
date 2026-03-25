import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import staysReducer from "../../store/staysSlice";
import reviewsReducer from "../../store/reviewsSlice";
import { StaysListPage } from "./StaysListPage";

// Mock the API module
vi.mock("../../api/stays", () => ({
  fetchAllStays: vi.fn().mockResolvedValue([]),
  fetchStayById: vi.fn().mockResolvedValue(null),
}));

// Mock all child components to simple divs
vi.mock("../../components", () => ({
  StayCard: () => <div>StayCard</div>,
  FilterPanel: () => <div>FilterPanel</div>,
  StayCardSkeleton: () => <div>Skeleton</div>,
  EmptyState: () => <div>EmptyState</div>,
  StaysMap: () => <div>StaysMap</div>,
}));

describe("StaysListPage", () => {
  it("renders result count text", () => {
    const store = configureStore({
      reducer: { stays: staysReducer, reviews: reviewsReducer },
      preloadedState: {
        stays: {
          items: [],
          listLoading: false,
          detailsLoading: false,
          filters: {
            minPrice: 0,
            maxPrice: 1000,
            minRating: 0,
            location: "",
            checkIn: null,
            checkOut: null,
          },
          sortBy: "name",
          selectedStay: null,
          listError: null,
          detailsError: null,
        },
        reviews: {
          items: [],
          optimisticIds: [],
          listLoading: false,
          addingLoading: false,
          listError: null,
          addingError: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <Router>
          <StaysListPage />
        </Router>
      </Provider>,
    );

    expect(screen.getByText(/0 stays available/i)).toBeInTheDocument();
  });

  it("renders initial sort option text", () => {
    const store = configureStore({
      reducer: { stays: staysReducer, reviews: reviewsReducer },
      preloadedState: {
        stays: {
          items: [],
          listLoading: false,
          detailsLoading: false,
          filters: {
            minPrice: 0,
            maxPrice: 1000,
            minRating: 0,
            location: "",
            checkIn: null,
            checkOut: null,
          },
          sortBy: "name",
          selectedStay: null,
          listError: null,
          detailsError: null,
        },
        reviews: {
          items: [],
          optimisticIds: [],
          listLoading: false,
          addingLoading: false,
          listError: null,
          addingError: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <Router>
          <StaysListPage />
        </Router>
      </Provider>,
    );

    expect(screen.getByText("Name (A-Z)")).toBeInTheDocument();
  });

  it("renders sort by label", () => {
    const store = configureStore({
      reducer: { stays: staysReducer, reviews: reviewsReducer },
      preloadedState: {
        stays: {
          items: [],
          listLoading: false,
          detailsLoading: false,
          filters: {
            minPrice: 0,
            maxPrice: 1000,
            minRating: 0,
            location: "",
            checkIn: null,
            checkOut: null,
          },
          sortBy: "name",
          selectedStay: null,
          listError: null,
          detailsError: null,
        },
        reviews: {
          items: [],
          optimisticIds: [],
          listLoading: false,
          addingLoading: false,
          listError: null,
          addingError: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <Router>
          <StaysListPage />
        </Router>
      </Provider>,
    );

    expect(screen.getAllByText("Sort by").length).toBeGreaterThan(0);
  });

  it("displays correct count with 2 items", () => {
    const store = configureStore({
      reducer: { stays: staysReducer, reviews: reviewsReducer },
      preloadedState: {
        stays: {
          items: [
            {
              id: "1",
              name: "House 1",
              price: 100,
              rating: 4.5,
              image: "img1.jpg",
              location: "NY",
              description: "d",
              amenities: [],
              latitude: 0,
              longitude: 0,
              availability: [],
            },
            {
              id: "2",
              name: "House 2",
              price: 200,
              rating: 4,
              image: "img2.jpg",
              location: "CA",
              description: "d",
              amenities: [],
              latitude: 0,
              longitude: 0,
              availability: [],
            },
          ],
          listLoading: false,
          detailsLoading: false,
          filters: {
            minPrice: 0,
            maxPrice: 1000,
            minRating: 0,
            location: "",
            checkIn: null,
            checkOut: null,
          },
          sortBy: "name",
          selectedStay: null,
          listError: null,
          detailsError: null,
        },
        reviews: {
          items: [],
          optimisticIds: [],
          listLoading: false,
          addingLoading: false,
          listError: null,
          addingError: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <Router>
          <StaysListPage />
        </Router>
      </Provider>,
    );

    expect(screen.getByText(/2 stays available/i)).toBeInTheDocument();
  });

  it("displays singular stay text with 1 item", () => {
    const store = configureStore({
      reducer: { stays: staysReducer, reviews: reviewsReducer },
      preloadedState: {
        stays: {
          items: [
            {
              id: "1",
              name: "House",
              price: 100,
              rating: 4.5,
              image: "img.jpg",
              location: "NY",
              description: "d",
              amenities: [],
              latitude: 0,
              longitude: 0,
              availability: [],
            },
          ],
          listLoading: false,
          detailsLoading: false,
          filters: {
            minPrice: 0,
            maxPrice: 1000,
            minRating: 0,
            location: "",
            checkIn: null,
            checkOut: null,
          },
          sortBy: "name",
          selectedStay: null,
          listError: null,
          detailsError: null,
        },
        reviews: {
          items: [],
          optimisticIds: [],
          listLoading: false,
          addingLoading: false,
          listError: null,
          addingError: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <Router>
          <StaysListPage />
        </Router>
      </Provider>,
    );

    expect(screen.getByText(/1 stay available/i)).toBeInTheDocument();
  });

  it("renders filter panel mock", () => {
    const store = configureStore({
      reducer: { stays: staysReducer, reviews: reviewsReducer },
      preloadedState: {
        stays: {
          items: [],
          listLoading: false,
          detailsLoading: false,
          filters: {
            minPrice: 0,
            maxPrice: 1000,
            minRating: 0,
            location: "",
            checkIn: null,
            checkOut: null,
          },
          sortBy: "name",
          selectedStay: null,
          listError: null,
          detailsError: null,
        },
        reviews: {
          items: [],
          optimisticIds: [],
          listLoading: false,
          addingLoading: false,
          listError: null,
          addingError: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <Router>
          <StaysListPage />
        </Router>
      </Provider>,
    );

    expect(screen.getByText("FilterPanel")).toBeInTheDocument();
  });

  it("renders map mock", () => {
    const store = configureStore({
      reducer: { stays: staysReducer, reviews: reviewsReducer },
      preloadedState: {
        stays: {
          items: [],
          listLoading: false,
          detailsLoading: false,
          filters: {
            minPrice: 0,
            maxPrice: 1000,
            minRating: 0,
            location: "",
            checkIn: null,
            checkOut: null,
          },
          sortBy: "name",
          selectedStay: null,
          listError: null,
          detailsError: null,
        },
        reviews: {
          items: [],
          optimisticIds: [],
          listLoading: false,
          addingLoading: false,
          listError: null,
          addingError: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <Router>
          <StaysListPage />
        </Router>
      </Provider>,
    );

    expect(screen.getByText("Loading map...")).toBeInTheDocument();
  });

  it("renders empty state when no items", async () => {
    const store = configureStore({
      reducer: { stays: staysReducer, reviews: reviewsReducer },
      preloadedState: {
        stays: {
          items: [],
          listLoading: false,
          detailsLoading: false,
          filters: {
            minPrice: 0,
            maxPrice: 1000,
            minRating: 0,
            location: "",
            checkIn: null,
            checkOut: null,
          },
          sortBy: "name",
          selectedStay: null,
          listError: null,
          detailsError: null,
        },
        reviews: {
          items: [],
          optimisticIds: [],
          listLoading: false,
          addingLoading: false,
          listError: null,
          addingError: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <Router>
          <StaysListPage />
        </Router>
      </Provider>,
    );

    expect(await screen.findByText("EmptyState")).toBeInTheDocument();
  });

  it("renders skeleton when loading", () => {
    const store = configureStore({
      reducer: { stays: staysReducer, reviews: reviewsReducer },
      preloadedState: {
        stays: {
          items: [],
          listLoading: true,
          detailsLoading: false,
          filters: {
            minPrice: 0,
            maxPrice: 1000,
            minRating: 0,
            location: "",
            checkIn: null,
            checkOut: null,
          },
          sortBy: "name",
          selectedStay: null,
          listError: null,
          detailsError: null,
        },
        reviews: {
          items: [],
          optimisticIds: [],
          listLoading: false,
          addingLoading: false,
          listError: null,
          addingError: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <Router>
          <StaysListPage />
        </Router>
      </Provider>,
    );

    expect(screen.getAllByText("Skeleton").length).toBeGreaterThan(0);
  });
});
