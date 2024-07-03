import React, { useEffect, useState } from "react";
import {
  Category,
  Tag,
  useCategoriesAndTagsQuery,
  User,
  UserRole,
  useUpdateTagMutation,
} from "@/graphql/__generated__/schema";
import DisplayTag from "@/components/DisplayTag";
import Tooltip from "@/components/Tooltip";

type Section = {
  id: string;
  category: Category;
  tags: Tag[];
};
const Tags: React.FC<{
  selectedTags?: Tag[];
  onSelectTag?: (tag: Tag) => void;
  onRemoveTag?: (tag: Tag) => void;
  isAdmin?: boolean;
  viewer?: User | null;
}> = ({ selectedTags, viewer, onSelectTag, onRemoveTag, isAdmin }) => {
  const [updateTag] = useUpdateTagMutation();
  const [sections, setSections] = useState<Section[]>([]);
  const { data, refetch } = useCategoriesAndTagsQuery();
  const categories = data?.categories || [];
  const tags = data?.tags || [];
  useEffect(() => {
    const _sections: Section[] = categories.map((category) => {
      return {
        id: category.id,
        category,
        tags: tags.filter((tag) => tag.category?.id === category.id),
      };
    });
    const generalTags = tags.filter(
      (tag) =>
        !tag.category || categories.every((c) => c.id !== tag.category?.id),
    );
    setSections([
      {
        id: "General",
        category: {
          id: "General",
          title: "General",
          createdAt: 0,
          user: {
            createdAt: 0,
            email: "",
            id: "",
            name: "",
            role: UserRole.Admin,
          },
          userId: "",
        },
        tags: generalTags,
      },
      ..._sections,
    ]);
  }, [data]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    tag: Tag,
    categoryId: string,
  ) => {
    e.dataTransfer.setData("tagId", tag.id);
    e.dataTransfer.setData("fromCategoryId", categoryId);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, categoryId: string) => {
    e.preventDefault();
    const tagId = e.dataTransfer.getData("tagId");
    const fromCategoryId = e.dataTransfer.getData("fromCategoryId");
    const tag = tags.find((t) => t.id === tagId);
    if (!tag) return;
    if (fromCategoryId === categoryId) return;
    updateTag({
      variables: {
        input: {
          id: tagId,
          categoryId: categoryId === "General" ? null : categoryId,
          content: tag.content,
          displayName: tag.displayName,
        },
      },
      onCompleted: () => {
        refetch();
      },
    });
    // Move tag to new category
    const newSections = sections.map((section) => {
      if (section.id === categoryId) {
        return {
          ...section,
          tags: section.tags.filter((t) => t.id !== tag.id).concat(tag),
        };
      }
      if (section.id === fromCategoryId) {
        return {
          ...section,
          tags: section.tags.filter((t) => t.id !== tag.id),
        };
      }
      return section;
    });

    setSections(newSections);
  };

  return (
    <div className={"flex flex-col gap-4"}>
      {sections.map((section) => (
        <div
          key={section.id}
          onDragOver={handleDragOver}
          onDrop={(e) => {
            onDrop(e, section.id);
          }}
        >
          <div className={"flex"}>
            <Tooltip
              trigger={
                <h3
                  className={"text-lg font-semibold text-[#132e53] w-auto flex"}
                >
                  {section.category.title} ({section.tags.length})
                </h3>
              }
            >
              <p>{section.category.description || section.category.title}</p>
            </Tooltip>
          </div>
          <div className={"flex flex-wrap gap-2 mt-4"}>
            {section.tags.map((tag) => (
              <div
                key={tag.id}
                draggable={isAdmin}
                onDragStart={(e) => {
                  handleDragStart(e, tag, section.id);
                }}
              >
                <DisplayTag
                  onRemove={onRemoveTag}
                  onSelected={onSelectTag}
                  canDelete={isAdmin || viewer?.id === tag.user.id}
                  selected={selectedTags?.some((t) => t.id === tag.id)}
                  tag={tag}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tags;
