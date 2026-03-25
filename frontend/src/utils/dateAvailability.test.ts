import { describe, it, expect } from "vitest";
import { isDateAvailable, AvailabilityRange } from "./dateAvailability";

describe("dateAvailability utils", () => {
  const ranges: AvailabilityRange[] = [
    { start: "2026-04-01", end: "2026-04-05" },
    { start: "2026-04-10", end: "2026-04-15" },
  ];

  it("returns true for a date inside a range", () => {
    expect(isDateAvailable(new Date("2026-04-03T10:00:00"), ranges)).toBe(true);
  });

  it("returns true on inclusive range boundaries", () => {
    expect(isDateAvailable(new Date("2026-04-01T00:00:00"), ranges)).toBe(true);
    expect(isDateAvailable(new Date("2026-04-15T23:59:59"), ranges)).toBe(true);
  });

  it("returns false for a date outside all ranges", () => {
    expect(isDateAvailable(new Date("2026-04-08T12:00:00"), ranges)).toBe(
      false,
    );
  });

  it("returns false when range dates are invalid", () => {
    const invalidRanges: AvailabilityRange[] = [
      { start: "not-a-date", end: "2026-04-05" },
      { start: "2026-04-10", end: "2026-99-99" },
    ];

    expect(
      isDateAvailable(new Date("2026-04-03T10:00:00"), invalidRanges),
    ).toBe(false);
  });

  it("normalizes time and compares by day only", () => {
    expect(isDateAvailable(new Date("2026-04-05T23:59:59"), ranges)).toBe(true);
    expect(isDateAvailable(new Date("2026-03-31T23:59:59"), ranges)).toBe(
      false,
    );
  });
});
