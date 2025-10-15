import { createSlice } from "@reduxjs/toolkit";


const initialState = [];



const cartSlice = createSlice({

    name: "cart",
    initialState,
    reducers: {

        addItems: (state, action) => {
            const existingItem = state.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                // state.push({ ...action.payload, quantity: 1 });
                state.push(action.payload);

            }
        },


        removeItem: (state, action) => {
            const existingItem = state.find(item => item.id === action.payload);
            if (existingItem) {
                if (existingItem.quantity > 1) {
                    existingItem.quantity -= 1; // Decrease quantity by 1 if more than 1
                } else {
                    return state.filter(item => item.id !== action.payload); // Remove item if quantity is 1
                }
            }
            return state;
        },
        removeAllItems: (state) => {
            return [];
        },
        setCartItems: (state, action) => {
            return action.payload; // Completely replace cart
        },
       
    }
})

export const getTotalPrice = (state) => state.cart.reduce((total, item) => total + (item.price * item.quantity), 0)

export const { addItems, removeItem, removeAllItems, setCartItems,} = cartSlice.actions;
export default cartSlice.reducer;