import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";
import { NextResponse } from "next/server";

export const PUT = async (request: Request) => {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { contractId } = await request.json();

    // Marcamos como LEÍDOS solo los mensajes de ESTE contrato
    // donde YO soy el destinatario (recipient)
    await Message.updateMany(
      {
        contract: contractId,
        recipient: sessionUser.userId,
        read: false,
      },
      { read: true },
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
};
