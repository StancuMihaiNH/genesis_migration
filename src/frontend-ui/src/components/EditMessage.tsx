import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import classNames from "classnames";
import {
  Message,
  MessageFragmentFragment,
  MessageFragmentFragmentDoc,
  MessageRole,
  MessagesDocument,
  MessagesQuery,
  TopicFragmentFragment,
  TopicFragmentFragmentDoc,
  useCreateMessageMutation,
  useUpdateMessageMutation,
} from "@/graphql/__generated__/schema";
import useMessageStore, {
  handleSendAndStreamCallback,
} from "@/store/useMessageStore";
import { newID } from "@/utils/id";
import { getUnixTime } from "date-fns";

type FormValue = {
  content: string;
};
const EditMessage: React.FC<{
  topicId: string;
  message: Message;
  onClose: () => void;
  onRefetch?: () => void;
}> = ({ message, onClose, topicId }) => {
  const { selectedModel } = useMessageStore();
  const [updateMessage, { client }] = useUpdateMessageMutation();
  const [createMessage] = useCreateMessageMutation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValue>({
    defaultValues: {
      content: message.content,
    },
  });

  const watchContent = watch("content");
  const hasChange = useMemo(() => {
    return watchContent !== message.content;
  }, [message.content, watchContent]);

  const appendMessageToCache = (message: Message) => {
    const readQuery = client.readQuery({
      query: MessagesDocument,
      variables: {
        topicId,
      },
    });
    client.writeQuery({
      query: MessagesDocument,
      variables: {
        topicId,
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

  const onSubmit = (data: FormValue) => {
    updateMessage({
      variables: {
        topicId,
        messageId: message.id,
        input: {
          content: data.content,
          model: selectedModel,
        },
      },
      optimisticResponse: {
        updateMessage: {
          ...message,
          ...data,
          model: selectedModel,
          __typename: "Message",
        },
      },
    });
    client.writeFragment({
      fragment: MessageFragmentFragmentDoc,
      fragmentName: "MessageFragment",
      id: `Message:${message.id}`,
      data: {
        ...message,
        ...data,
        model: selectedModel,
      },
    });
    if (message.role === "user") {
      const readQuery = client.readQuery({
        query: MessagesDocument,
        variables: {
          topicId,
        },
      });
      const prevMessages = readQuery?.messages?.items;
      if (prevMessages) {
        let keepMessages: Message[] = [];
        for (let i = 0; i < prevMessages.length; i++) {
          const msg = { ...prevMessages[i] };
          if (msg.id === message.id) {
            msg.content = data.content;
          }
          keepMessages.push(msg);
          if (msg.id === message.id) {
            break;
          }
        }
        client.writeQuery({
          query: MessagesDocument,
          variables: {
            topicId,
          },
          data: {
            ...readQuery,
            messages: {
              ...readQuery.messages,
              items: keepMessages,
            },
          },
        });

        const topicFragment = client.readFragment<TopicFragmentFragment>({
          id: `Topic:${topicId}`,
          fragment: TopicFragmentFragmentDoc,
          fragmentName: "TopicFragment",
        });
        const nowUnix = getUnixTime(new Date());
        if (topicFragment) {
          const newResponseMessage: Message = {
            id: newID(),
            role: MessageRole.Assistant,
            content: "",
            files: [],
            model: selectedModel,
            sourceDocuments: [],
            createdAt: nowUnix,
            updatedAt: nowUnix,
            localStatusError: false,
          };
          appendMessageToCache({
            ...newResponseMessage,
          });
          const tags = topicFragment.tags || [];
          try {
            handleSendAndStreamCallback(
              {
                messages: keepMessages,
                model: selectedModel,
                tags,
              },
              (res, err) => {
                const messageFragment =
                  client.readFragment<MessageFragmentFragment>({
                    id: `Message:${newResponseMessage.id}`,
                    fragment: MessageFragmentFragmentDoc,
                    fragmentName: "MessageFragment",
                  });
                if (!messageFragment) {
                  return;
                }
                if (err) {
                  const readQuery = client.readQuery<MessagesQuery>({
                    query: MessagesDocument,
                    variables: {
                      topicId,
                    },
                  });
                  client.writeQuery({
                    query: MessagesDocument,
                    variables: {
                      topicId,
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
                  return;
                }
                if (res === "__done__") {
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
                    content = messageFragment.content.replace(
                      `${match[0]}]`,
                      "",
                    );
                  }
                  createMessage({
                    variables: {
                      topicId,
                      input: {
                        id: messageFragment.id,
                        role: messageFragment.role,
                        content,
                        model: messageFragment.model,
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
              topicId,
            );
          } catch (err) {}
        }
      }
    }
    onClose();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={"w-full"}>
        <TextareaAutosize
          maxRows={20}
          {...register("content", { required: true })}
          className={classNames("w-full p-2 border border-gray-300 rounded", {
            "border-red-500": errors.content,
          })}
          placeholder="Type your message here..."
        />
      </div>
      <div className={"flex gap-2 justify-end"}>
        <button
          onClick={onClose}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded mt-2 hover:opacity-90"
          type={"button"}
        >
          Cancel
        </button>
        <button
          disabled={!hasChange}
          type="submit"
          className="bg-[#039fb8] text-white px-4 py-2 rounded mt-2 hover:opacity-90 disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default EditMessage;
