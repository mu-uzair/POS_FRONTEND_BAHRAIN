// import { createSlice } from "@reduxjs/toolkit";

// const initialState = [];

// const cartSlice = createSlice({
//     name: "cart",
//     initialState,
//     reducers: {
 
// addItems: (state, action) => {
//   const incoming = action.payload;

//   // ✅ Normalize all possible ID fields (menuItem, dishId, id, _id)
//   const normalizedId =
//     incoming.menuItem || incoming.dishId || incoming.id || incoming._id;

//   // ✅ Normalize variation key
//   const variationKey =
//     incoming.variationName?.toLowerCase?.().trim?.() || "default";

//   // ✅ Clean quantity
//   const incomingQty =
//     Number(incoming.quantity) > 0 ? Number(incoming.quantity) : 1;

//   // ✅ Find existing item (same dish + same variation)
//   const existingItem = state.find(
//     (item) =>
//       (item.menuItem === normalizedId ||
//         item.dishId === normalizedId ||
//         item.id === normalizedId) &&
//       (item.variationKey === variationKey ||
//         item.variationName?.toLowerCase?.().trim?.() === variationKey)
//   );

//   if (existingItem) {
//     // ✅ Merge quantities
//     existingItem.quantity += incomingQty;
//     // Optionally recompute total price if needed:
//     // existingItem.price = Number((existingItem.pricePerQuantity * existingItem.quantity).toFixed(3));
//   } else {
//     // ✅ Add new unique variation
//     state.push({
//       id: `${normalizedId}-${variationKey}`,
//       dishId: normalizedId,
//       menuItem: normalizedId,
//       name: incoming.dishName || incoming.name,
//       pricePerQuantity: Number((incoming.pricePerQuantity || incoming.price).toFixed(3)),
//       price: Number((incoming.pricePerQuantity || incoming.price).toFixed(3)),
//       section: incoming.section || null,
//       variationKey,
//       variationName: incoming.variationName || null,
//       quantity: incomingQty,
//       status: incoming.status || "Pending",
//       orderNo: incoming.orderNo || null,
//     });
//   }

//   console.log(
//     `🛒 Added/Updated: ${incoming.name || incoming.dishName} (${variationKey}) → ${incomingQty} pcs`
//   );
// },

//         removeItem: (state, action) => {
//             const existingItem = state.find(item => item.id === action.payload);
//             if (existingItem) {
//                 if (existingItem.quantity > 1) {
//                     existingItem.quantity -= 1;
//                 } else {
//                     return state.filter(item => item.id !== action.payload);
//                 }
//             }
//             return state;
//         },

//         removeAllItems: () => [],
//         setCartItems: (state, action) => action.payload,
//     },
// });

// // ✅ Selector (unchanged)
// export const getTotalPrice = (state) =>
//     state.cart.reduce((total, item) => total + item.price * item.quantity, 0);

// export const { addItems, removeItem, removeAllItems, setCartItems } = cartSlice.actions;
// export default cartSlice.reducer;


// using this code to fix some items dont appear on kitchen or grill side 

import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

const initialState = [];

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
 
addItems: (state, action) => {
  const incoming = action.payload;

  // ✅ Normalize all possible ID fields with validation
  const normalizedId =
    incoming.menuItem || incoming.dishId || incoming.id || incoming._id;

  // ✅ CRITICAL FIX: Ensure we have a valid ID
  if (!normalizedId) {
    console.error("❌ Cannot add item without a valid ID:", incoming);
    return state;
  }

  // ✅ Normalize variation key with better handling
  const variationKey =
    incoming.variationName?.toLowerCase?.().trim?.() || 
    incoming.variation?.toLowerCase?.().trim?.() ||
    "default";

  // ✅ Clean quantity
  const incomingQty =
    Number(incoming.quantity) > 0 ? Number(incoming.quantity) : 1;

  // ✅ CRITICAL FIX: Create a truly unique composite ID using uuid
  const uniqueId = `${normalizedId}-${variationKey}-${uuid()}`;

  // ✅ Find existing item (same dish + same variation)
  const existingItem = state.find(
    (item) => {
      const itemDishId = item.menuItem || item.dishId || item._id;
      const itemVariationKey = item.variationKey || "default";
      
      return (
        itemDishId === normalizedId &&
        itemVariationKey === variationKey
      );
    }
  );

  if (existingItem) {
    // ✅ Merge quantities
    existingItem.quantity += incomingQty;
    // ✅ Recompute total price
    existingItem.price = Number(
      (existingItem.pricePerQuantity * existingItem.quantity).toFixed(3)
    );
    
    console.log(
      `🛒 Updated: ${existingItem.name} (${variationKey}) → Qty: ${existingItem.quantity}`
    );
  } else {
    // ✅ Add new unique variation with proper ID
    const newItem = {
      id: uniqueId, // ✅ GUARANTEED UNIQUE
      dishId: normalizedId,
      menuItem: normalizedId,
      _id: normalizedId, // Keep original _id reference
      name: incoming.dishName || incoming.name || "Unknown Item",
      dishName: incoming.dishName || incoming.name || "Unknown Item",
      pricePerQuantity: Number((incoming.pricePerQuantity || incoming.price || 0).toFixed(3)),
      price: Number(((incoming.pricePerQuantity || incoming.price || 0) * incomingQty).toFixed(3)),
      section: incoming.section || null,
      variationKey,
      variationName: incoming.variationName || "Default",
      quantity: incomingQty,
      status: incoming.status || "Pending",
      orderNo: incoming.orderNo || null,
    };

    state.push(newItem);
    
    console.log(
      `🛒 Added: ${newItem.name} (${variationKey}) → ${incomingQty} pcs | ID: ${uniqueId}`
    );
  }
},

        removeItem: (state, action) => {
            const itemId = action.payload;
            const existingItem = state.find(item => item.id === itemId);
            
            if (existingItem) {
                if (existingItem.quantity > 1) {
                    existingItem.quantity -= 1;
                    // ✅ Recalculate price
                    existingItem.price = Number(
                      (existingItem.pricePerQuantity * existingItem.quantity).toFixed(3)
                    );
                    console.log(`🔻 Decreased: ${existingItem.name} → Qty: ${existingItem.quantity}`);
                } else {
                    console.log(`🗑️ Removed: ${existingItem.name}`);
                    return state.filter(item => item.id !== itemId);
                }
            }
            return state;
        },

        removeAllItems: () => {
            console.log("🧹 Cart cleared");
            return [];
        },
        
        setCartItems: (state, action) => {
            console.log("📦 Cart items set:", action.payload?.length || 0, "items");
            return action.payload;
        },
    },
});

// ✅ Selector with safety check
export const getTotalPrice = (state) =>
    state.cart.reduce((total, item) => {
        const itemTotal = (item.pricePerQuantity || 0) * (item.quantity || 0);
        return total + itemTotal;
    }, 0);

export const { addItems, removeItem, removeAllItems, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;