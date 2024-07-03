import React from "react";
import LoginForm from "@/components/LoginForm";

const Page = () => {
  return (
    <div
      className={
        "flex flex-col items-center justify-center w-full h-screen bg-[rgba(26,36,59,1)]"
      }
    >
      <LoginForm />
    </div>
  );
};

export default Page;
