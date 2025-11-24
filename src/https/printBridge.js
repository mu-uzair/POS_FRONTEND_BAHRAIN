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


export const printSalesReport = async (reportData) => {
  try {

    
    const response = await fetch(`${BRIDGE_BASE_URL}/print-sales-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Print failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Print sales report error:', error);
    throw error;
  }
};