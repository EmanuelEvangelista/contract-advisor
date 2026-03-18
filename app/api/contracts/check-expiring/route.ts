import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Contract from "@/models/Contract";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    await connectDB();

    const today = new Date();
    const in15Days = new Date();
    in15Days.setDate(today.getDate() + 15);

    // 1. Buscamos contratos que vencen pronto y NO han sido notificados
    const contracts = await Contract.find({
      expiryDate: {
        $gte: today,
        $lte: in15Days,
      },
      expiryNotificationSent: { $ne: true },
    }).populate("owner");

    const sentEmails: string[] = [];

    for (const contract of contracts) {
      const title = contract.contractName || "Untitled Contract";
      const ownerEmail = contract.owner?.email;

      if (ownerEmail) {
        // 2. Enviamos el email solo al dueño (Contador/Creador)
        await resend.emails.send({
          from: "ContractAdvisor <onboarding@resend.dev>",
          to: ownerEmail,
          subject: `⚠️ Expiry Alert: ${title}`,
          html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
              <h2 style="color: #d97706;">Contract Expiring Soon</h2>
              <p>This is an automated reminder that the following contract is reaching its end date:</p>
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px;">
                <p><strong>Contract:</strong> ${title}</p>
                <p><strong>Contractor:</strong> ${contract.contractor_details?.name || "N/A"}</p>
                <p><strong>Contractee:</strong> ${contract.contractee_details?.name || "N/A"}</p>
                <p><strong>Expiry Date:</strong> ${new Date(contract.expiryDate).toLocaleDateString()}</p>
              </div>
              <p>Please take the necessary steps for renewal or termination.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #999;">Automated notification from Contract Advisor.</p>
            </div>
          `,
        });

        // 3. Marcamos como enviado en la base de datos
        await Contract.findByIdAndUpdate(contract._id, {
          $set: { expiryNotificationSent: true },
        });

        sentEmails.push(ownerEmail);
      }
    }

    return NextResponse.json({
      success: true,
      processed: contracts.length,
      emailsSentTo: sentEmails,
    });
  } catch (error) {
    console.error("Cron Job Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
