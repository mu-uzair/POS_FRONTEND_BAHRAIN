// import {createSlice} from "@reduxjs/toolkit";


// const initialState = {

//     orderId: "",
//     customerName: "",
//     customerPhone: "",
//     guests: 0,
//     table: null,
//     orderPlacedAt:"",
//     orderType:"",
//     paymentMethod:""


// }

// const customerSlice = createSlice({
//     name: "customer",
//     initialState,
//     reducers : {



//         // },

//         setCustomer: (state, action) => {
//             const { name, phone, guests, orderType, paymentMethod, orderId } = action.payload;
//             state.orderId = orderId || `${Date.now()}`; // Preserve existing orderId if provided
//             state.customerName = name || "";
//             state.customerPhone = phone || "N/A";
//             state.guests = guests || 0;
//             state.orderPlacedAt = new Date().toISOString();
//             state.orderType = orderType || "";
//             state.paymentMethod = paymentMethod || ""; // Keep the payment method from payload
//             state.table = null; // Fixed this assignment
//         },


//         removeCustomer : (state) => {
//             state.customerName = "";
//             state.customerPhone = "";
//             state.guests = 0;
//             state.table = null;
//         },
//         updateTable : (state,action) => {
//             state.table = action.payload.table;
//         }
//     }
// });

// export const { setCustomer, removeCustomer, updateTable} = customerSlice.actions;
// export default customerSlice.reducer    

// solveing the orderplacing issue

// import { createSlice } from "@reduxjs/toolkit";


// const initialState = {
//     orderId: "",
//     customerName: "",
//     customerPhone: "",
//     guests: 0,
//     table: null,
//     orderPlacedAt: "",
//     orderType: "",
//     paymentMethod: "",
//     // --- NEW DELIVERY FIELDS ---
//     deliveryAddress: "",
//     deliveryBoyId: null, // Store the assigned delivery boy's ID
//     // -------------------------
// }

// const customerSlice = createSlice({
//     name: "customer",
//     initialState,
//     reducers: {

//         setCustomer: (state, action) => {
//             const { name, phone, guests, orderType, paymentMethod, orderId } = action.payload;
//             state.orderId = orderId || `${Date.now()}`;
//             state.customerName = name || "";
//             state.customerPhone = phone || ""; // Phone should not default to 'N/A' for delivery
//             state.guests = guests || 0;
//             state.orderPlacedAt = new Date().toISOString();
//             state.orderType = orderType || "";
//             state.paymentMethod = paymentMethod || "";
//             state.table = null;

//             // Clear delivery fields if order type is not delivery
//             if (orderType !== 'Delivery') {
//                 state.deliveryAddress = "";
//                 state.deliveryBoyId = null;
//             }
//         },

//         // --- NEW REDUCER FOR DELIVERY DETAILS ---
//         setDeliveryInfo: (state, action) => {
//             const { address, deliveryBoyId } = action.payload;
//             state.deliveryAddress = address || "";
//             state.deliveryBoyId = deliveryBoyId || null;
//             // Optionally, update phone/name if they are changed here
//             if (action.payload.phone) state.customerPhone = action.payload.phone;
//             if (action.payload.name) state.customerName = action.payload.name;
//         },
//         // ----------------------------------------

//         removeCustomer: (state) => {
//             state.customerName = "";
//             state.customerPhone = "";
//             state.guests = 0;
//             state.table = null;
//             // --- Clear NEW FIELDS ---
//             state.deliveryAddress = "";
//             state.deliveryBoyId = null;
//             // ------------------------
//         },
//         updateTable: (state, action) => {
//             state.table = action.payload.table;
//         }
//     }
// });

// export const { setCustomer, setDeliveryInfo, removeCustomer, updateTable } = customerSlice.actions;
// export default customerSlice.reducer


// import { createSlice } from "@reduxjs/toolkit";
// import { generateUniqueOrderNo } from "../../utils"; // adjust the path if needed

// const initialState = {
//   orderId: "",
//   orderNo: "",
//   customerName: "",
//   customerPhone: "",
//   guests: 0,
//   table: null,
//   orderPlacedAt: "",
//   orderType: "",
//   paymentMethod: "",
//   deliveryAddress: "",
//   deliveryBoyId: null,
// };

// const customerSlice = createSlice({
//   name: "customer",
//   initialState,
//   reducers: {
//     setCustomer: (state, action) => {
//       const { name, phone, guests, orderType, paymentMethod, orderId } = action.payload;

//       state.orderId = orderId || `${Date.now()}`;
//       state.orderNo = generateUniqueOrderNo(); // ✅ Add this line

//       state.customerName = name || "";
//       state.customerPhone = phone || "";
//       state.guests = guests || 0;
//       state.orderPlacedAt = new Date().toISOString();
//       state.orderType = orderType || "";
//       state.paymentMethod = paymentMethod || "";
//       state.table = null;

//       if (orderType !== "Delivery") {
//         state.deliveryAddress = "";
//         state.deliveryBoyId = null;
//       }
//     },

//     setDeliveryInfo: (state, action) => {
//       const { address, deliveryBoyId } = action.payload;
//       state.deliveryAddress = address || "";
//       state.deliveryBoyId = deliveryBoyId || null;
//       if (action.payload.phone) state.customerPhone = action.payload.phone;
//       if (action.payload.name) state.customerName = action.payload.name;
//     },

//     removeCustomer: (state) => {
//       state.customerName = "";
//       state.customerPhone = "";
//       state.guests = 0;
//       state.table = null;
//       state.deliveryAddress = "";
//       state.deliveryBoyId = null;
//       state.orderNo = "";
//     },

//     updateTable: (state, action) => {
//       state.table = action.payload.table;
//     },
//   },
// });

// export const { setCustomer, setDeliveryInfo, removeCustomer, updateTable } = customerSlice.actions;
// export default customerSlice.reducer;


// import { createSlice } from "@reduxjs/toolkit";

// // --- Helper function ---
// const generateUniqueOrderNo = () => {
//   const usedNos = JSON.parse(localStorage.getItem("usedOrderNos") || "[]");
//   let newNo;

//   do {
//     newNo = Math.floor(1000 + Math.random() * 9000);
//   } while (usedNos.includes(newNo));

//   usedNos.push(newNo);
//   localStorage.setItem("usedOrderNos", JSON.stringify(usedNos));

//   return `ORD-${newNo}`;
// };

// const initialState = {
//   orderId: "",
//   orderNo: "",
//   customerName: "",
//   customerPhone: "",
//   guests: 0,
//   table: null,
//   orderPlacedAt: "",
//   orderType: "",
//   paymentMethod: "",
//   deliveryAddress: "",
//   deliveryBoyId: null,
// };

// const customerSlice = createSlice({
//   name: "customer",
//   initialState,
//   reducers: {
//     setCustomer: (state, action) => {
//       const { name, phone, guests, orderType, paymentMethod, orderId, orderNo,isEdit } = action.payload;


//   // ✅ If it's a new order (not editing), generate a new unique orderNo
//   if (!isEdit) {
//     state.orderNo = generateUniqueOrderNo();
//   } else if (orderNo) {
//     // ✅ If editing and backend sent orderNo, keep it
//     state.orderNo = orderNo;
//   }

//       state.orderId = orderId || `${Date.now()}`;
//       state.customerName = name || "";
//       state.customerPhone = phone || "";
//       state.guests = guests || 0;
//       state.orderPlacedAt = new Date().toISOString();
//       state.orderType = orderType || "";
//       state.paymentMethod = paymentMethod || "";
//       state.table = null;

//       // ✅ Only generate if not already set (prevents regeneration on edit)
//       state.orderNo = orderNo || state.orderNo || generateUniqueOrderNo();

//       if (orderType !== "Delivery") {
//         state.deliveryAddress = "";
//         state.deliveryBoyId = null;
//       }
//     },

//     setDeliveryInfo: (state, action) => {
//       const { address, deliveryBoyId } = action.payload;
//       state.deliveryAddress = address || "";
//       state.deliveryBoyId = deliveryBoyId || null;
//       if (action.payload.phone) state.customerPhone = action.payload.phone;
//       if (action.payload.name) state.customerName = action.payload.name;
//     },

//     removeCustomer: (state) => {
//       Object.assign(state, initialState); // resets everything
//     },

//     updateTable: (state, action) => {
//       state.table = action.payload.table;
//     },
//   },
// });

// export const { setCustomer, setDeliveryInfo, removeCustomer, updateTable } = customerSlice.actions;
// export default customerSlice.reducer;


// import { createSlice } from "@reduxjs/toolkit";

// // --- Generate Unique 5-digit Order Number (Multi-Device Safe) ---
// const generateUniqueOrderNo = () => {
//   // Use timestamp (last 3 digits) + random (2 digits) for uniqueness
//   const timestamp = Date.now();
//   const timePart = parseInt(timestamp.toString().slice(-3)); // Last 3 digits of timestamp (0-999)
//   const randomPart = Math.floor(10 + Math.random() * 90); // Random 2 digits (10-99)

//   // Combine to create 5-digit number
//   const orderNum = (timePart * 100 + randomPart).toString().padStart(5, '0');

//   return `ORD-${orderNum}`;
// };

// const initialState = {
//   orderId: "",
//   orderNo: "",
//   customerName: "",
//   customerPhone: "",
//   guests: 0,
//   table: null,
//   orderPlacedAt: "",
//   orderType: "",
//   paymentMethod: "",
//   deliveryAddress: "",
//   deliveryBoyId: null,
// };

// const customerSlice = createSlice({
//   name: "customer",
//   initialState,
//   reducers: {
//     setCustomer: (state, action) => {
//       const { name, phone, guests, orderType, paymentMethod, orderId, orderNo, isEdit,table } = action.payload;

//       // ✅ If it's a new order (not editing), generate a new unique orderNo
//       if (!isEdit) {
//         state.orderNo = generateUniqueOrderNo();
//       } else if (orderNo) {
//         // ✅ If editing and backend sent orderNo, keep it
//         state.orderNo = orderNo;
//       }

//       state.orderId = orderId || `${Date.now()}`;
//       state.customerName = name || "";
//       state.customerPhone = phone || "";
//       state.guests = guests || 0;
//       state.orderPlacedAt = new Date().toISOString();
//       state.orderType = orderType || "";
//       state.paymentMethod = paymentMethod || "";
//       // state.table = null;
//       state.table = table || null;

//       if (orderType !== "Delivery") {
//         state.deliveryAddress = "";
//         state.deliveryBoyId = null;
//       }
//     },

//     setDeliveryInfo: (state, action) => {
//       const { address, deliveryBoyId } = action.payload;
//       state.deliveryAddress = address || "";
//       state.deliveryBoyId = deliveryBoyId || null;
//       if (action.payload.phone) state.customerPhone = action.payload.phone;
//       if (action.payload.name) state.customerName = action.payload.name;
//     },

//     removeCustomer: (state) => {
//       Object.assign(state, initialState);
//     },

//     updateTable: (state, action) => {
//       state.table = action.payload.table;
//     },
//   },
// });

// export const { setCustomer, setDeliveryInfo, removeCustomer, updateTable } = customerSlice.actions;
// export default customerSlice.reducer;


// import { createSlice } from "@reduxjs/toolkit";

// // --- Get current counter value without incrementing ---
// const getCurrentCounter = () => {
//   const today = new Date().toDateString();
//   const storedDate = localStorage.getItem("orderDate");
//   let storedCounter = parseInt(localStorage.getItem("orderCounter") || "0");

//   // If it's a new day, counter should be 0
//   if (storedDate !== today) {
//     return 0;
//   }

//   return storedCounter;
// };

// // --- Get Preview Order Number (Next order number without saving) ---
// const getPreviewOrderNo = () => {
//   const currentCounter = getCurrentCounter();
//   const nextNumber = currentCounter + 1;
//   return `ORD-${nextNumber}`;
// };

// // --- Confirm and Increment Counter (Call after successful order placement) ---
// const confirmOrderNo = () => {
//   const today = new Date().toDateString();
//   const storedDate = localStorage.getItem("orderDate");
//   let storedCounter = parseInt(localStorage.getItem("orderCounter") || "0");

//   // If it's a new day, reset
//   if (storedDate !== today) {
//     storedCounter = 0;
//     localStorage.setItem("orderDate", today);
//   }

//   // Increment and save
//   storedCounter += 1;
//   localStorage.setItem("orderCounter", storedCounter.toString());

//   console.log("✅ Order confirmed! Counter incremented to:", storedCounter);
// };

// const initialState = {
//   orderId: "",
//   orderNo: "",
//   customerName: "",
//   customerPhone: "",
//   guests: 0,
//   table: null,
//   orderPlacedAt: "",
//   orderType: "",
//   paymentMethod: "",
//   deliveryAddress: "",
//   deliveryBoyId: null,
//   items:[],
//   printedItems: [],
//   comment: "", 
// };

// const customerSlice = createSlice({
//   name: "customer",
//   initialState,
//   reducers: {
//     setCustomer: (state, action) => {
//       const { name, phone, guests, orderType, paymentMethod, orderId, orderNo, isEdit, table, items,comment  } = action.payload;

//       // ✅ If it's a new order (not editing), generate preview order number
//       if (!isEdit) {
//         state.orderNo = getPreviewOrderNo();
//         console.log("🆕 New order created with orderNo:", state.orderNo);
//       } else if (orderNo) {
//         // ✅ If editing, keep the existing orderNo from backend
//         state.orderNo = orderNo;
//         console.log("✏️ Editing existing order:", state.orderNo);
//       }

//       state.orderId = orderId || `${Date.now()}`;
//       state.customerName = name || "";
//       state.customerPhone = phone || "";
//       state.guests = guests || 0;
//       state.orderPlacedAt = new Date().toISOString();
//       state.orderType = orderType || "";
//       state.paymentMethod = paymentMethod || "";
//       state.table = table || null;
//       state.items = items || []; // ✅ <-- make sure this line exists
//        state.comment = comment || ""; // <-- set comment

//       if (orderType !== "Delivery") {
//         state.deliveryAddress = "";
//         state.deliveryBoyId = null;
//       }
//        printedItems: action.payload.printedItems || state.printedItems || []
//     },

//     // ✅ Call this action AFTER order is successfully placed/saved to backend
//     confirmOrder: (state) => {
//       confirmOrderNo();
//       console.log("Order confirmed, counter incremented");
//     },

//     setDeliveryInfo: (state, action) => {
//       const { address, deliveryBoyId } = action.payload;
//       state.deliveryAddress = address || "";
//       state.deliveryBoyId = deliveryBoyId || null;
//       if (action.payload.phone) state.customerPhone = action.payload.phone;
//       if (action.payload.name) state.customerName = action.payload.name;
//     },

//     removeCustomer: (state) => {
//       console.log("🧹 Clearing customer data");
//       Object.assign(state, initialState);
//     },

//     updateTable: (state, action) => {
//       state.table = action.payload.table;
//     },

//     // Optional: Reset order counter manually
//     resetOrderCounter: () => {
//       localStorage.setItem("orderCounter", "0");
//       localStorage.setItem("orderDate", new Date().toDateString());
//       console.log("🔄 Order counter reset to 0");
//     },
//   },
// });

// export const { setCustomer, confirmOrder, setDeliveryInfo, removeCustomer, updateTable, resetOrderCounter } = customerSlice.actions;
// export default customerSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

// --- Get current counter value without incrementing ---
const getCurrentCounter = () => {
  const today = new Date().toDateString();
  const storedDate = localStorage.getItem("orderDate");
  let storedCounter = parseInt(localStorage.getItem("orderCounter") || "0");

  // If it's a new day, counter should be 0
  if (storedDate !== today) {
    return 0;
  }

  return storedCounter;
};

// --- Get Preview Order Number (Next order number without saving) ---
const getPreviewOrderNo = () => {
  const currentCounter = getCurrentCounter();
  const nextNumber = currentCounter + 1;
  return `ORD-${nextNumber}`;
};

// --- Confirm and Increment Counter (Call after successful order placement) ---
const confirmOrderNo = () => {
  const today = new Date().toDateString();
  const storedDate = localStorage.getItem("orderDate");
  let storedCounter = parseInt(localStorage.getItem("orderCounter") || "0");

  // If it's a new day, reset
  if (storedDate !== today) {
    storedCounter = 0;
    localStorage.setItem("orderDate", today);
  }

  // Increment and save
  storedCounter += 1;
  localStorage.setItem("orderCounter", storedCounter.toString());

  console.log("✅ Order confirmed! Counter incremented to:", storedCounter);
};

const initialState = {
  orderId: "",
  orderNo: "",
  customerName: "",
  customerPhone: "",
  guests: 0,
  table: null,
  orderPlacedAt: "",
  orderType: "",
  paymentMethod: "",
  deliveryAddress: "",
  deliveryBoyId: null,
  items: [],
  printedItems: [], 
  comment: "", 
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomer: (state, action) => {
      const { 
        name, 
        phone, 
        guests, 
        orderType, 
        paymentMethod, 
        orderId, 
        orderNo, 
        isEdit, 
        table, 
        items, 
        comment,
        printedItems // ✅ ADD THIS to destructure printedItems from action.payload
      } = action.payload;

      // ✅ If it's a new order (not editing), generate preview order number
      if (!isEdit ) {
        state.orderNo = getPreviewOrderNo();
        console.log("🆕 New order created with orderNo:", state.orderNo);
      } else if (orderNo) {
        // ✅ If editing, keep the existing orderNo from backend
        state.orderNo = orderNo;
        console.log("✏️ Editing existing order:", state.orderNo);
      }

      state.orderId = orderId || `${Date.now()}`;
      state.customerName = name || "";
      state.customerPhone = phone || "";
      state.guests = guests || 0;
      state.orderPlacedAt = new Date().toISOString();
      state.orderType = orderType || "";
      state.paymentMethod = paymentMethod || "";
      state.table = table || null;
      state.items = items || [];
      state.comment = comment || "";
      
      // ✅ FIX: This was incorrectly placed - move it here properly
      state.printedItems = printedItems || state.printedItems || [];

      if (orderType !== "Delivery") {
        state.deliveryAddress = "";
        state.deliveryBoyId = null;
      }
    },

    // ✅ Call this action AFTER order is successfully placed/saved to backend
    confirmOrder: (state) => {
      confirmOrderNo();
      console.log("Order confirmed, counter incremented");
    },

    setDeliveryInfo: (state, action) => {
      const { address, deliveryBoyId } = action.payload;
      state.deliveryAddress = address || "";
      state.deliveryBoyId = deliveryBoyId || null;
      if (action.payload.phone) state.customerPhone = action.payload.phone;
      if (action.payload.name) state.customerName = action.payload.name;
    },

    // ✅ FIX: Update removeCustomer to clear printedItems
    removeCustomer: (state) => {
      console.log("🧹 Clearing customer data");
      // Reset all state to initial values
      state.orderId = "";
      state.orderNo = "";
      state.customerName = "";
      state.customerPhone = "";
      state.guests = 0;
      state.table = null;
      state.orderPlacedAt = "";
      state.orderType = "";
      state.paymentMethod = "";
      state.deliveryAddress = "";
      state.deliveryBoyId = null;
      state.items = [];
      state.printedItems = []; // ✅ ADD THIS - Clear printed items
      state.comment = "";
    },

    updateTable: (state, action) => {
      state.table = action.payload.table;
    },

    // Optional: Reset order counter manually
    resetOrderCounter: () => {
      localStorage.setItem("orderCounter", "0");
      localStorage.setItem("orderDate", new Date().toDateString());
      console.log("🔄 Order counter reset to 0");
    },
  },
});

export const { 
  setCustomer, 
  confirmOrder, 
  setDeliveryInfo, 
  removeCustomer, 
  updateTable, 
  resetOrderCounter 
} = customerSlice.actions;

export default customerSlice.reducer;
