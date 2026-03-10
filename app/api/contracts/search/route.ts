import connectDB from "@/config/database";
import Contract from "@/models/Contract";
import { NextResponse, NextRequest } from "next/server";
import { getSessionUser } from "@/utils/getSessionUser"; // Asegúrate de tener esta utilidad

export const GET = async (request: NextRequest) => {
  try {
    await connectDB();

    // 1. Verificamos seguridad: solo usuarios del estudio pueden buscar
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.user.studioId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get("keyword");
    const employee = searchParams.get("employee");
    const type = searchParams.get("type");

    // 2. Iniciamos la query filtrando SIEMPRE por el estudio actual
    let query: any = {
      studioId: sessionUser.user.studioId,
    };

    // 3. Filtro por Palabra Clave (Nombre de contrato, cliente o CUIT)
    if (keyword) {
      const keywordPattern = new RegExp(keyword, "i");
      query.$or = [
        { contractName: keywordPattern },
        { "contractor_details.name": keywordPattern },
        { "contractee_details.name": keywordPattern },
      ];
    }

    // 4. Filtro por Empleado Responsable
    if (employee) {
      query["assignedEmployee.name"] = new RegExp(employee, "i");
    }

    // 5. Filtro por Tipo de Contrato
    if (type && type !== "All") {
      query.contractType = type; // Aquí suele ser mejor coincidencia exacta si es un select
    }

    const contracts = await Contract.find(query).sort({ createdAt: -1 });

    return NextResponse.json(contracts, { status: 200 });
  } catch (error) {
    console.error("Search Error:", error);
    return NextResponse.json(
      { error: "Failed to search contracts" },
      { status: 500 },
    );
  }
};
