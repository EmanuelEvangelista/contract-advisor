import connectDB from "@/config/database";
import Contract from "@/models/Contract";
import { getSessionUser } from "@/utils/getSessionUser";
import { NextResponse, NextRequest } from "next/server";
import User from "@/models/User";
import { revalidatePath } from "next/cache"; // <--- NO OLVIDES ESTA IMPORTACIÓN

type Props = {
  params: Promise<{ id: string }>;
};

export const PATCH = async (request: NextRequest, { params }: Props) => {
  try {
    await connectDB();
    const { id } = await params;
    const { newOwnerId } = await request.json();

    if (!newOwnerId) {
      return NextResponse.json(
        { error: "newOwnerId is required" },
        { status: 400 },
      );
    }

    const sessionUser = await getSessionUser();
    if (
      !sessionUser ||
      !sessionUser.userId ||
      sessionUser.role !== "accountant"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newUser = await User.findById(newOwnerId);
    if (!newUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Actualizamos el objeto estático que ContractDetails usa para renderizar
    const updatedContract = await Contract.findByIdAndUpdate(
      id,
      {
        owner: newOwnerId,
        assignedEmployee: {
          employeeId: newUser._id.toString(),
          name: newUser.username || newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { returnDocument: "after" },
    );

    if (!updatedContract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 },
      );
    }

    // PURGAMOS EL CACHÉ: Esto obliga a los Server Components a renderizar de nuevo
    revalidatePath(`/contracts/${id}`);
    revalidatePath("/profile"); // Por si tenés la lista ahí también

    return NextResponse.json({ message: "Reassigned successfully" });
  } catch (error) {
    console.error("Error reassigning contract:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
