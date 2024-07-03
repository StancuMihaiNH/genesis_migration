import React, { useState } from "react";
import {
  Tag,
  TagsDocument,
  useDeleteTagMutation,
} from "@/graphql/__generated__/schema";
import classNames from "classnames";
import { RiCloseLine } from "react-icons/ri";
import Tooltip from "@/components/Tooltip";
import Modal from "@/components/Modal";

const DisplayTag: React.FC<{
  tag: Tag;
  selected?: boolean;
  onRemove?: (tag: Tag) => void;
  onSelected?: (tag: Tag) => void;
  canDelete?: boolean;
}> = ({ tag, selected, onRemove, onSelected, canDelete }) => {
  const [deleteTag, { loading, client }] = useDeleteTagMutation();
  const [confirmDelete, setConfirmDelete] = useState<Tag | undefined>();
  return (
    <>
      <Tooltip
        delayDuration={0}
        trigger={
          <div
            onClick={() => {
              if (selected && onRemove) {
                onRemove(tag);
              } else {
                if (onSelected) {
                  onSelected(tag);
                }
              }
            }}
            key={tag.id}
            className={classNames(
              "cursor-pointer px-4 py-2 text-[#525252] text-sm hover:opacity-90 rounded-full flex items-center gap-2",
              {
                "bg-[#dee22a]": selected,
                "bg-gray-400": !selected,
              },
            )}
          >
            <p>{tag.displayName}</p>
            {canDelete && (
              <button
                disabled={loading}
                onClick={async (e) => {
                  e.stopPropagation();
                  setConfirmDelete(tag);
                }}
              >
                <RiCloseLine size={20} />
              </button>
            )}
          </div>
        }
      >
        {tag.content || tag.displayName}
      </Tooltip>
      {confirmDelete && (
        <Modal
          title={"Delete Tag"}
          open={true}
          onClose={() => {
            setConfirmDelete(undefined);
          }}
        >
          <div className={"flex flex-col gap-4"}>
            <p>
              Are you sure you want to delete{" "}
              <strong>{confirmDelete.displayName}</strong>?
            </p>
            <div className={"flex gap-4 justify-between"}>
              <button
                onClick={() => {
                  setConfirmDelete(undefined);
                }}
              >
                Cancel
              </button>
              <button
                className={"bg-red-500 text-white rounded px-4 py-2"}
                onClick={async () => {
                  try {
                    deleteTag({
                      variables: {
                        deleteTagId: confirmDelete.id,
                      },
                      optimisticResponse: {
                        deleteTag: true,
                      },
                    });
                    if (onRemove) {
                      onRemove(confirmDelete);
                    }
                    const { tags } = client.readQuery({
                      query: TagsDocument,
                    });
                    if (!tags) return;
                    client.writeQuery({
                      query: TagsDocument,
                      data: {
                        tags: tags.filter(
                          (t: Tag) => t.id !== confirmDelete.id,
                        ),
                      },
                    });
                    setConfirmDelete(undefined);
                  } catch (err) {
                    console.log(err);
                  }
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default DisplayTag;
