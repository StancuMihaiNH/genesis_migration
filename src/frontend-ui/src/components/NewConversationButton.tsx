import React from "react";
import {
  TopicsDocument,
  useCreateTopicMutation,
} from "@/graphql/__generated__/schema";
import { useRouter } from "next/navigation";
import { useApolloClient } from "@apollo/client";
import classNames from "classnames";

const NewConversationButton = () => {
  const [create, { loading }] = useCreateTopicMutation();
  const router = useRouter();
  const client = useApolloClient();
  const handleNewTopic = async () => {
    try {
      const { data } = await create({
        variables: {
          input: {
            name: "",
            description: "",
            tagIds: [],
          },
        },
      });
      client.refetchQueries({
        include: [TopicsDocument],
      });
      router.push(`/conversation/${data?.createTopic.id}`);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <button
      disabled={loading}
      className={classNames(
        "bg-[#039fb8] text-white rounded p-2 w-full cursor-pointer",
        { "animate-pulse": loading },
      )}
      onClick={handleNewTopic}
    >
      New Conversation
    </button>
  );
};

export default NewConversationButton;
