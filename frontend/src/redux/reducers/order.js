import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  allProducts: [],
  shopProducts: [],
  product: null,
  error: null,
  success: false,
  orders: [], // also add orders to state since you’re setting it later
};

export const orderReducer = createReducer(initialState, (builder) => {
  builder
    // get all order of shop
    .addCase("getAllOrdersUserRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllOrdersUserSuccess", (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    })
    .addCase("getAllOrdersUserFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // get all orders of shop
      .addCase("getAllOrdersShopRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getAllOrdersShopSuccess", (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    })
    .addCase("getAllOrdersShopFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })


     // get all orders of admin
      .addCase("adminAllOrdersRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("adminAllOrdersSuccess", (state, action) => {
      state.isLoading = false;
      state.adminOrders = action.payload;
    })
    .addCase("adminAllOrdersFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    // clear errors
    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});
