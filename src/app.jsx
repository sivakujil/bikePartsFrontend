import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { RiderAuthProvider } from "./context/RiderAuthContext";
import { ThemeProvider as CustomThemeProvider } from "./context/ThemeContext";
import AdminRoute from "./components/AdminRoute";
import RiderProtectedRoute from "./components/RiderRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Page Components
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CodSuccess from "./pages/CodSuccess";
import CheckoutCancel from "./pages/CheckoutCancel";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import UserProfile from "./pages/UserProfile";
import ChatScreen from "./pages/ChatScreen";
import MyRequests from "./pages/MyRequests";

// Admin Components
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import ProductForm from "./pages/admin/ProductForm";
import AdminOrders from "./pages/admin/AdminOrders";
import Riders from "./pages/admin/Riders";
import Reports from "./pages/admin/Reports";
import Users from "./pages/admin/Users";
import Chat from "./pages/admin/Chat";
import AdminRequests from "./pages/admin/AdminRequests";
import Settings from "./pages/admin/Settings";
import AdminProfile from "./pages/admin/AdminProfile";
import ThemeAssistant from "./components/ThemeAssistant";
import RiderHome from "./pages/RiderHome";

// New Rider Panel Components
import RiderLogin from "./pages/RiderLogin";
import RiderDashboard from "./pages/RiderDashboard";
import RiderOrders from "./pages/RiderOrders";
import RiderOrderDetails from "./pages/RiderOrderDetails";
import PickupPage from "./pages/PickupPage";
import DeliveryPage from "./pages/DeliveryPage";
import ProofUpload from "./pages/ProofUpload";
import RiderProfile from "./pages/RiderProfile";

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* Protected Customer Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout-success/:sessionId" element={<CheckoutSuccess />} />
          <Route path="/cod-success" element={<CodSuccess />} />
          <Route path="/checkout/cancel" element={<CheckoutCancel />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/requests" element={<MyRequests />} />
          <Route path="/chat" element={<ChatScreen />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/add" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="requests" element={<AdminRequests />} />
          <Route path="riders" element={<Riders />} />
          <Route path="reports" element={<Reports />} />
          <Route path="users" element={<Users />} />
          <Route path="chat" element={<Chat />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* Rider Authentication Routes */}
        <Route path="/rider/login" element={<RiderLogin />} />

        {/* Protected Rider Routes */}
        <Route element={<RiderProtectedRoute />}>
          <Route path="/rider/dashboard" element={<RiderDashboard />} />
          <Route path="/rider/orders" element={<RiderOrders />} />
          <Route path="/rider/order/:id" element={<RiderOrderDetails />} />
          <Route path="/rider/pickup/:id" element={<PickupPage />} />
          <Route path="/rider/delivery/:id" element={<DeliveryPage />} />
          <Route path="/rider/proof/:id" element={<ProofUpload />} />
          <Route path="/rider/profile" element={<RiderProfile />} />
        </Route>

        {/* Legacy Rider Route */}
        <Route
          path="/rider"
          element={
            <RiderProtectedRoute>
              <RiderHome />
            </RiderProtectedRoute>
          }
        />
      </Routes>
      {!isAdmin && <Footer />}
      <ThemeAssistant />
    </>
  );
}

const theme = createTheme();

function App() {
  return (
    <CustomThemeProvider>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <RiderAuthProvider>
            <CartProvider>
              <Router future={{ v7_startTransition: true }}>
                <AppContent />
              </Router>
            </CartProvider>
          </RiderAuthProvider>
        </AuthProvider>
      </ThemeProvider>
    </CustomThemeProvider>
  );
}

export default App;

// // src/App.jsx
// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// // Contexts
// import { CartProvider } from "./context/CartContext";
// import { AuthProvider } from "./context/AuthContext";

// // Route Guards
// import AdminRoute from "./components/AdminRoute";
// import RiderRoute from "./components/RiderRoute";
// import ProtectedRoute from "./routes/ProtectedRoute";

// // Components
// import Navbar from "./components/Navbar"; // Make sure Navbar exists
// import Footer from "./components/Footer";

// // Public Pages
// import HomePage from "./pages/HomePage";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Products from "./pages/Products";
// import ProductDetails from "./pages/ProductDetails";

// // Protected Customer Pages
// import Cart from "./pages/Cart";
// import Checkout from "./pages/Checkout";
// import CheckoutSuccess from "./pages/CheckoutSuccess";
// import CheckoutCancel from "./pages/CheckoutCancel";
// import Orders from "./pages/Orders";
// import OrderDetails from "./pages/OrderDetails";
// import ChatScreen from "./pages/ChatScreen";

// // Admin Pages
// import AdminLayout from "./pages/admin/AdminLayout";
// import Dashboard from "./pages/admin/Dashboard";
// import AdminProducts from "./pages/admin/Products";
// import ProductForm from "./pages/admin/ProductForm";
// import AdminOrders from "./pages/admin/AdminOrders";
// import Riders from "./pages/admin/Riders";
// import Reports from "./pages/admin/Reports";
// import Users from "./pages/admin/Users";
// import Chat from "./pages/admin/Chat";
// import Settings from "./pages/admin/Settings";

// // Rider Pages
// import RiderHome from "./pages/RiderHome";

// function App() {
//   return (
//     <AuthProvider>
//       <CartProvider>
//         <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
//           {/* Navbar visible on all pages */}
//           <Navbar />

//           <Routes>
//             {/* Public Routes */}
//             <Route path="/" element={<HomePage />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/products" element={<Products />} />
//             <Route path="/product/:id" element={<ProductDetails />} />

//             {/* Protected Customer Routes */}
//             <Route element={<ProtectedRoute />}>
//               <Route path="/cart" element={<Cart />} />
//               <Route path="/checkout" element={<Checkout />} />
//               <Route path="/checkout-success/:sessionId" element={<CheckoutSuccess />} />
//               <Route path="/checkout/cancel" element={<CheckoutCancel />} />
//               <Route path="/orders" element={<Orders />} />
//               <Route path="/orders/:id" element={<OrderDetails />} />
//               <Route path="/chat" element={<ChatScreen />} />
//             </Route>

//             {/* Protected Admin Routes */}
//             <Route
//               path="/admin"
//               element={
//                 <AdminRoute>
//                   <AdminLayout />
//                 </AdminRoute>
//               }
//             >
//               <Route index element={<Dashboard />} />
//               <Route path="products" element={<AdminProducts />} />
//               <Route path="products/add" element={<ProductForm />} />
//               <Route path="products/edit/:id" element={<ProductForm />} />
//               <Route path="orders" element={<AdminOrders />} />
//               <Route path="riders" element={<Riders />} />
//               <Route path="reports" element={<Reports />} />
//               <Route path="users" element={<Users />} />
//               <Route path="chat" element={<Chat />} />
//               <Route path="settings" element={<Settings />} />
//             </Route>

//             {/* Protected Rider Routes */}
//             <Route
//               path="/rider"
//               element={
//                 <RiderRoute>
//                   <RiderHome />
//                 </RiderRoute>
//               }
//             />
//           </Routes>

//           {/* Footer visible on all pages */}
//           <Footer />
//         </Router>
//       </CartProvider>
//     </AuthProvider>
//   );
// }

// export default App;
