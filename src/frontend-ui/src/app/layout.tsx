import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Layout";
import classNames from "classnames";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "North Highland",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={classNames(inter.className)}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
