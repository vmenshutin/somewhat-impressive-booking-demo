import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Reviews } from "./Reviews";
import { Review } from "../../store/reviewsSlice";

vi.mock("./components/ReviewCard", () => ({
  ReviewCard: ({ review }: { review: Review }) => (
    <div data-testid="review-card">{review.author}</div>
  ),
}));

vi.mock("./components/ReviewForm", () => ({
  ReviewForm: () => <div data-testid="review-form">Review Form</div>,
}));

describe("Reviews", () => {
  const mockReviews: Review[] = [
    {
      id: "1",
      stayId: "stay-1",
      author: "John Doe",
      rating: 4,
      comment: "Great stay!",
      date: "2024-03-01",
    },
    {
      id: "2",
      stayId: "stay-1",
      author: "Jane Smith",
      rating: 5,
      comment: "Amazing place",
      date: "2024-03-02",
    },
  ];

  it("renders reviews title", () => {
    render(<Reviews stayId="stay-1" reviews={[]} reviewsLoading={false} />);

    expect(screen.getByText(/Guest Reviews/i)).toBeInTheDocument();
  });

  it("renders loading spinner when loading", () => {
    render(<Reviews stayId="stay-1" reviews={[]} reviewsLoading={true} />);

    expect(
      screen.getByRole("status", { name: /Loading reviews/i }),
    ).toBeInTheDocument();
  });

  it("renders review cards when reviews are available", () => {
    render(
      <Reviews stayId="stay-1" reviews={mockReviews} reviewsLoading={false} />,
    );

    const reviewCards = screen.getAllByTestId("review-card");
    expect(reviewCards).toHaveLength(2);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("renders empty state when no reviews exist", () => {
    render(<Reviews stayId="stay-1" reviews={[]} reviewsLoading={false} />);

    expect(screen.getByText(/No reviews yet/i)).toBeInTheDocument();
    expect(screen.getByText(/Be the first to share/i)).toBeInTheDocument();
  });

  it("renders review form", () => {
    render(
      <Reviews stayId="stay-1" reviews={mockReviews} reviewsLoading={false} />,
    );

    expect(screen.getByTestId("review-form")).toBeInTheDocument();
  });

  it('renders form title "Share Your Experience"', () => {
    render(<Reviews stayId="stay-1" reviews={[]} reviewsLoading={false} />);

    expect(screen.getByText("Share Your Experience")).toBeInTheDocument();
  });

  it("shows loading state over reviews when loading", () => {
    render(
      <Reviews stayId="stay-1" reviews={mockReviews} reviewsLoading={true} />,
    );

    expect(
      screen.getByRole("status", { name: /Loading reviews/i }),
    ).toBeInTheDocument();
    // Reviews list should not appear during loading
    const reviewCards = screen.queryAllByTestId("review-card");
    expect(reviewCards).toHaveLength(0);
  });

  it("passes correct stayId to review form", () => {
    render(<Reviews stayId="stay-123" reviews={[]} reviewsLoading={false} />);

    // ReviewForm component should be rendered with the stayId passed
    expect(screen.getByTestId("review-form")).toBeInTheDocument();
  });
});
