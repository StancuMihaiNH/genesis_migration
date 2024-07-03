import React from "react";
import { RiClipboardLine } from "react-icons/ri";
import classNames from "classnames";

const Copy: React.FC<{
  message: string;
  className?: string;
}> = ({ message, className }) => {
  const [showAnimation, setShowAnimation] = React.useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
    setShowAnimation(true);
    setTimeout(() => {
      setShowAnimation(false);
    }, 2000);
  };
  return (
    <button
      className={classNames(
        "flex items-center gap-1 text-[#132e53] text-xs px-1 rounded-md border border-[#132e53] hover:bg-[#132e53] hover:text-white transition-all duration-200 ease-in-out shadow",
        className,
      )}
      onClick={copyToClipboard}
    >
      <RiClipboardLine />
      {showAnimation ? "Copied!" : "Copy"}
    </button>
  );
};

export default Copy;
