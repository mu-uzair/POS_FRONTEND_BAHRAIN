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

import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    orderId: "",
    customerName: "",
    customerPhone: "",
    guests: 0,
    table: null,
    orderPlacedAt: "",
    orderType: "",
    paymentMethod: "",
    // --- NEW DELIVERY FIELDS ---
    deliveryAddress: "",
    deliveryBoyId: null, // Store the assigned delivery boy's ID
    // -------------------------
}

const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {

        setCustomer: (state, action) => {
            const { name, phone, guests, orderType, paymentMethod, orderId } = action.payload;
            state.orderId = orderId || `${Date.now()}`;
            state.customerName = name || "";
            state.customerPhone = phone || ""; // Phone should not default to 'N/A' for delivery
            state.guests = guests || 0;
            state.orderPlacedAt = new Date().toISOString();
            state.orderType = orderType || "";
            state.paymentMethod = paymentMethod || "";
            state.table = null;

            // Clear delivery fields if order type is not delivery
            if (orderType !== 'Delivery') {
                state.deliveryAddress = "";
                state.deliveryBoyId = null;
            }
        },

        // --- NEW REDUCER FOR DELIVERY DETAILS ---
        setDeliveryInfo: (state, action) => {
            const { address, deliveryBoyId } = action.payload;
            state.deliveryAddress = address || "";
            state.deliveryBoyId = deliveryBoyId || null;
            // Optionally, update phone/name if they are changed here
            if (action.payload.phone) state.customerPhone = action.payload.phone;
            if (action.payload.name) state.customerName = action.payload.name;
        },
        // ----------------------------------------

        removeCustomer: (state) => {
            state.customerName = "";
            state.customerPhone = "";
            state.guests = 0;
            state.table = null;
            // --- Clear NEW FIELDS ---
            state.deliveryAddress = "";
            state.deliveryBoyId = null;
            // ------------------------
        },
        updateTable: (state, action) => {
            state.table = action.payload.table;
        }
    }
});

export const { setCustomer, setDeliveryInfo, removeCustomer, updateTable } = customerSlice.actions;
export default customerSlice.reducer
