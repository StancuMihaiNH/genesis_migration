import React from "react";
import * as PopoverCore from "@radix-ui/react-popover";
import { RiCloseLine } from "react-icons/ri";
import classNames from "classnames";

const Popover: React.FC<{
  trigger: React.ReactNode;
  children: React.ReactNode;
  hideCloseButton?: boolean;
  className?: string;
}> = ({ trigger, children, hideCloseButton, className }) => (
  <PopoverCore.Root>
    <PopoverCore.Trigger asChild>{trigger}</PopoverCore.Trigger>
    <PopoverCore.Portal>
      <PopoverCore.Content
        className={classNames(
          "rounded w-[260px] bg-white shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.gray-500)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade",
          className,
        )}
        sideOffset={5}
      >
        {children}
        <PopoverCore.Close
          className={classNames(
            "rounded-full h-[25px] w-[25px] inline-flex items-center justify-center text-violet11 absolute top-[5px] right-[5px] hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 outline-none cursor-default",
            {
              hidden: hideCloseButton,
            },
          )}
          aria-label="Close"
        >
          <RiCloseLine />
        </PopoverCore.Close>
        <PopoverCore.Arrow className="fill-white" />
      </PopoverCore.Content>
    </PopoverCore.Portal>
  </PopoverCore.Root>
);

export default Popover;
