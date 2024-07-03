"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { getUnixTime } from "date-fns";
import MessageCard from "@/components/MessageCard";
import dynamic from "next/dynamic";

const ComposeInput = dynamic(() => import("@/components/ComposeInput"), {
  ssr: false,
});
import classNames from "classnames";
import Link from "next/link";
import {
  RiAddFill,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiCloseLine,
} from "react-icons/ri";
import Popover from "@/components/Popover";
import {
  Category,
  CreateMessageInput,
  FileInput,
  Message,
  MessageFragmentFragment,
  MessageFragmentFragmentDoc,
  MessageRole,
  MessagesDocument,
  MessagesQuery,
  Tag,
  TopicFragmentFragment,
  TopicFragmentFragmentDoc,
  useCategoriesQuery,
  useCreateMessageMutation,
  useMessagesQuery,
  usePromptsQuery,
  useTagsQuery,
  useTopicQuery,
  useUpdateTopicMutation,
  useViewerQuery,
} from "@/graphql/__generated__/schema";
import useMessageStore, {
  handleGenerateAITitle,
  handleSendAndStreamCallback,
} from "@/store/useMessageStore";
import useUpload from "@/hooks/useUpload";
import { newID } from "@/utils/id";
import Tooltip from "@/components/Tooltip";
import TopicPinningButton from "@/components/TopicPinningButton";

const TagSection: React.FC<{
  category: string;
  tags: Tag[];
  onClick: (tag: Tag) => void;
}> = ({ category, tags, onClick }) => {
  const [open, setOpen] = useState(false);
  if (tags.length === 0) return null;
  return (
    <div className={"flex flex-col"}>
      <h3
        onClick={() => setOpen(!open)}
        className={
          "text-lg font-semibold text-[#132e53] px-3 py-1 bg-gray-100 flex items-center justify-between cursor-pointer"
        }
      >
        {category}
        <span>
          {!open ? (
            <RiArrowDownSLine size={20} />
          ) : (
            <RiArrowUpSLine size={20} />
          )}
        </span>
      </h3>
      {open && (
        <div className={classNames("flex flex-col flex-wrap gap-2")}>
          {tags.map((tag, index) => (
            <button
              onClick={() => onClick(tag)}
              className={classNames(
                "flex items-center  text-[#525252] py-2 px-3 border-b hover:bg-gray-50 cursor-pointer text-sm",
                {
                  "border-t": index === 0,
                },
              )}
              key={tag.id}
            >
              {tag.displayName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const TagContainer: React.FC<{
  text: string;
  description?: string;
  onRemove?: () => void;
}> = ({ text, description, onRemove }) => {
  if (!text) return null;
  const parts = text
    .split("_")
    .slice(0, 2)
    .map((part) => {
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    });

  return (
    <Tooltip
      delayDuration={0}
      trigger={
        <div className="bg-[#dee22a] text-[#525252] py-1 px-2 md:px-4 md:py-2 rounded-full text-xs md:text-sm flex items-center gap-2">
          {parts.join(" ")}
          {onRemove && (
            <button onClick={onRemove}>
              <RiCloseLine size={20} />
            </button>
          )}
        </div>
      }
    >
      {description || text}
    </Tooltip>
  );
};

const Conversation: React.FC<{
  className?: string;
  id: string;
}> = ({ className, id }) => {
  const { data: viewer } = useViewerQuery();
  const abortControllerRef = useRef<AbortController | undefined | null>(null);
  const [isSending, setIsSending] = useState(false);
  const { upload } = useUpload();
  const [updateTopic] = useUpdateTopicMutation();
  const [createMessage] = useCreateMessageMutation();
  const { selectedModel, onModelChange } = useMessageStore();
  const { data: categoriesData } = useCategoriesQuery();
  const { data: PromptsData } = usePromptsQuery();
  const { data: tagsData } = useTagsQuery();
  const { data: topicData, loading: topicLoading } = useTopicQuery({
    variables: {
      topicId: id,
    },
  });
  const {
    data: messagesData,
    client,
    refetch: onRefetch,
    loading: messagesLoading,
  } = useMessagesQuery({
    variables: {
      topicId: id,
    },
  });
  const [showEditTitle, setShowEditTitle] = useState(false);
  const [title, setTitle] = useState("");
  const topic = topicData?.topic;
  const prompts = PromptsData?.prompts || [];
  const messages = useMemo(
    () => messagesData?.messages.items || [],
    [messagesData],
  );
  const endRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const tags = useMemo(() => tagsData?.tags || [], [tagsData]);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const availableSectionTags = useMemo(() => {
    const mapCategoryById = new Map<string, Category>();
    for (const category of categoriesData?.categories || []) {
      mapCategoryById.set(category.id, category);
    }
    let categories = new Map<string, Tag[]>();
    for (const tag of tags) {
      let categoryId = tag.categoryId || "General";
      if (!mapCategoryById.has(categoryId)) {
        categoryId = "General";
      }
      if (tag.category) {
        mapCategoryById.set(categoryId, tag.category);
      }
      if (!categories.has(categoryId)) {
        categories.set(categoryId, []);
      }
      const exist = topic?.tags?.find((t) => tag.id === t.id);
      if (!exist) {
        categories.get(categoryId)?.push(tag);
      }
    }
    return Array.from(categories.entries()).map(([category, tags]) => (
      <TagSection
        key={category}
        tags={tags}
        category={mapCategoryById.get(category)?.title || category}
        onClick={(tag) => {
          if (!topic) return;

          const updateTags = topic.tags || [];
          updateTopic({
            variables: {
              updateTopicId: id,
              input: {
                tagIds: [...(topic.tags || []), tag].map((t) => t.id),
              },
            },
            optimisticResponse: {
              updateTopic: {
                ...topic,
                tags: [...updateTags, tag].sort((a, b) => {
                  return a.displayName.localeCompare(b.displayName);
                }),
                __typename: "Topic",
              },
            },
          });
        }}
      />
    ));
  }, [tags, topic]);
  const handleUpdateTopic = (id: string, input: any) => {
    updateTopic({
      variables: {
        updateTopicId: id,
        input,
      },
      optimisticResponse: {
        updateTopic: {
          ...topic,
          ...input,
          __typename: "Topic",
        },
      },
    });
    const remainTags = [];
    client.writeFragment({
      fragment: TopicFragmentFragmentDoc,
      fragmentName: "TopicFragment",
      id: id,
      data: {
        ...topic,
        ...input,
        tags: input.tags,
      },
    });
  };

  const updateMessageToCache = (message: Message) => {
    const fragment = client.readFragment<MessageFragmentFragment>({
      id: `Message:${message.id}`,
      fragment: MessageFragmentFragmentDoc,
      fragmentName: "MessageFragment",
    });
    if (!fragment) return;
    client.writeFragment({
      id: `Message:${message.id}`,
      fragment: MessageFragmentFragmentDoc,
      fragmentName: "MessageFragment",
      data: {
        ...fragment,
        ...message,
      },
    });
  };
  const appendMessageToCache = (message: Message) => {
    const readQuery = client.readQuery({
      query: MessagesDocument,
      variables: {
        topicId: id,
      },
    });
    client.writeQuery({
      query: MessagesDocument,
      variables: {
        topicId: id,
      },
      data: {
        messages: {
          ...readQuery.messages,
          items: [
            ...readQuery.messages.items,
            { ...message, __typename: "Message" },
          ],
        },
      },
    });
  };

  const handleResend = async (message: Message) => {
    if (!topic) return;
    try {
      setIsSending(true);
      abortControllerRef.current = new AbortController();
      client.writeFragment({
        fragment: MessageFragmentFragmentDoc,
        fragmentName: "MessageFragment",
        id: `Message:${message.id}`,
        data: {
          ...message,
          localStatusError: false,
        },
      });

      const nowUnix = getUnixTime(new Date());
      const newResponseMessage: Message = {
        id: newID(),
        role: MessageRole.Assistant,
        content: "",
        files: [],
        sourceDocuments: [],
        createdAt: nowUnix,
        updatedAt: nowUnix,
        localStatusError: false,
      };

      handleSendAndStreamCallback(
        {
          messages,
          model: selectedModel,
          tags: topic.tags || [],
        },
        (res, error) => {
          const messageFragment = client.readFragment<MessageFragmentFragment>({
            id: `Message:${newResponseMessage.id}`,
            fragment: MessageFragmentFragmentDoc,
            fragmentName: "MessageFragment",
          });
          if (!messageFragment) {
            return;
          }
          if (error) {
            setIsSending(false);
            if (messageFragment && messageFragment.content == "") {
              const readQuery = client.readQuery<MessagesQuery>({
                query: MessagesDocument,
                variables: {
                  topicId: id,
                },
              });
              if (!readQuery) {
                return;
              }
              client.writeQuery({
                query: MessagesDocument,
                variables: {
                  topicId: id,
                },
                data: {
                  messages: {
                    ...readQuery?.messages,
                    items: readQuery?.messages?.items?.filter(
                      (msg: Message) => msg.id !== messageFragment.id,
                    ),
                  },
                },
              });
            }
            return;
          }
          if (res === "__done__") {
            setIsSending(false);
            let sourceDocuments = messageFragment.sourceDocuments || [];
            let content = messageFragment.content;
            const regex = /^\[.*?}(?=])/;
            const match = messageFragment.content.match(regex);
            if (match) {
              const json = JSON.parse(`${match[0]}]`);
              if (json) {
                sourceDocuments = json.map(
                  (item: { file_name: string; content: string }) => {
                    return {
                      id: newID(),
                      filename: item.file_name,
                      content: item.content,
                    };
                  },
                );
              }
              content = messageFragment.content.replace(`${match[0]}]`, "");
            }
            createMessage({
              variables: {
                topicId: topic.id,
                input: {
                  id: messageFragment.id,
                  role: messageFragment.role,
                  content,
                  sourceDocuments,
                },
              },
            });
            return;
          }
          updateMessageToCache({
            ...messageFragment,
            content: messageFragment.content + res,
            localStatusError: false,
          });
        },
        id,
        abortControllerRef?.current?.signal,
      );
      setIsSending(false);
    } catch (err) {
      client.writeFragment({
        fragment: MessageFragmentFragmentDoc,
        fragmentName: "MessageFragment",
        id: `Message:${message.id}`,
        data: {
          ...message,
          localStatusError: true,
        },
      });
      setIsSending(false);
      console.log(err);
    }
  };

  const handleStopStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsSending(false);
  };
  const handleSend = async (msg: string, files?: File[]) => {
    if (!topic) return;
    const newMessageId = newID();
    try {
      setIsSending(true);
      abortControllerRef.current = new AbortController();
      let filesInput: FileInput[] = [];
      if (files && files.length > 0) {
        filesInput = await Promise.all(
          files.map(async (file) => {
            const key = await upload(file);
            return {
              id: key,
              filename: file.name,
              contentType: file.type,
            };
          }),
        );
      }
      const input: CreateMessageInput = {
        id: newMessageId,
        role: MessageRole.User,
        content: msg,
        files: filesInput,
        model: selectedModel,
        sourceDocuments: [],
      };
      const nowUnix = getUnixTime(new Date());
      createMessage({
        variables: {
          topicId: topic.id,
          input,
        },
        optimisticResponse: {
          createMessage: {
            ...input,
            __typename: "Message",
            localStatusError: false,
            createdAt: nowUnix,
            updatedAt: nowUnix,
          },
        },
      });
      appendMessageToCache({
        ...input,
        createdAt: nowUnix,
        updatedAt: nowUnix,
        localStatusError: false,
      });
      const newResponseMessage: Message = {
        id: newID(),
        role: MessageRole.Assistant,
        content: "",
        files: [],
        model: input.model,
        sourceDocuments: [],
        createdAt: nowUnix,
        updatedAt: nowUnix,
        localStatusError: false,
      };
      appendMessageToCache({
        ...newResponseMessage,
      });

      const newMessages = [
        ...messages,
        {
          ...input,
          createdAt: nowUnix,
          updatedAt: nowUnix,
        },
      ];
      handleSendAndStreamCallback(
        {
          messages: newMessages,
          model: selectedModel,
          tags: topic.tags || [],
        },
        (res, error) => {
          const messageFragment = client.readFragment<MessageFragmentFragment>({
            id: `Message:${newResponseMessage.id}`,
            fragment: MessageFragmentFragmentDoc,
            fragmentName: "MessageFragment",
          });
          if (!messageFragment) {
            return;
          }
          if (error) {
            setIsSending(false);
            if (messageFragment && messageFragment.content == "") {
              const readQuery = client.readQuery<MessagesQuery>({
                query: MessagesDocument,
                variables: {
                  topicId: id,
                },
              });
              if (!readQuery) {
                return;
              }
              client.writeQuery({
                query: MessagesDocument,
                variables: {
                  topicId: id,
                },
                data: {
                  messages: {
                    ...readQuery?.messages,
                    items: readQuery?.messages?.items?.filter(
                      (msg: Message) => msg.id !== messageFragment.id,
                    ),
                  },
                },
              });
            }
            return;
          }
          if (res === "__done__") {
            setIsSending(false);
            let sourceDocuments = [];
            let content = messageFragment.content;
            const regex = /^\[.*?}(?=])/;
            const match = messageFragment.content.match(regex);
            if (match) {
              const json = JSON.parse(`${match[0]}]`);
              if (json) {
                sourceDocuments = json.map(
                  (item: { file_name: string; content: string }) => {
                    return {
                      id: newID(),
                      filename: item.file_name,
                      content: item.content,
                    };
                  },
                );
              }
              content = messageFragment.content.replace(`${match[0]}]`, "");
            }
            if (content.trim().length === 0) {
              // remove the message from cache
              const readQuery = client.readQuery<MessagesQuery>({
                query: MessagesDocument,
                variables: {
                  topicId: id,
                },
              });
              if (!readQuery) {
                return;
              }
              client.writeQuery({
                query: MessagesDocument,
                variables: {
                  topicId: id,
                },
                data: {
                  messages: {
                    ...readQuery?.messages,
                    items: readQuery?.messages?.items?.filter(
                      (msg: Message) => msg.id !== messageFragment.id,
                    ),
                  },
                },
              });
            } else {
              createMessage({
                variables: {
                  topicId: topic.id,
                  input: {
                    id: messageFragment.id,
                    role: messageFragment.role,
                    content,
                    model: messageFragment.model,
                    sourceDocuments: sourceDocuments,
                  },
                },
              });
              const topicFragment = client.readFragment<TopicFragmentFragment>({
                id: `Topic:${id}`,
                fragment: TopicFragmentFragmentDoc,
                fragmentName: "TopicFragment",
              });
              if (topicFragment) {
                if (!topicFragment.aiTitle && !topicFragment.name) {
                  // generate ai title
                  handleGenerateAITitle(
                    {
                      conversationId: id,
                      messages: newMessages,
                    },
                    abortControllerRef.current?.signal,
                  ).then((res) => {
                    if (res && res.title) {
                      updateTopic({
                        variables: {
                          updateTopicId: id,
                          input: {
                            aiTitle: res.title,
                          },
                        },
                      });
                      client.writeFragment({
                        fragment: TopicFragmentFragmentDoc,
                        fragmentName: "TopicFragment",
                        id: id,
                        data: {
                          ...topicFragment,
                          aiTitle: res.title,
                        },
                      });
                    }
                  });
                }
              }
            }
            return;
          }
          updateMessageToCache({
            ...messageFragment,
            content: messageFragment.content + res,
            localStatusError: false,
          });
        },
        id,
        abortControllerRef.current?.signal,
      );
    } catch (err) {
      console.log(err);
      const messageFragment = client.readFragment<MessageFragmentFragment>({
        id: `Message:${newMessageId}`,
        fragment: MessageFragmentFragmentDoc,
        fragmentName: "MessageFragment",
      });
      if (messageFragment) {
        client.writeFragment({
          id: `Message:${newMessageId}`,
          fragment: MessageFragmentFragmentDoc,
          fragmentName: "MessageFragment",
          data: {
            ...messageFragment,
            localStatusError: true,
          },
        });
      }
      setIsSending(false);
    }
  };
  return (
    <div
      className={classNames(
        "flex flex-1 flex-col h-screen max-w-full lg:max-w-[calc(100%-300px)] overflow-x-hidden",
        className,
      )}
    >
      <div className={"shadow w-full p-4"}>
        <div className={"flex flex-col gap-2 justify-start items-start"}>
          <Link
            href="/"
            className={"md:hidden text-[#132e53] underline cursor-pointer"}
          >
            Back
          </Link>
          <div className="flex-col md:flex-row flex justify-between w-full gap-4">
            <div className={"text-[#132e53] text-sm md:text-lg font-semibold"}>
              {!showEditTitle ? (
                <h3
                  onClick={() => {
                    setTitle(topic?.name || "");
                    setShowEditTitle(true);
                  }}
                >
                  {topic?.name || topic?.aiTitle || "New Conversation"}
                </h3>
              ) : (
                <input
                  autoFocus={true}
                  type="text"
                  className={
                    "text-[#132e53] text-lg font-semibold outline-[#039fb8]"
                  }
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  onBlur={() => {
                    handleUpdateTopic(id, { name: title });
                    setShowEditTitle(false);
                  }}
                />
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {topic?.tags?.map((item) => {
                return (
                  <TagContainer
                    description={item.content}
                    onRemove={() => {
                      updateTopic({
                        variables: {
                          updateTopicId: id,
                          input: {
                            tagIds:
                              topic?.tags
                                ?.filter((t) => t.id !== item.id)
                                .map((t) => t.id) || [],
                          },
                        },
                        optimisticResponse: {
                          updateTopic: {
                            ...topic,
                            tags: topic.tags?.filter((t) => t.id !== item.id),
                            __typename: "Topic",
                          },
                        },
                      });
                    }}
                    key={`tag-${item.id}`}
                    text={item.displayName}
                  />
                );
              })}
              <div className={"flex gap-2 items-center"}>
                <Popover
                  trigger={
                    <button
                      className={
                        "flex items-center bg-gray-200 py-2 px-4 rounded-full cursor-pointer text-[#525252]"
                      }
                    >
                      <RiAddFill size={24} />
                      <span>Tag</span>
                    </button>
                  }
                >
                  <h3 className={"p-3 text-[#525252] text-sm font-semibold"}>
                    Select tags
                  </h3>
                  <div
                    className={
                      "flex flex-col overflow-y-auto max-h-[50vh] gap-2 p-2"
                    }
                  >
                    {availableSectionTags}
                  </div>
                </Popover>
                <TopicPinningButton topicId={id} />
              </div>
            </div>
          </div>
          <p className={"text-[#132e53] text-sm"}>{messages.length} messages</p>
        </div>
      </div>
      <div
        className={
          "flex-1 p-4 overflow-y-auto overflow-x-hidden flex flex-col gap-6 max-w-full"
        }
        ref={containerRef}
      >
        {messages.map((message) => (
          <MessageCard
            viewer={viewer?.viewer?.user}
            handleResend={() => handleResend(message)}
            onRefetch={onRefetch}
            containerRef={containerRef}
            topicId={id}
            message={message}
            key={message.id}
          />
        ))}
        <div ref={endRef} />
      </div>
      <ComposeInput
        prompts={prompts}
        selectedModel={selectedModel}
        onModelChange={onModelChange}
        isSending={isSending}
        onStopStream={handleStopStream}
        onSend={handleSend}
      />
    </div>
  );
};

export default Conversation;
