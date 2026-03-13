import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/message/unread-count
export const GET = async (request: NextRequest) => {
  try {
    await connectDB();

    // En cada lugar que quiera obtener los datos del usuario que inicio session tengo que usar estas lineas
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json(
        { error: "User Id is required" },
        {
          status: 404,
        },
      );
    }

    const { userId } = sessionUser;
    // Hasta áca

    const count = await Message.countDocuments({
      recipient: userId,
      read: false,
    });

    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
};
