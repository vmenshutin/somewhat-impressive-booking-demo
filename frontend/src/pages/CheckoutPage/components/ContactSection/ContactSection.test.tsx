import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactSection } from "./ContactSection";

describe("ContactSection", () => {
  const mockOnValidChange = vi.fn();
  const mockOnContinue = vi.fn();

  beforeEach(() => {
    mockOnValidChange.mockClear();
    mockOnContinue.mockClear();
  });

  it("renders all contact input fields", () => {
    render(
      <ContactSection
        onValidChange={mockOnValidChange}
        onContinue={mockOnContinue}
      />,
    );

    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  });

  it("renders continue button", () => {
    render(
      <ContactSection
        onValidChange={mockOnValidChange}
        onContinue={mockOnContinue}
      />,
    );

    expect(
      screen.getByRole("button", { name: /Continue/i }),
    ).toBeInTheDocument();
  });

  it("continue button is disabled initially", () => {
    render(
      <ContactSection
        onValidChange={mockOnValidChange}
        onContinue={mockOnContinue}
      />,
    );

    const continueButton = screen.getByRole("button", { name: /Continue/i });
    expect(continueButton).toBeDisabled();
  });

  it("accepts first name input", async () => {
    const user = userEvent.setup();
    render(
      <ContactSection
        onValidChange={mockOnValidChange}
        onContinue={mockOnContinue}
      />,
    );

    const firstNameInput = screen.getByLabelText(
      /First Name/i,
    ) as HTMLInputElement;
    await user.type(firstNameInput, "John");

    expect(firstNameInput.value).toBe("John");
  });

  it("accepts last name input", async () => {
    const user = userEvent.setup();
    render(
      <ContactSection
        onValidChange={mockOnValidChange}
        onContinue={mockOnContinue}
      />,
    );

    const lastNameInput = screen.getByLabelText(
      /Last Name/i,
    ) as HTMLInputElement;
    await user.type(lastNameInput, "Doe");

    expect(lastNameInput.value).toBe("Doe");
  });

  it("accepts email input", async () => {
    const user = userEvent.setup();
    render(
      <ContactSection
        onValidChange={mockOnValidChange}
        onContinue={mockOnContinue}
      />,
    );

    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;
    await user.type(emailInput, "john@example.com");

    expect(emailInput.value).toBe("john@example.com");
  });

  it("shows error for missing first name after blur", async () => {
    const user = userEvent.setup();
    render(
      <ContactSection
        onValidChange={mockOnValidChange}
        onContinue={mockOnContinue}
      />,
    );

    const firstNameInput = screen.getByLabelText(/First Name/i);
    await user.click(firstNameInput);
    await user.tab();

    // Error should appear after blur
    await waitFor(() => {
      expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
    });
  });

  it("shows error for invalid email format", async () => {
    const user = userEvent.setup();
    render(
      <ContactSection
        onValidChange={mockOnValidChange}
        onContinue={mockOnContinue}
      />,
    );

    const emailInput = screen.getByLabelText(/Email/i);
    await user.type(emailInput, "invalid-email");
    await user.tab();

    await waitFor(() => {
      expect(
        screen.getByText(/Enter a valid email address/i),
      ).toBeInTheDocument();
    });
  });

  it("enables continue button when form is valid", async () => {
    const user = userEvent.setup();
    render(
      <ContactSection
        onValidChange={mockOnValidChange}
        onContinue={mockOnContinue}
      />,
    );

    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    const emailInput = screen.getByLabelText(/Email/i);

    await user.type(firstNameInput, "John");
    await user.type(lastNameInput, "Doe");
    await user.type(emailInput, "john@example.com");

    const continueButton = screen.getByRole("button", { name: /Continue/i });
    // After valid input, button should be enabled
    expect(continueButton).not.toBeDisabled();
  });

  it("calls onValidChange when values change", async () => {
    const user = userEvent.setup();
    render(
      <ContactSection
        onValidChange={mockOnValidChange}
        onContinue={mockOnContinue}
      />,
    );

    const firstNameInput = screen.getByLabelText(/First Name/i);
    await user.type(firstNameInput, "John");

    expect(mockOnValidChange).toHaveBeenCalled();
  });

  it("calls onContinue when continue button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <ContactSection
        onValidChange={mockOnValidChange}
        onContinue={mockOnContinue}
      />,
    );

    // Fill form to make button enabled
    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    const emailInput = screen.getByLabelText(/Email/i);

    await user.type(firstNameInput, "John");
    await user.type(lastNameInput, "Doe");
    await user.type(emailInput, "john@example.com");

    const continueButton = screen.getByRole("button", { name: /Continue/i });
    await user.click(continueButton);

    expect(mockOnContinue).toHaveBeenCalled();
  });

  it("accepts valid email formats", async () => {
    const user = userEvent.setup();
    render(
      <ContactSection
        onValidChange={mockOnValidChange}
        onContinue={mockOnContinue}
      />,
    );

    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;
    await user.type(emailInput, "test.user+tag@example.co.uk");

    expect(emailInput.value).toBe("test.user+tag@example.co.uk");
  });
});
