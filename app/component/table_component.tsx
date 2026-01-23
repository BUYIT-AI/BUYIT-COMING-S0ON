"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import LoadingComponent from "./loading";
import { MdDelete, MdRefresh } from "react-icons/md";
import { IoMdTrash } from "react-icons/io";
import { PiSelection } from "react-icons/pi";

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

interface RecentUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  createdAt: string;
  type?: string; // Add type field for consistency
}

interface Props {
  search: string;
  recentUsers?: RecentUser[];
}

type User = Contact | Seller | Buyer;

export default function TableComponent({ search, recentUsers = [] }: Props) {
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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

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

  // Function to handle displaying recent user details
  const showRecentUserDetails = (user: RecentUser) => {
    setShowDetails(true);
    // For recent users, we display them directly since we have their info
    setUserDetails({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      type: "SIGNUP",
      createdAt: user.createdAt,
    } as any);
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

  // Filter recent users based on search
  const filteredRecentUsers = useMemo(() => {
    if (!Array.isArray(recentUsers)) return [];
    return recentUsers.filter((u) => {
      const fullName = `${u.first_name} ${u.last_name}`.toLowerCase();
      const email = u.email.toLowerCase();
      const searchLower = search.toLowerCase();
      return fullName.includes(searchLower) || email.includes(searchLower);
    });
  }, [recentUsers, search]);

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

  // Pagination logic for regular users
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Pagination logic for search results (combined)
  const allSearchResults = [...filteredRecentUsers, ...filteredUsers];
  const totalSearchPages = Math.ceil(allSearchResults.length / itemsPerPage);
  const searchStartIndex = (currentPage - 1) * itemsPerPage;
  const searchEndIndex = searchStartIndex + itemsPerPage;
  const paginatedSearchResults = allSearchResults.slice(searchStartIndex, searchEndIndex);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

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
    // Show confirmation dialog
    const confirmed = confirm(
      `Are you sure you want to delete this ${
        userType === "SIGNUP" ? "member" : userType.toLowerCase()
      }? This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsLoadingData(true);
    if (userType === "SELLER") {
      try {
        const res = await fetch(`/api/delete-seller-api/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          setIsLoadingData(false);
          alert("Failed to delete seller");
          return;
        }
        setIsLoadingData(false);
        setSeller((prev) => prev.filter((seller) => seller.id !== id));
        alert("Seller deleted successfully");
      } catch (error) {
        console.error(error);
        setIsLoadingData(false);
        alert("Error deleting seller");
      }
    } else if (userType === "BUYER") {
      try {
        const res = await fetch(`/api/delete-buyer-api/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          setIsLoadingData(false);
          alert("Failed to delete buyer");
          return;
        }
        setIsLoadingData(false);
        setBuyer((prev) => prev.filter((buyer) => buyer.id !== id));
        alert("Buyer deleted successfully");
      } catch (error) {
        console.error(error);
        setIsLoadingData(false);
        alert("Error deleting buyer");
      }
    } else if (userType === "CONTACT") {
      try {
        const res = await fetch(`/api/delete-contact-user/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          setIsLoadingData(false);
          alert("Failed to delete contact");
          return;
        }
        setContact((prev) => prev.filter((contact) => contact.id !== id));
        alert("Contact deleted successfully");
      } catch (error) {
        console.error(error);
        setIsLoadingData(false);
        alert("Error deleting contact");
      }
    } else if (userType === "SIGNUP") {
      try {
        const res = await fetch(`/api/delete-presuser/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          setIsLoadingData(false);
          alert("Failed to delete member");
          return;
        }
        setIsLoadingData(false);
        // Remove from recentUsers - recentUsers will need to be managed by parent
        alert("Member deleted successfully");
        // Reload the page to update recent users
        window.location.reload();
      } catch (error) {
        console.error(error);
        setIsLoadingData(false);
        alert("Error deleting member");
      }
    }
  };

  return (
    <div className="w-full h-[95vh] mb-4 overflow-auto scroll bg-[#272a31]  md:p-5 p-3 my-2 rounded-[15px] flex justify-start items-start flex-col gap-3" style={{ contain: 'layout style paint' } as React.CSSProperties}>
      {/* Search Bar - Only show when not searching or show all results */}
      {!search && (
        <>
          {/* Recently Joined Users Section - Hide when searching */}
          {recentUsers.length > 0 && (
            <div className="w-full mb-6 pb-6 border-b border-white/10">
              <h2 className="text-white font-semibold text-[15px] mb-3">
                🎉 Newest Members
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-white text-sm">
                  <thead className="border-b border-white/10">
                    <tr>
                      <th className="text-left py-2 px-3 text-white/50">Name</th>
                      <th className="text-left py-2 px-3 text-white/50">Email</th>
                      <th className="text-left py-2 px-3 text-white/50">Joined</th>
                      <th className="text-left py-2 px-3 text-white/50">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user) => (
                      <tr 
                        key={user.id} 
                        className="border-b border-white/5 hover:bg-white/5 transition-all"
                      >
                        <td className="py-3 px-3 cursor-pointer" onClick={() => showRecentUserDetails(user)}>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-linear-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center text-xs font-semibold">
                              {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                            </div>
                            <span className="text-white/80">{user.first_name} {user.last_name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-white/60 text-sm cursor-pointer" onClick={() => showRecentUserDetails(user)}>{user.email}</td>
                        <td className="py-3 px-3 text-white/60 text-sm cursor-pointer" onClick={() => showRecentUserDetails(user)}>
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="py-3 px-3">
                          <button 
                            className="text-white/50 hover:text-red-500 transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteUser(user.id, "SIGNUP");
                            }}
                            title="Delete member"
                          >
                            <IoMdTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Search Results Title - Show when searching */}
      {search && (
        <div className="w-full mb-4">
          <h2 className="text-white font-semibold text-[15px]">
            Search Results for "{search}"
          </h2>
          <p className="text-white/50 text-sm mt-1">
            Found {filteredRecentUsers.length + filteredUsers.length} result{(filteredRecentUsers.length + filteredUsers.length) !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      <div className="flex justify-between items-center w-full">
        <h1 className="text-[15px] text-white font-semibold">
          Recent Booked Users
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
      <div className="overflow-auto scroll2 w-full" style={{ contain: 'content' } as React.CSSProperties}>
        <table className="min-w-full w-full scroll2 overflow-auto" style={{ borderCollapse: 'collapse' }}>
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
            ) : search ? (
              // Show filtered results from BOTH recent users and regular users when searching
              allSearchResults.length > 0 ? (
                <>
                  {/* Paginated Search Results */}
                  {paginatedSearchResults.map((u) => {
                    // Determine if this is a recent user or regular user
                    const isRecentUser = "first_name" in u && u.type === "SIGNUP";
                    
                    return (
                      <tr
                        key={u.id}
                        className="hover:bg-white/5 w-full pt-2 cursor-pointer"
                        onClick={() => 
                          isRecentUser 
                            ? showRecentUserDetails(u as RecentUser) 
                            : showDetailsFunc(u.id, u.type || 'CONTACT')
                        }
                      >
                        <td>
                          <div className="flex items-center gap-2 pl-3 md:py-2 py-5">
                            <span className={`h-10 w-10 flex justify-center items-center ${
                              isRecentUser
                                ? "bg-purple-900/30 text-purple-700"
                                : u.type === "SELLER"
                                ? "bg-purple-900/30 text-purple-700"
                                : u.type === "BUYER"
                                ? "bg-blue-600/30 text-blue-700"
                                : "bg-green-600/30 text-green-700"
                            } rounded-full md:text-[0.8rem] font-semibold uppercase`}>
                              {"first_name" in u
                                ? `${u.first_name.charAt(0)}${u.last_name.charAt(0)}`
                                : ("name" in u
                                  ? u.name.charAt(0)
                                  : "U")}
                            </span>
                            <div className="flex flex-col gap-1">
                              <h1 className="text-white/80 text-[1rem]">
                                {"first_name" in u
                                  ? `${u.first_name} ${u.last_name}`
                                  : "name" in u
                                  ? u.name
                                  : "User"}
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
                          </div>
                        </td>
                        <td>
                          <div className={`${
                            isRecentUser
                              ? "bg-purple-900/30 text-purple-700"
                              : u.type === "SELLER"
                              ? "bg-purple-900/30 text-purple-700"
                              : u.type === "BUYER"
                              ? "bg-blue-600/30 text-blue-700"
                              : "bg-green-600/30 text-green-700"
                          } inline-flex items-center gap-1 text-[0.8rem] rounded-full px-3 py-1`}>
                            {isRecentUser ? "🎉 New Member" : u.type}
                          </div>
                        </td>
                        <td>
                          <div className="pl-3 text-white/50 text-[0.8rem]">
                            {formatDate(u.createdAt)}
                          </div>
                        </td>
                        <td className="pl-3">
                          <button 
                            className="text-white/50 hover:text-red-500 transition-all"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteUser(u.id, isRecentUser ? "SIGNUP" : (u.type || 'CONTACT'));
                            }}
                            title="Delete"
                          >
                            <IoMdTrash />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </>
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-white/50">
                    No users found matching "{search}"
                  </td>
                </tr>
              )
            ) : filteredUsers.length > 0 ? (
              paginatedUsers.map((u, i) => (
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

      {/* Pagination Controls */}
      {!search && filteredUsers.length > itemsPerPage && (
        <div className="w-full flex justify-between items-center px-3 py-3 bg-[#1a1d23] rounded-lg mt-4 gap-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              currentPage === 1
                ? "bg-white/10 text-white/30 cursor-not-allowed"
                : "bg-white text-[#0f0f0f] hover:bg-white/90"
            }`}
          >
            ← Previous
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">
              Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
            </span>
            <span className="text-white/50 text-xs">
              ({paginatedUsers.length} of {filteredUsers.length} users)
            </span>
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              currentPage === totalPages
                ? "bg-white/10 text-white/30 cursor-not-allowed"
                : "bg-white text-[#0f0f0f] hover:bg-white/90"
            }`}
          >
            Next →
          </button>
        </div>
      )}

      {/* Search Results Pagination */}
      {search && allSearchResults.length > itemsPerPage && (
        <div className="w-full flex justify-between items-center px-3 py-3 bg-[#1a1d23] rounded-lg mt-4 gap-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              currentPage === 1
                ? "bg-white/10 text-white/30 cursor-not-allowed"
                : "bg-white text-[#0f0f0f] hover:bg-white/90"
            }`}
          >
            ← Previous
          </button>

          <div className="flex items-center gap-2">
            <span className="text-white text-sm">
              Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalSearchPages}</span>
            </span>
            <span className="text-white/50 text-xs">
              ({paginatedSearchResults.length} of {allSearchResults.length} results)
            </span>
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalSearchPages, prev + 1))}
            disabled={currentPage === totalSearchPages}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              currentPage === totalSearchPages
                ? "bg-white/10 text-white/30 cursor-not-allowed"
                : "bg-white text-[#0f0f0f] hover:bg-white/90"
            }`}
          >
            Next →
          </button>
        </div>
      )}

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
                  {userDetails.type === "SIGNUP" ? (
                    <div className="space-y-2">
                      <div className="bg-purple-900/10 border border-purple-900/30 rounded-lg p-3">
                        <p className="text-white/50 text-xs uppercase tracking-wider">
                          Member Since
                        </p>
                        <p className="text-white font-semibold text-sm">
                          {"createdAt" in userDetails
                            ? new Date(userDetails.createdAt).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      <div className="bg-purple-900/10 border border-purple-900/30 rounded-lg p-3">
                        <p className="text-white/50 text-xs uppercase tracking-wider">
                          Email
                        </p>
                        <p className="text-white font-semibold text-sm break-all">
                          {userDetails.email}
                        </p>
                      </div>
                    </div>
                  ) : userDetails.type === "SELLER" ? (
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
