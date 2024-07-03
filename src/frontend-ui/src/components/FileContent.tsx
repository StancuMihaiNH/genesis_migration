import React from "react";
import { useGetFileContentQuery } from "@/graphql/__generated__/schema";

const FileContent: React.FC<{
  id: string;
}> = ({ id }) => {
  const { data, loading } = useGetFileContentQuery({
    variables: {
      key: id,
    },
  });
  if (loading) return <div>Loading...</div>;
  return <div className={"whitespace-pre-line"}>{data?.getFileContent}</div>;
};

export default FileContent;
