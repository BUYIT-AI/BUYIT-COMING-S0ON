"use client";

import { useEffect, useState } from "react";
import Section from "./component/section";
import { AnimatePresence, motion } from "framer-motion";
import Loading from "./loading";
import LoginForm from "./component/loginForm";
interface FormData {
  first_name: string;
  last_name: string;
  email: string;
}
export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [container, setContainer] = useState<boolean>(false);
  const [form, setForm] = useState<boolean>(false);
  const [showLoginForm, setShowLoginForm] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: [value] });
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/create-user-api", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          first_name: String(formData.first_name),
          last_name: String(formData.last_name),
          email: String(formData.email),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return console.log(data.message);
      }

      console.log(data);
      //To remove the form and put in the container
      setForm(false);
      setShowLoginForm(false)
      setContainer(true);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
      });
    } catch (error) {
      console.error(error);
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
  ];
  
  useEffect(() => {
    const hasToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));

    if (hasToken) {
      setContainer(true);
      setForm(false);
      setShowLoginForm(false);
      setIsLoading(false);
    } else {
      const timer = setTimeout(() => {
        setForm(false);
        setShowLoginForm(true)
        setIsLoading(false);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, []);

  if (isLoading) {
    return <Loading />;
  }
   

  const openLoginForm = () => {
    setShowLoginForm(true);
    setForm(false);
  }

  const openSignupForm = () => {
    setShowLoginForm(false);
    setForm(true);
  }
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
          <div className="text-white fixed top-0 left-0 h-full w-full bg-black z-10 flex justify-center items-center">
            <motion.div
              key="intro-form"
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
                      className={`flex flex-col gap-1 w-full ${
                        f.name == "email" && "col-span-2"
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
                        className="h-12 bg-black/80 border border-white/12 rounded outline-none  px-4 text-white/50 text-[0.8rem]"
                      />
                    </div>
                  ))}
                </div>
                <p className="my-2 text-[0.9rem] text-purple-500 underline cursor-pointer" onClick={openLoginForm}>Already have an account ? Log in</p>
                <button className="h-12 bg-linear-to-r from-purple-600 to-purple-800 w-full my-2 rounded">
                  Submit
                </button>
              </form>
            </motion.div>
          </div>
        )}
        {showLoginForm && (
          <div className="text-white fixed top-0 left-0 h-full w-full bg-black z-10 flex justify-center items-center">
            <LoginForm openSignupForm={openSignupForm} closeLoginForm={() => setShowLoginForm(false)} />
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
