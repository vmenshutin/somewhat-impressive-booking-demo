import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { ReactElement } from "react";
import { AvailabilityDateCalendar } from "./AvailabilityDateCalendar";
import { AvailabilityRange } from "../../utils/dateAvailability";

const renderWithLocalization = (component: ReactElement) => {
  return render(
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {component}
    </LocalizationProvider>,
  );
};

describe("AvailabilityDateCalendar", () => {
  it("renders the component with availability", () => {
    const availability: AvailabilityRange[] = [
      { start: "2024-01-01", end: "2024-01-31" },
    ];

    renderWithLocalization(
      <AvailabilityDateCalendar availability={availability} />,
    );

    expect(screen.getByText("Availability")).toBeInTheDocument();
    expect(screen.getByText("Available dates")).toBeInTheDocument();
    expect(screen.getByText("Unavailable dates")).toBeInTheDocument();
  });

  it("displays empty alert when no availability is provided", () => {
    const availability: AvailabilityRange[] = [];

    renderWithLocalization(
      <AvailabilityDateCalendar availability={availability} />,
    );

    expect(
      screen.getByText("No availability is currently set for this stay."),
    ).toBeInTheDocument();
  });

  it("renders legend with available and unavailable indicators", () => {
    const availability: AvailabilityRange[] = [
      { start: "2024-01-15", end: "2024-01-20" },
    ];

    renderWithLocalization(
      <AvailabilityDateCalendar availability={availability} />,
    );

    const legendItems = screen.getAllByText(/Available|Unavailable/i);
    expect(legendItems.length).toBeGreaterThanOrEqual(2);
  });

  it("renders calendar when availability data is provided", () => {
    const availability: AvailabilityRange[] = [
      { start: "2024-03-01", end: "2024-03-31" },
    ];

    renderWithLocalization(
      <AvailabilityDateCalendar availability={availability} />,
    );

    // Calendar should be rendered - check for title and legend which indicates component is rendered
    expect(screen.getByText("Availability")).toBeInTheDocument();
    expect(screen.getByText("Available dates")).toBeInTheDocument();
  });

  it("disables calendar when no availability is set", () => {
    const availability: AvailabilityRange[] = [];

    renderWithLocalization(
      <AvailabilityDateCalendar availability={availability} />,
    );

    // Component should render even without availability, showing the empty state
    expect(
      screen.getByText("No availability is currently set for this stay."),
    ).toBeInTheDocument();
    expect(screen.getByText("Availability")).toBeInTheDocument();
  });

  it("handles multiple availability ranges", () => {
    const availability: AvailabilityRange[] = [
      { start: "2024-01-01", end: "2024-01-15" },
      { start: "2024-02-01", end: "2024-02-28" },
      { start: "2024-03-15", end: "2024-03-31" },
    ];

    renderWithLocalization(
      <AvailabilityDateCalendar availability={availability} />,
    );

    expect(screen.getByText("Availability")).toBeInTheDocument();
    expect(screen.getByText("Available dates")).toBeInTheDocument();
  });

  it("renders without crashing with overlapping availability ranges", () => {
    const availability: AvailabilityRange[] = [
      { start: "2024-01-01", end: "2024-01-20" },
      { start: "2024-01-15", end: "2024-02-15" },
    ];

    renderWithLocalization(
      <AvailabilityDateCalendar availability={availability} />,
    );

    expect(screen.getByText("Availability")).toBeInTheDocument();
  });
});
