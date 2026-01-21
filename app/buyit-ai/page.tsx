"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { FaArrowUp, FaChevronLeft } from "react-icons/fa";
import { FaCircleUser, FaWandMagicSparkles } from "react-icons/fa6";
import logo from "@/public/image/logo.png";
import { motion } from "framer-motion";
interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
}

export default function BuyIt() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));

  // Scroll chat container to latest message
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Main sending logic extracted so tags can use it
  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user" as const,
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/create-ai-api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionId, message: textToSend }),
      });

      const data = await res.json();

      setTimeout(() => {
        const aiMsg = {
          id: Date.now() + 1,
          sender: "ai" as const,
          text: data?.message || "Sorry, I couldn't generate a response.",
        };

        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
      }, 800);
    } catch (err) {
      console.error(err);
      setIsTyping(false);
    }
  };

  // Handler for Manual Send button
  const handleSend = () => sendMessage(message);

  // Handler for Suggestion Tags
  const handleTagClick = (tagText: string) => {
    sendMessage(tagText);
  };

  return (
    <div
      className={`${
        messages.length > 0
          ? "fixed top-0 left-0 min-h-screen w-full z-20"
          : " min-h-[80vh] "
      } flex justify-center items-center my-7 transition-all duration-150`}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeIn" }}
        className={`${
          messages.length > 0
            ? "fixed top-0 left-0 h-full w-full rounded-none"
            : "rounded-[30px]"
        } bg-[#202427]/40 drop-shadow-2xl backdrop-blur-md p-6 flex flex-col gap-4 transition-all duration-150`}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col gap-2 justify-center items-center mb-8">
            <h2 className="text-[29px] text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-purple-400">
              Hello How Can We Help You?
            </h2>
            <p className="text-white/30">
              Ask me questions based on buying and selling.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 h-full overflow-y-auto scroll px-1 md:mb-[7.1rem] mb-[8.7rem] relative">
            <div
              className="fixed top-0 left-0 p-3 cursor-pointer"
              onClick={() => {
                setMessages([]);
              }}
            >
              <span className="text-white">
                <FaChevronLeft />
              </span>
            </div>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${
                  msg.sender === "user"
                    ? "self-end max-w-85 w-full justify-end"
                    : "self-start flex-col w-full"
                }`}
              >
                <span
                  className={`rounded-full flex items-center justify-center h-8 w-8 shrink-0 ${
                    msg.sender === "user" ? "bg-purple-700" : "bg-black"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <FaCircleUser color="white" />
                  ) : (
                    <Image src={logo} alt="logo" width={20} height={20} />
                  )}
                </span>
                <div
                  className="px-5 py-4 rounded bg-black/20 text-white max-w-[70%] wrap-break-word"
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-2 self-start">
                <span className="bg-black flex justify-center items-center rounded-full h-8 w-8 shrink-0">
                  <Image src={logo} alt="logo" width={20} height={20} />
                </span>
                <div className="px-3 py-1 rounded bg-black/20 text-white max-w-[70%] text-[0.9rem] flex items-center gap-2">
                  <span className="animate-pulse">•••</span> AI is typing...
                </div>
              </div>
            )}
            <div ref={chatEndRef}></div>
          </div>
        )}

        {/* Input Area */}
        <div
          className={`${
            messages.length > 0 ? "absolute bottom-8 z-20" : "relative"
          } md:w-[95%] w-[92%] bg-black p-3 rounded-[10px]`}
        >
          <span className="absolute top-4 text-white">
            <FaWandMagicSparkles />
          </span>
          <textarea
            placeholder="Ask Me Market Advice"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            className="w-full resize-none placeholder:pl-1 pl-5 border-none outline-none text-white text-[0.9rem]"
          />
          <div className={`flex items-center justify-between`}>
            {/* Horizontal Scrollable Tags */}
            {messages.length === 0 && (
              <div className="flex gap-2 overflow-x-auto scroll2 scrollbar-none md:max-w-[90%] w-[90%] px-1">
                <span
                  onClick={() => handleTagClick("Explain Market")}
                  className="cursor-pointer hover:bg-white/20 px-3 py-1 bg-[#333]/30 text-white text-[0.8rem] rounded-full whitespace-nowrap"
                >
                  Explain Market
                </span>
                <span
                  onClick={() => handleTagClick("How can I sell?")}
                  className="cursor-pointer hover:bg-white/20 px-3 py-1 bg-[#333]/30 text-white text-[0.8rem] rounded-full whitespace-nowrap"
                >
                  How can I sell?
                </span>
                <span
                  onClick={() => handleTagClick("Where can I sell?")}
                  className="cursor-pointer hover:bg-white/20 px-3 py-1 bg-[#333]/30 text-white text-[0.8rem] rounded-full whitespace-nowrap"
                >
                  Where can I sell?
                </span>
              </div>
            )}

            {/* Send Button */}
            <button
              className={`bg-purple-500 h-8 w-8 rounded-full text-white flex justify-center items-center shrink-0 ml-auto`}
              onClick={handleSend}
            >
              <FaArrowUp />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
