"use client";

import Image from "next/image";
import { MouseEventHandler } from "react";
type Props = { handler: MouseEventHandler<HTMLDivElement> };
export const GoogleLoginButton = ({ handler }: Props) => {
  return (
    <div
      className="p-4 flex gap-4 items-center bg-white rounded-full cursor-pointer text-black w-fit"
      onClick={handler}
    >
      <Image
        src="/Logo-google-icon.png"
        alt="Google Icon"
        width={32}
        height={32}
        className="rounded-full"
      />
      <span>Continue with Google</span>
    </div>
  );
};
