import {createSlice} from "@reduxjs/toolkit";


const initialState = {

    orderId: "",
    customerName: "",
    customerPhone: "",
    guests: 0,
    table: null,
    orderPlacedAt:"",
    orderType:"",
    paymentMethod:""


}

const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers : {
        // setCustomer : (state, action) => {
        //     const { name, phone ,guests, orderType,paymentMethod} = action.payload;
        //     state.orderId = `${Date.now()}`;
        //     state.customerName = name;
        //     state.customerPhone = phone;
        //     state.guests = guests;
        //     state.orderPlacedAt = new Date();
        //     state.orderType = orderType;
        //     state.paymentMethod =paymentMethod;
        //     table: null

            
        // },

        setCustomer: (state, action) => {
            const { name, phone, guests, orderType, paymentMethod, orderId } = action.payload;
            state.orderId = orderId || `${Date.now()}`; // Preserve existing orderId if provided
            state.customerName = name || "";
            state.customerPhone = phone || "N/A";
            state.guests = guests || 0;
            state.orderPlacedAt = new Date().toISOString();
            state.orderType = orderType || "";
            state.paymentMethod = paymentMethod || ""; // Keep the payment method from payload
            state.table = null; // Fixed this assignment
        },
        

        removeCustomer : (state) => {
            state.customerName = "";
            state.customerPhone = "";
            state.guests = 0;
            state.table = null;
        },
        updateTable : (state,action) => {
            state.table = action.payload.table;
        }
    }
});

export const { setCustomer, removeCustomer, updateTable} = customerSlice.actions;
export default customerSlice.reducer    

