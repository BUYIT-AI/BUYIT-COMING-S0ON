"use client";
import TableComponent from "@/app/component/table_component";
import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaChevronDown, FaRegTrashAlt } from "react-icons/fa";
import { MdGroup, MdPhone, MdRefresh } from "react-icons/md";

interface Data {
  seller: Seller[];
  buyer: Buyer[];
  contact: Contact[];
}

interface Contact {
  id: string;
}

interface Seller {
  id: string;

  brand_Name: string;
  email: string;
  product: string;
  social_media: string;
  country: string;
  type: string;
  interest: string;
  createdAt: string;
}

interface Buyer {
  id: string;
}

interface RecentUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  createdAt: string;
}

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<Data[]>([]);
  const [search, setSearch] = useState<string>("");
  const [seller, setSeller] = useState<Seller[]>([]);
  const [buyer, setBuyer] = useState<Buyer[]>([]);
  const [contact, setContact] = useState<Contact[]>([]);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentUsersCount, setRecentUsersCount] = useState<number>(0);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchDetails = async () => {
      try {
        const res = await fetch(`/api/fetch-all`);
        const data = await res.json();

        if (!res.ok) {
          console.log("An error occurred while fetching all details");
          return;
        }

        setUsers(data.data);
        setContact(data.data.contact);
        setBuyer(data.data.buyer);
        setSeller(data.data.seller);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, []);

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
    <div className={` w-full h-full relative`}>
      <div
        className={`py-3.5 md:px-10 px-4 w-full absolute top-0 left-0 h-full  overflow-auto scroll
         transition-all duration-150`}
      >
        <header className="flex md:gap-10 gap-2 items-center md:justify-between w-full">
          <h1 className="text-white md:text-[30px] text-[23px] font-semibold">
            Dashboard
          </h1>
          <div className="relative w-full">
            <span className="absolute text-white/25 top-[25%] left-2.5">
              <CiSearch size={20} />
            </span>
            <input
              type="text"
              onChange={handleSearch}
              value={search}
              className="bg-[#272a31] h-10 md:w-75 w-full rounded-full text-white placeholder:text-white/25 text-[0.9rem] px-10 border border-white/15 outline-none"
              placeholder="Search User..."
            />
          </div>
        </header>

        <div className="w-full h-full my-10">
          <div
            className={`md:grid md:grid-cols-[repeat(4,22%)] flex overflow-x-auto scroll2 scrollbar-none md:max-w-full w-full
              gap-8 transition-all duration-150`}
          >
            <div className="p-6 bg-[#272a31] rounded-[15px] border border-white/5 flex flex-col justify-center min-w-[50%] md:min-w-auto ">
              <h1 className="text-white/30">Total Users</h1>
              <div className="flex justify-between items-center">
                <span className="text-white text-[1.3rem] font-semibold">
                  {buyer.length + seller.length + contact.length}
                </span>
                <span className="h-9 w-9 bg-blue-800/30 text-blue-800 flex justify-center items-center rounded">
                  <MdGroup />
                </span>
              </div>
            </div>
            <div className="p-6 bg-[#272a31] rounded-[15px] border border-white/5 flex flex-col justify-center min-w-[50%] md:min-w-auto ">
              <h1 className="text-white/30">Booked Users</h1>
              <div className="flex justify-between items-center">
                <span className="text-white text-[1.3rem] font-semibold">
                  {seller.length + buyer.length}
                </span>
                <span className="h-9 w-9 bg-blue-800/30 text-blue-800 flex justify-center items-center rounded">
                  <MdGroup />
                </span>
              </div>
            </div>

            <div className="p-6 bg-[#272a31] rounded-[15px] border border-white/5 flex flex-col justify-center min-w-[50%] md:min-w-auto ">
              <h1 className="text-white/30">Contacted Users</h1>
              <div className="flex justify-between items-center">
                <span className="text-white text-[1.3rem] font-semibold">
                  {contact.length}
                </span>
                <span className="h-9 w-9 bg-green-800/30 text-green-800 flex justify-center items-center rounded">
                  <MdPhone />
                </span>
              </div>
            </div>

            <div className="p-6 bg-[#272a31] rounded-[15px] border border-white/5 flex flex-col justify-center min-w-[50%] md:min-w-auto ">
              <h1 className="text-white/30">Recently Joined</h1>
              <div className="flex justify-between items-center">
                <span className="text-white text-[1.3rem] font-semibold">
                  {recentUsersCount}
                </span>
                <span className="h-9 w-9 bg-purple-800/30 text-purple-800 flex justify-center items-center rounded">
                  <MdGroup />
                </span>
              </div>
            </div>
          </div>

          <TableComponent search={search} recentUsers={recentUsers} />
        </div>
      </div>
    </div>
  );
}
