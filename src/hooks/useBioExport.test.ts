import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useBioExport } from "./useBioExport";

afterEach(() => vi.restoreAllMocks());

describe("useBioExport", () => {
  const setupAnchorMock = () => {
    const clickMock = vi.fn();
    const realCreate = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "a") {
        const el = realCreate("a");
        el.click = clickMock;
        return el;
      }
      // Restore for all other elements to avoid recursion
      vi.mocked(document.createElement).mockRestore();
      vi.spyOn(document, "createElement").mockImplementation((t: string) => {
        if (t === "a") { const a2 = realCreate("a"); a2.click = clickMock; return a2; }
        return realCreate(t);
      });
      return realCreate(tag);
    });
    return clickMock;
  };

  it("exportSingleBio triggers a download click", () => {
    const clickMock = setupAnchorMock();
    const { result } = renderHook(() => useBioExport());
    act(() => result.current.exportSingleBio("My bio text", 0));
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
  });

  it("exportAllBios triggers a download click", () => {
    const clickMock = setupAnchorMock();
    const { result } = renderHook(() => useBioExport());
    act(() => result.current.exportAllBios(["Bio 1", "Bio 2"]));
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
  });
});
