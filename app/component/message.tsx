"use client";

import React, { SetStateAction, useEffect } from "react";
import { MdCheck } from "react-icons/md";

interface Props {
  message?: string;
  cancel: () => void;
  status: boolean;
}
export default function Message({ message, cancel, status }: Props) {
  useEffect(() => {console.log(status)}, [status]);
  return (
    <div>
      <div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span
              className={`h-7.5 w-7.5 border-2 ${
                status == false
                  ? "border-red-600 text-red-600"
                  : "border-green-600 text-green-600"
              } rounded-full  flex justify-center items-center`}
            >
              {status == true ? <MdCheck /> : <span>&times;</span>}
            </span>
            <p className="text-white">{message}</p>
          </div>
          <span
            className="text-white font-semibold text-2xl cursor-pointer"
            onClick={cancel}
          >
            &times;
          </span>
        </div>
      </div>
    </div>
  );
}
