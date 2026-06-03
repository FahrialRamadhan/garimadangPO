import axios from "axios";

const BASE_URL = "https://qr.ireng.uk/api";

export async function generateQris(qris, amount) {
  try {
    const response = await axios.get(
      `${BASE_URL}/qris/convert`,
      {
        params: {
          data: qris,
          amount: amount,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("QRIS Error:", error);
    throw error;
  }
}