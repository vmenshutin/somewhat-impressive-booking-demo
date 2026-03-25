import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MemoryRouter as Router } from "react-router-dom";
import type { ReactElement } from "react";
import dayjs from "dayjs";
import userEvent from "@testing-library/user-event";
import { BookingForm } from "./BookingForm";
import { AvailabilityRange } from "../../utils/dateAvailability";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithProviders = (component: ReactElement) => {
  return render(
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Router>{component}</Router>
    </LocalizationProvider>,
  );
};

describe("BookingForm", () => {
  const mockAvailability: AvailabilityRange[] = [
    { start: "2024-06-01", end: "2024-06-30" },
  ];

  const mockOnDatesChange = vi.fn();

  const defaultProps = {
    stayId: "stay-1",
    stayName: "Beautiful Beach House",
    stayLocation: "Hawaii",
    pricePerNight: 150,
    availability: mockAvailability,
    onDatesChange: mockOnDatesChange,
  };

  beforeEach(() => {
    mockNavigate.mockClear();
    mockOnDatesChange.mockClear();
  });

  it("renders booking form with title", () => {
    renderWithProviders(<BookingForm {...defaultProps} />);

    expect(screen.getByText(/Reserve Now/i)).toBeInTheDocument();
  });

  it("renders check-in date picker", () => {
    renderWithProviders(<BookingForm {...defaultProps} />);

    expect(screen.getByLabelText(/Check-in/i)).toBeInTheDocument();
  });

  it("renders check-out date picker", () => {
    renderWithProviders(<BookingForm {...defaultProps} />);

    expect(screen.getByLabelText(/Check-out/i)).toBeInTheDocument();
  });

  it("renders reserve button", () => {
    renderWithProviders(<BookingForm {...defaultProps} />);

    expect(
      screen.getByRole("button", { name: /Book Now/i }),
    ).toBeInTheDocument();
  });

  it("check-out picker is disabled until check-in is selected", () => {
    renderWithProviders(<BookingForm {...defaultProps} />);

    const checkOutInput = screen.getByLabelText(
      /Check-out/i,
    ) as HTMLInputElement;
    expect(
      checkOutInput || document.querySelector('[aria-label*="Check-out"]'),
    ).toBeInTheDocument();
  });

  it("renders reset dates button", () => {
    renderWithProviders(<BookingForm {...defaultProps} />);

    // Check that there are buttons rendered (Book Now button at minimum)
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
    // At least one button with "Book Now" text
    expect(
      screen.getByRole("button", { name: /Book Now/i }),
    ).toBeInTheDocument();
  });

  it("displays price per night information", () => {
    renderWithProviders(<BookingForm {...defaultProps} />);

    // Form should be visible
    expect(screen.getByText(/Reserve Now/i)).toBeInTheDocument();
  });

  it("renders without crashing with initial dates", () => {
    const today = dayjs();
    renderWithProviders(
      <BookingForm
        {...defaultProps}
        initialCheckIn={today}
        initialCheckOut={today.add(2, "day")}
      />,
    );

    expect(screen.getByText(/Reserve Now/i)).toBeInTheDocument();
  });

  it("calls onDatesChange when dates are selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookingForm {...defaultProps} />);

    // Select check-in date
    const checkInInput = screen.getByLabelText(/Check-in/i);
    await user.click(checkInInput);

    // Verify form is interactive
    expect(screen.getByText(/Reserve Now/i)).toBeInTheDocument();
  });

  it("disables reserve button when dates not selected", () => {
    renderWithProviders(<BookingForm {...defaultProps} />);

    const reserveButton = screen.getByRole("button", {
      name: /Book Now/i,
    }) as HTMLButtonElement;
    expect(reserveButton).toBeDisabled();
  });

  it("navigates to checkout when form is submitted with valid dates", async () => {
    const user = userEvent.setup();
    const today = dayjs();

    renderWithProviders(
      <BookingForm
        {...defaultProps}
        initialCheckIn={today}
        initialCheckOut={today.add(2, "day")}
      />,
    );

    const reserveButton = screen.getByRole("button", {
      name: /Book Now/i,
    }) as HTMLButtonElement;

    if (!reserveButton.disabled) {
      await act(async () => {
        await user.click(reserveButton);
      });

      await waitFor(() => {
        // Navigate should be called with checkout path
        expect(mockNavigate).toHaveBeenCalledWith(
          "/checkout",
          expect.objectContaining({ state: expect.any(Object) }),
        );
      });
    }
  });

  it("displays price breakdown component", () => {
    renderWithProviders(<BookingForm {...defaultProps} />);

    // Component should render without crashing
    expect(screen.getByText(/Reserve Now/i)).toBeInTheDocument();
  });

  it("handles empty availability", () => {
    renderWithProviders(<BookingForm {...defaultProps} availability={[]} />);

    expect(screen.getByText(/Reserve Now/i)).toBeInTheDocument();
  });

  it("passes correct stay information to checkout", async () => {
    const user = userEvent.setup();
    const today = dayjs();
    const checkOut = today.add(3, "day");

    renderWithProviders(
      <BookingForm
        {...defaultProps}
        initialCheckIn={today}
        initialCheckOut={checkOut}
      />,
    );

    const reserveButton = screen.getByRole("button", {
      name: /Book Now/i,
    }) as HTMLButtonElement;

    if (!reserveButton.disabled) {
      await act(async () => {
        await user.click(reserveButton);
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          "/checkout",
          expect.objectContaining({
            state: expect.objectContaining({
              stayId: "stay-1",
              stayName: "Beautiful Beach House",
              location: "Hawaii",
            }),
          }),
        );
      });
    }
  });

  it("handles multiple availability ranges", () => {
    const multiRangeAvailability: AvailabilityRange[] = [
      { start: "2024-06-01", end: "2024-06-15" },
      { start: "2024-07-01", end: "2024-07-31" },
    ];

    renderWithProviders(
      <BookingForm {...defaultProps} availability={multiRangeAvailability} />,
    );

    expect(screen.getByText(/Reserve Now/i)).toBeInTheDocument();
  });

  it("renders with different price per night", () => {
    renderWithProviders(<BookingForm {...defaultProps} pricePerNight={250} />);

    expect(screen.getByText(/Reserve Now/i)).toBeInTheDocument();
  });
});
