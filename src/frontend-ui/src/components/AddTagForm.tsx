import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import {
  Category,
  FileInput,
  Tag,
  TagInput,
  useCreateTagMutation,
} from "@/graphql/__generated__/schema";
import { newID } from "@/utils/id";
import useUpload from "@/hooks/useUpload";
import { RiCloseLine } from "react-icons/ri";

type FormValues = {
  displayName: string;
  content: string;
  categoryId?: string;
};
const AddTagForm: React.FC<{
  categories: Category[];
  onAdded?: (tag: Tag) => void;
}> = ({ onAdded, categories }) => {
  const { upload } = useUpload();
  const [createTag, { loading, error }] = useCreateTagMutation();
  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      displayName: "",
      content: "",
      categoryId: "",
    },
  });
  const onSubmit = async (data: FormValues) => {
    const tagId = newID();
    try {
      const input: TagInput = {
        displayName: data.displayName,
        content: data.content,
        categoryId: data.categoryId,
        id: tagId,
      };
      if (files.length) {
        setUploading(true);
        input.attachments = await Promise.all(
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
      const { data: tag } = await createTag({
        variables: {
          input,
        },
      });
      if (tag) {
        onAdded?.(tag.createTag);
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
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
        <div className={classNames("flex flex-col gap-2 w-full")}>
          <label>Attachments</label>
          <div className={"flex flex-col gap-2 w-full"}>
            {files.map((file) => (
              <div key={file.name} className={"flex gap-2 items-center"}>
                <p
                  title={file.name}
                  className={
                    "p-2 border border-gray-300 rounded-md truncate w-40 flex-1"
                  }
                >
                  {file.name}
                </p>
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
        {error && <div className={"text-red-500"}>Error: {error.message}</div>}
        <button
          disabled={loading}
          className={
            "bg-[#039fb8] text-white p-2 px-4 rounded-md cursor-pointer"
          }
          type="submit"
        >
          {loading || uploading ? "Adding Tag..." : "Add Tag"}
        </button>
      </form>
    </div>
  );
};

export default AddTagForm;
