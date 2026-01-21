"use client";
import logo from "@/public/image/logo.png";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
export default function Header() {
  const dropRef = useRef<HTMLDivElement | null>(null);
  const [showDropdown, setDropDown] = useState<boolean>(false);
  const closeDropdown = (e: MouseEvent) => {
    if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
      setDropDown(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  const openDropDown = () => {
    setDropDown(true);
  };
  const router = useRouter();
  const openHomePage = () => {
    router.push("/");
  };

  const openBookFunc = () => {
    router.push("/book");
  };
  return (
    <div className="text-white flex justify-between items-center h-full relative">
      <Image
        src={logo}
        alt="logo"
        height={30}
        width={30}
        onClick={openHomePage}
        className="cursor-pointer"
      />

      <nav className="md:font-semibold font-normal md:py-0 py-3 text-[0.9rem] md:block hidden">
        <Link href="/features">Feautures</Link>
        <Link href="/contact" className="mx-9">
          Contact
        </Link>
        <Link href="/buyit-ai" className="">
          Try Buyit AI
        </Link>
        <Link href="/book" className="mx-9 md:hidden block">
          Book Now
        </Link>
      </nav>

      <AnimatePresence mode="wait">
        {showDropdown && (
          <motion.nav
            key="drop-down"
            initial={{ height: 0 }}
            animate={{ height: 160 }}
            transition={{ duration: 0.3 }}
            exit={{ height: 0 }}
            ref={dropRef}
            className="md:font-semibold overflow-hidden h-full font-normal z-20 md:py-0 py-3 text-[0.9rem] md:block md:bg-transparent bg-white/10 backdrop-blur-md border border-white/12  md:static absolute left-0 -bottom-45 rounded-[15px] w-full drop-shadow-2xl flex md:flex-row flex-col justify-center items-center text-center gap-4"
          >
            <Link href="/features" onClick={() => setDropDown(false)}>
              Feautures
            </Link>
            <Link
              href="/contact"
              className="mx-9"
              onClick={() => setDropDown(false)}
            >
              Contact
            </Link>
            <Link
              href="/contact"
              className="mx-9"
              onClick={() => setDropDown(false)}
            >
              Try Buyit AI
            </Link>
            <Link
              href="/book"
              className="mx-9 md:hidden block"
              onClick={() => setDropDown(false)}
            >
              Book Now
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
      <button
        className="font box-gradient w-37.5 md:flex hidden items-center gap-2 justify-center h-10 rounded-full text-[0.9rem] cursor-pointer"
        onClick={openBookFunc}
      >
        Book Now{" "}
        <span className="h-5 w-5 bg-white text-blue-900 rounded-full flex justify-center items-center">
          <FaArrowRight size={10} />
        </span>
      </button>

      <span className="md:hidden block" onClick={openDropDown}>
        <HiOutlineMenuAlt3 size={35} />
      </span>
    </div>
  );
}
