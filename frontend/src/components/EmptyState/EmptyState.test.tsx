import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EmptyState } from "./EmptyState";

describe("EmptyState component", () => {
  it("should render the empty state message", () => {
    render(<EmptyState />);

    expect(screen.getByText("No stays found")).toBeInTheDocument();
    expect(
      screen.getByText(/No stays match your current filters/),
    ).toBeInTheDocument();
  });

  it("should render the SearchOff icon", () => {
    const { container } = render(<EmptyState />);

    // MUI icons are rendered as SVG
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should render the reset button when onReset is provided", () => {
    const mockReset = vi.fn();
    render(<EmptyState onReset={mockReset} />);

    const button = screen.getByRole("button", { name: /Clear Filters/i });
    expect(button).toBeInTheDocument();
  });

  it("should not render the reset button when onReset is not provided", () => {
    render(<EmptyState />);

    const button = screen.queryByRole("button", { name: /Clear Filters/i });
    expect(button).not.toBeInTheDocument();
  });

  it("should call onReset when the button is clicked", async () => {
    const mockReset = vi.fn();

    render(<EmptyState onReset={mockReset} />);

    const button = screen.getByRole("button", { name: /Clear Filters/i });
    fireEvent.click(button);

    expect(mockReset).toHaveBeenCalledOnce();
  });

  it("should handle multiple clicks on reset button", async () => {
    const mockReset = vi.fn();

    render(<EmptyState onReset={mockReset} />);

    const button = screen.getByRole("button", { name: /Clear Filters/i });
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(mockReset).toHaveBeenCalledTimes(3);
  });

  it("should have proper accessibility attributes", () => {
    render(<EmptyState />);

    const heading = screen.getByRole("heading", { name: /No stays found/i });
    expect(heading).toBeInTheDocument();
  });

  it("should apply correct styling classes", () => {
    const { container } = render(<EmptyState />);

    const boxElement = container.querySelector('[class*="MuiBox"]');
    expect(boxElement).toBeInTheDocument();
  });
});
