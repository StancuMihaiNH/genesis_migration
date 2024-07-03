import React from "react";
import * as TooltipCore from "@radix-ui/react-tooltip";

const Tooltip: React.FC<{
  trigger: React.ReactNode;
  children: React.ReactNode;
  delayDuration?: number;
}> = ({ trigger, children, delayDuration }) => {
  return (
    <TooltipCore.Provider delayDuration={delayDuration}>
      <TooltipCore.Root>
        <TooltipCore.Trigger asChild>{trigger}</TooltipCore.Trigger>
        <TooltipCore.Portal>
          <TooltipCore.Content
            className="max-w-md data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
            sideOffset={5}
          >
            {children}
            <TooltipCore.Arrow className="fill-white" />
          </TooltipCore.Content>
        </TooltipCore.Portal>
      </TooltipCore.Root>
    </TooltipCore.Provider>
  );
};

export default Tooltip;
