"use client";
import Message from "@/app/component/message";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

interface FormData {
  create_password: string;
  confirm_password: string;
}

interface Params {}

export default function LoginForm({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const [formData, setFormData] = useState<FormData>({
    create_password: "",
    confirm_password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<string>("");
  const [messageStatus, setMessageStatus] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const token = params.then((res) => res.key);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`/api/create-new-password${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          create_password: formData.create_password,
          confirm_password: formData.create_password,
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
        setMessageText(data.message || "Login successful!");
        console.log("Creation successful:", data);
        // Reset form after success
        setFormData({
          create_password: "",
          confirm_password: "",
        });
      } else {
        setMessageStatus(false);
        setMessageText(data.message || "Login failed. Please try again.");
        console.error("Creation Password failed:", data);
      }
    } catch (error) {
      setIsLoading(false);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
      setMessageStatus(false);
      setMessageText("An error occurred. Please try again.");
      console.error("Login error:", error);
    }
  };

  const showNewPasswordFunc = () => {
    setShowNewPassword(!showNewPassword);
  };

  const showConfirmPasswordFunc = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const formMap = [
    {
      name: "create_password",
      label: "New Password",
      placeholder: "Enter your new password",
      value: formData.create_password,
      type: showNewPassword ? "text" : "password",
      onChange: handleChange,
    },
    {
      name: "confirm_password",
      label: "Confirm Password",
      placeholder: "Confirm your new password",
      value: formData.confirm_password,
      type: showConfirmPassword ? "text" : "password",
      onChange: handleChange,
    },
  ];
  return (
    <div className="text-white fixed top-0 left-0 h-full w-full bg-black z-10 flex justify-center items-center">
      <AnimatePresence mode="wait">
        {showMessage && (
          <motion.div
            key="message-login"
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
        key="create-new-form"
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
          <h1 className="text-2xl">Create New Password</h1>
          <p className="text-white/25 text-[0.9rem]">
            Please enter your new password below.
          </p>
          <div className={`mt-3 w-full  flex-col flex  gap-4`}>
            {formMap.map((f, i) => (
              <div
                key={i}
                className={`relative flex flex-col gap-1 w-full ${
                  f.name == "email" && "col-span-2"
                }`}
              >
                <label className="text-[0.9rem] text-white/50">{f.label}</label>
                <input
                  type={f.type}
                  name={f.name}
                  onChange={f.onChange}
                  value={f.value}
                  disabled={isLoading}
                  className="h-12 bg-black/80 border border-white/12 rounded outline-none  px-4 text-white/50 text-[0.8rem] disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div
                  className="absolute top-[58%] right-2.5"
                  onClick={() => showNewPasswordFunc()}
                >
                  {f.name === "create_password" && (
                    <div>
                      {showNewPassword ? (
                        <div>
                          <IoMdEye />
                        </div>
                      ) : (
                        <div>
                          <IoMdEyeOff />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div
                  className="absolute top-[58%] right-2.5"
                  onClick={() => showConfirmPasswordFunc()}
                >
                  {f.name === "confirm_password" && (
                    <div>
                      {showConfirmPassword ? (
                        <div>
                          <IoMdEye />
                        </div>
                      ) : (
                        <div>
                          <IoMdEyeOff />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <a
            href="/"
            className="my-2 text-[0.9rem] text-purple-500 underline cursor-pointer"
          >
            Have an account? Log in
          </a>
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
