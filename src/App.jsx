// @ts-nocheck
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Toaster } from "react-hot-toast";

import { ColorModeContext, useMode } from "./theme";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ErrorBoundary from "./components/common/ErrorBoundary";

// Layout Components
import Header1 from "./components/header/Header1";
import Header2 from "./components/header/Header2";
import Header3 from "./components/header/Header3";
import Footer from "./components/footer/footer";
import ScrollToTop from "./components/scroll/ScrollToTop";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProductPage from "./pages/ProductPage";
import { Box } from "@mui/material";

// Protected Route — must render inside AuthProvider
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppLayout = () => {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { fontFamily: "Open Sans, sans-serif" },
            success: { iconTheme: { primary: "#D23F57", secondary: "#fff" } },
          }}
        />
        <Header1 />
        <Header2 />
        <Header3 />
        <Box bgcolor={theme.palette.bg?.main || "#f6f6f6"} minHeight="70vh">
          <Routes>
            <Route path="/"             element={<HomePage />} />
            <Route path="/login"        element={<LoginPage />} />
            <Route path="/register"     element={<RegisterPage />} />
            <Route path="/cart"         element={<CartPage />} />
            <Route path="/products/:id" element={<ProductPage />} />
            <Route path="/checkout"     element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
            <Route path="/orders"       element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
            <Route path="/orders/:id"   element={<PrivateRoute><OrderDetailPage /></PrivateRoute>} />
            <Route path="/profile"      element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/admin"        element={<PrivateRoute><AdminPage /></PrivateRoute>} />
            <Route path="*"             element={<NotFoundPage />} />
          </Routes>
        </Box>
        <Footer />
        <ScrollToTop />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          {/* ErrorBoundary داخل الـ Providers — حتى يتوفر Auth/Cart context عند عرض رسالة الخطأ */}
          <ErrorBoundary>
            <AppLayout />
          </ErrorBoundary>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
