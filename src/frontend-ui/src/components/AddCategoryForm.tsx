import React from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import {
  CategoriesDocument,
  CategoriesQuery,
  useAddCategoryMutation,
} from "@/graphql/__generated__/schema";

type FormValues = {
  title: string;
  description: string;
};

const AddCategoryForm: React.FC<{
  onDone?: () => void;
}> = ({ onDone }) => {
  const [addCategory, { loading, error, client }] = useAddCategoryMutation();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
    },
  });
  const onSubmit = async ({ title, description }: FormValues) => {
    try {
      const { data } = await addCategory({
        variables: {
          title: title.trim(),
          description: description.trim(),
        },
      });
      if (data?.addCategory) {
        const readQuery = client.readQuery<CategoriesQuery>({
          query: CategoriesDocument,
        });
        if (readQuery) {
          client.writeQuery({
            query: CategoriesDocument,
            data: {
              categories: [...readQuery.categories, data?.addCategory],
            },
          });
        }
      }
      onDone?.();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={"flex flex-col gap-2 mb-4"}>
        <label htmlFor="name" className={"text-gray-700"}>
          Name
        </label>
        <input
          className={classNames("p-2 border border-gray-200 rounded", {
            "border-red-500": errors.title,
          })}
          type="text"
          id="name"
          {...register("title", { required: true })}
        />
        {errors.title && (
          <span className={"text-sm text-red-500"}>
            {errors.title.message || "This field is required"}
          </span>
        )}
      </div>
      <div className={"flex flex-col gap-2 mb-4"}>
        <label htmlFor="email" className={"text-gray-700"}>
          Description
        </label>
        <textarea
          className={classNames("p-2 border border-gray-200 rounded", {
            "border-red-500": errors.description,
          })}
          id="description"
          {...register("description")}
        />
      </div>
      <button
        disabled={loading}
        type="submit"
        className={"bg-[#132e53] text-white px-4 py-2 rounded"}
      >
        {loading ? "Saving" : "Save"}
      </button>
    </form>
  );
};

export default AddCategoryForm;
