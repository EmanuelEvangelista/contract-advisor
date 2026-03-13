import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";
import { NextResponse, NextRequest } from "next/server";

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

  const messages = await Message.find({ contract: id })
    .populate("sender", "username image")
    .sort({ createdAt: 1 });

  // Marcamos como leídos los mensajes que recibiste tú en este contrato
  await Message.updateMany(
    {
      contract: id,
      recipient: sessionUser.userId, // Usamos recipient para ser precisos
      read: false,
    },
    { read: true },
  );

  return NextResponse.json(messages);
};

export const POST = async (request: NextRequest, { params }: Props) => {
  try {
    await connectDB();
    const { id } = await params; // Este es el ID del contrato que viene en la URL
    const sessionUser = await getSessionUser();

    if (
      !sessionUser ||
      !sessionUser.userId ||
      sessionUser.status === "inactive"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, recipientId } = await request.json();

    // Validación de seguridad
    if (!text || !recipientId) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 },
      );
    }

    const message = await Message.create({
      sender: sessionUser.userId,
      recipient: recipientId,
      contract: id, // Usamos el ID de los params para evitar errores
      text: text,
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
