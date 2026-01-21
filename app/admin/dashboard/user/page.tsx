"use client";

import TableComponent from "@/app/component/table_component";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";

export default function User() {
  const [search, setSearch] = useState<string>('')
  return (
    <div className="p-3 w-full h-full relative">
      <header className="flex md:gap-10 gap-2 items-center md:justify-between w-full">
        <h1 className="text-white md:text-[30px] text-[23px] font-semibold">
          User
        </h1>
        <div className="relative w-full">
          <span className="absolute text-white/25 top-[25%] left-2.5">
            <CiSearch size={20} />
          </span>
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            className="bg-[#272a31] h-10 md:w-75 w-full rounded-full text-white placeholder:text-white/25 text-[0.9rem] px-10 border border-white/15 outline-none"
            placeholder="Search User..."
          />
        </div>
      </header>
      <TableComponent search={search} />
    </div>
  );
}
