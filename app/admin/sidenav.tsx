"use client";
import logo from "@/public/image/logo.png";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
   MdDashboard,
   MdGroup,
   MdOutlineDashboard,
   MdOutlineGroup,
} from "react-icons/md";
import LinkComponent from "./sidenav_component";
export default function Sidenav() {
  const pathname = usePathname();
  const router = useRouter()
  return (
    <div className="relative rounded-full flex justify-center items-center flex-row  lg:flex-col  lg:py-10 py-2 w-[90%]  lg:bg-transparent bg-black  lg:drop-shadow-none drop-shadow-2xl">
      <div className="h-18 w-18 flex justify-center items-center bg-black  lg:rounded-[15px] rounded-full absolute  lg:top-3.5 -top-[50%] z-20" onClick={() => router.push("/")}>
        <Image src={logo} alt="image" height={30} width={30} />
      </div>
      <div className="flex  lg:flex-col justify-center items-center  lg:gap-10 gap-20  lg:mt-49 w-full">
        <LinkComponent
          path="/admin/dashboard"
          icon={
            pathname == "/admin/dashboard" ? (
              < MdDashboard />
            ) : (
              < MdOutlineDashboard />
            )
          }
        />
        <LinkComponent
          path="/admin/dashboard/user"
          icon={
            pathname == "/admin/dashboard/user" ? (
              < MdGroup />
            ) : (
              < MdOutlineGroup />
            )
          }
        />
      </div>
    </div>
  );
}
