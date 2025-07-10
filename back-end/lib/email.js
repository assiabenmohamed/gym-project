export const sendPasswordResetEmail = async (req, res) => {
  const { email, resetLink } = req.body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL, // Ton adresse Gmail (ex: assia.dev@gmail.com)
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: '"Gym Support" <pulsefit.training2025@gmail.com>',
    to: email,
    subject: "Reset Your Password",
    html: `
      <h2>Password Reset Request</h2>
      <p>Hello,</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you didn't request this, you can safely ignore this email.</p>
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
};
