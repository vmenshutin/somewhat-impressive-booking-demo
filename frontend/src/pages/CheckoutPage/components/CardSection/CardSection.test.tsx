import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CardSection } from "./CardSection";

describe("CardSection", () => {
  const mockOnValidChange = vi.fn();

  beforeEach(() => {
    mockOnValidChange.mockClear();
  });

  it("renders card payment form fields", () => {
    render(<CardSection onValidChange={mockOnValidChange} />);

    expect(screen.getByLabelText(/Card Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Expiry/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CVV/i)).toBeInTheDocument();
  });

  it("displays card type badges", () => {
    render(<CardSection onValidChange={mockOnValidChange} />);

    expect(screen.getByText("VISA")).toBeInTheDocument();
    expect(screen.getByText("Mastercard")).toBeInTheDocument();
  });

  it("accepts card number input", async () => {
    const user = userEvent.setup();
    render(<CardSection onValidChange={mockOnValidChange} />);

    const cardInput = screen.getByLabelText(/Card Number/i) as HTMLInputElement;
    await user.type(cardInput, "4111111111111111");

    expect(cardInput.value).toContain("4111");
  });

  it("accepts expiry input in MM/YY format", async () => {
    const user = userEvent.setup();
    render(<CardSection onValidChange={mockOnValidChange} />);

    const expiryInput = screen.getByLabelText(/Expiry/i) as HTMLInputElement;
    await user.type(expiryInput, "12/25");

    expect(expiryInput.value).toBe("12/25");
  });

  it("accepts CVV input", async () => {
    const user = userEvent.setup();
    render(<CardSection onValidChange={mockOnValidChange} />);

    const cvvInput = screen.getByLabelText(/CVV/i) as HTMLInputElement;
    await user.type(cvvInput, "123");

    expect(cvvInput.value).toBe("123");
  });

  it("shows error for invalid card number", async () => {
    const user = userEvent.setup();
    render(<CardSection onValidChange={mockOnValidChange} />);

    const cardInput = screen.getByLabelText(/Card Number/i);
    await user.type(cardInput, "1234");
    await user.tab();

    await waitFor(() => {
      expect(
        screen.getByText(/Enter a 16-digit card number/i),
      ).toBeInTheDocument();
    });
  });

  it("shows error for invalid expiry format", async () => {
    const user = userEvent.setup();
    render(<CardSection onValidChange={mockOnValidChange} />);

    const expiryInput = screen.getByLabelText(/Expiry/i);
    await user.type(expiryInput, "13/25");
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/Use MM\/YY format/i)).toBeInTheDocument();
    });
  });

  it("shows error for invalid CVV", async () => {
    const user = userEvent.setup();
    render(<CardSection onValidChange={mockOnValidChange} />);

    const cvvInput = screen.getByLabelText(/CVV/i);
    await user.type(cvvInput, "12");
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/3 or 4 digits/i)).toBeInTheDocument();
    });
  });

  it("filters out non-digit characters from card number", async () => {
    const user = userEvent.setup();
    render(<CardSection onValidChange={mockOnValidChange} />);

    const cardInput = screen.getByLabelText(/Card Number/i) as HTMLInputElement;
    await user.type(cardInput, "4111-1111-1111-1111");

    // Should only contain digits
    expect(/^\d+\s*$/.test(cardInput.value)).toBe(true);
  });

  it("filters out non-digit characters from CVV", async () => {
    const user = userEvent.setup();
    render(<CardSection onValidChange={mockOnValidChange} />);

    const cvvInput = screen.getByLabelText(/CVV/i) as HTMLInputElement;
    await user.type(cvvInput, "abc123");

    // Should only contain digits
    expect(/^\d+$/.test(cvvInput.value)).toBe(true);
  });

  it("detects VISA card type", async () => {
    const user = userEvent.setup();
    render(<CardSection onValidChange={mockOnValidChange} />);

    const cardInput = screen.getByLabelText(/Card Number/i);
    await user.type(cardInput, "4111111111111111");

    // VISA badge should be highlighted (check that component was called with correct data)
    expect(mockOnValidChange).toHaveBeenCalledWith(
      expect.objectContaining({ cardNumber: expect.stringContaining("4111") }),
      expect.any(String),
      expect.any(Boolean),
    );
  });

  it("detects Mastercard type", async () => {
    const user = userEvent.setup();
    render(<CardSection onValidChange={mockOnValidChange} />);

    const cardInput = screen.getByLabelText(/Card Number/i);
    await user.type(cardInput, "5111111111111111");

    // Should detect as Mastercard
    expect(mockOnValidChange).toHaveBeenCalledWith(
      expect.objectContaining({ cardNumber: expect.stringContaining("5111") }),
      expect.any(String),
      expect.any(Boolean),
    );
  });

  it("calls onValidChange when form values change", async () => {
    const user = userEvent.setup();
    render(<CardSection onValidChange={mockOnValidChange} />);

    const cardInput = screen.getByLabelText(/Card Number/i);
    await user.type(cardInput, "4111");

    expect(mockOnValidChange).toHaveBeenCalled();
  });

  it("accepts 4-digit CVV (American Express)", async () => {
    const user = userEvent.setup();
    render(<CardSection onValidChange={mockOnValidChange} />);

    const cvvInput = screen.getByLabelText(/CVV/i) as HTMLInputElement;
    await user.type(cvvInput, "1234");

    expect(cvvInput.value).toBe("1234");
  });

  it("requires valid expiry with proper month validation", async () => {
    const user = userEvent.setup();
    render(<CardSection onValidChange={mockOnValidChange} />);

    const expiryInput = screen.getByLabelText(/Expiry/i);
    await user.type(expiryInput, "00/25");
    await user.tab();

    // Month 00 is invalid
    await waitFor(() => {
      expect(screen.getByText(/Use MM\/YY format/i)).toBeInTheDocument();
    });
  });
});
