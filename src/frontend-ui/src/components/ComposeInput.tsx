"use client";
import React, { useEffect, useMemo, useRef, useState, DragEvent } from "react";
import { BsPaperclip, BsX, BsMagic } from "react-icons/bs";
import { RiRobot3Line } from "react-icons/ri";
import TextareaAutosize from "react-textarea-autosize";
import FileIcon from "@/components/FileIcon";
import {
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { models } from "@/Models";
import classNames from "classnames";
import Prompts from "@/components/Prompts";
import { Prompt } from "@/graphql/__generated__/schema";
import EventEmitter, { EVENT } from "@/events";
import { FiArrowUp } from "react-icons/fi";

const ComposeInput: React.FC<{
  isSending?: boolean;
  onSend: (message: string, files?: File[]) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  prompts: Prompt[];
  onStopStream?: () => void;
}> = ({
  onSend,
  isSending,
  selectedModel,
  onModelChange,
  prompts,
  onStopStream,
}) => {
  const [showPrompts, setShowPrompts] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [input, setInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isOpenModelPicker, setIsOpenModelPicker] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpenModelPicker,
    onOpenChange: setIsOpenModelPicker,
    placement: "top-start",
  });
  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps } = useInteractions([click, dismiss]);

  useEffect(() => {
    if (input.startsWith("/")) {
      // show prompts
      setShowPrompts(true);
    } else {
      setShowPrompts(false);
    }
  }, [input]);

  const handleSend = async () => {
    if (isSending) {
      onStopStream?.();
      return;
    }
    onSend(input, files);
    setInput("");
    setFiles([]);
  };

  const filterPrompts = useMemo(() => {
    // remove the / from the input
    const query = input.slice(1).toLowerCase();
    return prompts.filter(
      (prompt) =>
        prompt.title.toLowerCase().includes(query) ||
        prompt.description.toLowerCase().includes(query),
    );
  }, [input, prompts]);

  useEffect(() => {
    EventEmitter.subscribe(EVENT.VALUE_CHANGE, (str: string) => {
      setInput(str);
    });
  }, []);

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const droppedFiles = Array.from(event.dataTransfer.files);
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const allowExtensions = /(\.pdf|\.doc|\.docx|\.txt)$/i;
    for (const file of droppedFiles) {
      if (file.size > MAX_FILE_SIZE) {
        alert("File is too large. Please upload files less than 5MB");
        return;
      }
      if (!allowExtensions.test(file.name)) {
        alert(
          "Invalid file extension. Please upload only PDF, DOC, DOCX, or TXT files",
        );
        return;
      }
    }
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  return (
    <>
      {showPrompts && (
        <div className={"p-4 flex gap-4"}>
          <Prompts
            prompts={filterPrompts}
            onPromptSelect={(p) => {
              setInput(p);
              setShowPrompts(false);
            }}
          />
        </div>
      )}
      <div
        className={"p-3 shadow border border-gray-200"}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          disabled={isSending}
          className={"hidden"}
          multiple
          onChange={(e) => {
            // validate files and  only low up to 5MB each
            const allowExtensions = /(\.pdf|\.doc|\.docx|\.txt)$/i;
            const _files = Array.from(e.target.files || []);
            const MAX_FILE_SIZE = 5 * 1024 * 1024;
            for (const file of _files) {
              if (file.size > MAX_FILE_SIZE) {
                alert("File is too large. Please upload files less than 5MB");
                fileRef.current!.value = "";
                return;
              }
              if (!allowExtensions.test(file.name)) {
                alert(
                  "Invalid file extension. Please upload only PDF, DOC, DOCX, or TXT files",
                );
                fileRef.current!.value = "";
                return;
              }
            }
            setFiles((prev) => [...prev, ..._files]);
            // clear the input
            fileRef.current!.value = "";
          }}
          type={"file"}
          accept={
            "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          }
          ref={fileRef}
        />
        <div className={"pb-3 flex gap-3"}>
          {isOpenModelPicker && (
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              className={"rounded py-2"}
            >
              <div className={"rounded bg-gray-100"}>
                {models.map((model, index) => (
                  <button
                    onClick={() => {
                      onModelChange(model.id);
                      setIsOpenModelPicker(false);
                    }}
                    key={model.id}
                    className={classNames(
                      "flex gap-4 items-center justify-between w-full p-2 hover:opacity-60",
                      {
                        "border-b border-gray-300": index !== models.length - 1,
                        "rounded-t-[10px]": index === 0,
                        "rounded-b-[10px]": index === models.length - 1,
                      },
                    )}
                  >
                    <span className={"text-[#132e53] font-semibold text-sm"}>
                      {model.displayName}
                    </span>
                    <span
                      className={classNames(
                        "w-2 h-2 bg-[#039fb8] rounded-full",
                        {
                          "opacity-100": selectedModel === model.id,
                          "opacity-0": selectedModel !== model.id,
                        },
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
          <button
            ref={refs.setReference}
            {...getReferenceProps()}
            type={"button"}
            className={
              "p-1 rounded-[10px] hover:bg-gray-200 text-[#132e53] bg-gray-100 gap-2 items-center px-2 inline-flex shadow overflow-x-hidden transition hover:delay-100"
            }
          >
            <span className={"w-5 h-5"}>
              <RiRobot3Line size={20} />
            </span>
            <span className={"text-[#132e53] font-semibold text-sm"}>
              {selectedModel}
            </span>
          </button>
          <button
            onClick={() => {
              if (!showPrompts) {
                setInput("/");
                inputRef.current?.focus();
              } else {
                setInput("");
              }
            }}
            type={"button"}
            className={
              "p-1 rounded-[10px] hover:bg-gray-200 text-[#132e53] bg-gray-100 gap-2 items-center px-2 inline-flex shadow w-[35px] overflow-x-hidden transition hover:delay-100 hover:w-[100px]"
            }
          >
            <span className={"w-5 h-5"}>
              <BsMagic size={20} />
            </span>
            <span className={"text-[#132e53] font-semibold text-sm"}>
              Prompts
            </span>
          </button>
        </div>
        <div
          className={"shadow p-3 border-t  flex flex-col gap-2 rounded-[10px]"}
        >
          {files.length > 0 && (
            <div className={"flex flex-row gap-2 flex-wrap p-2"}>
              {files.map((file, index) => (
                <div
                  key={index}
                  className={"flex items-center gap-2 border rounded p-2"}
                >
                  <div className={"bg-[#dee22a] text-white p-2 rounded"}>
                    <FileIcon type={file.type} />
                  </div>
                  <span className={"text-sm"}>{file.name}</span>
                  <button
                    type={"button"}
                    className={"text-red-500"}
                    onClick={() => {
                      setFiles((prev) => prev.filter((_, i) => i !== index));
                    }}
                  >
                    <BsX size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className={"flex flex-1 items-end justify-end"}>
            <div className={"flex flex-1 items-center gap-2"}>
              <button
                disabled={isSending}
                onClick={() => {
                  fileRef.current?.click();
                }}
                className={
                  "p-2 rounded-full hover:bg-gray-200 mr-2 text-[#132e53] disabled:opacity-50"
                }
              >
                <BsPaperclip size={24} />
              </button>
              <TextareaAutosize
                id={"new-message-textarea"}
                ref={inputRef}
                placeholder={"Type a message"}
                className={"flex-1 resize-none p-2 outline-0 text-[#132e53]"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                // check keyboard if command + enter is pressed
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    if (e.shiftKey) {
                      // add a newline
                      return;
                    } else {
                      e.preventDefault();
                      await handleSend();
                    }
                  }
                }}
              />
            </div>
            {isSending ? (
              <button
                onClick={() => {
                  onStopStream?.();
                }}
                className={
                  "w-10 h-10 bg-primary rounded-full flex items-center justify-center"
                }
              >
                <div className={"w-3 h-3 bg-white animate-pulse"} />
              </button>
            ) : (
              <button
                disabled={(!input && files.length === 0) || isSending}
                onClick={handleSend}
                className={
                  "rounded-full w-10 h-10 flex items-center justify-center bg-primary text-white font-semibold hover:opacity-90 disabled:opacity-50"
                }
              >
                <FiArrowUp size={24} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ComposeInput;
