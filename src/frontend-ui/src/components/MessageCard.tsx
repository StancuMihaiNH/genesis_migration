"use client";
import React, { useRef, useState } from "react";
import Avatar from "@/components/Avatar";
import { fromUnixTime, format } from "date-fns";
import { DATE_TIME_FORMAT } from "@/constants";
import classNames from "classnames";
import FileIcon from "@/components/FileIcon";
import { marked } from "marked";
import {
  RiEditBoxLine,
  RiErrorWarningLine,
  RiRobot3Line,
} from "react-icons/ri";
import Copy from "@/components/Copy";
import Modal from "@/components/Modal";
import EditMessage from "@/components/EditMessage";
import MessageSelection from "@/components/MessageSelection";
import { Message, File as FileObj, User } from "@/graphql/__generated__/schema";
import { getModelName } from "@/Models";
import { createPortal } from "react-dom";
import FileDrawer from "@/components/FileDrawer";

const process = (txt: string) => {
  const regex = /^\[.*?}(?=])/;
  const match = txt.match(regex);
  if (match && match[0]) {
    return txt.replace(`${match[0]}]`, "");
  }
  return txt;
};

const MessageCard: React.FC<{
  topicId: string;
  message: Message;
  containerRef: React.RefObject<HTMLDivElement>;
  onRefetch?: () => void;
  handleResend: () => void;
  viewer?: User | null;
}> = ({ viewer, message, topicId, containerRef, onRefetch, handleResend }) => {
  const [file, setFile] = useState<FileObj>();
  const [showEdit, setShowEdit] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  //const { rewriteMessage } = useMessageStore();
  const handleRewrite = (start: number, end: number) => {
    // rewriteMessage(topicId, message.id, start, end);
  };

  return (
    <>
      <div
        className={classNames("flex flex-col gap-2  p-4 group/item", {
          "items-start": message.role === "assistant",
          "items-end": message.role === "user",
        })}
      >
        <Avatar user={viewer} role={message.role} />
        <div
          className={classNames("flex flex-col", {
            "items-start": message.role === "assistant",
            "items-end": message.role === "user",
          })}
        >
          <div
            ref={ref}
            className={"message-card text-[#132e53] text-lg overflow-x-auto"}
            dangerouslySetInnerHTML={{
              __html: marked(process(message?.content || "")),
            }}
          />
          {message.files && message.files.length > 0 && (
            <div className={"flex flex-row gap-2 flex-wrap py-2"}>
              {message.files?.map((file, index) => (
                <button
                  onClick={() => setFile(file)}
                  type={"button"}
                  key={index}
                  className={
                    "flex items-center gap-2 border rounded p-2 text-[#132e53]"
                  }
                >
                  <div className={"bg-[#dee22a] text-white p-2 rounded"}>
                    <FileIcon type={file.contentType} />
                  </div>
                  {file.filename}
                </button>
              ))}
            </div>
          )}
          <div className={"text-[12px] flex items-center gap-2"}>
            <p>{format(fromUnixTime(message.createdAt), DATE_TIME_FORMAT)}</p>

            {message.role === "assistant" && (
              <div
                className={
                  "flex items-center gap-1 text-xs px-1 rounded-md border border-[#132e53] bg-[#132e53] text-white transition-all duration-200 ease-in-out shadow"
                }
              >
                <RiRobot3Line />
                {getModelName(message.model || "gpt-4")}
              </div>
            )}
          </div>
          {message.sourceDocuments && message.sourceDocuments.length > 0 && (
            <>
              <h4 className="font-bold mt-4">Citations:</h4>
              <div className={"flex flex-row gap-2 flex-wrap py-2"}>
                {message.sourceDocuments?.map((file, index) => (
                  <div
                    key={index}
                    className={
                      "flex-row items-center gap-2 border rounded p-2 text-[#132e53]"
                    }
                  >
                    <div
                      className={
                        "bg-white text-[#1a243b] italic text-sm p-2 rounded mb-2"
                      }
                    >
                      <span>{file.filename}</span>
                    </div>
                    <div className="px-4 break-all">{file.content}</div>
                  </div>
                ))}
              </div>
            </>
          )}
          {message.localStatusError && (
            <div className={"flex items-center"}>
              <button
                onClick={handleResend}
                className={"p-2 flex  items-center gap-1 text-red-500 text-sm"}
              >
                <RiErrorWarningLine size={20} className={"text-red-500"} />
                Resend
              </button>
            </div>
          )}
          <div
            className={
              "flex items-center gap-2 mt-2 invisible group-hover/item:visible"
            }
          >
            <Copy message={message.content} />
            {message.role === "user" && (
              <button
                onClick={() => setShowEdit(true)}
                className={classNames(
                  "flex items-center gap-1 text-[#132e53] text-xs px-1 rounded-md border border-[#132e53] hover:bg-[#132e53] hover:text-white transition-all duration-200 ease-in-out shadow",
                )}
              >
                <RiEditBoxLine /> Edit
              </button>
            )}
          </div>
        </div>
      </div>
      <Modal
        title={"Edit message"}
        open={showEdit}
        onClose={() => setShowEdit(false)}
      >
        <EditMessage
          onRefetch={onRefetch}
          topicId={topicId}
          onClose={() => setShowEdit(false)}
          message={message}
        />
      </Modal>
      {message.role === "assistant" && (
        <MessageSelection
          onRewrite={handleRewrite}
          containerRef={containerRef}
          parentRef={ref}
        />
      )}
      {file &&
        createPortal(
          <FileDrawer file={file} onClose={() => setFile(undefined)} />,
          document.body,
        )}
    </>
  );
};

export default MessageCard;
