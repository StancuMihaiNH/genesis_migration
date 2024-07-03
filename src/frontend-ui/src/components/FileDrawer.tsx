import React from "react";
import { File as FileObj } from "@/graphql/__generated__/schema";
import { RiCloseLine } from "react-icons/ri";
import FileContent from "@/components/FileContent";

const FileDrawer: React.FC<{
  file: FileObj;
  onClose: () => void;
}> = ({ file, onClose }) => {
  return (
    <div
      id={"left-drawer"}
      className={
        "fixed top-0 left-0 w-full lg:w-1/3 h-full bg-white transition duration-100 shadow animate-slideDownAndFade"
      }
    >
      <div className={"p-4 h-screen flex flex-col gap-2"}>
        <div className={"border-b border-[#132e53] pb-2"}>
          <div className={"flex justify-between"}>
            <h2 className={"text-[#132e53] text-lg font-bold"}>
              {file.filename}
            </h2>
            <button onClick={onClose}>
              <RiCloseLine size={30} />
            </button>
          </div>
          <a
            target={"_blank"}
            href={file.url || "#"}
            className={"text-xs bg-[#132e53] text-white px-2 py-1 rounded-md"}
          >
            Download
          </a>
        </div>
        <div className={"overflow-y-auto flex-1"}>
          {file.content ? (
            <div className={"whitespace-pre-line"}>{file.content}</div>
          ) : (
            <div>
              {file.contentType === "text/plain" ? (
                <FileContent id={file.id} />
              ) : (
                <div>
                  <p>Sorry, we can't preview this file type.</p>
                  <a
                    target={"_blank"}
                    href={file.url || "#"}
                    className={"text-lg text-blue-600"}
                  >
                    Download file
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileDrawer;
