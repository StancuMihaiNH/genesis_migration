declare global {
  interface Window {
    pdfjsLib: typeof import("pdfjs-dist/types/src/display/api");
  }
}

export {};
