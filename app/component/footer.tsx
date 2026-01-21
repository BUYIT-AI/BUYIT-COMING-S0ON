"use client";

import Image from "next/image";
import logo from "@/public/image/logo.png";
import Link from "next/link";
import { AiFillInstagram } from "react-icons/ai";
import { FaFacebook } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { IoLogoLinkedin } from "react-icons/io";
export default function Footer() {
  return (
    <div className="relative flex flex-col justify-end gap-5 h-full">
      <div className="flex justify-between md:flex-row flex-col md:items-center gap-5.5 md:gap-0">
        <div className="flex gap-5  items-center">
          <Image src={logo} alt="logo" height={30} width={30} />
          <div className="w-px h-10 bg-white/40"></div>
          <p className="text-white/80 w-80 text-[0.9rem]">
            Solutions that drive success and propel your buying and selling
            forward.
          </p>
        </div>
    {/*
        <div className="flex gap-8 text-white">
          <Link href="/">Coming Soon</Link>
          <Link href="/contact">Contact</Link>
        </div> */}
      </div>
      <div className="w-full bg-white/20 h-px"></div>
      <div className="flex justify-between items-center">
        <p className="text-white text-[0.9rem]">Copyright &copy; 2026. All Right reserved</p>
        <div className="text-white flex gap-4 text-[24px]">
          <AiFillInstagram />
          <FaFacebook />
          <BsTwitterX />
          <IoLogoLinkedin />
        </div>
      </div>
    </div>
  );
}
