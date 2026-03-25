import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { fetchStayById } from "../../api/stays";
import staysReducer from "../../store/staysSlice";
import reviewsReducer from "../../store/reviewsSlice";
import { StayDetailsPage } from "./StayDetailsPage";

vi.mock("../../api/stays", () => ({
  fetchAllStays: vi.fn().mockResolvedValue([]),
  fetchStayById: vi.fn(),
}));

vi.mock("../../api/reviews", () => ({
  fetchReviews: vi.fn().mockResolvedValue([]),
}));

vi.mock("../../components/BookingForm/BookingForm", () => ({
  BookingForm: () => <div>BookingForm</div>,
}));

vi.mock(
  "../../components/AvailabilityDateCalendar/AvailabilityDateCalendar",
  () => ({
    AvailabilityDateCalendar: () => <div>Calendar</div>,
  }),
);

vi.mock("../../components", () => ({
  Reviews: () => (
    <div>
      <div>Guest Reviews</div>
      <div>Share Your Experience</div>
    </div>
  ),
  StayCardSkeleton: () => <div>Skeleton</div>,
}));

describe("StayDetailsPage", () => {
  const mockStay = {
    id: "1",
    name: "Beautiful Beach House",
    price: 150,
    rating: 4.8,
    image: "beach.jpg",
    location: "Hawaii",
    description: "A beautiful beach house with ocean views",
    amenities: ["WiFi", "Pool", "Air Conditioning", "Kitchen"],
    latitude: 0,
    longitude: 0,
    availability: [{ startDate: "2024-01-01", endDate: "2024-01-31" }],
  };

  const createStore = (overrides?: {
    selectedStay?: typeof mockStay | null;
    detailsLoading?: boolean;
  }) =>
    configureStore({
      reducer: { stays: staysReducer, reviews: reviewsReducer },
      preloadedState: {
        stays: {
          items: [],
          listLoading: false,
          detailsLoading: overrides?.detailsLoading ?? false,
          filters: {
            minPrice: 0,
            maxPrice: 1000,
            minRating: 0,
            location: "",
            checkIn: null,
            checkOut: null,
          },
          sortBy: "name",
          selectedStay: overrides?.selectedStay ?? null,
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

  const renderPage = (store: ReturnType<typeof createStore>) => {
    render(
      <Provider store={store}>
        <Router initialEntries={["/1"]}>
          <Routes>
            <Route path="/:id" element={<StayDetailsPage />} />
          </Routes>
        </Router>
      </Provider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchStayById).mockResolvedValue(mockStay);
  });

  it("renders stay details after loading", async () => {
    const store = createStore({ selectedStay: null });
    await act(async () => {
      renderPage(store);
    });

    expect(
      await screen.findByText("Beautiful Beach House"),
    ).toBeInTheDocument();
    expect(await screen.findByText("Hawaii")).toBeInTheDocument();
    expect(await screen.findByText("Calendar")).toBeInTheDocument();
    expect(await screen.findByText("BookingForm")).toBeInTheDocument();
  });

  it("renders amenities and review section", async () => {
    const store = createStore({ selectedStay: null });
    await act(async () => {
      renderPage(store);
    });

    expect(await screen.findByText("WiFi")).toBeInTheDocument();
    expect(await screen.findByText("Pool")).toBeInTheDocument();
    expect(await screen.findByText(/Guest Reviews/i)).toBeInTheDocument();
    expect(
      await screen.findByText("Share Your Experience"),
    ).toBeInTheDocument();
  });

  it("renders not found when API returns no stay", async () => {
    vi.mocked(fetchStayById).mockResolvedValueOnce(null as never);

    const store = createStore({ selectedStay: null });
    await act(async () => {
      renderPage(store);
    });

    expect(await screen.findByText("Stay Not Found")).toBeInTheDocument();
  });

  it("renders skeleton while details are loading", async () => {
    const store = createStore({ selectedStay: null, detailsLoading: true });
    act(() => {
      renderPage(store);
    });

    expect(screen.getAllByText("Skeleton").length).toBeGreaterThan(0);

    // Flush any pending state updates from effects
    await act(async () => {});
  });
});
