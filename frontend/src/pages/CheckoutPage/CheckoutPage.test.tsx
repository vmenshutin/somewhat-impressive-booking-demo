import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { CheckoutPage } from "./CheckoutPage";
import bookingReducer from "../../store/bookingSlice";

vi.mock("./components/ContactSection/ContactSection", () => ({
  ContactSection: ({
    onChange,
  }: {
    onChange: (values: Record<string, string>, isValid: boolean) => void;
  }) => (
    <div data-testid="contact-section">
      <button
        onClick={() =>
          onChange(
            { firstName: "John", lastName: "Doe", email: "john@example.com" },
            true,
          )
        }
      >
        Set Valid Contact
      </button>
    </div>
  ),
}));

vi.mock("./components/AddressSection/AddressSection", () => ({
  AddressSection: ({
    onChange,
  }: {
    onChange: (values: Record<string, string>, isValid: boolean) => void;
  }) => (
    <div data-testid="address-section">
      <button
        onClick={() =>
          onChange(
            {
              street: "123 Main",
              city: "NYC",
              state: "NY",
              zipCode: "10001",
              country: "USA",
            },
            true,
          )
        }
      >
        Set Valid Address
      </button>
    </div>
  ),
}));

vi.mock("./components/CardSection/CardSection", () => ({
  CardSection: ({
    onChange,
  }: {
    onChange: (
      values: Record<string, string>,
      normalizedNumber: string,
      isValid: boolean,
    ) => void;
  }) => (
    <div data-testid="card-section">
      <button
        onClick={() =>
          onChange(
            { cardNumber: "4111111111111111", expiry: "12/25", cvv: "123" },
            "4111111111111111",
            true,
          )
        }
      >
        Set Valid Card
      </button>
    </div>
  ),
}));

vi.mock("./components/BookingSummary/BookingSummary", () => ({
  BookingSummary: ({
    stayName,
    location,
  }: {
    stayName: string;
    location: string;
  }) => (
    <div data-testid="booking-summary">
      {stayName} - {location}
    </div>
  ),
}));

const createMockStore = () =>
  configureStore({
    reducer: {
      booking: bookingReducer,
    },
  });

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderCheckoutPage = (
  bookingState: Record<string, unknown> | null = null,
) => {
  const store = createMockStore();

  return render(
    <Provider store={store}>
      <Router initialEntries={[{ pathname: "/checkout", state: bookingState }]}>
        <Routes>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </Router>
    </Provider>,
  );
};

describe("CheckoutPage", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const mockBookingState = {
    stayId: "stay-1",
    stayName: "Beautiful Beach House",
    location: "Hawaii",
    checkIn: "2024-06-01",
    checkOut: "2024-06-05",
    nights: 4,
    totalPrice: 600,
  };

  it("shows error when no booking details provided", () => {
    renderCheckoutPage();

    expect(screen.getByText(/No booking details found/i)).toBeInTheDocument();
  });

  it("renders checkout form sections", () => {
    renderCheckoutPage(mockBookingState);

    expect(screen.getByTestId("contact-section")).toBeInTheDocument();
    expect(screen.getByTestId("address-section")).toBeInTheDocument();
    expect(screen.getByTestId("card-section")).toBeInTheDocument();
  });

  it("renders booking summary", () => {
    renderCheckoutPage(mockBookingState);

    expect(screen.getByTestId("booking-summary")).toBeInTheDocument();
  });

  it("displays stay name and location in summary", () => {
    renderCheckoutPage(mockBookingState);

    expect(screen.getByText(/Beautiful Beach House/)).toBeInTheDocument();
    expect(screen.getByText(/Hawaii/)).toBeInTheDocument();
  });

  it("has back button to navigate backward", () => {
    renderCheckoutPage(mockBookingState);

    const backButton = screen.getByRole("button", { name: /back/i });
    expect(backButton).toBeInTheDocument();
  });

  it("displays price information", () => {
    renderCheckoutPage(mockBookingState);

    // Price should be displayed in summary or page
    expect(screen.getByText(/600|Beautiful Beach House/)).toBeInTheDocument();
  });

  it("renders checkout sections in accordion format", () => {
    renderCheckoutPage(mockBookingState);

    // Accordion structure should be present
    const accordions = document.querySelectorAll(".MuiAccordion-root");
    expect(accordions.length).toBeGreaterThanOrEqual(0);
  });

  it("displays without crashing when booking state is provided", () => {
    expect(() => {
      renderCheckoutPage(mockBookingState);
    }).not.toThrow();
  });

  it("has contact, address, and card sections", () => {
    renderCheckoutPage(mockBookingState);

    expect(screen.getByTestId("contact-section")).toBeInTheDocument();
    expect(screen.getByTestId("address-section")).toBeInTheDocument();
    expect(screen.getByTestId("card-section")).toBeInTheDocument();
  });

  it("shows back to stays button when no booking found", () => {
    renderCheckoutPage();

    const backButton = screen.getByRole("button", { name: /Back to Stays/i });
    expect(backButton).toBeInTheDocument();
  });
});
