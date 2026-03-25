import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReviewCard } from "./ReviewCard";
import { Review } from "../../../../store/reviewsSlice";

describe("ReviewCard", () => {
  const mockReview: Review = {
    id: "1",
    stayId: "stay-1",
    author: "John Doe",
    rating: 4,
    comment:
      "This was a wonderful stay. The host was very responsive and the location was perfect.",
    date: "2024-03-01",
  };

  it("renders review author name", () => {
    render(<ReviewCard review={mockReview} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders review date", () => {
    render(<ReviewCard review={mockReview} />);

    expect(screen.getByText("2024-03-01")).toBeInTheDocument();
  });

  it("renders review comment", () => {
    render(<ReviewCard review={mockReview} />);

    expect(screen.getByText(mockReview.comment)).toBeInTheDocument();
  });

  it("renders rating correctly", () => {
    render(<ReviewCard review={mockReview} />);

    // MUI Rating renders a readonly rating with aria attributes
    const ratingElement = document.querySelector('[role="img"]');
    expect(ratingElement).toBeInTheDocument();
  });

  it("renders 5-star rating", () => {
    const fiveStarReview = {
      ...mockReview,
      rating: 5,
    };

    render(<ReviewCard review={fiveStarReview} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders 1-star rating", () => {
    const oneStarReview = {
      ...mockReview,
      rating: 1,
    };

    render(<ReviewCard review={oneStarReview} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders card with all content", () => {
    const { container } = render(<ReviewCard review={mockReview} />);

    const card = container.querySelector(".MuiCard-root");
    expect(card).toBeInTheDocument();

    const authorAndDate = screen.getByText("John Doe").parentElement;
    expect(authorAndDate).toBeInTheDocument();
  });

  it("renders with different author names", () => {
    const review2 = {
      ...mockReview,
      author: "Jane Smith",
    };

    render(<ReviewCard review={review2} />);

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("handles long review comments", () => {
    const longCommentReview = {
      ...mockReview,
      comment: "This is a very long review that goes on and on. "
        .repeat(10)
        .trim(),
    };

    render(<ReviewCard review={longCommentReview} />);

    // Use partial text matching for long comments that may wrap
    const shortSubstring = longCommentReview.comment.substring(0, 30);
    expect(screen.getByText(new RegExp(shortSubstring))).toBeInTheDocument();
  });
});
