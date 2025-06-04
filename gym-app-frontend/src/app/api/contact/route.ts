import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { name, email, message } = await req.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL, // Ton adresse Gmail (ex: assia.dev@gmail.com)
      pass: process.env.SMTP_PASSWORD, // Mot de passe App Gmail
    },
  });

  const mailOptions = {
    from: `"${name}" <${email}>`, // L'utilisateur qui t'écrit
    to: process.env.SMTP_EMAIL, // Toi = destinataire réel
    subject: `Message from ${name}`,
    text: message,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({
      success: true,
      message: "Email sent successfully.",
    });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send email." },
      { status: 500 }
    );
  }
}
