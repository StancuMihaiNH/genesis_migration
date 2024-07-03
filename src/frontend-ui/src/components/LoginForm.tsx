"use client";
import React from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import { useLoginMutation } from "@/graphql/__generated__/schema";
import { useRouter } from "next/navigation";
import Image from "next/image";

type FormValues = {
  email: string;
  password: string;
};
const LoginForm = () => {
  const navigate = useRouter();
  const [login, { loading, error }] = useLoginMutation();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const submit = async ({ email, password }: FormValues) => {
    try {
      const data = await login({
        variables: { email, password },
      });
      localStorage.setItem(
        `${process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY}`,
        data.data?.login.token || "",
      );
      navigate.push("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className={"max-w-lg"}>
      <div className={"shadow p-5 rounded"}>
        <div className={"flex justify-between items-center gap-2 p-5 mb-4"}>
          <div className={"flex flex-col gap-1"}>
            <h1 className={"text-white text-[22px]"}>NORTH HIGHLAND</h1>
            <p className={"text-white text-[12px] text-right"}>
              Make <span className={"text-[#039fb8]"}>Change</span> Happen
              <sup>®</sup>
            </p>
          </div>
          <Image src={"/logo_sm.png"} alt={"NH"} width={38} height={66} />
        </div>
        <h1
          className={"font-semibold text-white dark:text-gray-100 mb-3 text-xl"}
        >
          Sign In
        </h1>
        <form
          onSubmit={handleSubmit(submit)}
          className={"flex flex-col w-full space-y-4 shadow"}
        >
          <input
            type="email"
            placeholder="Email"
            className={classNames("w-full py-1 px-2 border rounded-lg", {
              "border-red-500": errors.email,
            })}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email",
              },
            })}
          />
          {errors.email && (
            <span className={"text-red-500 text-sm"}>
              {errors.email.message}
            </span>
          )}
          <input
            type="password"
            placeholder="Password"
            className={classNames("w-full py-1 px-2 border rounded-lg", {
              "border-red-500": errors.password,
            })}
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <span className={"text-red-500 text-sm"}>
              {errors.password.message}
            </span>
          )}
          {error && (
            <span className={"text-red-500 text-sm"}>{error.message}</span>
          )}
          <button
            disabled={loading}
            type="submit"
            className={
              "w-full p-2 text-white bg-[#039fb8] rounded-lg hover:bg-[#039fb8]"
            }
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
