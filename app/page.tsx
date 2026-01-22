"use client";

import { useEffect, useState } from "react";
import Section from "./component/section";
import { AnimatePresence, motion } from "framer-motion";
import Loading from "./loading";
import LoginForm from "./component/loginForm";
import Message from "./component/message";
import LoadingComponent from "./component/loading";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import ForgotPassword from "./component/forgotPassword";

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [container, setContainer] = useState<boolean>(false);
  const [form, setForm] = useState<boolean>(false);
  const [showLoginForm, setShowLoginForm] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<string>("");
  const [messageStatus, setMessageStatus] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Check password strength in real-time
    if (name === "password") {
      setPasswordStrength({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[!@#$%^&*]/.test(value),
      });
    }
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      const res = await fetch("/api/create-user-api", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          first_name: String(formData.first_name),
          last_name: String(formData.last_name),
          email: String(formData.email),
          password: String(formData.password),
        }),
      });

      const data = await res.json();
      setFormSubmitting(false);

      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      if (!res.ok) {
        setMessageStatus(false);
        setMessageText(data.message || "Signup failed. Please try again.");
        return;
      }

      setMessageStatus(true);
      setMessageText(data.message || "Account created successfully!");

      // To remove the form and put in the container
      setTimeout(() => {
        setForm(false);
        setShowLoginForm(true);
        setContainer(false);
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
        });
        setSuccess(data.success);
      }, 2000);
    } catch (error) {
      setFormSubmitting(false);
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
      name: "first_name",
      label: "First name",
      placeholder: "Enter Your First name",
      value: formData.first_name,
      type: "text",
      onChange: handleChange,
    },
    {
      name: "last_name",
      label: "Last name",
      placeholder: "Enter Your last name",
      value: formData.last_name,
      type: "text",
      onChange: handleChange,
    },
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

  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/verify-token", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Important: Include cookies
        });

        if (res.ok) {
          // Token is valid, show container
          setContainer(true);
          setForm(false);
          setShowLoginForm(false);
          setIsLoading(false);
        } else {
          // Token is invalid or expired, show login form
          setForm(false);
          setShowLoginForm(true);
          setIsLoading(false);
        }
      } catch (error) {
        // Error checking token, show login form
        setForm(false);
        setShowLoginForm(true);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <Loading />;
  }
    

  const openLoginForm = () => {
    setShowLoginForm(true);
    setForm(false);
  };

  const openSignupForm = () => {
    setShowLoginForm(false);
    setForm(true);
  };
  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const childVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {form && (
          <div className="text-white fixed top-0 left-0 h-full w-full bg-black z-10 flex justify-center items-center overflow-y-auto scroll">
            <AnimatePresence mode="wait">
              {showMessage && (
                <motion.div
                  key="message-signup"
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
              key="intro"
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
                <h1 className="text-2xl">Hello there!</h1>
                <p className="text-white/25 text-[0.9rem]">
                  Please to continue put in your details.
                </p>
                <div
                  className={`mt-3 w-full md:grid md:grid-cols-2 flex-col flex  gap-4`}
                >
                  {formMap.map((f, i) => (
                    <div
                      key={i}
                      className={`relative flex flex-col gap-1 w-full ${
                        f.name == "email" || f.name == "password"
                          ? "col-span-2"
                          : ""
                      }`}
                    >
                      <label className="text-[0.9rem] text-white/50">
                        {f.label}
                      </label>
                      <input
                        type={f.type}
                        name={f.name}
                        onChange={f.onChange}
                        value={f.value}
                        disabled={formSubmitting}
                        className="h-12 bg-black/80 border border-white/12 rounded outline-none  px-4 text-white/50 text-[0.8rem] disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <div
                        className="absolute top-[58%] right-2.5 cursor-pointer"
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

                {/* Password Strength Indicators */}
                {formData.password && (
                  <div className="w-full mt-3 p-3 bg-black/50 rounded border border-white/10">
                    <p className="text-[0.8rem] text-white/70 mb-2">Password Requirements:</p>
                    <div className="space-y-1 text-[0.75rem]">
                      <div className={`flex items-center gap-2 ${passwordStrength.length ? "text-green-400" : "text-white/50"}`}>
                        <span>{passwordStrength.length ? "✓" : "○"}</span>
                        <span>At least 8 characters</span>
                      </div>
                      <div className={`flex items-center gap-2 ${passwordStrength.uppercase ? "text-green-400" : "text-white/50"}`}>
                        <span>{passwordStrength.uppercase ? "✓" : "○"}</span>
                        <span>At least 1 UPPERCASE letter (A-Z)</span>
                      </div>
                      <div className={`flex items-center gap-2 ${passwordStrength.lowercase ? "text-green-400" : "text-white/50"}`}>
                        <span>{passwordStrength.lowercase ? "✓" : "○"}</span>
                        <span>At least 1 lowercase letter (a-z)</span>
                      </div>
                      <div className={`flex items-center gap-2 ${passwordStrength.number ? "text-green-400" : "text-white/50"}`}>
                        <span>{passwordStrength.number ? "✓" : "○"}</span>
                        <span>At least 1 number (0-9)</span>
                      </div>
                      <div className={`flex items-center gap-2 ${passwordStrength.special ? "text-green-400" : "text-white/50"}`}>
                        <span>{passwordStrength.special ? "✓" : "○"}</span>
                        <span>At least 1 special character (!@#$%^&*)</span>
                      </div>
                    </div>
                  </div>
                )}

                <p
                  className="my-2 text-[0.9rem] text-purple-500 underline cursor-pointer"
                  onClick={openLoginForm}
                >
                  Already have an account ? Log in
                </p>
                <button
                  disabled={formSubmitting}
                  className="h-12 bg-linear-to-r from-purple-600 to-purple-800 w-full my-2 rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {formSubmitting ? <LoadingComponent /> : "Submit"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
        {showLoginForm && (
          <div className="text-white fixed top-0 left-0 h-full w-full bg-black z-10 flex justify-center items-center overflow-y-auto scroll">
            <LoginForm
              openSignupForm={openSignupForm}
              success={success}
              openContainer={() => {
                setContainer(true);
                setShowLoginForm(false);
              }}
              closeLoginForm={() => setShowLoginForm(false)}
              openForgotPassword={() => setShowForgotPassword(true)}
            />
          </div>
        )}
        {showForgotPassword && (
          <div className="text-white fixed top-0 left-0 h-full w-full bg-black z-10 flex justify-center items-center">
            <ForgotPassword
              openLoginForm={() => {
                setShowLoginForm(true);
                setShowForgotPassword(false);
              }}
            />
          </div>
        )}
        {container && (
          <motion.div
            key="container-info"
            variants={containerVariants}
            initial="hidden"
            animate="visible" // Fixed typo: was "vidible"
            className=" p-4 md:p-8"
          >
            {/* Section with staggered children */}
            <motion.div
              variants={childVariants as any}
              className="" // Added spacing for section content
            >
              <Section />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
