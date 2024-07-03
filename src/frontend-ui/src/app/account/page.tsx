"use client";
import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  useUpdateUserMutation,
  useViewerQuery,
} from "@/graphql/__generated__/schema";
import Link from "next/link";
import useUpload from "@/hooks/useUpload";
import UpdateUserProfile from "@/components/UpdateUserProfile";
const Sidebar = dynamic(() => import("@/components/sidebar"), { ssr: false });
const Page = () => {
  const { data, refetch } = useViewerQuery();
  const [update] = useUpdateUserMutation();
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { upload } = useUpload();
  const [showUpdateUserProfile, setShowUpdateUserProfile] = useState(false);
  return (
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
        <div className={"bg-white shadow max-w-lg w-lvw rounded"}>
          <h1 className={"text-2xl font-bold p-4"}>Account</h1>
          <div className={"p-4 flex flex-col gap-2"}>
            <div>
              <input
                className={"hidden"}
                disabled={uploading}
                onChange={async (e) => {
                  if (!data?.viewer?.user?.id) {
                    return;
                  }
                  if (!e.target.files || e.target.files.length === 0) {
                    return;
                  }
                  const file = e.target.files[0];
                  try {
                    setUploading(true);
                    const key = await upload(file);
                    await update({
                      variables: {
                        updateUserId: data?.viewer?.user?.id,
                        input: {
                          avatar: key,
                        },
                      },
                    });
                    await refetch();
                  } catch (error) {
                    console.log(error);
                    alert("Failed to upload file");
                  } finally {
                    setUploading(false);
                    if (avatarFileRef.current) {
                      avatarFileRef.current.value = "";
                    }
                  }
                }}
                ref={avatarFileRef}
                type={"file"}
                accept={"image/*"}
              />
              <div className={"w-[100px] h-[100px] bg-gray-500 rounded-full"}>
                {data?.viewer.user?.avatarUrl ? (
                  <img
                    src={data?.viewer.user?.avatarUrl}
                    alt={data?.viewer.user?.name}
                    className={"w-full h-full object-cover rounded-full"}
                  />
                ) : (
                  <div
                    className={
                      "w-full h-full flex items-center justify-center text-white text-3xl"
                    }
                  >
                    {data?.viewer.user?.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  if (avatarFileRef.current) {
                    avatarFileRef.current.click();
                  }
                }}
                disabled={uploading}
                className={"text-primary text-sm"}
              >
                {uploading ? "Uploading..." : "Change Avatar"}
              </button>
            </div>
            <div>
              <p>
                <strong>Name:</strong> {data?.viewer?.user?.name}
              </p>
              <p>
                <strong>Email:</strong> {data?.viewer?.user?.email}
              </p>
              <div>
                <p>
                  <strong>Password:</strong> ********{" "}
                </p>
                {!showUpdateUserProfile ? (
                  <button
                    onClick={() => setShowUpdateUserProfile(true)}
                    className={"text-primary text-sm"}
                  >
                    Update my profile
                  </button>
                ) : (
                  <div className={"shadow p-2 mt-4"}>
                    {!data?.viewer.user ? (
                      <p>Loading...</p>
                    ) : (
                      <UpdateUserProfile
                        user={data?.viewer?.user}
                        onCompleted={() => {
                          setShowUpdateUserProfile(false);
                        }}
                        onCanceled={() => {
                          setShowUpdateUserProfile(false);
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
