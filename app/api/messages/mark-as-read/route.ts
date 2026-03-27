import connectDB from "@/config/database";
import Message from "@/models/Message";
import User from "@/models/User"; // <-- IMPORTANTE: No olvides importar el modelo User
import { getSessionUser } from "@/utils/getSessionUser";
import { NextResponse } from "next/server";

export const PUT = async (request: Request) => {
  try {
    await connectDB();

    // 1. Extraer el contractId del cuerpo de la petición
    const { contractId } = await request.json();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 2. Buscar al usuario en la DB para obtener el ObjectId real
    // Nota: Revisa si en tu utilidad es sessionUser.email o sessionUser.user.email
    const user = await User.findOne({ email: sessionUser.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const recipient =
      sessionUser.user.role === "accountant"
        ? sessionUser.user.studioId
        : sessionUser.userId;

    // 3. Actualizar mensajes
    const result = await Message.updateMany(
      {
        contract: contractId,
        recipient: recipient,
        read: false,
      },
      { read: true },
    );

    return NextResponse.json(
      { success: true, modifiedCount: result.modifiedCount },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error en mark-as-read:", error);
    return NextResponse.json(
      { error: "Error al actualizar mensajes" },
      { status: 500 },
    );
  }
};
