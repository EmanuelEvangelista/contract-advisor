"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { useSession } from "next-auth/react";
import Pusher from "pusher-js";

interface GlobalContextType {
  unreadMessages: number;
  refreshNotifications: () => void;
  setUnreadMessages: Dispatch<SetStateAction<number>>;
}

const GlobalContext = createContext<GlobalContextType | null>(null);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { data: session } = useSession();

  const fetchUnread = async () => {
    try {
      const res = await fetch("/api/messages/unread-messages");
      const data = await res.json();
      setUnreadMessages(data.count);
    } catch (error) {
      console.error("Error fetching unread messages:", error);
    }
  };

  useEffect(() => {
    if (!session?.user?.studioId) return;

    const appKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!appKey || !cluster) {
      console.error("❌ Pusher env vars missing");
      return;
    }

    const pusher = new Pusher(appKey, {
      cluster,
    });

    const channelName = `studio-${session.user.studioId}`;
    const channel = pusher.subscribe(channelName);

    channel.bind("pusher:subscription_succeeded", () => {
      console.log("✅ Suscrito al canal global:", channelName);
    });

    channel.bind("new-message", () => {
      console.log("📩 Nuevo mensaje en el estudio");
      fetchUnread();
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [session?.user?.studioId]);

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
