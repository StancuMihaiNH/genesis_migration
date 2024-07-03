import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { RiCloseFill } from "react-icons/ri";

const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
}> = ({ open, onClose, children, title, description }) => {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          onClose();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
            {title}
          </Dialog.Title>
          <Dialog.Description className="text-[#132e53] mt-[10px] mb-5 text-[15px] leading-normal">
            {description}
          </Dialog.Description>
          {children}
          <Dialog.Close asChild>
            <button
              className="text-[#132e53] absolute top-[10px] right-[10px] inline-flex h-[30px] w-[30px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <RiCloseFill size={24} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
