import React from "react";
import Sidenav from "../sidenav";

export default function DashboardLayout({children} : {children: React.ReactNode}) {
    return (
        <div className="fixed top-0 left-0 h-full w-full bg-[#202427] z-10 md:block">
            <div className="z-30 md:bg-[#272a2f] flex items-center justify-center fixed md:top-0 bottom-5  md:left-0 md:w-[8%] w-full md:h-full h-[8%]">
                <Sidenav />
            </div>
            <div className="fixed top-0 right-0 md:w-[92%] w-full h-full z-20">{children}</div>
        </div>
    )
}