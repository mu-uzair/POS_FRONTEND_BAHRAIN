


// using this code to fix some items dont appear on kitchen or grill side 

// import { createSlice } from "@reduxjs/toolkit";
// import { v4 as uuid } from "uuid";

// const initialState = [];

// const cartSlice = createSlice({
//     name: "cart",
//     initialState,
//     reducers: {
 
// addItems: (state, action) => {
//   const incoming = action.payload;

//   // ✅ Normalize all possible ID fields with validation
//   const normalizedId =
//     incoming.menuItem || incoming.dishId || incoming.id || incoming._id;

//   // ✅ CRITICAL FIX: Ensure we have a valid ID
//   if (!normalizedId) {
//     console.error("❌ Cannot add item without a valid ID:", incoming);
//     return state;
//   }

//   // ✅ Normalize variation key with better handling
//   const variationKey =
//     incoming.variationName?.toLowerCase?.().trim?.() || 
//     incoming.variation?.toLowerCase?.().trim?.() ||
//     "default";

//   // ✅ Clean quantity
//   const incomingQty =
//     Number(incoming.quantity) > 0 ? Number(incoming.quantity) : 1;

//   // ✅ CRITICAL FIX: Create a truly unique composite ID using uuid
//   const uniqueId = `${normalizedId}-${variationKey}-${uuid()}`;

//   // ✅ Find existing item (same dish + same variation)
//   const existingItem = state.find(
//     (item) => {
//       const itemDishId = item.menuItem || item.dishId || item._id;
//       const itemVariationKey = item.variationKey || "default";
      
//       return (
//         itemDishId === normalizedId &&
//         itemVariationKey === variationKey
//       );
//     }
//   );

//   if (existingItem) {
//     // ✅ Merge quantities
//     existingItem.quantity += incomingQty;
//     // ✅ Recompute total price
//     existingItem.price = Number(
//       (existingItem.pricePerQuantity * existingItem.quantity).toFixed(3)
//     );
    
//     console.log(
//       `🛒 Updated: ${existingItem.name} (${variationKey}) → Qty: ${existingItem.quantity}`
//     );
//   } else {
//     // ✅ Add new unique variation with proper ID
//     const newItem = {
//       id: uniqueId, // ✅ GUARANTEED UNIQUE
//       dishId: normalizedId,
//       menuItem: normalizedId,
//       _id: normalizedId, // Keep original _id reference
//       name: incoming.dishName || incoming.name || "Unknown Item",
//       dishName: incoming.dishName || incoming.name || "Unknown Item",
//       pricePerQuantity: Number((incoming.pricePerQuantity || incoming.price || 0).toFixed(3)),
//       price: Number(((incoming.pricePerQuantity || incoming.price || 0) * incomingQty).toFixed(3)),
//       section: incoming.section || null,
//       variationKey,
//       variationName: incoming.variationName || "Default",
//       quantity: incomingQty,
//       status: incoming.status || "Pending",
//       orderNo: incoming.orderNo || null,
//     };

//     state.push(newItem);
    
//     console.log(
//       `🛒 Added: ${newItem.name} (${variationKey}) → ${incomingQty} pcs | ID: ${uniqueId}`
//     );
//   }
// },

//         removeItem: (state, action) => {
//             const itemId = action.payload;
//             const existingItem = state.find(item => item.id === itemId);
            
//             if (existingItem) {
//                 if (existingItem.quantity > 1) {
//                     existingItem.quantity -= 1;
//                     // ✅ Recalculate price
//                     existingItem.price = Number(
//                       (existingItem.pricePerQuantity * existingItem.quantity).toFixed(3)
//                     );
//                     console.log(`🔻 Decreased: ${existingItem.name} → Qty: ${existingItem.quantity}`);
//                 } else {
//                     console.log(`🗑️ Removed: ${existingItem.name}`);
//                     return state.filter(item => item.id !== itemId);
//                 }
//             }
//             return state;
//         },

//         removeAllItems: () => {
//             console.log("🧹 Cart cleared");
//             return [];
//         },
        
//         setCartItems: (state, action) => {
//             console.log("📦 Cart items set:", action.payload?.length || 0, "items");
//             return action.payload;
//         },
//     },
// });

// // ✅ Selector with safety check
// export const getTotalPrice = (state) =>
//     state.cart.reduce((total, item) => {
//         const itemTotal = (item.pricePerQuantity || 0) * (item.quantity || 0);
//         return total + itemTotal;
//     }, 0);

// export const { addItems, removeItem, removeAllItems, setCartItems } = cartSlice.actions;
// export default cartSlice.reducer;

// using this code to test price mismatch

// import { createSlice } from "@reduxjs/toolkit";
// import { v4 as uuid } from "uuid";

// const initialState = [];

// // ✅ Safe rounding to 3 decimal places
// const round3 = (num) =>
//   Math.round((Number(num) || 0) * 1000) / 1000;

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {

//     addItems: (state, action) => {
//       const incoming = action.payload;

//       // ✅ Normalize dish ID
//       const normalizedId =
//         incoming.menuItem || incoming.dishId || incoming._id || incoming.id;

//       if (!normalizedId) {
//         console.error("❌ Cannot add item without a valid ID:", incoming);
//         return state;
//       }

//       // ✅ Normalize variation key
//       const variationKey =
//         incoming.variationName?.toLowerCase?.().trim?.() ||
//         incoming.variation?.toLowerCase?.().trim?.() ||
//         "default";

//       // ✅ Clean quantity (always positive integer)
//       const incomingQty = Number(incoming.quantity) > 0 ? Number(incoming.quantity) : 1;

//       // ✅ CRITICAL: Extract unit price correctly.
//       // Never trust `incoming.price` as unit price — it may already be total.
//       // `pricePerQuantity` is ALWAYS the single-unit price.
//       // If only `price` is provided and quantity > 1, derive unit price.
//       let unitPrice;
//       if (incoming.pricePerQuantity != null && Number(incoming.pricePerQuantity) > 0) {
//         // Best case: explicit unit price provided
//         unitPrice = round3(incoming.pricePerQuantity);
//       } else if (incoming.price != null && incomingQty > 0) {
//         // Fallback: derive unit price from total / qty
//         unitPrice = round3(Number(incoming.price) / incomingQty);
//       } else {
//         unitPrice = 0;
//       }

//       // ✅ Find existing item (same dish + same variation)
//       const existingItem = state.find((item) => {
//         const itemDishId = item.menuItem || item.dishId || item._id;
//         const itemVariationKey = item.variationKey || "default";
//         return itemDishId === normalizedId && itemVariationKey === variationKey;
//       });

//       if (existingItem) {
//         // ✅ Merge: increment quantity, recompute price from unit price
//         existingItem.quantity += incomingQty;
//         existingItem.price = round3(existingItem.pricePerQuantity * existingItem.quantity);

//         console.log(
//           `🛒 Updated: ${existingItem.name} (${variationKey}) → Qty: ${existingItem.quantity} | Unit: ${existingItem.pricePerQuantity} | Total: ${existingItem.price}`
//         );
//       } else {
//         // ✅ Add new item — always derive price from unit price * qty
//         const newItem = {
//           id: `${normalizedId}-${variationKey}-${uuid()}`,
//           dishId: normalizedId,
//           menuItem: normalizedId,
//           _id: normalizedId,
//           name: incoming.dishName || incoming.name || "Unknown Item",
//           dishName: incoming.dishName || incoming.name || "Unknown Item",
//           section: incoming.section || null,
//           variationKey,
//           variationName: incoming.variationName || "Default",
//           pricePerQuantity: unitPrice,             // ✅ Always unit price
//           price: round3(unitPrice * incomingQty),  // ✅ Always unit * qty
//           quantity: incomingQty,
//           status: incoming.status || "Pending",
//           orderNo: incoming.orderNo || null,
//         };

//         state.push(newItem);

//         console.log(
//           `🛒 Added: ${newItem.name} (${variationKey}) → ${incomingQty} pcs | Unit: ${unitPrice} | Total: ${newItem.price}`
//         );
//       }
//     },

//     removeItem: (state, action) => {
//       const itemId = action.payload;
//       const existingItem = state.find((item) => item.id === itemId);

//       if (existingItem) {
//         if (existingItem.quantity > 1) {
//           existingItem.quantity -= 1;
//           // ✅ Always recompute from unit price
//           existingItem.price = round3(existingItem.pricePerQuantity * existingItem.quantity);
//           console.log(`🔻 Decreased: ${existingItem.name} → Qty: ${existingItem.quantity} | Total: ${existingItem.price}`);
//         } else {
//           console.log(`🗑️ Removed: ${existingItem.name}`);
//           return state.filter((item) => item.id !== itemId);
//         }
//       }
//       return state;
//     },

//     removeAllItems: () => {
//       // console.log("🧹 Cart cleared");
//       return [];
//     },

//     setCartItems: (state, action) => {
//       console.log("📦 Cart items set:", action.payload?.length || 0, "items");
//       return action.payload;
//     },
//   },
// });

// // ✅ Selector: always recompute from pricePerQuantity * quantity
// // Never trust item.price — this is the single source of truth for totals
// export const getTotalPrice = (state) =>
//   state.cart.reduce((total, item) => {
//     const unitPrice = Number(item.pricePerQuantity) || 0;
//     const qty = Number(item.quantity) || 0;
//     return total + unitPrice * qty;
//   }, 0);

// export const { addItems, removeItem, removeAllItems, setCartItems } = cartSlice.actions;
// export default cartSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

/**
 * Round to exactly 3 decimal places using integer math.
 * Avoids the IEEE 754 drift that makes 0.6 + 0.7 = 1.2999999999999998.
 */
const round3 = (num) => Math.round((Number(num) || 0) * 1000) / 1000;

/**
 * Custom dishes are created with id = "custom-<uuid>".
 * They must NEVER be merged — each is a unique line item.
 */
const isCustomDish = (id) => typeof id === "string" && id.startsWith("custom-");

// ─────────────────────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────────────────────

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {

    addItems: (state, action) => {
      const incoming = action.payload;

      // Resolve canonical dish ID
      const normalizedId =
        incoming.menuItem || incoming.dishId || incoming._id || incoming.id;

      if (!normalizedId) {
        console.error("❌ [Cart] Cannot add item without a valid ID:", incoming);
        return state;
      }

      // Normalize variation key
      const variationKey =
        incoming.variationName?.toLowerCase?.().trim?.() ||
        incoming.variation?.toLowerCase?.().trim?.() ||
        "default";

      // Clean quantity
      const incomingQty = Number(incoming.quantity) > 0 ? Number(incoming.quantity) : 1;

      // Resolve unit price
      // pricePerQuantity is ALWAYS the per-unit price.
      // Never use incoming.price as unit price when qty > 1
      // because it may already be the accumulated total.
      let unitPrice;
      if (incoming.pricePerQuantity != null && Number(incoming.pricePerQuantity) > 0) {
        unitPrice = round3(incoming.pricePerQuantity);
      } else if (incoming.price != null && incomingQty > 0) {
        unitPrice = round3(Number(incoming.price) / incomingQty);
      } else {
        unitPrice = 0;
      }

      // Custom dishes: always a new line item, never merged
      if (isCustomDish(normalizedId)) {
        const customItem = {
          id:               normalizedId,
          dishId:           normalizedId,
          menuItem:         normalizedId,
          _id:              normalizedId,
          name:             incoming.dishName || incoming.name || "Custom Item",
          dishName:         incoming.dishName || incoming.name || "Custom Item",
          section:          incoming.section || null,
          variationKey:     "custom",
          variationName:    incoming.variationName || "Custom",
          pricePerQuantity: unitPrice,
          price:            round3(unitPrice * incomingQty),
          quantity:         incomingQty,
          status:           "Pending",
          orderNo:          incoming.orderNo || null,
        };
        state.push(customItem);
        console.log(`🛒 [Cart] Custom added: "${customItem.name}" | Unit: ${unitPrice} | Total: ${customItem.price}`);
        return;
      }

      // Regular dishes: merge if same dish + same variation
      const existingItem = state.find((item) => {
        const itemDishId       = item.menuItem || item.dishId || item._id;
        const itemVariationKey = item.variationKey || "default";
        return itemDishId === normalizedId && itemVariationKey === variationKey;
      });

      if (existingItem) {
        existingItem.quantity += incomingQty;
        existingItem.price = round3(existingItem.pricePerQuantity * existingItem.quantity);
        console.log(
          `🛒 [Cart] Merged: "${existingItem.name}" (${variationKey})` +
          ` | Qty: ${existingItem.quantity} | Total: ${existingItem.price}`
        );
      } else {
        const newItem = {
          id:               `${normalizedId}-${variationKey}-${uuid()}`,
          dishId:           normalizedId,
          menuItem:         normalizedId,
          _id:              normalizedId,
          name:             incoming.dishName || incoming.name || "Unknown Item",
          dishName:         incoming.dishName || incoming.name || "Unknown Item",
          section:          incoming.section || null,
          variationKey,
          variationName:    incoming.variationName || "Default",
          pricePerQuantity: unitPrice,
          price:            round3(unitPrice * incomingQty),
          quantity:         incomingQty,
          status:           incoming.status || "Pending",
          orderNo:          incoming.orderNo || null,
        };
        state.push(newItem);
        console.log(
          `🛒 [Cart] Added: "${newItem.name}" (${variationKey})` +
          ` | ${incomingQty} pcs | Unit: ${unitPrice} | Total: ${newItem.price}`
        );
      }
    },

    removeItem: (state, action) => {
      const itemId       = action.payload;
      const existingItem = state.find((item) => item.id === itemId);

      if (!existingItem) return state;

      if (existingItem.quantity > 1) {
        existingItem.quantity -= 1;
        existingItem.price = round3(existingItem.pricePerQuantity * existingItem.quantity);
        console.log(`🔻 [Cart] Decreased: "${existingItem.name}" | Qty: ${existingItem.quantity}`);
      } else {
        console.log(`🗑️  [Cart] Removed: "${existingItem.name}"`);
        return state.filter((item) => item.id !== itemId);
      }
    },

    removeAllItems: () => {
      console.log("🧹 [Cart] Cleared");
      return [];
    },

    setCartItems: (_state, action) => {
      console.log("📦 [Cart] Set:", action.payload?.length ?? 0, "items");
      return action.payload;
    },
  },
});

// ─────────────────────────────────────────────────────────────
// SELECTORS
// ─────────────────────────────────────────────────────────────

/**
 * Recompute total from pricePerQuantity × quantity every time.
 *
 * WHY round3 on EACH line before summing:
 *   0.6 + 0.7 = 1.2999999999999998 in IEEE 754 floating point.
 *   Rounding each subtotal to 3dp before accumulating keeps every
 *   intermediate result clean. The outer round3() catches any
 *   residual drift when there are many items.
 *
 * Example:
 *   TABOULA  Small  × 1  → round3(0.6 × 1)  = 0.600
 *   GREEN SALAD Small × 1  → round3(0.7 × 1)  = 0.700
 *   sum: 0.600 + 0.700 = 1.300  ✅  (not 1.2999999999999998)
 */
export const getTotalPrice = (state) =>
  round3(
    state.cart.reduce(
      (total, item) =>
        total + round3(
          (Number(item.pricePerQuantity) || 0) * (Number(item.quantity) || 0)
        ),
      0
    )
  );

export const { addItems, removeItem, removeAllItems, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;