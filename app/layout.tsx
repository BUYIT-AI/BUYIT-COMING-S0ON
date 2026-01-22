"use client";
import "./globals.css";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { Poppins } from "next/font/google";
import Head from "next/head";
import Header from "./component/header";
import Footer from "./component/footer";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins", // CSS variable
});

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [container, setContainer] = useState<boolean>(false);
  const [form, setForm] = useState<boolean>(false);
  return (
    <html>
      <head>
        <link rel="icon" href="/image/buyitlogo.png" />
      </head>
      <body className={` ${poppins.variable} md:px-20 px-5`}>
        {/* Header with its own animation */}
        <div className="blur"></div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeIn" }}
          className="pt-9"
        >
          <Header />
        </motion.div>

        {/*Nice planet eclipse */}

        <div>{children}</div>
        {/* Footer with delayed animation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeIn" }}
          className="py-9"
        >
          <Footer />
        </motion.div>
      </body>
    </html>
  );
}
