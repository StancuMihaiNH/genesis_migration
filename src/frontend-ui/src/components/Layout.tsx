"use client";
import React from "react";
import GraphQLProvider from "@/graphql/client";
import AppProvider from "@/context";

const Layout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <GraphQLProvider>
      <AppProvider>{children}</AppProvider>
    </GraphQLProvider>
  );
};

export default Layout;
