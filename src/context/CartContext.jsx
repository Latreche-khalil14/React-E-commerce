import { createContext, useContext, useEffect, useReducer } from "react";
import { getCartApi, addToCartApi, updateCartItemApi, removeFromCartApi, clearCartApi } from "../api/cart.api";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext(null);

const initialState = {
  cart: null,
  loading: false,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_CART":
      return { ...state, cart: action.payload, loading: false };
    case "CLEAR_CART":
      return { ...state, cart: null };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Fetch cart when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      dispatch({ type: "CLEAR_CART" });
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    // Prevent duplicate simultaneous fetches
    if (state.loading) return;
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const res = await getCartApi();
      dispatch({ type: "SET_CART", payload: res.data.cart });
    } catch (err) {
      // Silently fail — user may not be authenticated yet
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const addToCart = async (productId, quantity = 1, size = "", color = "") => {
    try {
      const res = await addToCartApi({ productId, quantity, size, color });
      dispatch({ type: "SET_CART", payload: res.data.cart });
      toast.success("Added to cart!");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
      return false;
    }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      const res = await updateCartItemApi(itemId, quantity);
      dispatch({ type: "SET_CART", payload: res.data.cart });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update cart");
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await removeFromCartApi(itemId);
      dispatch({ type: "SET_CART", payload: res.data.cart });
      toast.success("Item removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const clearCart = async () => {
    try {
      await clearCartApi();
      dispatch({ type: "CLEAR_CART" });
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  const cartCount = state.cart?.totalItems || 0;
  const cartTotal = state.cart?.subtotal || 0;

  return (
    <CartContext.Provider value={{ ...state, cartCount, cartTotal, fetchCart, addToCart, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
