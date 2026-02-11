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
        subject: `${otp} is your DubaiP2P Verification Code`,
        htmlContent: `
          <div style="font-family: 'Helvetica', Arial, sans-serif; background-color: #0B0E11; padding: 40px 20px; color: #ffffff; text-align: center;">
            <div style="max-width: 400px; margin: 0 auto; background-color: #161A1E; border: 1px solid #333; padding: 30px; border-radius: 24px;">
              <h1 style="color: #FCD535; margin-bottom: 10px; font-style: italic;">DubaiP2P</h1>
              <p style="color: #999; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Verification Code</p>
              <div style="background-color: #000; padding: 20px; border-radius: 16px; margin: 25px 0; border: 1px solid #FCD535;">
                <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #FCD535;">${otp}</span>
              </div>
              <p style="color: #666; font-size: 12px;">This code is valid for 5 minutes. Do not share this with anyone.</p>
              <div style="margin-top: 30px; border-top: 1px solid #333; pt: 20px;">
                <p style="color: #444; font-size: 10px; text-transform: uppercase;">Secure P2P Node • Encrypted Session</p>
              </div>
            </div>
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
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const baseUrl = process.env.BASE_URL || 'https://dubaip2p.onrender.com';

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "DubaiP2P System",
          email: process.env.MAIL_FROM_EMAIL,
        },
        to: [{ email: adminEmail }],
        subject: `🚨 ACTION REQUIRED: Payment Uploaded - Trade ${trade._id.slice(-6)}`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
              <div style="background-color: #FCD535; padding: 20px; text-align: center;">
                <h2 style="margin: 0; color: #000;">New Payment Verification</h2>
              </div>
              <div style="padding: 20px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 12px; text-transform: uppercase;">Order ID</td>
                    <td style="padding: 8px 0; font-weight: bold; text-align: right;">#${trade._id.slice(-8)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 12px; text-transform: uppercase;">Amount</td>
                    <td style="padding: 8px 0; font-weight: bold; text-align: right; color: #2ecc71;">₹${trade.fiatAmount} (${trade.cryptoAmount} USDT)</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 12px; text-transform: uppercase;">User Email</td>
                    <td style="padding: 8px 0; font-weight: bold; text-align: right;">${user.email}</td>
                  </tr>
                   <tr>
                    <td style="padding: 8px 0; color: #666; font-size: 12px; text-transform: uppercase;">Payout Details</td>
                    <td style="padding: 8px 0; font-weight: bold; text-align: right; font-family: monospace; color: #f39c12;">${trade.walletAddress}</td>
                  </tr>
                </table>
                
                <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 8px; text-align: center;">
                  <p style="margin-bottom: 10px; font-weight: bold; font-size: 14px;">User Screenshot:</p>
                  <img src="${baseUrl}${trade.transactionScreenshot}" style="max-width: 100%; border-radius: 8px; border: 1px solid #ddd;" alt="Payment Proof" />
                </div>

                <a href="${baseUrl}/admin" style="display: block; margin-top: 25px; padding: 15px; background-color: #000; color: #FCD535; text-decoration: none; text-align: center; border-radius: 8px; font-weight: bold; text-transform: uppercase;">
                  Process in Admin Panel
                </a>
              </div>
            </div>
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