"use client";
import React, { useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
const Sidebar = dynamic(() => import("@/components/sidebar"), { ssr: false });
import Conversation from "@/components/Conversation";

const Page: NextPage<{ params: { id: string } }> = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem(
      process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY || "",
    );
    if (!token) {
      router.push("/login");
    }
  }, [router]);
  return (
    <div className={"flex flex-col md:flex-row w-full h-screen"}>
      <Sidebar
        className={"hidden md:flex md:w-[300px] md:min-w-[300px] md:relative"}
      />
      <Conversation id={id} />
    </div>
  );
};

export default Page;
