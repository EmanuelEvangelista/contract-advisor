import connectDB from "@/config/database";
import { NextRequest, NextResponse } from "next/server";
import Contract from "@/models/Contract";
import cloudinary from "@/config/cloudinary";
import mongoose from "mongoose";
import { getSessionUser } from "@/utils/getSessionUser";
import User from "@/models/User";

type Props = {
  params: Promise<{ id: string }>;
};

//GET /api/contracts/:id
export const GET = async (request: NextRequest, { params }: Props) => {
  try {
    await connectDB();

    const { id } = await params;
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // SI EL ID NO ES UN OBJECTID VÁLIDO DE MONGO (como la palabra "search")
    // DETENEMOS LA EJECUCIÓN AQUÍ MISMO
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const contract = await Contract.findById(id);

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        {
          status: 404,
        },
      );
    }

    if (
      contract.studioId.toString() !== sessionUser.user.studioId?.toString()
    ) {
      console.error(
        `Acceso denegado: Studio Contrato(${contract.studioId}) vs Usuario(${sessionUser.user.studioId})`,
      );
      return NextResponse.json(
        { error: "No perteneces a este estudio" },
        { status: 401 },
      );
    }

    return NextResponse.json(contract);
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

//DELETE /api/contracts/:id
export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id: contractId } = await params;
    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, user } = sessionUser;
    await connectDB();

    const contract = await Contract.findById(contractId);

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 },
      );
    }

    if (contract.studioId.toString() !== user.studioId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // --- LÓGICA DE PERMISOS MEJORADA ---
    // 1. Si es el dueño (el que lo creó) -> Puede borrar
    // 2. Si es el contador del estudio -> Puede borrar cualquier contrato del estudio
    const isOwner = contract.owner.toString() === sessionUser.userId;
    const isStudioAdmin =
      user.role === "accountant" &&
      contract.studioId.toString() === user.studioId;

    if (!isOwner && !isStudioAdmin) {
      return NextResponse.json(
        { error: "Unauthorized to delete this contract" },
        { status: 401 },
      );
    }

    // --- LIMPIEZA DE CLOUDINARY

    // Si los archivos son importantes de borrar en la nube:
    if (contract.pdfs && contract.pdfs.length > 0) {
      for (const url of contract.pdfs) {
        // Extraer el public_id de la URL de cloudinary
        const parts = url.split("/");
        const fileName = parts[parts.length - 1].split(".")[0];
        const folder = "contractadvisor"; // El nombre que usamos antes
        await cloudinary.uploader.destroy(`${folder}/${fileName}`);
      }
    }

    await contract.deleteOne();

    return NextResponse.json(
      { message: "Contract deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};

// // Put /api/contracts/:id
export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    await connectDB();
    const { id } = await params;
    const sessionUser = await getSessionUser();

    // 1. Validación de Sesión
    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 401 },
      );
    }

    const { userId, user } = sessionUser;
    const { role, studioId, email, name } = user; // Extraemos el role aquí

    // 2. Buscar contrato existente
    const existingContract = await Contract.findById(id);
    if (!existingContract) {
      return NextResponse.json(
        { message: "Contract does not exist" },
        { status: 404 },
      );
    }

    // 3. VALIDACIÓN DE PERMISOS (Nestrly Logic)
    // 1. Validar que el contrato pertenezca al estudio del usuario
    if (existingContract.studioId?.toString() !== user.studioId?.toString()) {
      return NextResponse.json(
        { message: "No perteneces a este estudio" },
        { status: 403 },
      );
    }
    // El 'counter' o 'admin' pueden todo. El 'employee' solo lo suyo.
    const isPowerUser = role === "accountant" || role === "admin";
    const isOwner = existingContract.owner.toString() === userId;

    if (!isPowerUser && !isOwner) {
      return NextResponse.json(
        { message: "No tienes permiso para editar este contrato" },
        { status: 403 },
      );
    }

    // 4. Leer datos del body
    const data = await request.json();

    // 5. PREPARAR EL OBJETO (Mantenemos coherencia de datos)
    const contractData = {
      ...data,
      studioId,
      // Si el usuario es empleado, nos aseguramos de que no cambie el owner a otro
      owner: isPowerUser ? data.owner || existingContract.owner : userId,
      assignedEmployee: {
        employeeId: userId,
        name,
        email,
        role,
      },
      startDate: data.startDate
        ? new Date(data.startDate)
        : existingContract.startDate,
      expiryDate: data.expiryDate
        ? new Date(data.expiryDate)
        : existingContract.expiryDate,
    };

    // 6. Actualizar
    const updatedContract = await Contract.findByIdAndUpdate(id, contractData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(updatedContract, { status: 200 });
  } catch (error: any) {
    console.error("Failed to update contract:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
