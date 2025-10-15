// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   orderToEdit: null,
//   isEditing: false
// };

// const editOrderSlice = createSlice({
//   name: "editOrder",
//   initialState,
//   reducers: {
//     setOrderToEdit: (state, action) => {
//       state.orderToEdit = action.payload;
//       state.originalOrderId = action.payload._id; // Store original ID
//       state.isEditing = true;
//     },
//     clearOrderToEdit: (state) => {
//       state.orderToEdit = null;
//       state.originalOrderId = null;
//       state.isEditing = false;
//     },
//     updateEditedOrder: (state, action) => {
//       state.orderToEdit = {
//         ...state.orderToEdit,
//         ...action.payload
//       };
//     }
//   }
// });

// export const { setOrderToEdit, clearOrderToEdit, updateEditedOrder } = editOrderSlice.actions;
// export default editOrderSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   
    isEditing: false
  };

const editOrderSlice = createSlice({
  name: "editOrder",
  initialState,
  reducers: {
    setEditingMode: (state, action) => {
      state.isEditing = action.payload;
    }
}
});

export const { setEditingMode  } = editOrderSlice.actions;
export default editOrderSlice.reducer;