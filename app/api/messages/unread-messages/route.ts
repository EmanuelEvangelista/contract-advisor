import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { Types } from "mongoose";

export const dynamic = "force-dynamic";

// GET /api/message/unread-count
export const GET = async (request: NextRequest) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json(
        { error: "User Id is required" },
        {
          status: 404,
        },
      );
    }

    // 🔥 NUEVA LÓGICA (según rol)
    const isAccountant = sessionUser.user.role === "accountant";

    const myId = isAccountant ? sessionUser.user.studioId : sessionUser.userId;

    if (!myId) {
      return NextResponse.json({ count: 0 }, { status: 200 });
    }

    const recipient =
      sessionUser.user.role === "accountant"
        ? sessionUser.user.studioId
        : sessionUser.userId;

    const count = await Message.countDocuments({
      recipient: recipient,
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
