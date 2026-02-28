import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import connectDB from "@/config/database";
import Studio from "@/models/Studio";
import { generateStudioCode } from "@/utils/generateStudioCode";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    if (!session.user?.email) {
      return NextResponse.json(
        { error: "Email no disponible" },
        { status: 400 },
      );
    }

    const studio = await Studio.findOne({
      adminEmail: session.user.email,
    });

    if (!studio) {
      return NextResponse.json(
        { error: "Studio no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(studio);
  } catch (error) {
    return NextResponse.json(
      { error: "Error obteniendo estudio" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { studioName } = await req.json();

    if (!session.user?.email) {
      return NextResponse.json(
        { error: "Email no disponible en la sesión" },
        { status: 400 },
      );
    }

    const studio = await Studio.create({
      name: studioName,
      adminEmail: session.user.email,
      invitationCode: generateStudioCode(),
    });

    return NextResponse.json(studio, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Código duplicado, intenta nuevamente" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Error creando el estudio" },
      { status: 500 },
    );
  }
}
