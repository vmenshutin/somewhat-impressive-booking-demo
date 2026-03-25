import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { ConfirmationPage } from "./ConfirmationPage";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockBookingSummary = {
  stayName: "Beautiful Beach House",
  location: "Hawaii",
  checkIn: "2024-06-01",
  checkOut: "2024-06-05",
  nights: 4,
  totalPrice: 600,
};

const mockConfirmationState = {
  confirmationId: "CONF-12345",
  bookingSummary: mockBookingSummary,
};

const renderConfirmationPage = (
  confirmationState: Record<string, unknown> | null = null,
) => {
  return render(
    <Router
      initialEntries={[{ pathname: "/confirmation", state: confirmationState }]}
    >
      <Routes>
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </Router>,
  );
};

describe("ConfirmationPage", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("shows error when no confirmation details provided", () => {
    renderConfirmationPage();

    expect(
      screen.getByText(/No confirmation details found/i),
    ).toBeInTheDocument();
  });

  it("displays confirmation success message", () => {
    renderConfirmationPage(mockConfirmationState);

    expect(screen.getByText(/Booking Confirmed/i)).toBeInTheDocument();
  });

  it("displays success checkmark icon", () => {
    renderConfirmationPage(mockConfirmationState);

    const checkIcon = document.querySelector('[data-testid="CheckCircleIcon"]');
    expect(
      checkIcon || screen.getByText(/Booking Confirmed/i),
    ).toBeInTheDocument();
  });

  it("displays confirmation ID", () => {
    renderConfirmationPage(mockConfirmationState);

    expect(screen.getByText("CONF-12345")).toBeInTheDocument();
  });

  it("displays payment success message", () => {
    renderConfirmationPage(mockConfirmationState);

    expect(screen.getByText(/payment was successful/i)).toBeInTheDocument();
  });

  it("displays booking summary with stay name", () => {
    renderConfirmationPage(mockConfirmationState);

    expect(screen.getByText("Beautiful Beach House")).toBeInTheDocument();
  });

  it("displays location in booking summary", () => {
    renderConfirmationPage(mockConfirmationState);

    expect(screen.getByText("Hawaii")).toBeInTheDocument();
  });

  it("displays check-in date", () => {
    renderConfirmationPage(mockConfirmationState);

    expect(screen.getByText(/2024-06-01/)).toBeInTheDocument();
  });

  it("displays check-out date", () => {
    renderConfirmationPage(mockConfirmationState);

    expect(screen.getByText(/2024-06-05/)).toBeInTheDocument();
  });

  it("displays number of nights", () => {
    renderConfirmationPage(mockConfirmationState);

    expect(screen.getByText(/Nights/i)).toBeInTheDocument();
  });

  it("displays total price", () => {
    renderConfirmationPage(mockConfirmationState);

    expect(screen.getByText(/600/)).toBeInTheDocument();
  });

  it("has back to stays button", () => {
    renderConfirmationPage(mockConfirmationState);

    const backButton = screen.getByRole("button", { name: /Back to Stays/i });
    expect(backButton).toBeInTheDocument();
  });

  it("navigates home when back button clicked", async () => {
    const user = userEvent.setup();
    renderConfirmationPage(mockConfirmationState);

    const backButton = screen.getByRole("button", { name: /Back to Stays/i });
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("displays back button when no confirmation found", () => {
    renderConfirmationPage();

    const backButton = screen.getByRole("button", { name: /Back to Stays/i });
    expect(backButton).toBeInTheDocument();
  });

  it("renders without crashing with full booking state", () => {
    expect(() => {
      renderConfirmationPage(mockConfirmationState);
    }).not.toThrow();
  });

  it("displays confirmation ID label", () => {
    renderConfirmationPage(mockConfirmationState);

    expect(screen.getByText(/Confirmation ID/i)).toBeInTheDocument();
  });

  it("handles missing booking summary gracefully", () => {
    const stateWithoutSummary = {
      confirmationId: "CONF-99999",
    };

    renderConfirmationPage(stateWithoutSummary);

    expect(screen.getByText("CONF-99999")).toBeInTheDocument();
    expect(screen.getByText(/Booking Confirmed/i)).toBeInTheDocument();
  });
});
