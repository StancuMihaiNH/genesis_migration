"use client";
import React, { useState } from "react";
import {
  CategoriesDocument,
  CategoriesQuery,
  Category,
  useCategoriesQuery,
  useDeleteCategoryMutation,
  UserRole,
  useViewerQuery,
} from "@/graphql/__generated__/schema";
import Link from "next/link";
import { RiAddLine } from "react-icons/ri";
import Sidebar from "@/components/sidebar";
import Modal from "@/components/Modal";
import AddCategoryForm from "@/components/AddCategoryForm";
import TabNav from "@/components/TabNav";
import EditCategoryForm from "@/components/EditCategoryForm";
import classNames from "classnames";

const Page = () => {
  const { data: viewer } = useViewerQuery();
  const [deleteCategory, { client }] = useDeleteCategoryMutation();
  const [showAddCategory, setShowAddCategory] = useState(false);
  const { data, loading } = useCategoriesQuery();
  const [confirmDelete, setConfirmDelete] = useState<Category | undefined>();
  const [showEditCategory, setShowEditCategory] = useState<
    Category | undefined
  >();

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      deleteCategory({
        variables: {
          deleteCategoryId: categoryId,
        },
        optimisticResponse: {
          deleteCategory: true,
        },
      });
      const readQuery = client.readQuery<CategoriesQuery>({
        query: CategoriesDocument,
      });
      if (readQuery) {
        if (readQuery.categories) {
          client.writeQuery<CategoriesQuery>({
            query: CategoriesDocument,
            data: {
              categories: readQuery.categories.filter(
                (c) => c.id !== categoryId,
              ),
            },
          });
        }
      }
      setConfirmDelete(undefined);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div
        className={"flex flex-col md:flex-row h-screen relative md:pl-[300px]"}
      >
        <Sidebar
          className={"hidden md:flex md:w-[300px] fixed left-0 top-0 bottom-0"}
        />
        <div className={"flex flex-col flex-1 p-4 gap-2"}>
          <Link
            href="/"
            className={"md:hidden text-[#132e53] underline cursor-pointer"}
          >
            Back
          </Link>
          <div className={"bg-white"}>
            <TabNav
              links={[
                { title: "Tags", href: "/admin/tags" },
                { title: "Categories", href: "/admin/categories" },
              ]}
            />
            <div className={"flex p-4 gap-2 items-center"}>
              <h1 className={"text-2xl font-bold"}>Categories</h1>
              <button
                onClick={() => setShowAddCategory(true)}
                className={"text-[#132e53] px-4 py-2 rounded flex items-center"}
                type={"button"}
              >
                <RiAddLine />
                Add Category
              </button>
            </div>
            <div className={"p-4"}>
              <div className={"relative overflow-x-auto"}>
                <table
                  className={
                    "w-full text-sm text-left rtl:text-right text-gray-500"
                  }
                >
                  <thead
                    className={
                      "text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700"
                    }
                  >
                    <tr className={"border border-gray-200"}>
                      <th scope="col" className="px-6 py-3">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Owner
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.categories?.map((category) => {
                      const canModify =
                        viewer?.viewer.user?.role === UserRole.Admin ||
                        category.userId === viewer?.viewer.user?.id;
                      return (
                        <tr
                          key={category.id}
                          className={"border border-gray-200"}
                        >
                          <td className={"px-6 py-4"}>{category.title}</td>
                          <td className={"px-6 py-4"}>
                            {category.description}
                          </td>
                          <td className={"px-6 py-4"}>
                            <div className={"flex gap-2 items-center"}>
                              <div
                                className={
                                  "w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                                }
                              >
                                {category.user.avatarUrl ? (
                                  <img
                                    className={"w-full h-full rounded-full"}
                                    src={category.user.avatarUrl}
                                    alt={category.user.name}
                                  />
                                ) : (
                                  category.user?.name?.charAt(0)
                                )}
                              </div>
                              <span>{category.user?.name || "Unknown"}</span>
                            </div>
                          </td>
                          <td className={"px-6 py-4"}>
                            <div className={"flex gap-2 items-center"}>
                              <button
                                disabled={!canModify}
                                onClick={() => {
                                  setShowEditCategory(category);
                                }}
                                className={classNames({
                                  "text-[#132e53]": canModify,
                                  "text-gray-300": !canModify,
                                })}
                              >
                                Edit
                              </button>
                              <button
                                disabled={!canModify}
                                onClick={() => {
                                  setConfirmDelete(category);
                                }}
                                className={classNames(
                                  "text-red-500",
                                  !canModify && "text-gray-300",
                                )}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {confirmDelete && (
        <Modal
          open={true}
          onClose={() => setConfirmDelete(undefined)}
          title={"Delete Category"}
        >
          <div className={"flex flex-col gap-4"}>
            <p>
              Are you sure you want to delete{" "}
              <strong>{confirmDelete.title}</strong>?
            </p>
            <div className={"flex gap-4 justify-between"}>
              <button onClick={() => setConfirmDelete(undefined)}>
                Cancel
              </button>
              <button
                className={"bg-red-500 text-white rounded px-4 py-2"}
                onClick={() => handleDeleteCategory(confirmDelete.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
      {showEditCategory && (
        <Modal
          title={"Edit Category"}
          open={true}
          onClose={() => {
            setShowEditCategory(undefined);
          }}
        >
          <EditCategoryForm
            canChangeOwner={viewer?.viewer.user?.role === UserRole.Admin}
            category={showEditCategory}
            onDone={() => {
              setShowEditCategory(undefined);
            }}
          />
        </Modal>
      )}
      <Modal
        title={"Add Category"}
        open={showAddCategory}
        onClose={() => {
          setShowAddCategory(false);
        }}
      >
        <AddCategoryForm
          onDone={() => {
            setShowAddCategory(false);
          }}
        />
      </Modal>
    </>
  );
};

export default Page;
