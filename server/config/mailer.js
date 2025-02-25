import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Use environment variables
    pass: process.env.EMAIL_PASS, // Use App Password if 2FA is enabled
  },
  tls: {
    rejectUnauthorized: false, // To avoid SSL certificate issues
  },
});

// Function to send a welcome email
const sendWelcomeEmail = async (to, name) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to, // Correct email recipient
      subject: "Welcome to Our App",
      text: `Hi ${name},\n\nThank you for signing up!\n\nBest Regards,\nYour App Team`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to", to);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Failed to send email");
  }
};

export default sendWelcomeEmail;
