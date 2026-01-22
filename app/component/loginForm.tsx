"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Message from "./message";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useRouter } from "next/navigation";

interface FormData {
  email: string;
  password: string;
}

interface Props {
  openSignupForm: () => void;
  closeLoginForm: () => void;
  openForgotPassword?: () => void;
  openContainer: () => void;
  success?: boolean;
}
export default function LoginForm({
  openSignupForm,
  closeLoginForm,
  openForgotPassword,
  success,
  openContainer,
}: Props) {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<string>("");
  const [messageStatus, setMessageStatus] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
const router = useRouter()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/create-login-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
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
        // Reset form after success
        setFormData({
          email: "",
          password: "",
        });

        // Show container immediately after successful login
             router.push('/')
        setTimeout(() => {
          openContainer();
          closeLoginForm();
        }, 1500);

   
      } else {
        setMessageStatus(false);
        setMessageText(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setIsLoading(false);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
      setMessageStatus(false);
      setMessageText("An error occurred. Please try again.");
    }
  };

  const formMap = [
    {
      name: "email",
      label: "Email Address",
      placeholder: "Enter your email address",
      value: formData.email,
      type: "email",
      onChange: handleChange,
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      value: formData.password,
      type: showPassword ? "text" : "password",
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
        key="login-form"
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
          <h1 className="text-2xl">Welcome Back</h1>
          <p className="text-white/25 text-[0.9rem]">
            Welcome to our platform! Please enter your login details to access
            your account.
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
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {f.name === "password" && (
                    <div>
                      {showPassword ? (
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
          <p
            className="my-2 text-[0.9rem] text-purple-500 underline cursor-pointer"
            onClick={() => {
              closeLoginForm();
              openSignupForm();
            }}
          >
            Dont have an account ? Sign up
          </p>
          <button
            disabled={isLoading}
            className="h-12 bg-linear-to-r from-purple-600 to-purple-800 w-full my-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Submit"}
          </button>
          <p
            className="text-purple-500 text-[0.9rem] underline w-full text-right"
            onClick={openForgotPassword}
          >
            Forgot Password?
          </p>
        </form>
      </motion.div>
    </div>
  );
}
