import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";
import { NextResponse, NextRequest } from "next/server";
import { Types } from "mongoose";
import { pusherServer } from "@/lib/pusher";

type Props = {
  params: Promise<{ id: string }>;
};

export const GET = async (request: NextRequest, { params }: Props) => {
  await connectDB();
  const { id } = await params;
  const sessionUser = await getSessionUser();

  if (
    !sessionUser ||
    !sessionUser.userId ||
    sessionUser.status === "inactive"
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAccountant = sessionUser.user.role === "accountant";

  // MI IDENTIDAD EN ESTE CHAT:
  const myChatId = isAccountant
    ? sessionUser.user.studioId // Si soy contador, mi "ID de buzón" es el Studio
    : sessionUser.userId; // Si soy empleado, es mi ID de usuario

  if (!myChatId) {
    return NextResponse.json([], { status: 200 });
  }

  // ✅ Marcar como leídos SOLO los que yo recibo
  await Message.updateMany(
    {
      contract: id,
      recipient: myChatId,
      read: false,
      sender: { $ne: myChatId }, // IMPORTANTE: Que el que lo envió NO sea yo mismo
    },
    { read: true },
  );

  const messages = await Message.find({ contract: id })
    .populate("sender", "username image studioId")
    .sort({ createdAt: 1 });

  return NextResponse.json(messages);
};

export const POST = async (request: NextRequest, { params }: Props) => {
  try {
    await connectDB();
    const { id } = await params;
    console.log("este es el id del back", id);
    const sessionUser = await getSessionUser();

    if (
      !sessionUser ||
      !sessionUser.userId ||
      sessionUser.status === "inactive"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, recipientId: employeeId } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 },
      );
    }

    const isAccountant = sessionUser.user.role === "accountant";
    const sender = sessionUser.userId;
    const recipient = isAccountant ? employeeId : sessionUser.user.studioId;

    if (!sender || !recipient) {
      return NextResponse.json(
        { error: "Invalid sender or recipient" },
        { status: 400 },
      );
    }

    const message = await Message.create({
      contract: new Types.ObjectId(id),
      sender: new Types.ObjectId(sender),
      recipient: new Types.ObjectId(recipient),
      text,
      read: false,
    });

    const populatedMessage = await message.populate(
      "sender",
      "username image email",
    );
    // Disparar al canal del contrato
    await pusherServer.trigger(
      `chat-${id}`,
      "new-message",
      populatedMessage.toObject(),
    );

    // Disparar también al canal global del estudio
    await pusherServer.trigger(
      `studio-${sessionUser.user.studioId}`,
      "new-message",
      populatedMessage.toObject(),
    );

    console.log(
      "Pusher disparado a:",
      `chat-${id}`,
      "y",
      `studio-${sessionUser.user.studioId}`,
    );

    console.log("Pusher disparado a:", `chat-${id}`, populatedMessage._id);

    return NextResponse.json(populatedMessage, { status: 201 });
  } catch (error) {
    console.error("Error en POST Message:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
