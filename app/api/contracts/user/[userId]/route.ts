import connectDB from "@/config/database";
import { NextRequest, NextResponse } from "next/server";
import Contract from "@/models/Contract";

//GET /api/contracts/user/userId
export const GET = async (
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ userId: string }>;
  },
) => {
  const { userId } = await params;
  const idUser = userId;

  if (!idUser) {
    return NextResponse.json(
      { error: "User Id es required" },
      {
        status: 400,
      },
    );
  }

  try {
    await connectDB();

    const contracts = await Contract.find({ owner: idUser });

    return NextResponse.json(contracts);
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { error: "Database connection failed" },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
