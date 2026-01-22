"use client";

import { useRouter } from "next/navigation";
import { FaArrowRight } from "react-icons/fa";

export default function Section() {
  const router = useRouter()
  return (
    <div className="flex justify-center items-center text-center flex-col lg:h-full min-h-[80vh] gap-5 w-full">
      <span className="py-2 px-3 text-white border border-white rounded-full">
        COMING SOON
      </span>
      <h1 className="md:text-[75px] text-[50px] w-full text-white text-center font-bold">
        The Future of Shopping is Almost Here…
      </h1>
      <p className="text-white/80 text-center md:w-125.25 text-[0.9rem]">
      Meet BuyIt — your smart assistant for smarter, faster, and easier shopping decisions.
      </p>
      <button className="bg-black/30 backdrop-blur-md border border-white/10 drop-shadow-2xl h-12 gap-2 px-5 flex justify-between items-center rounded-full cursor-pointer">
        <span className="text-white text-[0.9rem]" onClick={() => {
          router.push("/buyit-ai")
        }}>Try Buyit AI</span>{" "}
        <span className="h-8 w-8 bg-white flex justify-center items-center text-black -rotate-45 rounded-full">
          <FaArrowRight />
        </span>
      </button>
    </div>
  );
}
