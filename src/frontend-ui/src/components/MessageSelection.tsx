"use client";
import React from "react";
import { createPortal } from "react-dom";
import useTextSelection from "@/hooks/useTextSelection";
import { RiRefreshFill } from "react-icons/ri";
import Copy from "@/components/Copy";
import EventEmitter, { EVENT } from "@/events";

const MessageSelection: React.FC<{
  parentRef: React.RefObject<HTMLElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  onRewrite: (start: number, end: number) => void;
}> = ({ parentRef, containerRef, onRewrite }) => {
  const { clientRect, start, end, isCollapsed, textContent, showSelection } =
    useTextSelection(containerRef.current!, parentRef.current!);
  if (!clientRect || isCollapsed) return null;
  let left = clientRect.left;
  if (left < 0) {
    left += 40;
  }
  if (left + 200 > window.innerWidth) {
    left -= 150;
  }
  return createPortal(
    <div
      className={"flex items-center gap-2"}
      style={{
        position: "absolute",
        top: `${clientRect?.top - 30}px`,
        left: `${left}px`,
        height: clientRect?.height,
      }}
    >
      <Copy className={"bg-white"} message={textContent ?? ""} />
      <button
        onClick={() => {
          if (!textContent) {
            alert("Please select text to rewrite");
            return;
          }
          EventEmitter.dispatch(EVENT.VALUE_CHANGE, textContent);
        }}
        className="bg-white flex items-center gap-1 text-[#132e53] text-xs px-1 rounded-md border border-[#132e53] hover:bg-[#132e53] hover:text-white transition-all duration-200 ease-in-out shadow"
      >
        <RiRefreshFill />
        Rewrite
      </button>
    </div>,
    document.body,
  );
};

export default MessageSelection;
