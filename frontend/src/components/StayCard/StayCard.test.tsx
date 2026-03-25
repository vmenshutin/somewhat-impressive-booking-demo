import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StayCard } from "./StayCard";
import { Stay } from "../../store/staysSlice";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("StayCard component", () => {
  const mockStay: Stay = {
    id: "1",
    name: "Luxury Beachfront Villa",
    description: "Beautiful oceanfront villa",
    location: "Bali, Indonesia",
    price: 250,
    rating: 4.8,
    image: "https://example.com/villa.jpg",
    amenities: ["WiFi", "Pool", "Beach Access"],
    latitude: -8.653,
    longitude: 115.213,
    availability: [
      { startDate: "2024-06-01", endDate: "2025-01-31" },
      { startDate: "2025-03-15", endDate: "2025-05-31" },
    ],
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("should render stay information correctly", () => {
    render(<StayCard stay={mockStay} />);

    expect(screen.getByText("Luxury Beachfront Villa")).toBeInTheDocument();
    expect(screen.getByText(/Bali, Indonesia/)).toBeInTheDocument();
    expect(screen.getByText("$250")).toBeInTheDocument();
  });

  it("should display the correct rating", () => {
    render(<StayCard stay={mockStay} />);

    expect(screen.getByText(/4.8/)).toBeInTheDocument();
  });

  it("should render the stay image with correct alt text", () => {
    render(<StayCard stay={mockStay} />);

    const image = screen.getByAltText(
      "Luxury Beachfront Villa",
    ) as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toContain("villa.jpg");
  });

  it("should display amenities as chips", () => {
    render(<StayCard stay={mockStay} />);

    expect(screen.getByText("WiFi")).toBeInTheDocument();
    expect(screen.getByText("Pool")).toBeInTheDocument();
  });

  it('should show "more" text when there are more than 2 amenities', () => {
    const stayWith5Amenities: Stay = {
      ...mockStay,
      amenities: ["WiFi", "Pool", "Beach Access", "Kitchen", "Hot Tub"],
    };

    render(<StayCard stay={stayWith5Amenities} />);

    expect(screen.getByText(/\+3/)).toBeInTheDocument();
  });

  it("should navigate to stay details when card is clicked", async () => {
    const user = userEvent.setup();

    const { container } = render(<StayCard stay={mockStay} />);

    // Find and click the Card element
    const card = container.querySelector('[class*="MuiCard"]');
    if (card) {
      await user.click(card);
    }

    expect(mockNavigate).toHaveBeenCalledWith("/stays/1");
  });

  it("should render with correct per-night label", () => {
    render(<StayCard stay={mockStay} />);

    expect(screen.getByText("per night")).toBeInTheDocument();
  });

  it("should handle different price values correctly", () => {
    const cheapStay: Stay = {
      ...mockStay,
      price: 50,
    };

    render(<StayCard stay={cheapStay} />);

    expect(screen.getByText("$50")).toBeInTheDocument();
  });

  it("should handle low ratings", () => {
    const lowRatedStay: Stay = {
      ...mockStay,
      rating: 2.5,
    };

    render(<StayCard stay={lowRatedStay} />);

    expect(screen.getByText(/2.5/)).toBeInTheDocument();
  });

  it("should render description text", () => {
    render(<StayCard stay={mockStay} />);

    expect(screen.getByText("Beautiful oceanfront villa")).toBeInTheDocument();
  });
});
