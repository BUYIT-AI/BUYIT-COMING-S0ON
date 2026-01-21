"use client";
import phone from "@/public/image/Group 2.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { IoIosMegaphone } from "react-icons/io";
import { LuBrain } from "react-icons/lu";
import { SlCalender } from "react-icons/sl";

export default function Features() {
    const router = useRouter()

    const openHomePage = () => {
        router.push('/')
    }
  return (
    <div className="min-h-screen w-full flex justify-center items-center flex-col gap-3 mt-16">
      <div className="flex flex-col w-full justify-center items-center gap-2.5">
        <h1 className="text-[60px] text-white text-center">
          The Future Of <b>E-Commerce</b>
        </h1>
        <p className="text-white/50 text-center">
          Buy.Sell.Scale powered by <b>AI & Blockchain</b>
        </p>
        <button className="bg-black drop-shadow-2xl border border-white/25 rounded-full w-45 text-white h-10" onClick={openHomePage}>
          Notify Me
        </button>
      </div>
      <div className="mt-20">
        <div className="relative flex gap-19.5">
          <Image src={phone} alt="phone" height={500} width={500} className="lg:static absolute"/>
          <div className="flex flex-col md:gap-10.5 gap-3  md:my-0">
            <div className="flex gap-1.5 flex-col relative blur2">
              <span className="h-10 w-10 bg-black text-white border border-white/15 rounded flex justify-center items-center ">
                <LuBrain />
              </span>
              <h2 className="text-white md:text-[25px] text-[18px]">
                AI Buying & Selling Advisor
              </h2>
              <p className="text-white/55">
                The AI gives clear, practical advice on what to buy and sell.
              </p>
            </div>

            <div className="flex gap-1.5 flex-col relative blur2">
              <span className="h-10 w-10 bg-black text-white border border-white/15 rounded flex justify-center items-center">
                <FaWandMagicSparkles />
              </span>
              <h2 className="text-white md:text-[25px] text-[18px]">
                AI Image Generation for Buyers & Sellers
              </h2>
              <p className="text-white/55">
                The AI gives clear, description on what you want.
              </p>
            </div>
            <div className="flex gap-1.5 flex-col relative blur2">
              <span className="h-10 w-10 bg-black text-white border border-white/15 rounded flex justify-center items-center">
                <IoIosMegaphone />
              </span>
              <h2 className="text-white md:text-[25px] text-[18px]">
                AI Advertisement & Marketing Assistant{" "}
              </h2>
              <p className="text-white/55">
                Even beginners can run professional-level marketing campaigns.{" "}
              </p>
            </div>
            <div className="flex gap-1.5 flex-col relative blur2">
              <span className="h-10 w-10 bg-black text-white border border-white/15 rounded flex justify-center items-center">
                <SlCalender />
              </span>
              <h2 className="text-white md:text-[25px] text-[18px]">
                AI Seasonal Deal Prediction{" "}
              </h2>
              <p className="text-white/55">
                Sellers sell at the right time, not randomly.{" "} 
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
