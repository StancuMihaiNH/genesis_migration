"use client";
import React, { useEffect } from "react";
const ConfirmButton: React.FC<{
  title: string;
  confirmTitle: string;
  onConfirm: () => void;
  className?: string;
}> = ({ title, confirmTitle, onConfirm, className }) => {
  const [isConfirming, setIsConfirming] = React.useState(false);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (isConfirming) {
        setIsConfirming(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [isConfirming]);
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (isConfirming) {
          onConfirm();
          setIsConfirming(false);
        } else {
          setIsConfirming(true);
        }
      }}
      className={className}
    >
      {isConfirming ? confirmTitle : title}
    </button>
  );
};

export default ConfirmButton;
