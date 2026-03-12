import connectDB from "@/config/database";
import User from "@/models/User";
import { NextResponse, NextRequest } from "next/server";
import { Types } from "mongoose";

type Props = {
  params: Promise<{ id: string }>;
};

export const GET = async (request: NextRequest, { params }: Props) => {
  try {
    await connectDB();

    const { id } = await params;

    if (!id) {
      return new NextResponse("Studio ID is required", { status: 400 });
    }

    // Usamos cast explícito a 'any' para evitar que TS se queje del overload
    // y usamos un filtro que funcione tanto si es un ID único como si estuviera en un array
    const members = await User.find({
      studioId: id as any,
    })
      .select("_id username role email")
      .lean();

    // Si tu esquema dice que studioId es un Array, pero vos guardás un solo ID,
    // Mongoose a veces se marea. El cast a 'any' en el find es la solución rápida y segura.

    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching studio members:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
