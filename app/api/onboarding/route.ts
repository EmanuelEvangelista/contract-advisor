import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import connectDB from "@/config/database";
import User from "@/models/User";
import Studio from "@/models/Studio";
import { generateStudioCode } from "@/utils/generateStudioCode";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  console.log("ONBOARDING HIT");

  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { action, invitationCode, studioName } = await req.json();

    const userEmail = session.user.email;

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found in session" },
        { status: 400 },
      );
    }

    const existingUser = await User.findOne({ email: userEmail });

    if (existingUser?.studioId) {
      return NextResponse.json(
        { error: "User already belongs to a studio" },
        { status: 400 },
      );
    }

    // CASO A: El usuario es un Contador y crea un nuevo estudio
    if (action === "create") {
      if (!studioName) {
        return NextResponse.json(
          { error: "Studio name is required" },
          { status: 400 },
        );
      }
      const newStudio = await Studio.create({
        name: studioName,
        invitationCode: generateStudioCode(),
        adminEmail: userEmail,
      });

      await User.findOneAndUpdate(
        { email: newStudio.adminEmail },
        {
          studioId: newStudio._id,
          role: "accountant",
          status: "active",
        },
      );
      return NextResponse.json({ message: "Studio created successfully" });
    }

    // CASO B: El usuario es un Empleado y se une mediante código
    if (action === "join") {
      if (!invitationCode) {
        return NextResponse.json(
          { error: "Invitation code is required" },
          { status: 400 },
        );
      }

      const normalizedCode = invitationCode.trim().toUpperCase();

      const studio = await Studio.findOne({
        invitationCode: normalizedCode,
      }).select("_id");

      if (!studio) {
        return NextResponse.json(
          { error: "Invalid invitation code" },
          { status: 400 },
        );
      }

      await User.findOneAndUpdate(
        { email: userEmail },
        {
          studioId: studio._id,
          role: "employee",
          status: "active",
        },
      );

      return NextResponse.json({
        message: "Joined studio successfully",
      });
    }
  } catch (error: any) {
    console.error("ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
};
