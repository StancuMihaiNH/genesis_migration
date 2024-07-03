import React from "react";
import { useForm } from "react-hook-form";
import {
  User,
  UserRole,
  useUpdateUserMutation,
} from "@/graphql/__generated__/schema";
import classNames from "classnames";

type FormValues = {
  name: string;
  role: UserRole;
};

const EditUserForm: React.FC<{
  onCompleted?: () => void;
  user: User;
}> = ({ onCompleted, user }) => {
  const [update, { loading, error }] = useUpdateUserMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: user.name,
      role: user.role,
    },
  });
  const onSubmit = async (data: FormValues) => {
    try {
      await update({
        variables: {
          updateUserId: user.id,
          input: {
            name: data.name.trim(),
            role: data.role,
          },
        },
      });
      onCompleted?.();
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
            "border-red-500": errors.name,
          })}
          type="text"
          id="name"
          {...register("name", { required: true })}
        />
        {errors.name && (
          <span className={"text-sm text-red-500"}>
            {errors.name.message || "This field is required"}
          </span>
        )}
      </div>
      <div className={"flex flex-col gap-2 mb-4"}>
        <label htmlFor="role" className={"text-gray-700"}>
          Role
        </label>
        <select
          className={"p-2 border border-gray-200 rounded"}
          id="role"
          {...register("role", { required: true })}
        >
          <option value={UserRole.Admin}>Admin</option>
          <option value={UserRole.User}>User</option>
        </select>
      </div>
      {error && (
        <div className={"text-red-500 text-sm mb-4"}>{error.message}</div>
      )}
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

export default EditUserForm;
