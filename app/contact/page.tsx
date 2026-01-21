"use client";

import { useEffect, useState } from "react";
import { MdCheck, MdMail, MdPhone } from "react-icons/md";
import Message from "../component/message";
import { AnimatePresence, motion } from "framer-motion";
import LoadingComponent from "../component/loading";

interface forlgata {
  full_name: string;
  email: string;
  message: string;
}
export default function Contact() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [status, setStatus] = useState<number | null>(null);
  const [messageText, setMessageText] = useState<string>("");
  const [forlgata, setForlgata] = useState<forlgata>({
    full_name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    setStatus(null)
  }, [])

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForlgata({ ...forlgata, [name]: value });
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`/api/send-message`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          full_name: forlgata.full_name,
          email: forlgata.email,
          message: forlgata.message,
        }),
      });

      const data = await res.json();

      setIsLoading(false);

      if (!res.ok) {
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 3000);
        setMessageText(data.message);
        setStatus(data.status);
        console.log(data);
        return;
      }

      setForlgata({
        full_name: "",
        email: "",
        message: "",
      });

      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
      setStatus(data.status);
      setMessageText(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const form = [
    {
      label: "Name",
      value: forlgata.full_name,
      onchange: handleChange,
      placeholder: "John Doe",
      name: "full_name",
    },
    {
      label: "Email",
      value: forlgata.email,
      onchange: handleChange,
      placeholder: "example@gmail.com",
      name: "email",
    },
    {
      label: "Message",
      value: forlgata.message,
      onchange: handleChange,
      placeholder: "Type your message here...",
      name: "message",
    },
  ];


  return (
    <div className="flex lg:justify-center lg:items-center items-start justify-start lg:flex-row flex-col w-full lg:px-8 min-h-[85vh] md:mt-0 mt-[4.1rem]">
      <AnimatePresence mode="wait">
        {showMessage && (
          <motion.div
            key="message"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.2, ease: "easeIn" }}
            exit={{ y: "-100%" }}
            className={`fixed top-0 left-0 z-20 w-full bg-black py-5 px-3 drop-shadow-2xl transition-all duration-200 
             overflow-hidden`}
          >
            <Message
              cancel={() => setShowMessage(false)}
              message={messageText}
              status={
                status == 400 || status == 500
                  ? false
                  : status == 200 || status == 201
                  ? true
                  : false
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className=" flex gap-4.5 flex-col w-full">
        <span className="text-white/80" onClick={() => setShowMessage(true)}>
          WE ARE HERE TO HELP YOU
        </span>
        <h1 className="text-[60px] text-white lg:w-150">
          <b>DISCUSS </b>YOUR OPINION WITH US
        </h1>
        <p className="text-white text-[0.9rem] md:w-120">
          Are you waiting to get your dream product then contact us for more
          info.
        </p>
      </div>
      <div className=" w-full">
        <div className="md:w-100 w-full md:mt-0 mt-16">
          <form onSubmit={handleSubmit} className="flex gap-2 flex-col ">
            {form.map((f, i) => (
              <div
                key={i}
                className={`bg-slate-500/30 backdrop-blur-lg rounded-[10px] px-5 py-4 ${
                  f.name == "message" ? "h-50" : "h-17"
                } flex justify-center flex-col gap-1.5`}
              >
                <label className="text-white/30">{f.label}</label>
                {f.name == "message" ? (
                  <textarea
                    name={f.name}
                    placeholder={f.placeholder}
                    value={f.value}
                    rows={7}
                    onChange={f.onchange}
                    className="w-full resize-none text-white border-none outline-none"
                  />
                ) : (
                  <input
                    type="text"
                    name={f.name}
                    placeholder={f.placeholder}
                    value={f.value}
                    onChange={f.onchange}
                    className="border-none outline-none text-white"
                  />
                )}
              </div>
            ))}
            <button
              type={isLoading ? "button" : "submit"}
              className="bg-blue-950 h-13 rounded text-white"
            >
              {isLoading ? <LoadingComponent /> : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
