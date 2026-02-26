import connectDB from "@/config/database";
import { NextRequest, NextResponse } from "next/server";
import Contract from "@/models/Contract";

//GET /api/contracts
export const GET = async (request: NextRequest) => {
  try {
    await connectDB();

    const page = Number(request.nextUrl.searchParams.get("page")) || 1;
    const pageSize = Number(request.nextUrl.searchParams.get("pageSize")) || 6;

    const skip = (page - 1) * pageSize;

    const total = await Contract.countDocuments({});
    const contracts = await (Contract as any)
      .find({})
      .skip(skip)
      .limit(pageSize);

    const result = {
      total,
      contracts,
    };

    return NextResponse.json(result);
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
