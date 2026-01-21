"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoadingComponent from "./loading";
import Message from "./message";
interface formData {
  name: string;
  email: string;
  product: string;
  interest: string;
}

interface Props {
  backFunc: () => void;
}
export default function BuyerForm({ backFunc }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCancelLoading, setIsCancelLoading] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [status, setStatus] = useState<number | null>(null);
  const [messageText, setMessageText] = useState<string>("");
  const [formData, setFormData] = useState<formData>({
    name: "",
    email: "",
    product: "",
    interest: "",
  });

  useEffect(() => {
    setStatus(null);
  }, [status]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const deleteBooking = async (id: string) => {
    setIsCancelLoading(true);
    try {
      const res = await fetch(`/api/delete-buyer-api/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 3000);
        setMessageText(data.message);
        setStatus(data.status);
        return;
      }

      setIsCancelLoading(false);

      setFormData({
        name: "",
        email: "",
        product: "",
        interest: "",
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

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/create-buyer-api`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          product: formData.product,
          interest: formData.interest,
        }),
      });

      const data = await res.json();

      setIsLoading(false);
      setIsCancelLoading(false);

      if (!res.ok) {
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 3000);
        setMessageText(data.message);
        setStatus(data.status);
        setUserId(data.id);
        console.log(data);
        return;
      }

      setFormData({
        name: "",
        email: "",
        product: "",
        interest: "",
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
      type: "text",
      label: "Full name",
      value: formData.name,
      onchange: handleChange,
      placeholder: "John Doe",
      name: "name",
    },

    {
      type: "email",
      label: "Email",
      value: formData.email,
      onchange: handleChange,
      placeholder: "example@gmail.com",
      name: "email",
    },
    {
      type: "text",
      label: "What are favourite product ?",
      value: formData.product,
      onchange: handleChange,
      placeholder: "e.g, Shoes, Clothe",
      name: "product",
    },
    {
      type: "text",
      label: "Interest",
      value: formData.interest,
      onchange: handleChange,
      placeholder: "What are you interested in ?",
      name: "interest",
    },
  ];
  return (
    <div className="flex justify-center items-center flex-col md:min-h-screen min-h-[80vh]">
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
      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeIn" }}
        onSubmit={handleSubmit}
        className="flex gap-2 flex-col md:w-115 w-full h-full rounded-[20px] bg-slate-900/60 backdrop-blur-md border border-white/15 p-4 drop-shadow-2xl my-12"
      >
        <h1 className="text-[30px] text-white">Buyer </h1>
        <p className="text-[0.9rem] text-white/30">
          Be our selected participant to buy the future of commerce.
        </p>

        <div className="my-3 flex flex-col gap-5">
          {form.map((f, i) => (
            <div
              key={i}
              className={`flex gap-1 flex-col ${
                f.name == "interest" && "col-span-2"
              }`}
            >
              <label className="text-white text-[0.9rem]">{f.label}</label>
              {f.name == "interest" ? (
                <textarea
                  name={f.name}
                  value={f.value}
                  rows={7}
                  onChange={f.onchange}
                  placeholder={f.placeholder}
                  className="h-33 w-full border border-white/10 bg-slate-800/30 rounded placeholder:text-white/30 text-white text-[0.9rem] outline-none px-5 py-2.5 resize-none scroll"
                />
              ) : (
                <input
                  type={f.type}
                  name={f.name}
                  value={f.value}
                  onChange={f.onchange}
                  placeholder={f.placeholder}
                  className="h-12 w-full border border-white/10 bg-slate-800/30 rounded placeholder:text-white/30 text-white text-[0.9rem] outline-none px-5 py-2.5"
                />
              )}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <span
            className="bg-blue-950/50 h-13 rounded text-white flex justify-center items-center"
            onClick={() => (status == 401 ? deleteBooking(userId) : backFunc())}
          >
            {status == 400 ? (
              <div>
                {isCancelLoading ? <LoadingComponent /> : "Cancel Booking"}
              </div>
            ) : (
              "Back"
            )}
          </span>
          <button
            type={isLoading ? "button" : "submit"}
            className="bg-blue-950 h-13 rounded text-white"
          >
            {isLoading ? <LoadingComponent /> : "Submit"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
