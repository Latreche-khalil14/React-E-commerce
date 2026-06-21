import api from "./axios";

export const createOrderApi = (data) => api.post("/orders", data);
export const getMyOrdersApi = (params) => api.get("/orders/my", { params });
export const getOrderApi = (id) => api.get(`/orders/${id}`);
export const cancelOrderApi = (id, reason) => api.put(`/orders/${id}/cancel`, { reason });

// Admin
export const getAllOrdersApi = (params) => api.get("/orders", { params });
export const updateOrderStatusApi = (id, status) => api.put(`/orders/${id}/status`, { status });
