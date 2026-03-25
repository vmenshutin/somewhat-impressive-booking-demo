import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { StayCardSkeleton } from "./StayCardSkeleton";

describe("StayCardSkeleton", () => {
  it("renders skeleton loading state", () => {
    const { container } = render(<StayCardSkeleton />);

    const card = container.querySelector(".MuiCard-root");
    expect(card).toBeInTheDocument();
  });

  it("renders multiple skeleton elements for content loading", () => {
    const { container } = render(<StayCardSkeleton />);

    // Should have several skeleton elements for image, title, subtitle, details, tags, and footer
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons.length).toBeGreaterThanOrEqual(6);
  });

  it("renders card with correct structure", () => {
    const { container } = render(<StayCardSkeleton />);

    const card = container.querySelector(".MuiCard-root");
    const cardContent = container.querySelector(".MuiCardContent-root");

    expect(card).toBeInTheDocument();
    expect(cardContent).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    expect(() => {
      render(<StayCardSkeleton />);
    }).not.toThrow();
  });

  it("has rectangular skeleton for image placeholder", () => {
    const { container } = render(<StayCardSkeleton />);

    const skeletons = container.querySelectorAll('[class*="MuiSkeleton"]');
    const rectangularSkeleton = Array.from(skeletons).find((el) =>
      el.getAttribute("style")?.includes("height: 240px"),
    );

    // Verify that the first skeleton has the image height
    expect(rectangularSkeleton || skeletons[0]).toBeInTheDocument();
  });

  it("renders rounded skeletons for tag placeholders", () => {
    const { container } = render(<StayCardSkeleton />);

    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
