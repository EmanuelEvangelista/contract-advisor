"use client";
import { useEffect, useState } from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import Image from "next/image";
import { ContractFormType } from "@/types/contract";
import { useSession } from "next-auth/react";
import ProfileImage from "@/assets/images/profile.png";

interface Props {
  contract: ContractFormType;
}

const ContractChat = ({ contract }: Props) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  const { data: session } = useSession();

  const contractId = contract._id;

  console.log(contractId, contract.studioId);

  if (session?.user.studioId !== contract.studioId) {
    return null;
  }

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

    const myId = session?.user?.id;
    const myRole = session?.user?.role;
    const ownerId = contract.owner; // El "contador" o dueño del contrato
    const employeeId = contract?.assignedEmployee?.employeeId;

    // LÓGICA DE ESPEJO:
    // Si mi ID es el del dueño, el mensaje va para el empleado.
    // En cualquier otro caso (si soy el empleado o un admin), el mensaje va para el dueño.

    const recipientId =
      myRole === "accountant"
        ? contract?.assignedEmployee?.employeeId // accountant → employee
        : session?.user?.studioId; // employee → studio

    // Validación extra: Si por algún error el recipientId queda igual al senderId
    if (recipientId === myId) {
      console.error("Error: Intentando enviar un mensaje a uno mismo.");
      return;
    }

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

      await fetchMessages();
      refreshNotifications();
      setText("");
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };
  return (
    <div className="border rounded-xl p-4">
      <div className="h-64 overflow-y-auto mb-4">
        {messages.map((msg) => {
          // 1. Verificamos si el mensaje es nuestro
          const isMe =
            msg.sender?._id === session?.user?.id ||
            msg.sender?._id === session?.user?.studioId;

          return (
            <div
              key={msg._id}
              className={`flex gap-3 mb-4 ${isMe ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Imagen de Perfil */}
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

              {/* Burbuja del mensaje */}
              <div
                className={`flex flex-col max-w-[70%] ${isMe ? "items-end" : "items-start"}`}
              >
                <p className="text-[10px] text-slate-400 mb-1 px-1">
                  {isMe ? "Tú" : msg.sender?.username || "Unknown user"}
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

      <div className="flex gap-2">
        <input
          className="border rounded-lg px-3 py-2 flex-1"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message.."
        />

        <button
          onClick={sendMessage}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ContractChat;
