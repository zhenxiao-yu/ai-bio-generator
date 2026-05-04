"use client";

export function useBioExport() {
  const downloadText = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportSingleBio = (text: string, index: number) => {
    downloadText(text, `bio-${index + 1}.txt`);
  };

  const exportAllBios = (bios: string[]) => {
    const content = bios
      .map((bio, i) => `--- Bio ${i + 1} ---\n${bio}`)
      .join("\n\n");
    downloadText(content, "bios.txt");
  };

  return { exportSingleBio, exportAllBios };
}
