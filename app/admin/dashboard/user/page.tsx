"use client";

import TableComponent from "@/app/component/table_component";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";

interface RecentUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  createdAt: string;
}

export default function User() {
  const [search, setSearch] = useState<string>('')
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentUsersCount, setRecentUsersCount] = useState<number>(0);

  // Fetch recent users
  useEffect(() => {
    const fetchRecentUsers = async () => {
      try {
        const res = await fetch(`/api/fetch-recent-users`);
        const data = await res.json();

        if (res.ok && data.success && Array.isArray(data.data?.users)) {
          setRecentUsers(data.data.users);
          setRecentUsersCount(data.data.count);
        } else {
          setRecentUsers([]);
          setRecentUsersCount(0);
        }
      } catch (error) {
        console.error("Error fetching recent users:", error);
        setRecentUsers([]);
        setRecentUsersCount(0);
      }
    };

    fetchRecentUsers();
  }, []);

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
      <TableComponent search={search} recentUsers={recentUsers} />
    </div>
  );
}
