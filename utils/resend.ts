import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendExpiryEmail = async (
  email: string,
  contractName: string,
  expiryDate: string,
  clientName: string,
) => {
  try {
    await resend.emails.send({
      from: "ContractAdvisor <onboarding@resend.dev>", // Luego puedes usar tu propio dominio
      to: email,
      subject: `⚠️ Alerta de Vencimiento: ${contractName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #334155;">
          <h2 style="color: #4f46e5;">Contrato por vencer</h2>
          <p>Hola,</p>
          <p>Te informamos que el siguiente contrato está a menos de <b>15 días</b> de su fecha de finalización:</p>
          <div style="background-color: #f1f5f9; padding: 15px; border-radius: 10px; margin: 20px 0;">
            <p style="margin: 5px 0;"><b>Contrato:</b> ${contractName}</p>
            <p style="margin: 5px 0;"><b>Cliente:</b> ${clientName}</p>
            <p style="margin: 5px 0; color: #dc2626;"><b>Vence el:</b> ${new Date(expiryDate).toLocaleDateString("es-AR")}</p>
          </div>
          <p>Por favor, toma las acciones necesarias para su renovación o finalización.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">Este es un mensaje automático de ContractAdvisor.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error enviando email:", error);
  }
};
