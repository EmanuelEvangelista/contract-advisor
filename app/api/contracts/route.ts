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
    const pdfFiles = formData.getAll("file") as File[];
    const rawData = formData.get("data") as string;

    if (!rawData) {
      return NextResponse.json(
        { message: "Invalid form data" },
        { status: 400 },
      );
    }

    const data = JSON.parse(rawData);

    // --- 1. SUBIR A CLOUDINARY PRIMERO ---
    const uploadedUrls: string[] = [];

    if (pdfFiles && pdfFiles.length > 0) {
      for (const pdfFile of pdfFiles) {
        if (pdfFile.size > 0) {
          const arrayBuffer = await pdfFile.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64 = buffer.toString("base64");

          const uploadResult = await cloudinary.uploader.upload(
            `data:application/pdf;base64,${base64}`,
            {
              folder: "contractadvisor",
              resource_type: "auto",
              public_id: `contract_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            },
          );
          uploadedUrls.push(uploadResult.secure_url);
        }
      }
    }

    // --- 2. PREPARAR EL OBJETO PARA GUARDAR ---
    const contractToSave = {
      ...data,
      studioId,
      owner: userId,
      assignedEmployee: {
        employeeId: userId,
        name,
        email,
        role,
      },
      startDate: data.startDate ? new Date(data.startDate) : new Date(),
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : new Date(),
      // SOBRESCRIBIMOS el campo pdfs con las URLs reales (o un array vacío)
      // para que Mongoose no reciba los objetos vacíos [{}] del JSON.parse
      pdfs: uploadedUrls,
    };

    // --- 3. GUARDAR EN MONGOOSE DESPUÉS DE TENER LAS URLS ---
    const newContract = new Contract(contractToSave);
    await newContract.save();

    return NextResponse.json(
      { message: "Created", id: newContract._id },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("ERROR EN EL BACKEND:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
