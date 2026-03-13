"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

interface GlobalContextType {
  unreadMessages: number;
  refreshNotifications: () => void;
  setUnreadMessages: Dispatch<SetStateAction<number>>;
}

const GlobalContext = createContext<GlobalContextType | null>(null);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [unreadMessages, setUnreadMessages] = useState(0);

  const fetchUnread = async () => {
    try {
      const res = await fetch("/api/messages/unread-messages");
      const data = await res.json();

      setUnreadMessages(data.count);
      console.log("aca deberia aparecer", data.count);
    } catch (error) {
      console.error("Error fetching unread messages:", error);
    }
  };

  useEffect(() => {
    fetchUnread();

    const interval = setInterval(() => {
      fetchUnread();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        unreadMessages,
        refreshNotifications: fetchUnread,
        setUnreadMessages,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("useGlobalContext must be used inside GlobalProvider");
  }

  return context;
};
