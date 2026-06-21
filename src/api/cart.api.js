import api from "./axios";

export const getCartApi = () => api.get("/cart");
export const addToCartApi = (data) => api.post("/cart", data);
export const updateCartItemApi = (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity });
export const removeFromCartApi = (itemId) => api.delete(`/cart/${itemId}`);
export const clearCartApi = () => api.delete("/cart/clear");
