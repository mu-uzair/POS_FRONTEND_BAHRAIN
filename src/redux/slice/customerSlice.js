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


import { createSlice } from "@reduxjs/toolkit";

// --- Helper function ---
const generateUniqueOrderNo = () => {
  const usedNos = JSON.parse(localStorage.getItem("usedOrderNos") || "[]");
  let newNo;

  do {
    newNo = Math.floor(1000 + Math.random() * 9000);
  } while (usedNos.includes(newNo));

  usedNos.push(newNo);
  localStorage.setItem("usedOrderNos", JSON.stringify(usedNos));

  return `ORD-${newNo}`;
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
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomer: (state, action) => {
      const { name, phone, guests, orderType, paymentMethod, orderId, orderNo,isEdit } = action.payload;

      
  // ✅ If it's a new order (not editing), generate a new unique orderNo
  if (!isEdit) {
    state.orderNo = generateUniqueOrderNo();
  } else if (orderNo) {
    // ✅ If editing and backend sent orderNo, keep it
    state.orderNo = orderNo;
  }

      state.orderId = orderId || `${Date.now()}`;
      state.customerName = name || "";
      state.customerPhone = phone || "";
      state.guests = guests || 0;
      state.orderPlacedAt = new Date().toISOString();
      state.orderType = orderType || "";
      state.paymentMethod = paymentMethod || "";
      state.table = null;

      // ✅ Only generate if not already set (prevents regeneration on edit)
      state.orderNo = orderNo || state.orderNo || generateUniqueOrderNo();

      if (orderType !== "Delivery") {
        state.deliveryAddress = "";
        state.deliveryBoyId = null;
      }
    },

    setDeliveryInfo: (state, action) => {
      const { address, deliveryBoyId } = action.payload;
      state.deliveryAddress = address || "";
      state.deliveryBoyId = deliveryBoyId || null;
      if (action.payload.phone) state.customerPhone = action.payload.phone;
      if (action.payload.name) state.customerName = action.payload.name;
    },

    removeCustomer: (state) => {
      Object.assign(state, initialState); // resets everything
    },

    updateTable: (state, action) => {
      state.table = action.payload.table;
    },
  },
});

export const { setCustomer, setDeliveryInfo, removeCustomer, updateTable } = customerSlice.actions;
export default customerSlice.reducer;
