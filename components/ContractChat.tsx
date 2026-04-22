"use client";
import { useEffect, useState, useRef } from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import Image from "next/image";
import { ContractFormType } from "@/types/contract";
import { useSession } from "next-auth/react";
import ProfileImage from "@/assets/images/logo.png";
import Pusher from "pusher-js";

interface Props {
  contract: ContractFormType;
}

const ContractChat = ({ contract }: Props) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const { refreshNotifications } = useGlobalContext();

  const contractId = contract._id?.toString();

  // 1. Cargar mensajes al montar
  useEffect(() => {
    const fetchMessages = async () => {
      if (!contractId) return;
      const res = await fetch(`/api/contracts/${contractId}/messages`);
      const data = await res.json();
      setMessages(data);
      refreshNotifications();
    };

    fetchMessages();
  }, [contractId]);

  // 2. Suscribirse a Pusher (canal del contrato)
  useEffect(() => {
    if (!contractId) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channelName = `chat-${contractId}`;
    const channel = pusher.subscribe(channelName);

    channel.bind("pusher:subscription_succeeded", () => {
      console.log("✅ Suscrito con éxito al canal:", channelName);
    });

    channel.bind("pusher:subscription_error", (err: any) => {
      console.error("❌ Error de suscripción:", err);
    });

    const handleNewMessage = (newMessage: any) => {
      setMessages((prev) => {
        const exists = prev.find((m) => m._id === newMessage._id);
        return exists ? prev : [...prev, newMessage];
      });
      refreshNotifications?.();
    };

    channel.bind("new-message", handleNewMessage);

    return () => {
      channel.unbind("new-message", handleNewMessage);
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [contractId]);

  // 3. Scroll automático
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!text || !contractId) return;

    const myRole = session?.user?.role;
    const recipientId =
      myRole === "accountant"
        ? contract?.assignedEmployee?.employeeId
        : session?.user?.studioId;

    try {
      await fetch(`/api/contracts/${contractId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId,
          text,
          recipientId,
        }),
      });

      setText("");
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  return (
    <div className="border rounded-xl p-4">
      <div ref={scrollRef} className="h-64 overflow-y-auto mb-4">
        {messages.map((msg) => {
          const myId = String(session?.user?.id || "");
          const msgSenderId = String(msg.sender?._id || msg.sender || "");
          const isMe = msgSenderId === myId;

          return (
            <div
              key={msg._id}
              className={`flex gap-3 mb-4 ${isMe ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className="flex-shrink-0">
                <Image
                  className="h-9 w-9 rounded-full object-cover border border-slate-100"
                  src={
                    msg.sender?.image &&
                    !msg.sender.image.includes("iran.liara")
                      ? msg.sender.image
                      : ProfileImage
                  }
                  alt="User Profile"
                  width={36}
                  height={36}
                />
              </div>
              <div
                className={`flex flex-col max-w-[70%] ${isMe ? "items-end" : "items-start"}`}
              >
                <p className="text-slate-400 mb-1 px-1">
                  {isMe ? "Tú" : msg.sender?.username || "Admin"}
                </p>
                <div
                  className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                    isMe
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-slate-100 text-slate-700 rounded-tl-none"
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 w-full">
        <input
          className="border border-slate-200 rounded-xl px-3 py-1.5 flex-1 text-sm outline-none focus:border-emerald-400 transition-colors"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Escribe un mensaje..."
        />
        <button
          onClick={sendMessage}
          className="bg-emerald-500 hover:bg-emerald-600 text-white 
             px-3 py-1 rounded-lg text-xs font-semibold 
             transition-all active:scale-95 shrink-0"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ContractChat;
