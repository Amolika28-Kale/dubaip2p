require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.sendMail({
  from: process.env.SMTP_FROM,
  to: "thosarjayashri@gmail.com",
  subject: "SMTP Test",
  text: "Brevo SMTP working 🎉",
})
.then(() => console.log("✅ SMTP AUTH SUCCESS"))
.catch(err => console.error("❌ SMTP FAIL", err));
