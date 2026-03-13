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

  await Message.updateMany(
    {
      contract: id,
      sender: { $ne: sessionUser.userId },
    },
    { read: true },
  );

  return NextResponse.json(messages);
};

export const POST = async (request: NextRequest, { params }: Props) => {
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

  const { text } = await request.json();

  const message = await Message.create({
    contract: id,
    sender: sessionUser?.userId,
    text,
    read: false,
  });

  return NextResponse.json(message);
};
