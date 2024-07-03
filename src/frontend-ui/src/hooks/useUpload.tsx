import { usePresignedUploadUrlMutation } from "@/graphql/__generated__/schema";

const uploadToS3 = async (presignedUrl: string, file: File) => {
  const response = await fetch(presignedUrl, {
    method: "PUT",
    body: file,
  });
  if (!response.ok) {
    throw new Error("Failed to upload file");
  }
};

const useUpload = () => {
  const [presigned, { loading }] = usePresignedUploadUrlMutation();
  const upload = async (file: File, prefix?: string) => {
    const { data } = await presigned({
      variables: {
        filename: file.name,
        contentType: file.type,
        prefix,
      },
    });
    const { url, key } = data?.presignedUploadUrl || {};
    if (!url || !key) {
      throw new Error("Failed to get presigned URL");
    }
    await uploadToS3(url, file);
    return key;
  };
  return { upload };
};

export default useUpload;
