import connectDB from "@/config/database";
import { getSessionUser } from "@/utils/getSessionUser";
import { NextResponse, NextRequest } from "next/server";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

type Props = {
  params: Promise<{ id: string }>;
};

export const PATCH = async (request: NextRequest, { params }: Props) => {
  try {
    await connectDB();

    const { id } = await params;
    const { status } = await request.json(); // read status from request body

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 },
      );
    }

    const sessionUser = await getSessionUser();

    console.log("SessionUser:", sessionUser);

    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only accountant/admin can modify user status
    if (sessionUser.user.role !== "accountant") {
      return new NextResponse(
        "Forbidden: You do not have administrator permissions",
        { status: 403 },
      );
    }

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent the admin from disabling their own account
    if (id === sessionUser.user.id && status === "inactive") {
      return new NextResponse("You cannot deactivate your own account", {
        status: 400,
      });
    }

    user.status = status;

    await user.save();

    // Revalidate cached pages
    revalidatePath("/profile");
    revalidatePath("/users");

    return NextResponse.json({
      message: "User status updated successfully",
    });
  } catch (error) {
    console.error("Error updating user status:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
