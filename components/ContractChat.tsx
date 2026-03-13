"use client";
import { useEffect, useState } from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import Image from "next/image";
import { ContractFormType } from "@/types/contract";
import { useSession } from "next-auth/react";

const ContractChat = ({ contract }: ContractFormType) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  const { data: session } = useSession();

  const contractId = contract._id;

  const { refreshNotifications } = useGlobalContext();

  const fetchMessages = async () => {
    const res = await fetch(`/api/contracts/${contractId}/messages`);
    const data = await res.json();
    setMessages(data);
  };

  useEffect(() => {
    if (!contractId) return;
    fetchMessages();
  }, [contractId]);

  const sendMessage = async () => {
    if (!text || !contractId) return;

    const recipientId =
      session?.user?.id === contract.owner
        ? contract.assignedEmployee._id
        : contract.owner;

    try {
      await fetch(`/api/contracts/${contractId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractId: contractId,
          text,
          recipientId: recipientId, // 👈 Enviamos el ID correcto
        }),
      });

      setText("");

      await fetchMessages();

      // actualiza la campana de notificaciones
      refreshNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="border rounded-xl p-4">
      <div className="h-64 overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div key={msg._id} className="flex gap-3 mb-2">
            <Image
              className="h-9 w-9 rounded-full"
              src={msg.sender?.image || "/images/profile.png"}
              alt="User Profile"
              width={36}
              height={36}
            />

            <div>
              <p className="text-sm font-bold">{msg.sender.username}</p>
              <p className="text-sm text-slate-600">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="border rounded-lg px-3 py-2 flex-1"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribir mensaje..."
        />

        <button
          onClick={sendMessage}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ContractChat;
