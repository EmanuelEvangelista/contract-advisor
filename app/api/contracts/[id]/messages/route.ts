import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";
import { NextResponse, NextRequest } from "next/server";
import { Types } from "mongoose";

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

  // 👇 ESTE es el ID lógico del usuario en el chat
  const myId = isAccountant
    ? sessionUser.user.studioId?.toString()
    : sessionUser.userId;

  if (!myId) {
    return NextResponse.json([], { status: 200 });
  }

  // ✅ Marcar como leídos SOLO los que yo recibo
  await Message.updateMany(
    {
      contract: id,
      recipient: new Types.ObjectId(myId),
      read: false,
      sender: { $ne: new Types.ObjectId(myId) },
    },
    { read: true },
  );

  const messages = await Message.find({ contract: id })
    .populate("sender", "username image")
    .sort({ createdAt: 1 });

  return NextResponse.json(messages);
};

export const POST = async (request: NextRequest, { params }: Props) => {
  try {
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

    const { text, recipientId: employeeId } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 },
      );
    }

    const isAccountant = sessionUser.user.role === "accountant";

    // 👇 DEFINIMOS sender y recipient correctamente
    const sender = isAccountant
      ? sessionUser.user.studioId
      : sessionUser.userId;

    const recipient = isAccountant
      ? employeeId // accountant responde al empleado
      : sessionUser.user.studioId; // empleado manda al estudio

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

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error en POST Message:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
