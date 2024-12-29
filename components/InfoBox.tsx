"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

interface InfoBoxProps {
  heading: string;
  backgroundColor: string;
  textColor: string;
  buttonInfo: {
    text: string;
    link: string;
    backgroundColor: string;
  };
  children: string;
}
const InfoBox = ({
  heading,
  backgroundColor = "bg-gray-100",
  textColor = "text-gray-800",
  buttonInfo,
  children,
}: InfoBoxProps) => {
  const { data: session } = useSession();
  return (
    <div className={`${backgroundColor} p-6 rounded-lg shadow-md`}>
      <h2 className={`${textColor} text-2xl font-bold`}>{heading}</h2>
      <p className={`${textColor} mt-2 mb-4`}>{children}</p>
      {!session && buttonInfo.link === "/properties/add" ? (
        <button
          onClick={() => toast.error("Please login to add property")}
          className={`inline-block ${buttonInfo.backgroundColor} text-white rounded-lg px-4 py-2 hover:opacity-80`}
        >
          {buttonInfo.text}
        </button>
      ) : (
        <Link
          href={buttonInfo.link}
          className={`inline-block ${buttonInfo.backgroundColor} text-white rounded-lg px-4 py-2 hover:opacity-80`}
        >
          {buttonInfo.text}
        </Link>
      )}
    </div>
  );
};

export default InfoBox;
