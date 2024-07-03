import React, { useState } from "react";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { BiTrash } from "react-icons/bi";
import {
  Prompt,
  PromptsDocument,
  useCreatePromptMutation,
  useDeletePromptMutation,
} from "@/graphql/__generated__/schema";

type FormValues = {
  title: string;
  description: string;
};
const Prompts: React.FC<{
  prompts: Prompt[];
  onPromptSelect?: (prompt: string) => void;
}> = ({ prompts, onPromptSelect }) => {
  const [deletePrompt] = useDeletePromptMutation();
  const [create, { loading, client }] = useCreatePromptMutation();
  const [showAddPrompt, setShowAddPrompt] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async ({ title, description }: FormValues) => {
    try {
      const { data } = await create({
        variables: {
          title,
          description,
        },
      });
      reset();
      setShowAddPrompt(false);
      const readQuery = client.readQuery({
        query: PromptsDocument,
      });
      client.writeQuery({
        query: PromptsDocument,
        data: {
          prompts: [...readQuery.prompts, data?.createPrompt],
        },
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div
      className={
        "flex flex-col w-full border rounded overflow-y-auto max-h-[400px]"
      }
    >
      {prompts.map((prompt, index) => (
        <div
          onClick={() => onPromptSelect?.(prompt.description)}
          key={prompt.title}
          className={classNames(
            "flex flex-col gap-1 p-2 hover:bg-gray-100 transition cursor-pointer border-b",
          )}
        >
          <div className={"flex justify-between items-center"}>
            <h3 className={"text-[#132e53] font-semibold"}>{prompt.title}</h3>
            <button
              className={"p2"}
              onClick={(e) => {
                e.stopPropagation();
                deletePrompt({
                  variables: {
                    deletePromptId: prompt.id,
                  },
                  optimisticResponse: {
                    deletePrompt: true,
                  },
                });

                const readQuery = client.readQuery({
                  query: PromptsDocument,
                });
                if (!readQuery) {
                  return;
                }
                client.writeQuery({
                  query: PromptsDocument,
                  data: {
                    prompts: readQuery.prompts.filter(
                      (p: Prompt) => p.id !== prompt.id,
                    ),
                  },
                });
              }}
            >
              <BiTrash className={"cursor-pointer text-red-500"} size={24} />
            </button>
          </div>
          <p className={"text-[#132e53]"}>{prompt.description}</p>
        </div>
      ))}
      <div ref={ref}>
        {!showAddPrompt && (
          <button
            onClick={() => {
              setShowAddPrompt(true);
              ref.current?.scrollIntoView({ behavior: "smooth", block: "end" });
            }}
            className={
              "w-full flex flex-col gap-1 p-2 hover:bg-gray-100 transition cursor-pointer border-b text-[#132e53] font-semibold"
            }
          >
            Add new Prompt
          </button>
        )}
        {showAddPrompt && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={"flex flex-col gap-2 p-2"}>
              <input
                type="text"
                placeholder="Title"
                className={"p-2 border rounded"}
                {...register("title", { required: true })}
              />
              {errors.title && (
                <span className={"text-red-500"}>Title is required</span>
              )}
              <textarea
                placeholder="Prompt"
                className={"p-2 border rounded"}
                {...register("description", { required: true })}
              />
              {errors.description && (
                <span className={"text-red-500"}>Description is required</span>
              )}
              <div className={"flex gap-4"}>
                <button
                  type="button"
                  onClick={() => setShowAddPrompt(false)}
                  className={
                    "p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  }
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  type="submit"
                  className={
                    "p-2 bg-[#132e53] text-white rounded hover:bg-[#132e53] transition"
                  }
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Prompts;
