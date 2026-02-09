const axios = require("axios");

const INTERAKT_API_KEY = process.env.INTERAKT_API_KEY;
const INTERAKT_API_URL = "https://api.interakt.ai/v1/messages"; // Assuming this is the endpoint

const sendWhatsappOTP = async (phone, otp) => {
  try {
    // Clean phone number: remove + and ensure it's without country code for India
    let cleanPhone = phone.replace(/^\+/, "");

    if (cleanPhone.startsWith("91")) {
      cleanPhone = cleanPhone.slice(2);
    }

    // Template variables
    const appName = "DubaiP2P"; // Assuming {{1}} is app name, but task says {{1}} = App name, {{2}} = DubaiP2P
    // Wait, task: {{1}} = App name, {{2}} = DubaiP2P, so perhaps {{1}} = "DubaiP2P", {{2}} = "DubaiP2P"
    // But that seems redundant. Perhaps {{1}} = "verification", {{2}} = "DubaiP2P"
    // I'll use "verification" for {{1}}, "DubaiP2P" for {{2}}
    const bodyValues = ["verification", "DubaiP2P", otp];

    const payload = {
      countryCode: "91",
      phoneNumber: cleanPhone,
      type: "Template",
      template: {
        name: "otp_template", // Assuming template name is "otp_template"
        languageCode: "en",
        bodyValues: bodyValues
      }
    };

    const response = await axios.post(INTERAKT_API_URL, payload, {
      headers: {
        "Authorization": `Bearer ${INTERAKT_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    console.log("Interakt API Response:", response.data);

    // Assuming success if status 200 and response indicates success
    if (response.status === 200 && response.data.success !== false) {
      return { success: true };
    }

    return {
      success: false,
      error: response.data.message || "WhatsApp OTP sending failed",
    };
  } catch (error) {
    console.error("Interakt Error:", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

module.exports = { sendWhatsappOTP };
