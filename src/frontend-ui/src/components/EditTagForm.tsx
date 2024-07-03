import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import {
  Category,
  FileInput,
  File as FileObj,
  Tag,
  TagInput,
  useUpdateTagMutation,
  useUsersQuery,
} from "@/graphql/__generated__/schema";
import { newID } from "@/utils/id";
import useUpload from "@/hooks/useUpload";
import { RiCloseLine } from "react-icons/ri";
import { createPortal } from "react-dom";
import FileDrawer from "@/components/FileDrawer";

type FormValues = {
  displayName: string;
  content: string;
  categoryId?: string;
  userId?: string;
};
const EditTagForm: React.FC<{
  tag: Tag;
  categories: Category[];
  oneDone?: () => void;
  canChangeOwner?: boolean;
}> = ({ canChangeOwner, oneDone, categories, tag }) => {
  const { data: usersData, loading: usersLoading } = useUsersQuery();
  const { upload } = useUpload();
  const [updateTag, { loading, error }] = useUpdateTagMutation();
  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileObj | undefined>();
  const [attachments, setAttachments] = useState<FileObj[]>(
    tag.attachments || [],
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      displayName: tag.displayName,
      content: tag.content,
      categoryId: tag.categoryId || "",
      userId: tag.userId,
    },
  });

  useEffect(() => {
    reset({
      displayName: tag.displayName,
      content: tag.content,
      categoryId: tag.categoryId || "",
      userId: tag.userId,
    });
    setAttachments(tag.attachments || []);
    setFiles([]);
  }, [tag]);
  const onSubmit = async (data: FormValues) => {
    const tagId = newID();
    try {
      const input: TagInput = {
        displayName: data.displayName,
        content: data.content,
        categoryId: data.categoryId,
        id: tagId,
        userId: data.userId,
      };
      let newAttachments: FileInput[] = [];
      if (files.length) {
        setUploading(true);
        newAttachments = await Promise.all(
          files.map(async (file) => {
            const key = await upload(file, tagId);
            const fileInput: FileInput = {
              id: key,
              filename: file.name,
              contentType: file.type,
            };
            return fileInput;
          }),
        );
        setUploading(false);
      }
      const existAttachments = attachments.map((a) => ({
        id: a.id,
        filename: a.filename,
        contentType: a.contentType,
      }));
      input.attachments = [...existAttachments, ...newAttachments];
      await updateTag({
        variables: {
          input: {
            ...input,
            id: tag.id,
          },
        },
      });
      oneDone?.();
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <div className={"w-full"}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={"flex gap-4 flex-col items-start"}
        >
          <div className={classNames("flex flex-col gap-2 w-full")}>
            <label>Tag Name</label>
            <input
              className={classNames("p-2 border border-gray-300 rounded-md", {
                "border-red-500": errors.displayName,
              })}
              type="text"
              placeholder="Tag Name"
              {...register("displayName", { required: true })}
            />
          </div>
          <div className={classNames("flex flex-col gap-2 w-full")}>
            <label>Content</label>
            <textarea
              className={classNames("p-2 border border-gray-300 rounded-md", {
                "border-red-500": errors.content,
              })}
              placeholder="Tag Content"
              {...register("content", { required: true })}
            />
          </div>
          <div className={classNames("flex flex-col gap-2 w-full")}>
            <label>Category</label>
            <select
              className={classNames("p-2 border border-gray-300 rounded-md")}
              {...register("categoryId")}
            >
              <option value={""}>General</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>
          {canChangeOwner && (
            <div className={"flex flex-col gap-2 mb-4 w-full"}>
              <label htmlFor="owner" className={"text-gray-700"}>
                Owner
              </label>
              {usersLoading ? (
                <p>Loading...</p>
              ) : (
                <select
                  className={classNames(
                    "p-2 border border-gray-200 rounded w-full",
                    {
                      "border-red-500": errors.userId,
                    },
                  )}
                  id="owner"
                  {...register("userId", { required: true })}
                >
                  {usersData?.users.items?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              )}
              {errors.userId && (
                <span className={"text-sm text-red-500"}>
                  {errors.userId.message || "This field is required"}
                </span>
              )}
            </div>
          )}
          <div className={classNames("flex flex-col gap-2 w-full")}>
            <label>Attachments</label>
            <div className={"flex flex-col gap-2 w-full"}>
              {attachments.map((file) => (
                <div key={file.id} className={"flex gap-2 items-center"}>
                  <button
                    type={"button"}
                    onClick={() => {
                      setPreviewFile(file);
                    }}
                    title={file.filename}
                    className={
                      "p-2 border border-gray-300 rounded-md truncate w-40 flex-1"
                    }
                  >
                    {file.filename}
                  </button>
                  <button
                    type={"button"}
                    onClick={() => {
                      setAttachments(
                        attachments.filter((f) => f.id !== file.id),
                      );
                    }}
                    className={"text-red-500"}
                  >
                    <RiCloseLine size={20} />
                  </button>
                </div>
              ))}
              {files.map((file, fileIdex) => (
                <div
                  key={`${file.name}-${fileIdex}`}
                  className={"flex gap-2 items-center"}
                >
                  <button
                    onClick={() => {
                      setPreviewFile({
                        filename: file.name,
                        content: "",
                        contentType: file.type,
                        id: `${file.name}-${fileIdex}`,
                      });
                    }}
                    title={file.name}
                    className={
                      "p-2 border border-gray-300 rounded-md truncate w-40 flex-1"
                    }
                  >
                    {file.name}
                  </button>
                  <button
                    type={"button"}
                    onClick={() => {
                      setFiles(files.filter((f) => f !== file));
                    }}
                    className={"text-red-500"}
                  >
                    <RiCloseLine size={20} />
                  </button>
                </div>
              ))}
            </div>
            <input
              ref={fileRef}
              className={classNames(
                "p-2 border border-gray-300 rounded-md hidden",
              )}
              type="file"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  setFiles([...files, ...Array.from(e.target.files)]);
                }
                fileRef.current!.value = "";
              }}
            />
            <button
              type={"button"}
              onClick={() => {
                fileRef.current?.click();
              }}
              className={classNames(
                "p-2 border border-dashed border-gray-300 rounded-md",
              )}
            >
              Add Attachments
            </button>
          </div>
          {error && (
            <div className={"text-red-500"}>Error: {error.message}</div>
          )}
          <button
            disabled={loading}
            className={classNames(
              "bg-[#039fb8] text-white p-2 px-4 rounded-md cursor-pointer w-full",
              {
                "opacity-50": loading || uploading,
              },
            )}
            type="submit"
          >
            {loading || uploading ? "Saving" : "Save"}
          </button>
        </form>
      </div>
      {previewFile &&
        createPortal(
          <FileDrawer
            file={previewFile}
            onClose={() => setPreviewFile(undefined)}
          />,
          document.body,
        )}
    </>
  );
};

export default EditTagForm;
