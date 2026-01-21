"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaArrowRight, FaShoppingCart } from "react-icons/fa";
import { MdOutlineShop, MdOutlineShoppingBag } from "react-icons/md";
import { TbMoneybag } from "react-icons/tb";
import BuyerForm from "../component/buyerForm";
import SellerForm from "../component/sellerForm";

export default function Book() {
  const [type, setType] = useState<"seller" | "buyer" | null>(null);
  const [container, setContainer] = useState<boolean>(true);
  const [buyerFormContainer, setBuyerFormContainer] = useState<boolean>(false);
  const [sellerFormContainer, setSellerFormContainer] =
    useState<boolean>(false);
  const openType = (type: "seller" | "buyer") => {
    if (type == "seller") {
      setType("seller");
    } else if (type == "buyer") {
      setType("buyer");
    }
  };

  const continueFunc = (type: string) => {
    if (type == "buyer") {
      setBuyerFormContainer(true);
      setContainer(false);
      setSellerFormContainer(false);
    } else if (type == "seller") {
      setBuyerFormContainer(false);
      setContainer(false);
      setSellerFormContainer(true);
    }
  };

  const backFunc = () => {
    setBuyerFormContainer(false);
    setSellerFormContainer(false);
    setContainer(true);
  };

  return (
    <div className="flex justify-center items-center flex-col md:min-h-screen min-h-[80vh]">
      <AnimatePresence mode="wait">
        {container && (
          <motion.div
            key="container"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeIn" }}
            className="flex gap-2 flex-col md:w-150 w-full h-full rounded-[20px] bg-slate-900/60 backdrop-blur-md border border-white/15 p-4 drop-shadow-2xl my-12"
          >
            <h1 className="text-white text-[1.3rem]">Select Type</h1>
            <p className="text-white/25">
              Select what will make us understand you better.
            </p>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-3 my-3">
              <div
                className={` flex justify-center items-center flex-col h-30 bg-black/30 rounded ${
                  type == "buyer"
                    ? " border-2 border-purple-600"
                    : "border border-white/10"
                } cursor-pointer transition-all duration-150`}
                onClick={() => {
                  openType("buyer");
                }}
              >
                <span className="text-white/30">
                  <MdOutlineShoppingBag size={50} />
                </span>
                <h2 className="text-white/70">Buyer</h2>
              </div>
              <div
                className={` flex justify-center items-center flex-col h-30 bg-black/30 rounded ${
                  type == "seller"
                    ? " border-2 border-purple-600"
                    : "border border-white/10"
                } cursor-pointer transition-all duration-150`}
                onClick={() => {
                  openType("seller");
                }}
              >
                <span className="text-white/30">
                  <TbMoneybag size={50} />
                </span>
                <h2 className="text-white/70">Seller</h2>
              </div>
            </div>
            <button
              className="w-full flex items-center justify-center gap-3 text-white bg-purple-800 rounded outline-none border-none py-2 drop-shadow-2xl cursor-pointer"
              onClick={() => {
                continueFunc(type as any);
              }}
            >
              Continue <FaArrowRight />
            </button>
          </motion.div>
        )}
        {buyerFormContainer && (
          <motion.div
            key="buyer"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeIn" }}
          >
            <BuyerForm backFunc={backFunc} />
          </motion.div>
        )}
        {sellerFormContainer && (
          <motion.div
            key="seller"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeIn" }}
          >
            <SellerForm backFunc={backFunc} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
