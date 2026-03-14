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

    // 1. Fetch contracts expiring within the next 15 days
    // that haven't received a reminder yet
    const contracts = await Contract.find({
      expiryDate: {
        $gte: today,
        $lte: in15Days,
      },
      expirationReminderSent: { $ne: true },
    }).populate("owner");

    const sentEmails = [];

    for (const contract of contracts) {
      // Use fallback values to avoid "undefined" in the email
      const title = contract.contractName || "Untitled Contract";
      const contractor = contract.contractor_details?.name || "Not specified";
      const contractee = contract.contractee_details?.name || "Not specified";
      const ownerEmail = contract.owner?.email;

      if (ownerEmail) {
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
                <p><strong>Contractor:</strong> ${contractor}</p>
                <p><strong>Contractee:</strong> ${contractee}</p>
                <p><strong>Expiry Date:</strong> ${new Date(contract.expiryDate).toLocaleDateString()}</p>
              </div>
              <p>Please take the necessary steps for renewal or termination.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #999;">Automated notification from Contract Advisor.</p>
            </div>
          `,
        });

        // Mark as sent so we don't spam the user tomorrow
        contract.expiryNotificationSent = true;
        await contract.save();
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
