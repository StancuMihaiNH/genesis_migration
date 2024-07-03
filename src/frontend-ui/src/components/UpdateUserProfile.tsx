import React, { useState } from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import { User, useUpdateUserMutation } from "@/graphql/__generated__/schema";

type FormValues = {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
const UpdateUserProfile: React.FC<{
  onCanceled?: () => void;
  onCompleted?: () => void;
  user: User;
}> = ({ user, onCanceled, onCompleted }) => {
  const [update, { loading, error }] = useUpdateUserMutation();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: user.name,
      email: user.email,
      currentPassword: "",
      newPassword: "",
    },
  });
  const onSubmit = async (data: FormValues) => {
    try {
      await update({
        variables: {
          updateUserId: user.id,
          input: {
            name: data.name,
            email: data.email,
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          },
        },
      });
      onCompleted?.();
    } catch (err) {
      console.log(err);
    }
  };

  const watchPassword = watch("newPassword");
  return (
    <form>
      {error && (
        <div className={"bg-red-500 text-white p-2 rounded-md"}>
          {error.message}
        </div>
      )}
      <div
        className={classNames("flex flex-col gap-2 mb-4", {
          "border-red-500": errors.name,
        })}
      >
        <label htmlFor="name" className={"text-gray-700"}>
          Name
        </label>
        <input
          className={"p-2 border border-gray-200 rounded"}
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
      <div
        className={classNames("flex flex-col gap-2 mb-4", {
          "border-red-500": errors.email,
        })}
      >
        <label htmlFor="email" className={"text-gray-700"}>
          Email
        </label>
        <input
          className={"p-2 border border-gray-200 rounded"}
          type="email"
          id="email"
          {...register("email", {
            required: true,
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && (
          <span className={"text-sm text-red-500"}>
            {errors.email.message || "This field is required"}
          </span>
        )}
      </div>
      {showPassword ? (
        <>
          <div className={"flex flex-col gap-2 mb-4"}>
            <label htmlFor="name" className={"text-gray-700"}>
              Current Password
            </label>
            <input
              className={classNames("p-2 border border-gray-200 rounded", {
                "border-red-500": errors.currentPassword,
              })}
              type="password"
              id="name"
              {...register("currentPassword", { required: true })}
            />
            {errors.currentPassword && (
              <span className={"text-sm text-red-500"}>
                {errors.currentPassword.message || "This field is required"}
              </span>
            )}
          </div>
          <div className={"flex flex-col gap-2 mb-4"}>
            <label htmlFor="role" className={"text-gray-700"}>
              New Password
            </label>
            <input
              className={classNames("p-2 border border-gray-200 rounded", {
                "border-red-500": errors.newPassword,
              })}
              type="password"
              id="role"
              {...register("newPassword", { required: true })}
            />
            {errors.newPassword && (
              <span className={"text-sm text-red-500"}>
                {errors.newPassword.message || "This field is required"}
              </span>
            )}
          </div>
          <div className={"flex flex-col gap-2 mb-4"}>
            <label htmlFor="role" className={"text-gray-700"}>
              Confirm new Password
            </label>
            <input
              className={classNames("p-2 border border-gray-200 rounded", {
                "border-red-500": errors.confirmPassword,
              })}
              type="password"
              id="role"
              {...register("confirmPassword", {
                required: true,
                validate: (value) =>
                  value === watchPassword || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <span className={"text-sm text-red-500"}>
                {errors.confirmPassword.message || "This field is required"}
              </span>
            )}
          </div>
          <button
            type={"button"}
            onClick={() => setShowPassword(false)}
            className={"text-[#132e53] underline cursor-pointer"}
          >
            Hide Password Fields
          </button>
        </>
      ) : (
        <div>
          <button
            onClick={() => setShowPassword(true)}
            className={"text-[#132e53] underline cursor-pointer"}
            type={"button"}
          >
            Show Password Fields
          </button>
        </div>
      )}
      <div className={"flex gap-4 justify-end"}>
        <button
          type={"button"}
          onClick={onCanceled}
          className={"bg-gray-500 text-white p-2 px-4 rounded-md"}
        >
          Cancel
        </button>
        <button
          disabled={loading}
          type={"submit"}
          onClick={handleSubmit(onSubmit)}
          className={"bg-[#132e53] text-white p-2 px-4 rounded-md"}
        >
          {loading ? "Saving" : "Change Password"}
        </button>
      </div>
    </form>
  );
};

export default UpdateUserProfile;
