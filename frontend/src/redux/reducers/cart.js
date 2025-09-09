import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  cart: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
};

export const cartReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("addToCart", (state, action) => {
      const item = action.payload;
      const isItemExist = state.cart.find((i) => i._id === item._id);

      if (isItemExist) {
        // Replace existing item
        state.cart = state.cart.map((i) =>
          i._id === isItemExist._id ? item : i
        );
      } else {
        // Add new item
        state.cart.push(item);
      }

      // ✅ Save updated cart to localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    })

    .addCase("removeFromCart", (state, action) => {
      state.cart = state.cart.filter((i) => i._id !== action.payload);

      // ✅ Save updated cart to localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    });
});
