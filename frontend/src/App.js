import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRout from "./routes/ProtectedRout.js";
import { ShopHomePage } from "./ShopRout.js";
import {
  LoginPage,
  SignUpPage,
  ActivationPage,
  HomePage,
  ProductsPage,
  BestSellingPage,
  EventsPage,
  FaqPage,
  ProductDetailsPage,
  ProfilePage,
  ShopCreatePage,
  SellerActivationPage,
  ShopLoginPage,
  OrderSuccessPage,
  OrderDetailsPage,
  TrackOrderPage,
  UserInbox,
} from "./routes/Routes.js";
import {
  ShopDashboardPage,
  ShopCreateProduct,
  ShopAllProducts,
  ShopCreateEvents,
  ShopAllEvents,
  ShopAllCoupouns,
  ShopAllOrders,
  ShopOrderDetails,
  ShopAllRefunds,
  ShopSettingsPage,
  ShopWithDrawMoneyPage,
  ShopInboxPage,
} from "./routes/ShopRoutes";
import {
  AdminDashboardPage,
  AdminDashboardUsers,
  AdminDashboardSellers,
  AdminDashboardOrders,
  AdminDashboardProducts,
  AdminDashboardEvents,
  AdminDashboardWithdraw
} from "./routes/AdminRoutes.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Store from "./redux/store";
import { loadUser } from "./redux/actions/user.js";
import { loadShop } from "./redux/actions/user.js";
// import { getAllProducts } from "./redux/actions/product";
import ShopPreviewPage from "./pages/Shop/ShopPreviewPage.jsx";
import SellerProtectedRout from "./routes/SellerProtecredRout.js";
import { getAllEvents } from "./redux/actions/event.js";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import axios from "axios";
import { server } from "./server.js";
// script import
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute.js";

const App = () => {
  const [stripeApikey, setStripeApikey] = useState("");

  async function getStripeApikey() {
    const { data } = await axios.get(`${server}/payment/stripeapikey`);
    setStripeApikey(data.stripeApikey);
  }

  useEffect(() => {
    Store.dispatch(loadUser());
    Store.dispatch(loadShop());
    // Store.dispatch(getAllProducts());
    Store.dispatch(getAllEvents());
    getStripeApikey();
  }, []);
  //  console.log(stripeApikey);

  return (
    <BrowserRouter>
      {stripeApikey && (
        <Elements stripe={loadStripe(stripeApikey)}>
          <Routes>
            <Route
              path="/payment"
              element={
                <ProtectedRout>
                  <PaymentPage />
                </ProtectedRout>
              }
            />
          </Routes>
        </Elements>
      )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/order/success" element={<OrderSuccessPage />} />
        <Route
          path="/activation/:activation_token"
          element={<ActivationPage />}
        />
        <Route
          path="/seller/activation/:activation_token"
          element={<SellerActivationPage />}
        />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/best-selling" element={<BestSellingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRout>
              <CheckoutPage />
            </ProtectedRout>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRout>
              <ProfilePage />
            </ProtectedRout>
          }
        />
        <Route
          path="/inbox"
          element={
            <ProtectedRout>
              <UserInbox />
            </ProtectedRout>
          }
        />
        <Route
          path="/user/order/:id"
          element={
            <ProtectedRout>
              <OrderDetailsPage />
            </ProtectedRout>
          }
        />

        <Route
          path="/user/track/order/:id"
          element={
            <ProtectedRout>
              <TrackOrderPage />
            </ProtectedRout>
          }
        />
        {/* SHOP ROUTE */}
        <Route path="/shop-create" element={<ShopCreatePage />} />
        <Route path="/shop-login" element={<ShopLoginPage />} />
        <Route
          path="/shop/:id"
          element={
            <SellerProtectedRout>
              <ShopHomePage />
            </SellerProtectedRout>
          }
        />
        <Route
          path="/settings"
          element={
            <SellerProtectedRout>
              <ShopSettingsPage />
            </SellerProtectedRout>
          }
        />
        <Route
          path="/shop/preview/:id"
          element={
            <SellerProtectedRout>
              <ShopPreviewPage />
            </SellerProtectedRout>
          }
        />

        <Route
          path="/dashboard"
          element={
            <SellerProtectedRout>
              <ShopDashboardPage />
            </SellerProtectedRout>
          }
        />
        <Route
          path="/dashboard-create-product"
          element={
            <SellerProtectedRout>
              <ShopCreateProduct />
            </SellerProtectedRout>
          }
        />
        <Route
          path="/dashboard-orders"
          element={
            <SellerProtectedRout>
              <ShopAllOrders />
            </SellerProtectedRout>
          }
        />
        <Route
          path="/dashboard-refunds"
          element={
            <SellerProtectedRout>
              <ShopAllRefunds />
            </SellerProtectedRout>
          }
        />
        <Route
          path="/order/:id"
          element={
            <SellerProtectedRout>
              <ShopOrderDetails />
            </SellerProtectedRout>
          }
        />
        <Route
          path="/dashboard-products"
          element={
            <SellerProtectedRout>
              <ShopAllProducts />
            </SellerProtectedRout>
          }
        />
        <Route
          path="/dashboard-create-event"
          element={
            <SellerProtectedRout>
              <ShopCreateEvents />
            </SellerProtectedRout>
          }
        />
        <Route
          path="/dashboard-events"
          element={
            <SellerProtectedRout>
              <ShopAllEvents />
            </SellerProtectedRout>
          }
        />
        <Route
          path="/dashboard-coupouns"
          element={
            <SellerProtectedRout>
              <ShopAllCoupouns />
            </SellerProtectedRout>
          }
        />
        <Route
          path="/dashboard-withdraw-Money"
          element={
            <SellerProtectedRout>
              <ShopWithDrawMoneyPage />
            </SellerProtectedRout>
          }
        />

        <Route
          path="/dashboard-messages"
          element={
            <SellerProtectedRout>
              <ShopInboxPage />
            </SellerProtectedRout>
          }
        />
        {/* admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardPage />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin-users"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardUsers />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin-sellers"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardSellers />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin-orders"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardOrders />
            </ProtectedAdminRoute>
          }
        />
         <Route
          path="/admin-products"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardProducts />
            </ProtectedAdminRoute>
          }
        />
         <Route
          path="/admin-events"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardEvents />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin-withdraw-request"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardWithdraw />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
};

export default App;
