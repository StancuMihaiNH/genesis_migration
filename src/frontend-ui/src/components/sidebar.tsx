"use client";
import React, { useContext, useEffect, useState } from "react";
import TopicCard from "@/components/TopicCard";
import Image from "next/image";
import classNames from "classnames";
import { useParams, useRouter } from "next/navigation";
import {
  Topic,
  TopicsDocument,
  useDeleteTopicMutation,
  UserRole,
  useTopicsQuery,
  useViewerQuery,
} from "@/graphql/__generated__/schema";
import DropDown from "@/components/DropDown";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useDebounce } from "use-debounce";
import { AppContext } from "@/context";
import NewConversationButton from "@/components/NewConversationButton";
import usePinTopic from "@/hooks/usePinTopic";

const Sidebar: React.FC<{
  className?: string;
}> = ({ className }) => {
  const {
    topicFilterPin,
    setTopicFilterPin,
    topicFilterSortAsc,
    setTopicFilterSortAsc,
    search: searchContext,
    setSearch,
  } = useContext(AppContext);
  const [input, setInput] = useState(searchContext || "");
  const [search] = useDebounce(input, 300);
  const navigate = useRouter();
  const [deleteTopic] = useDeleteTopicMutation();
  const { loading: pinLoading, pin, unpin } = usePinTopic();
  const { data: viewer, client } = useViewerQuery();
  const {
    data: topicsData,
    previousData,
    loading,
  } = useTopicsQuery({
    variables: {
      search,
      asc: topicFilterSortAsc,
      pinned: topicFilterPin,
    },
  });
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    setSearch(search);
  }, [search]);
  const handleDeleteTopic = (id: string) => {
    deleteTopic({
      variables: {
        deleteTopicId: id,
      },
      optimisticResponse: {
        deleteTopic: true,
      },
    });
    client.writeQuery({
      query: TopicsDocument,
      variables: {
        search,
        asc: topicFilterSortAsc,
        pinned: topicFilterPin,
      },
      data: {
        topics: topicsData?.topics?.filter((t) => t.id !== id),
      },
    });
    router.push("/");
  };
  let topics = topicsData?.topics ? [...topicsData.topics] : [];
  if (loading) {
    topics = previousData?.topics ? [...previousData.topics] : [];
  }
  if (topicFilterPin) {
    topics = topics.filter((t) => t.pinned);
  }
  topics = topics.sort((a, b) => {
    const aLastMessageAt = a.lastMessageAt || 0;
    const bLastMessageAt = b.lastMessageAt || 0;
    if (topicFilterSortAsc) {
      return aLastMessageAt - bLastMessageAt;
    }
    return bLastMessageAt - aLastMessageAt;
  });
  return (
    <div
      className={classNames(
        "flex flex-col shadow bg-[rgba(26,36,59,1)] gap-4",
        className,
      )}
    >
      <div className={"flex justify-between items-center gap-2 p-5"}>
        <div className={"flex flex-col gap-1"}>
          <h1 className={"text-white text-[22px]"}>NORTH HIGHLAND</h1>
          <p className={"text-white text-[12px] text-right"}>
            Make <span className={"text-[#039fb8]"}>Change</span> Happen
            <sup>®</sup>
          </p>
        </div>
        <Image src={"/logo_sm.png"} alt={"NH"} width={38} height={66} />
      </div>
      <div className={"border-b border-[rgba(255,255,255,0.1)]"}>
        <div className={"flex items-center gap-2 p-5 relative"}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"Search..."}
            className={
              "bg-[rgba(255,255,255,0.1)] text-white p-2 px-4 rounded w-full focus:outline-none focus:ring-2 focus:ring-primary"
            }
          />
          <div
            className={classNames("absolute right-8", {
              hidden: !loading,
            })}
          >
            <svg
              aria-hidden="true"
              className="w-4 h-4 text-gray-200 animate-spin  fill-[#039fb8]"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        </div>
        <div
          className={
            "flex items-center gap-2 px-5 pb-2 border-b border-[rgba(255,255,255,0.1)]"
          }
        >
          <span
            className={
              "text-white text-[12px] font-semibold uppercase tracking-wider"
            }
          >
            Sort by:
          </span>
          <button
            onClick={() => setTopicFilterPin((prev) => !prev)}
            className={classNames("text-[12px] uppercase tracking-wider", {
              "text-[#039fb8]": topicFilterPin,
              "text-gray-500": !topicFilterPin,
            })}
          >
            Pinned
          </button>
          <button
            onClick={() => setTopicFilterSortAsc((prev) => !prev)}
            className={classNames("text-[12px] uppercase tracking-wider", {
              "text-[#039fb8]": topicFilterSortAsc,
              "text-gray-500": !topicFilterSortAsc,
            })}
          >
            {topicFilterSortAsc ? "Ascending" : "Descending"}
          </button>
        </div>
      </div>
      <div className={" flex-1 overflow-y-auto flex flex-col gap-2 p-5"}>
        {topics.map((topic, idx) => {
          const isActive = params.id === topic.id || (!params.id && idx === 0);
          return (
            <TopicCard
              onPin={() => {
                pin(topic.id);
              }}
              onUnpin={() => {
                unpin(topic.id);
              }}
              onDelete={() => handleDeleteTopic(topic.id)}
              isActive={isActive}
              key={topic.id}
              topic={topic as Topic}
            />
          );
        })}
      </div>
      <div
        className={
          "gap-2 pt-2 border-t border-[rgba(255,255,255,0.1)] h-[120px]"
        }
      >
        <div className={"text-right px-5"}>
          <a
            className={"text-[#039fb8] text-[13px] hover:underline"}
            href={"mailto:ai.genesis@northhighland.com"}
          >
            Report an issue
          </a>
        </div>
        <div className={"flex gap-4 p-5"}>
          <div className={"flex"}>
            <DropDown
              trigger={
                <button
                  className={
                    "w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center"
                  }
                >
                  {viewer?.viewer.user?.avatarUrl ? (
                    <img
                      src={viewer?.viewer.user?.avatarUrl}
                      className={"w-10 h-10 rounded-full"}
                      alt={viewer?.viewer.user?.name}
                    />
                  ) : (
                    <span>
                      {viewer?.viewer?.user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "NH"}
                    </span>
                  )}
                </button>
              }
            >
              <DropdownMenu.Item
                onClick={() => {
                  router.push("/account");
                }}
                className="group text-[13px] leading-none text-[#039fb8] rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-[#039fb8] data-[highlighted]:text-violet1"
              >
                My Account
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => {
                  router.push("/admin/tags");
                }}
                className="group text-[13px] leading-none text-[#039fb8] rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-[#039fb8] data-[highlighted]:text-violet1"
              >
                Manage Tags
              </DropdownMenu.Item>
              {viewer?.viewer?.user?.role === UserRole.Admin && (
                <DropdownMenu.Item
                  onClick={() => {
                    router.push("/admin/users");
                  }}
                  className="group text-[13px] leading-none text-[#039fb8] rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-[#039fb8] data-[highlighted]:text-violet1"
                >
                  Manage Users
                </DropdownMenu.Item>
              )}
              <DropdownMenu.Item
                onClick={() => {
                  localStorage.removeItem(
                    `${process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY}`,
                  );
                  navigate.push("/login");
                  client.clearStore();
                }}
                className="group text-[13px] leading-none text-[#039fb8] rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-[#039fb8] data-[highlighted]:text-violet1"
              >
                Sign Out
              </DropdownMenu.Item>
            </DropDown>
          </div>
          <NewConversationButton />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
