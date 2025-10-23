// import { createSlice } from "@reduxjs/toolkit";


// const initialState = [];



// const cartSlice = createSlice({

//     name: "cart",
//     initialState,
//     reducers: {

//         addItems: (state, action) => {
//             const existingItem = state.find(item => item.id === action.payload.id);
//             if (existingItem) {
//                 existingItem.quantity += 1;
//             } else {
//                 // state.push({ ...action.payload, quantity: 1 });
//                 state.push(action.payload);

//             }
//         },


//         removeItem: (state, action) => {
//             const existingItem = state.find(item => item.id === action.payload);
//             if (existingItem) {
//                 if (existingItem.quantity > 1) {
//                     existingItem.quantity -= 1; // Decrease quantity by 1 if more than 1
//                 } else {
//                     return state.filter(item => item.id !== action.payload); // Remove item if quantity is 1
//                 }
//             }
//             return state;
//         },
//         removeAllItems: (state) => {
//             return [];
//         },
//         setCartItems: (state, action) => {
//             return action.payload; // Completely replace cart
//         },

//     }
// })

// export const getTotalPrice = (state) => state.cart.reduce((total, item) => total + (item.price * item.quantity), 0)

// export const { addItems, removeItem, removeAllItems, setCartItems,} = cartSlice.actions;
// export default cartSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
 


        // addItems: (state, action) => {
        //     const incomingItem = action.payload;
        //     console.log('Adding to cart:', incomingItem); // <- check this

        //     // Use dishId as a consistent reference (fallback to payload.id)
        //     const existingItem = state.find(
        //         item => item.dishId === incomingItem._id || item.id === incomingItem.id
        //     );

        //     if (existingItem) {
        //         existingItem.quantity += 1;
        //     } else {
        //         state.push({
        //             id: incomingItem._id,          // local id for Redux
        //             dishId: incomingItem._id,      // MongoDB dishId
        //             name: incomingItem.dishName || incomingItem.name,
        //             price: incomingItem.pricePerQuantity || incomingItem.price,
        //             section: incomingItem.section || null,   // <- store section here
        //             quantity: 1,
        //         });
        //     }
        // },



    //     addItems: (state, action) => {
    //   const incomingItem = action.payload;

    //   // 🧩 Consistent dishId reference
    //   const existingItem = state.find(
    //     (item) =>
    //       (item.dishId === incomingItem._id || item.id === incomingItem._id) &&
    //       item.section === (incomingItem.section || null) &&
    //       item.name === (incomingItem.dishName || incomingItem.name)
    //   );

    //   if (existingItem) {
    //     // ✅ Add actual quantity (not just +1)
    //     existingItem.quantity += incomingItem.quantity;
    //     // ✅ Update total price correctly
    //     existingItem.price += incomingItem.price;
    //   } else {
    //     // ✅ Add a fresh new item with correct quantity & price
    //     state.push({
    //       id: incomingItem._id,
    //       dishId: incomingItem._id,
    //       name: incomingItem.dishName || incomingItem.name,
    //       price: incomingItem.price, // total price (pricePerQuantity * quantity)
    //       pricePerQuantity: incomingItem.pricePerQuantity || incomingItem.price,
    //       section: incomingItem.section || null,
    //       quantity: incomingItem.quantity,
    //     });
    //   }
    // },

// addItems: (state, action) => {
//   const incomingItem = action.payload;
//   console.log('Adding to cart:', incomingItem);

//   // 🧠 Create a unique key per variation (or fallback to "default")
//   const variationKey =
//     incomingItem.variationName?.toLowerCase?.() || "default";

//   // 🔍 Check if the same dish *and* same variation already exist
//   const existingItem = state.find(
//     item =>
//       (item.dishId === incomingItem._id || item.id === incomingItem._id) &&
//       item.variationKey === variationKey
//   );

//   if (existingItem) {
//     // Increment quantity safely
//     existingItem.quantity += incomingItem.quantity || 1;
//   } else {
//     // 🆕 Add new unique item entry (even for same dish, different variation)
//     state.push({
//       id: `${incomingItem._id}-${variationKey}`, // unique per variation
//       dishId: incomingItem._id,
//       name: incomingItem.dishName || incomingItem.name,
//       price: Number((incomingItem.pricePerQuantity || incomingItem.price).toFixed(3)), // keep 3 decimals
//       section: incomingItem.section || null,
//       variationKey,
//       variationName: incomingItem.variationName || null,
//       quantity: incomingItem.quantity || 1,
//     });
//   }
// },


addItems: (state, action) => {
  const incoming = action.payload;

  // ✅ Normalize and ensure clean data
  const variationKey = incoming.variationName?.toLowerCase?.().trim?.() || "default";
  const incomingQty = Number(incoming.quantity) > 0 ? Number(incoming.quantity) : 1;

  // ✅ Try to find an existing item (same dish + same variation)
  const existingItem = state.find(
    (item) =>
      (item.dishId === incoming._id || item.id === incoming._id) &&
      item.variationKey === variationKey
  );

  if (existingItem) {
    // ✅ Increment only by the selected quantity
    existingItem.quantity += incomingQty;
  } else {
    // ✅ Add as a brand-new variation entry
    state.push({
      id: `${incoming._id}-${variationKey}`, // unique per variation
      dishId: incoming._id,
      name: incoming.dishName || incoming.name,
      price: Number((incoming.pricePerQuantity || incoming.price).toFixed(3)),
      section: incoming.section || null,
      variationKey,
      variationName: incoming.variationName || null,
      quantity: incomingQty,
    });
  }

  console.log(
    `🛒 Added/Updated: ${incoming.name || incoming.dishName} (${variationKey}) → dishId: ${
      incoming._id
    }, qty: ${incomingQty}`
  );
},



        removeItem: (state, action) => {
            const existingItem = state.find(item => item.id === action.payload);
            if (existingItem) {
                if (existingItem.quantity > 1) {
                    existingItem.quantity -= 1;
                } else {
                    return state.filter(item => item.id !== action.payload);
                }
            }
            return state;
        },

        removeAllItems: () => [],
        setCartItems: (state, action) => action.payload,
    },
});

// ✅ Selector (unchanged)
export const getTotalPrice = (state) =>
    state.cart.reduce((total, item) => total + item.price * item.quantity, 0);

export const { addItems, removeItem, removeAllItems, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
