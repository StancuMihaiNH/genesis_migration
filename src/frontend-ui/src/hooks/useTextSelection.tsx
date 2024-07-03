import { useCallback, useLayoutEffect, useState } from "react";

type ClientRect = Record<keyof Omit<DOMRect, "toJSON">, number>;

function roundValues(_rect: ClientRect) {
  const rect = {
    ..._rect,
  };
  for (const key of Object.keys(rect)) {
    // @ts-ignore
    rect[key] = Math.round(rect[key]);
  }
  return rect;
}

function shallowDiff(prev: any, next: any) {
  if (prev != null && next != null) {
    for (const key of Object.keys(next)) {
      if (prev[key] != next[key]) {
        return true;
      }
    }
  } else if (prev != next) {
    return true;
  }
  return false;
}

type TextSelectionState = {
  clientRect?: ClientRect;
  isCollapsed?: boolean;
  textContent?: string;
  showSelection?: boolean;
  start?: number;
  end?: number;
};

const defaultState: TextSelectionState = {};

export function useTextSelection(
  containerRef: HTMLElement,
  target?: HTMLElement,
) {
  const [
    { clientRect, start, end, isCollapsed, textContent, showSelection },
    setState,
  ] = useState<TextSelectionState>(defaultState);

  const reset = useCallback(() => {
    setState(defaultState);
  }, []);

  const handler = useCallback(
    (event: "selectionchange" | "keyup" | "keydown" | "resize" | "scroll") => {
      let newRect: ClientRect;
      const selection = window.getSelection();
      let newState: TextSelectionState = {
        showSelection: event === "keyup" ?? false,
      };

      if (selection == null || !selection.rangeCount) {
        setState(newState);
        return;
      }

      const range = selection.getRangeAt(0);

      if (target != null && !target.contains(range.commonAncestorContainer)) {
        setState(newState);
        return;
      }

      if (range == null) {
        setState(newState);
        return;
      }

      const contents = range.cloneContents();

      if (contents.textContent != null) {
        newState.textContent = contents.textContent;
        if (range.startContainer && range.endContainer) {
          newState.start = range.startOffset;
          newState.end = range.endOffset;
        }
      }

      const rects = range.getClientRects();

      if (rects.length === 0 && range.commonAncestorContainer != null) {
        const el = range.commonAncestorContainer as HTMLElement;
        newRect = roundValues(el.getBoundingClientRect().toJSON());
      } else {
        if (rects.length < 1) return;
        newRect = roundValues(rects[0].toJSON());
      }
      if (shallowDiff(clientRect, newRect)) {
        newState.clientRect = newRect;
      }
      newState.isCollapsed = range.collapsed;

      if (event === "keyup") {
        newState.showSelection = true;
      }
      setState(newState);
    },
    [target],
  );

  useLayoutEffect(() => {
    document.addEventListener("selectionchange", () =>
      handler("selectionchange"),
    );
    document.addEventListener("keydown", () => handler("keydown"));
    document.addEventListener("keyup", () => handler("keyup"));
    window.addEventListener("resize", () => handler("resize"));

    if (containerRef) {
      containerRef.addEventListener("scroll", () => handler("scroll"));
    }
    return () => {
      document.removeEventListener("selectionchange", () =>
        handler("selectionchange"),
      );
      document.removeEventListener("keydown", () => handler("keydown"));
      document.removeEventListener("keyup", () => handler("keyup"));
      window.removeEventListener("resize", () => handler("resize"));
      if (containerRef) {
        containerRef.removeEventListener("scroll", () => handler("scroll"));
      }
    };
  }, [target, containerRef]);

  return {
    clientRect,
    isCollapsed,
    textContent,
    showSelection,
    start,
    end,
  };
}

export default useTextSelection;
