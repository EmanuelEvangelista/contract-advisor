import connectDB from "@/config/database";
import { NextRequest, NextResponse } from "next/server";
import Contract from "@/models/Contract";
import cloudinary from "@/config/cloudinary";
import mongoose from "mongoose";
import { getSessionUser } from "@/utils/getSessionUser";

type Props = {
  params: Promise<{ id: string }>;
};

//GET /api/contracts/:id
export const GET = async (request: NextRequest, { params }: Props) => {
  try {
    await connectDB();

    const { id } = await params;

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
    console.log(contract);

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 },
      );
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
    // El 'counter' o 'admin' pueden todo. El 'employee' solo lo suyo.
    const isPowerUser = role === "counter" || role === "admin";
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

// // Put /api/properties/:id
// export const PUT = async (request: NextRequest, { params }: Props) => {
//   const { id } = await params;

//   try {
//     await connectDB();

//     // En cada lugar que quiera obtener los datos del usuario que inicio session tengo que usar estas lineas
//     const sessionUser = await getSessionUser();

//     if (!sessionUser || !sessionUser.userId) {
//       return NextResponse.json(
//         { error: "User Id is required" },
//         {
//           status: 404,
//         },
//       );
//     }

//     const { userId } = sessionUser;
//     // Hasta áca

//     const formData = await request.formData();

//     // Acces all values from amenities
//     const amenities = formData.getAll("amenities");

//     // Get property to update
//     const existingProperty = await Property.findById(id);

//     if (!existingProperty) {
//       return NextResponse.json(
//         { message: "Property does not exist" },
//         {
//           status: 404,
//         },
//       );
//     }

//     // Verify ownership
//     if (existingProperty.owner.toString() !== userId) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         {
//           status: 401,
//         },
//       );
//     }

//     // Create popertyData object for database
//     const propertyData = {
//       type: formData.get("type") as string,
//       name: formData.get("name") as string,
//       description: formData.get("description") as string,

//       location: {
//         street: formData.get("location.street") as string,
//         city: formData.get("location.city") as string,
//         state: formData.get("location.state") as string,
//         zipCode: formData.get("location.zipCode") as string,
//       },

//       beds: Number(formData.get("beds")),
//       baths: Number(formData.get("baths")),
//       square_feet: Number(formData.get("square_feet")),

//       amenities,

//       rates: {
//         weekly: formData.get("rates.weekly")
//           ? Number(formData.get("rates.weekly"))
//           : undefined,

//         monthly: formData.get("rates.monthly")
//           ? Number(formData.get("rates.monthly"))
//           : undefined,

//         nightly: formData.get("rates.nightly")
//           ? Number(formData.get("rates.nightly"))
//           : undefined,
//       },

//       seller_info: {
//         name: formData.get("seller_info.name") as string,
//         email: formData.get("seller_info.email") as string,
//         phone: formData.get("seller_info.phone") as string,
//       },
//       owner: userId,
//     };

//     // Update property in database
//     const updatedProperty = await Property.findByIdAndUpdate(id, propertyData, {
//       new: true,
//     });
//     return NextResponse.json(updatedProperty, { status: 200 });
//   } catch (error) {
//     console.error("POST PROPERTY ERROR:", error);
//     return NextResponse.json(
//       { message: "Failed to update property" },
//       { status: 500 },
//     );
//   }
// };
