import { describe, expect, it } from "vitest";
import { formatReleaseYear, formatRuntime, formatRating } from "@/lib/utils";

describe("formatting helpers", () => {
  it("formats release year", () => {
    expect(formatReleaseYear("2010-07-16")).toBe(2010);
    expect(formatReleaseYear(undefined)).toBe("N/A");
  });

  it("formats runtime", () => {
    expect(formatRuntime(148)).toBe("2h 28m");
    expect(formatRuntime(50)).toBe("50m");
  });

  it("formats ratings", () => {
    expect(formatRating(8.456)).toBe("8.5");
    expect(formatRating(undefined)).toBe("-");
  });
});
