"use client";
import { usePathname } from "next/navigation";
import React from "react";

interface Props {
  link?: string;
  label?: string;
  icon?: React.ReactNode;
  path: string;
}
export default function LinkComponent({ link, label, icon, path }: Props) {
  const pathname = usePathname();
  const isActive = pathname === path;
  return (
    <a
      href={path}
      className={`${
        isActive
          ? "rounded-full bg-white text-slate-900 drop-shadow-2xl"
          : "text-white/30"
      } relative  md:h-10 md:w-10 h-13 w-13 flex justify-center items-center text-[1.4rem]`}
    >
      {icon}
    </a>
  );
}
