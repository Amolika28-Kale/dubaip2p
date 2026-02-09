const axios = require("axios");

const sendOTP = async (to, otp) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: process.env.MAIL_FROM_NAME,
          email: process.env.MAIL_FROM_EMAIL,
        },
        to: [{ email: to }],
        subject: "Your OTP Code",
        htmlContent: `
          <div style="font-family:Arial">
            <h2>Your OTP</h2>
            <h1>${otp}</h1>
            <p>Valid for 5 minutes</p>
          </div>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("✅ OTP sent:", response.data.messageId);
    return { success: true };
  } catch (err) {
    console.error("❌ Brevo API error:", err.response?.data || err.message);
    return { success: false };
  }
};

const sendAdminNotification = async (trade, user) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'; // Replace with actual admin email
    const baseUrl = process.env.BASE_URL || 'https://dubaip2p.onrender.com';

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: process.env.MAIL_FROM_NAME,
          email: process.env.MAIL_FROM_EMAIL,
        },
        to: [{ email: adminEmail }],
        subject: `New Payment Received - Trade ${trade._id.slice(-8)}`,
        htmlContent: `
          <div style="font-family:Arial">
            <h2>New Payment Uploaded</h2>
            <h3>User Details</h3>
            <p><strong>Username:</strong> ${user.name || 'N/A'}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone || 'N/A'}</p>
            <p><strong>Balance:</strong> ₹${user.balance}</p>
            <p><strong>Referral Code:</strong> ${user.referralCode}</p>
            <p><strong>Joined:</strong> ${new Date(user.createdAt).toLocaleString()}</p>
            <h3>Trade Details</h3>
            <p><strong>Trade ID:</strong> ${trade._id}</p>
            <p><strong>Send Method:</strong> ${trade.sendMethod}</p>
            <p><strong>Receive Method:</strong> ${trade.receiveMethod}</p>
            <p><strong>Fiat Amount:</strong> ₹${trade.fiatAmount}</p>
            <p><strong>Crypto Amount:</strong> ${trade.cryptoAmount} USDT</p>
            <p><strong>Rate:</strong> ₹${trade.rate} per USDT</p>
            <p><strong>Wallet Address:</strong> ${trade.walletAddress}</p>
            <p><strong>Status:</strong> ${trade.status}</p>
            <p><strong>Paid At:</strong> ${trade.paidAt ? new Date(trade.paidAt).toLocaleString() : 'N/A'}</p>
            <p><strong>Created:</strong> ${new Date(trade.createdAt).toLocaleString()}</p>
            <h3>Payment Screenshot</h3>
            <img src="${baseUrl}${trade.transactionScreenshot}" alt="Payment Screenshot" style="max-width:100%; height:auto;" />
          </div>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("✅ Admin notification sent:", response.data.messageId);
    return { success: true };
  } catch (err) {
    console.error("❌ Admin notification error:", err.response?.data || err.message);
    return { success: false };
  }
};

module.exports = { sendOTP, sendAdminNotification };
