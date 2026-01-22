"use client";
import logo from "@/public/image/logo.png";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { MdLogout } from "react-icons/md";

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
}


export default function Header() {
  const dropRef = useRef<HTMLDivElement | null>(null);
  const [showDropdown, setDropDown] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const closeDropdown = (e: MouseEvent) => {
    if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
      setDropDown(false);
    }
  };

  const closeUserMenu = (e: MouseEvent) => {
    if (
      userMenuRef.current &&
      !userMenuRef.current.contains(e.target as Node)
    ) {
      setShowUserMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeDropdown);
    document.addEventListener("mousedown", closeUserMenu);
    return () => {
      document.removeEventListener("mousedown", closeDropdown);
      document.removeEventListener("mousedown", closeUserMenu);
    };
  }, []);

  const getInitials = () => {
    if (user) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(
        0
      )}`.toUpperCase();
    }
    return "U";
  };

  // Check if user is logged in
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const res = await fetch("/api/verify-token", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkUserAuth();
    getInitials();

    // Listen for login event to refresh user data immediately
    window.addEventListener("userLogin", checkUserAuth);
    return () => window.removeEventListener("userLogin", checkUserAuth);
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

  const handleLogout = async () => {
    try {
      // Call logout endpoint to clear token on backend
      const res = await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.ok) {
        // Update local state
        setIsLoggedIn(false);
        setUser(null);
        setShowUserMenu(false);

        // Dispatch logout event to notify page
        window.dispatchEvent(new CustomEvent("userLogout"));
        router.push("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
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
              href="/buyit-ai"
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
      <div className="flex items-center gap-1">
        <button
          className="font box-gradient w-37.5 md:flex hidden items-center gap-2 justify-center h-10 rounded-full text-[0.9rem] cursor-pointer"
          onClick={openBookFunc}
        >
          Book Now{" "}
          <span className="h-5 w-5 bg-white text-blue-900 rounded-full flex justify-center items-center">
            <FaArrowRight size={10} />
          </span>
        </button>
        {isLoggedIn && user && (
          <div className="relative md:block hidden" ref={userMenuRef}>
            <div
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="h-10 w-10 bg-linear-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center cursor-pointer hover:from-purple-500 hover:to-purple-700 transition-all duration-200 border border-white/20"
              title={`${user.first_name} ${user.last_name}`}
            >
              <span className="text-white font-semibold text-sm">
                {getInitials()}
              </span>
            </div>

            {/* User Menu Dropdown */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  key="user-menu"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md border border-white/12 rounded-lg shadow-lg overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-white/10">
                    <p className="text-white font-semibold text-sm">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-white/60 text-xs">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2 transition-all duration-200"
                  >
                    <MdLogout size={16} />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* User Profile Avatar */}

      <div className="md:hidden gap-2 flex item-center flex-row-reverse">
        <span onClick={openDropDown}>
          <HiOutlineMenuAlt3 size={35} />
        </span>
        {isLoggedIn && user && (
          <div className="relative" ref={userMenuRef}>
            <div
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="h-10 w-10 bg-linear-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center cursor-pointer hover:from-purple-500 hover:to-purple-700 transition-all duration-200 border border-white/20"
              title={`${user.first_name} ${user.last_name}`}
            >
              <span className="text-white font-semibold text-sm">
                {getInitials()}
              </span>
            </div>

            {/* User Menu Dropdown */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  key="user-menu"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md border border-white/12 rounded-lg shadow-lg overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-white/10">
                    <p className="text-white font-semibold text-sm">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-white/60 text-xs">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2 transition-all duration-200"
                  >
                    <MdLogout size={16} />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
