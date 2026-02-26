import connectDB from "@/config/database";
import { NextRequest, NextResponse } from "next/server";
import Contract from "@/models/Contract";
// import { getSessionUser } from "@/utils/getSessionUser";
import mongoose from "mongoose";

type Props = {
  params: Promise<{ id: string }>; // Importante: Es una Promesa
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
// export const DELETE = async (request: NextRequest, { params }: Props) => {
//   const { id } = await params;

//   try {
//     const contractId = id;

//     // const sessionUser = await getSessionUser();

//     // Check for session
//     // if (!sessionUser || !sessionUser.userId) {
//     //   return NextResponse.json(
//     //     { error: "User ID is required" },
//     //     {
//     //       status: 401,
//     //     },
//     //   );
//     // }

//     // const { userId } = sessionUser;

//     await connectDB();

//     const contract = await Contract.findById(contractId);

//     if (!contract) {
//       return NextResponse.json(
//         { error: "Property not found" },
//         {
//           status: 404,
//         },
//       );
//     }

//     // Verify ownership
//     if (contract.owner.toString() !== userId) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         {
//           status: 401,
//         },
//       );
//     }

//     await contract.deleteOne();

//     return NextResponse.json({ message: "Property deleted" }, { status: 200 });
//   } catch (error) {
//     console.error("Database connection error:", error);
//     return NextResponse.json(
//       { error: "Database connection failed" },
//       {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       },
//     );
//   }
// };

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
