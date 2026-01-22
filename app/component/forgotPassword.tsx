"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Message from "./message";

interface Props {
  openLoginForm: () => void;
}
export default function ForgotPassword({ openLoginForm }: Props) {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<string>("");
  const [messageStatus, setMessageStatus] = useState<boolean>(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/send-link-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email
        }),
      });

      const data = await res.json();
      setIsLoading(false);

      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      if (res.ok) {
        setMessageStatus(true);
        setMessageText(data.message || "Password reset link sent!");
        console.log("Forgot password successful:", data);
      } else {
        setMessageStatus(false);
        setMessageText(data.message || "Failed to send reset link.");
        console.error("Forgot password failed:", data);
      }
    } catch (error) {
        console.error("An error occurred:", error);
      setIsLoading(false);
      setShowMessage(true);
    }
  };

  const formMap = [
    {
      name: "email",
      label: "Email Address",
      placeholder: "Enter your email address",
      value: email,
      type: "email",
      onChange: handleChange,
    },
  ];
  return (
    <div className="text-white fixed top-0 left-0 h-full w-full bg-black z-10 flex justify-center items-center">
      <AnimatePresence mode="wait">
        {showMessage && (
          <motion.div
            key="message-password"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.2, ease: "easeIn" }}
            exit={{ y: "-100%" }}
            className="fixed top-0 left-0 z-30 w-full bg-black py-5 px-3 drop-shadow-2xl transition-all duration-200 overflow-hidden"
          >
            <Message
              message={messageText}
              cancel={() => setShowMessage(false)}
              status={messageStatus}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        key="password-form"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.3, ease: "easeIn" }}
      >
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white/10 md:w-100 w-80 p-4 backdrop-blur-md border border-white/5 rounded flex justify-start items-start flex-col gap-1"
        >
          <h1 className="text-2xl">Forgot Password</h1>
          <p className="text-white/25 text-[0.9rem]">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
          <div className={`mt-3 w-full  flex-col flex  gap-4`}>
            {formMap.map((f, i) => (
              <div key={i} className={`relative flex flex-col gap-1 w-full`}>
                <label className="text-[0.9rem] text-white/50">{f.label}</label>
                <input
                  type={f.type}
                  name={f.name}
                  onChange={f.onChange}
                  value={f.value}
                  disabled={isLoading}
                  className="h-12 bg-black/80 border border-white/12 rounded outline-none  px-4 text-white/50 text-[0.8rem] disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            ))}
          </div>
          <p
            className="my-2 text-[0.9rem] text-purple-500 underline cursor-pointer"
            onClick={() => {
              openLoginForm();
            }}
          >
            I have an account? Log in
          </p>
          <button
            disabled={isLoading}
            className="h-12 bg-linear-to-r from-purple-600 to-purple-800 w-full my-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Submit"}
          </button>

        </form>
      </motion.div>
    </div>
  );
}
