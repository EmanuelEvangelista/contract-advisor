import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    await connectDB();
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json([], { status: 401 });
    }

    // Obtenemos un array de IDs de contratos que tienen mensajes sin leer para este usuario
    const unreadContractIds = await Message.distinct("contract", {
      recipient: sessionUser.userId,
      read: false,
    });

    return NextResponse.json(unreadContractIds, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json([], { status: 500 });
  }
};
