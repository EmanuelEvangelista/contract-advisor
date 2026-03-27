import User from "@/models/User";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

export const GET = async () => {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) return new Response("Unauthorized", { status: 401 });

    // 1. Obtener el ID de Mongo usando el email de la sesión
    const user = await User.findOne({ email: sessionUser.user.email });
    if (!user) return new Response("User not found", { status: 404 });

    const recipient =
      sessionUser.user.role === "accountant"
        ? sessionUser.user.studioId
        : sessionUser.userId;

    // 2. Usar user._id (que es un ObjectId válido)
    const unreadContractIds = await Message.distinct("contract", {
      recipient: recipient,
      read: false,
    });

    return new Response(JSON.stringify(unreadContractIds), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Server Error", { status: 500 });
  }
};
