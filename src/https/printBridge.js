import axios from "axios";

// Local Printer Bridge (runs on same PC as printers)
const BRIDGE_BASE_URL = "http://localhost:5001";

export const sendToPrinters = async (orderData) => {
  try {
    const res = await axios.post(`${BRIDGE_BASE_URL}/print`, orderData, {
      timeout: 3000,
    });
    console.log("🖨️ Printer bridge response:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Printer bridge error:", err.message);
    throw err;
  }
};
