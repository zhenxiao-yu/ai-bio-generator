import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useBioExport } from "./useBioExport";

describe("useBioExport", () => {
  let anchorClickMock: ReturnType<typeof vi.fn>;
  let originalCreate: typeof document.createElement;

  beforeEach(() => {
    anchorClickMock = vi.fn();
    originalCreate = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "a") {
        const el = originalCreate("a");
        el.click = anchorClickMock;
        return el;
      }
      return originalCreate(tag);
    });
  });

  it("exportSingleBio triggers a download with the bio text", () => {
    const { result } = renderHook(() => useBioExport());
    act(() => result.current.exportSingleBio("My bio text", 0));
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(anchorClickMock).toHaveBeenCalled();
  });

  it("exportAllBios triggers a download combining all bios", () => {
    const { result } = renderHook(() => useBioExport());
    act(() => result.current.exportAllBios(["Bio 1", "Bio 2"]));
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(anchorClickMock).toHaveBeenCalled();
  });
});
