import React from "react";
import Image from "next/image";
import { User } from "@/graphql/__generated__/schema";
const Avatar: React.FC<{
  role: "assistant" | "user";
  user?: User | null;
}> = ({ role, user }) => {
  if (role === "assistant") {
    return (
      <div
        className={
          "flex w-10 h-10 rounded-full items-center justify-center bg-[#039fb8]"
        }
      >
        <Image src={"/logo-nh.png"} alt={"NH"} width={20} height={20} />
      </div>
    );
  }

  const avatarUrl = user?.avatarUrl;
  const firstCharOfName =
    user?.name && user.name.length ? user?.name[0].toUpperCase() : "U";
  return (
    <div
      className={
        "flex w-10 h-10 rounded-full bg-[#dee22a] items-center justify-center font-bold"
      }
    >
      {avatarUrl ? (
        <img
          className={"w-full h-full object-cover rounded-full"}
          alt={user?.name}
          src={avatarUrl}
        />
      ) : (
        `${firstCharOfName}`
      )}
    </div>
  );
};

export default Avatar;
