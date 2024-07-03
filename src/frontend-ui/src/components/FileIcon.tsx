import React from "react";
import { BsFileText, BsFiletypePdf, BsFileWord } from "react-icons/bs";

const FileIcon: React.FC<{ type: string }> = ({ type }) => {
  if (type === "application/pdf") {
    return <BsFiletypePdf size={24} />;
  }
  if (type === "application/msword") {
    return <BsFileWord size={24} />;
  }
  return <BsFileText size={24} />;
};

export default FileIcon;
