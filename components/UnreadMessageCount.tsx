"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useGlobalContext } from "@/context/GlobalContext";

const UnreadMessageCount = () => {
  const { data: session } = useSession();
  const { unreadMessages, setUnreadMessages } = useGlobalContext();

  useEffect(() => {
    if (!session) return;

    const fetchUnreadMessages = async () => {
      try {
        const res = await fetch("/api/messages/unread-messages");

        if (res.ok) {
          const data = await res.json();
          setUnreadMessages(data.count);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUnreadMessages();
  }, [session, setUnreadMessages]);

  return (
    <span
      className={`absolute -top-2 -right-2 flex items-center justify-center h-5 min-w-[1.25rem] px-1 text-[10px] font-bold rounded-full border-2 border-white leading-none z-10 transition-colors ${
        unreadMessages > 0 ? "bg-red-500 text-white" : "bg-gray-200 text-black"
      }`}
      style={{ transform: "translate(25%, -25%)" }}
    >
      {unreadMessages}
    </span>
  );
};

export default UnreadMessageCount;
