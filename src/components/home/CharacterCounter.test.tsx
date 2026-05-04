import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CharacterCounter from "./CharacterCounter";

describe("CharacterCounter", () => {
  it("renders count and limit", () => {
    render(<CharacterCounter count={50} limit={160} />);
    expect(screen.getByText("50/160")).toBeInTheDocument();
  });

  it("shows overflow amount when over limit", () => {
    render(<CharacterCounter count={170} limit={160} />);
    expect(screen.getByText("(+10)")).toBeInTheDocument();
  });

  it("has accessible aria-label", () => {
    render(<CharacterCounter count={80} limit={160} />);
    expect(screen.getByLabelText("80 of 160 characters")).toBeInTheDocument();
  });

  it("applies warning style at 80% threshold", () => {
    const { container } = render(<CharacterCounter count={128} limit={160} />);
    const span = container.firstChild as HTMLElement;
    expect(span.className).toMatch(/yellow/);
  });

  it("applies destructive style when over limit", () => {
    const { container } = render(<CharacterCounter count={161} limit={160} />);
    const span = container.firstChild as HTMLElement;
    expect(span.className).toMatch(/destructive/);
  });

  it("applies muted style when under 80%", () => {
    const { container } = render(<CharacterCounter count={50} limit={160} />);
    const span = container.firstChild as HTMLElement;
    expect(span.className).toMatch(/muted/);
  });
});
