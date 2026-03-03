import connectDB from "@/config/database";
import { NextRequest, NextResponse } from "next/server";
import Contract from "@/models/Contract";
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";

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

export const POST = async (request: NextRequest) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 401 },
      );
    }

    const { userId, user } = sessionUser;
    const { role, studioId, email, name } = user;

    const formData = await request.formData();

    // 📌 1️⃣ Obtener JSON enviado desde el frontend
    const rawData = formData.get("data");

    if (!rawData || typeof rawData !== "string") {
      return NextResponse.json(
        { message: "Invalid form data" },
        { status: 400 },
      );
    }

    const data = JSON.parse(rawData);

    const pdfFile = formData.get("file") as File | null;
    let pdfUrl = "";
    if (pdfFile) {
      const buffer = Buffer.from(await pdfFile.arrayBuffer());
      const base64 = buffer.toString("base64");
      const uploadResult = await cloudinary.uploader.upload(
        `data:application/pdf;base64,${base64}`,
        { folder: "contracts", resource_type: "raw" },
      );
      pdfUrl = uploadResult.secure_url;
    }

    const contractToSave = {
      ...data,
      studioId: studioId, // El string del ID de sesión
      owner: userId, // El string del ID de sesión
      assignedEmployee: {
        employeeId: userId,
        name: name,
        email: email,
        role: role,
      },
      pdfUrl,
      // Aseguramos que las fechas sean objetos Date
      startDate: new Date(data.startDate),
      expiryDate: new Date(data.expiryDate),
    };

    // Manejo de PDF...
    // ...

    // Al usar el constructor de Mongoose, él se encarga de convertir
    // los strings de IDs a ObjectIds de MongoDB internamente.
    const newContract = new Contract(contractToSave);
    await newContract.save();

    return NextResponse.json(
      { message: "Created", id: newContract._id },
      { status: 201 },
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
