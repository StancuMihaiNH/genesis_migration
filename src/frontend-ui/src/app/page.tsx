"use client";
import { useTopicsQuery } from "@/graphql/__generated__/schema";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Conversation from "@/components/Conversation";
import dynamic from "next/dynamic";
import { AppContext } from "@/context";
const Sidebar = dynamic(() => import("@/components/sidebar"), { ssr: false });
export default function Home() {
  const {
    topicFilterPin,
    topicFilterSortAsc,
    search: searchContext,
  } = useContext(AppContext);
  const { data } = useTopicsQuery({
    variables: {
      search: "",
      asc: topicFilterSortAsc,
      pinned: topicFilterPin,
    },
  });
  const topics = data?.topics || [];
  const topic = topics.length ? topics[0] : null;
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
    <div className={"flex flex-col md:flex-row h-screen"}>
      <Sidebar
        className={
          "w-full fixed h-screen md:w-[300px] md:min-w-[300px] md:relative"
        }
      />
      {topic ? (
        <Conversation
          id={topics.length ? topics[0].id : "1"}
          className={"invisible md:visible"}
        />
      ) : (
        <div />
      )}
    </div>
  );
}
