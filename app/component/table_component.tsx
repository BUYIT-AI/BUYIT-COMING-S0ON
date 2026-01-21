"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import LoadingComponent from "./loading";
import { MdDelete, MdRefresh } from "react-icons/md";
import { IoMdTrash } from "react-icons/io";
import { PiSelection } from "react-icons/pi";
import { u } from "framer-motion/client";

interface Contact {
  id: string;
  name: string;
  email: string;
  type: string;
  message: string;
  createdAt: string;
}

interface Seller {
  id: string;
  first_name: string;
  last_name: string;
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
  name: string;
  email: string;
  product: string;
  interest: string;
  type: string;
  createdAt: string;
}

interface Props {
  search: string;
}

type User = Contact | Seller | Buyer;

export default function TableComponent({ search }: Props) {
  const [type, setType] = useState<"all" | "contact" | "buyer" | "seller">(
    "all"
  );
  const dropRef = useRef<HTMLDivElement | null>(null);
  const [seller, setSeller] = useState<Seller[]>([]);
  const [buyer, setBuyer] = useState<Buyer[]>([]);
  const [contact, setContact] = useState<Contact[]>([]);
  const [userDetails, setUserDetails] = useState<
    Seller | Buyer | Contact | null
  >(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const dropDownRef = useRef<HTMLDivElement | null>(null);

  const typeFunc = (type: "all" | "book" | "contact") => {};

  const fetchAll = async () => {
    setIsLoadingData(true);
    try {
      const res = await fetch(`/api/fetch-all`);
      const data = await res.json();

      if (!res.ok) throw new Error("Failed");

      setContact(data.data.contact);
      setBuyer(data.data.buyer);
      setSeller(data.data.seller);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const showDetailsFunc = async (id: string, type: string) => {
    setShowDetails(true);
    setIsSelected(true);
    try {
      const res = await fetch(`/api/fetch-user/${id}?type=${type}`);
      const data = await res.json();
      if (!res.ok) throw new Error("Failed");
      setUserDetails(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSelected(false);
    }
  };

  const hideDetailsFunc = () => {
    setShowDetails(false);
    setUserDetails(null);
  };

  const refreshUser = () => {
    fetchAll();
  };

  useEffect(() => {
    fetchAll();
    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  const allData = (): User[] => {
    if (type == "buyer") return buyer;
    if (type == "seller") return seller;
    if (type == "contact") return contact;
    return [...buyer, ...seller, ...contact];
  };

  const dataToShow = allData();

  const filteredUsers = useMemo(() => {
    return dataToShow.filter((u) => {
      if ("brand_Name" in u && typeof u.brand_Name === "string") {
        return u.brand_Name.toLowerCase().includes(search.toLowerCase());
      }

      if ("first_name" in u && typeof u.first_name === "string") {
        return u.first_name.toLowerCase().includes(search.toLowerCase());
      }

      if ("name" in u && typeof u.name === "string") {
        return u.name.toLowerCase().includes(search.toLowerCase());
      }

      return false;
    });
  }, [dataToShow, search]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const closeDropdown = (e: MouseEvent) => {
    if (
      dropDownRef.current &&
      !dropDownRef.current.contains(e.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  const deleteUser = async (id: string, userType: string) => {
    setIsLoadingData(true);
    if (userType === "SELLER") {
      try {
        const res = await fetch(`/api/delete-seller-api/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          setIsLoadingData(false);
          return;
        }
        setIsLoadingData(false);
        setSeller((prev) => prev.filter((seller) => seller.id !== id));
      } catch (error) {
        console.error(error);
      }
    } else if (userType === "BUYER") {
      try {
        const res = await fetch(`/api/delete-buyer-api/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          setIsLoadingData(false);
          return;
        }
        setIsLoadingData(false);
        setBuyer((prev) => prev.filter((buyer) => buyer.id !== id));
      } catch (error) {
        console.error(error);
      }
    } else if (userType === "CONTACT") {
      try {
        const res = await fetch(`/api/delete-contact-user/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          setIsLoadingData(false);
          return;
        }
        setContact((prev) => prev.filter((contact) => contact.id !== id));
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="w-full h-full mb-4 overflow-auto scroll bg-[#272a31]  md:p-5 p-3 my-2 rounded-[15px] flex justify-start items-start flex-col gap-3">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-[15px] text-white font-semibold">
          Recent Upcoming Users
        </h1>
        <button
          className={`${
            isLoadingData ? "animate-spin" : ""
          } h-10 w-10 text-white bg-black rounded-full flex justify-center items-center outline-none border-none cursor-pointer`}
          onClick={() => refreshUser()}
        >
          <MdRefresh />
        </button>
      </div>
      <div className="overflow-auto scroll2 w-full">
        <table className="min-w-full w-full scroll2 overflow-auto">
          <thead className="text-left text-white bg-[#202427]">
            <tr className="w-full">
              <td className="th tracking-wider">User Name</td>
              <td className="th tracking-wider">User Id</td>
              <td className="th tracking-wider">Status</td>
              <td className="th tracking-wider">Created At</td>
              <td className="th tracking-wider">Action</td>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoadingData ? (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  <LoadingComponent />
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((u, i) => (
                <tr
                  key={i}
                  className="hover:bg-white/5 w-full pt-2 cursor-pointer"
                  onClick={() => showDetailsFunc(u.id, u.type)}
                >
                  <td>
                    <div className="flex items-center gap-2 pl-3 md:py-2 py-5">
                      <span
                        className={`h-10 w-10 flex justify-center items-center ${
                          u.type === "SELLER"
                            ? "bg-purple-900/30 text-purple-700"
                            : u.type === "BUYER"
                            ? "bg-blue-600/30 text-blue-700"
                            : "bg-green-600/30 text-green-700"
                        } rounded-full md:text-[0.8rem] font-semibold uppercase`}
                      >
                        {"name" in u
                          ? u.name.charAt(0)
                          : `${u.first_name.charAt(0)}${u.last_name.charAt(0)}`}
                      </span>

                      <div className="flex flex-col gap-1">
                        <h1 className="text-white/80 text-[1rem]">
                          {"name" in u
                            ? u.name
                            : `${u.first_name} ${u.last_name}`}
                        </h1>
                        <span className="text-white/30 text-[0.8rem]">
                          {u.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="pl-3 text-white/50 text-[0.8rem] line-clamp-1 md:line-clamp-none">
                      #{u.id}
                    </div>{" "}
                  </td>

                  <td>
                    <div
                      className={`${
                        u.type === "SELLER"
                          ? "bg-purple-900/30 text-purple-700"
                          : u.type === "BUYER"
                          ? "bg-blue-600/30 text-blue-700"
                          : "bg-green-600/30 text-green-700"
                      } flex justify-center items-center rounded-full text-[0.9rem] py-1 w-23 md:w-auto`}
                    >
                      {u.type}
                    </div>
                  </td>

                  <td className="pl-3 text-white/50 text-[0.9rem]">
                    {formatDate(u.createdAt)}
                  </td>

                  <td>
                    <div className="flex gap-2">
                      <button
                        className="bg-red-600/30 text-red-600 h-10 w-10 rounded flex justify-center items-center cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteUser(u.id, u.type);
                        }}
                      >
                        <IoMdTrash />
                      </button>

                      <button className="bg-blue-600/30 text-blue-600 h-10 w-10 rounded flex justify-center items-center">
                        <PiSelection />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-white">
                  No user found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Sidebar*/}
      <div
        className={`fixed top-0 right-0 h-full md:w-90 w-full bg-[#272a31] drop-shadow-2xl py-9 flex  flex-col ${
          showDetails ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-20`}
      >
        {isSelected || !userDetails ? (
          <div>
            <LoadingComponent />
          </div>
        ) : (
          <div>
            <div
              className={`flex justify-center flex-col ${
                !isSelected ? "scale-100 opacity-100" : "scale-95 opacity-0"
              } transition-all duration-300`}
            >
              <span
                className="cursor-pointer fixed -top-9 right-1.5 font-bold text-white text-[1.3rem]"
                onClick={() => hideDetailsFunc()}
              >
                &times;
              </span>
              <div className="flex flex-col justify-center items-center gap-1.5">
                <span
                  className={`h-20 w-20 flex justify-center items-center ${
                    userDetails?.type === "SELLER"
                      ? "bg-purple-900/30 text-purple-700"
                      : userDetails?.type === "BUYER"
                      ? "bg-blue-600/30 text-blue-700"
                      : "bg-green-600/30 text-green-700"
                  } rounded-full md:text-[2rem] font-semibold uppercase`}
                >
                  {"name" in userDetails
                    ? userDetails.name.charAt(0)
                    : `${userDetails.first_name.charAt(
                        0
                      )}${userDetails.last_name.charAt(0)}`}
                </span>
                <h1 className="text-[1.4rem] text-white capitalize">
                  {" "}
                  {"name" in userDetails
                    ? userDetails.name
                    : `${userDetails.first_name} ${userDetails.last_name}`}
                </h1>
                <div className="text-white/50 text-[0.9rem] flex items-center gap-2">
                  {userDetails.email}{" "}
                  <div
                    className={`${
                      userDetails.type === "SELLER"
                        ? "bg-purple-900/30 text-purple-700"
                        : userDetails.type === "BUYER"
                        ? "bg-blue-600/30 text-blue-700"
                        : "bg-green-600/30 text-green-700"
                    } flex justify-center items-center rounded-full text-[0.9rem] py-1 px-2 w-23 md:w-auto`}
                  >
                    {userDetails.type}
                  </div>
                </div>
                <div className="mt-6 w-full px-4 space-y-3">
                  {userDetails.type === "SELLER" ? (
                    <div className="space-y-2">
                      <div className="bg-purple-900/10 border border-purple-900/30 rounded-lg p-3">
                        <p className="text-white/50 text-xs uppercase tracking-wider">
                          Brand
                        </p>
                        <p className="text-white font-semibold text-sm capitalize">
                          {"brand_Name" in userDetails
                            ? userDetails.brand_Name
                            : "N/A"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-purple-900/10 border border-purple-900/30 rounded-lg p-3">
                          <p className="text-white/50 text-xs uppercase tracking-wider">
                            Product
                          </p>
                          <p className="text-white font-semibold text-sm truncate">
                            {"product" in userDetails
                              ? userDetails.product
                              : "N/A"}
                          </p>
                        </div>
                        <div className="bg-purple-900/10 border border-purple-900/30 rounded-lg p-3">
                          <p className="text-white/50 text-xs uppercase tracking-wider">
                            Country
                          </p>
                          <p className="text-white font-semibold text-sm">
                            {"country" in userDetails
                              ? userDetails.country
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="bg-purple-900/10 border border-purple-900/30 rounded-lg p-3">
                        <p className="text-white/50 text-xs uppercase tracking-wider">
                          Social Media
                        </p>
                        <p className="text-white font-semibold text-sm truncate">
                          {"social_media" in userDetails
                            ? userDetails.social_media
                            : "N/A"}
                        </p>
                      </div>
                      <div className="bg-purple-900/10 border border-purple-900/30 rounded-lg p-3">
                        <p className="text-white/50 text-xs uppercase tracking-wider">
                          Interest
                        </p>
                        <p className="text-white font-semibold text-sm">
                          {"interest" in userDetails
                            ? userDetails.interest
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  ) : userDetails.type === "BUYER" ? (
                    <div className="space-y-2">
                      <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-3">
                        <p className="text-white/50 text-xs uppercase tracking-wider">
                          Product Interested
                        </p>
                        <p className="text-white font-semibold text-sm">
                          {"product" in userDetails
                            ? userDetails.product
                            : "N/A"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-3">
                          <p className="text-white/50 text-xs uppercase tracking-wider">
                            Interest
                          </p>
                          <p className="text-white font-semibold text-sm">
                            {"interest" in userDetails
                              ? userDetails.interest
                              : "N/A"}
                          </p>
                        </div>
                        <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-3">
                          <p className="text-white/50 text-xs uppercase tracking-wider">
                            Member Since
                          </p>
                          <p className="text-white font-semibold text-sm">
                            {"createdAt" in userDetails
                              ? new Date(
                                  userDetails.createdAt
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-3">
                        <p className="text-white/50 text-xs uppercase tracking-wider">
                          Subject
                        </p>
                        <p className="text-white font-semibold text-sm">
                          {"type" in userDetails ? userDetails.type : "Contact"}
                        </p>
                      </div>
                      <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-3">
                        <p className="text-white/50 text-xs uppercase tracking-wider">
                          Message
                        </p>
                        <p className="text-white font-semibold text-sm line-clamp-3">
                          {"message" in userDetails
                            ? userDetails.message
                            : "N/A"}
                        </p>
                      </div>
                      <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-3">
                        <p className="text-white/50 text-xs uppercase tracking-wider">
                          Contacted On
                        </p>
                        <p className="text-white font-semibold text-sm">
                          {"createdAt" in userDetails
                            ? new Date(
                                userDetails.createdAt
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
