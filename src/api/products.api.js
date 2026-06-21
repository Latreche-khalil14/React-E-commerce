import api from "./axios";

export const getProductsApi = (params) => api.get("/products", { params });
export const getProductApi = (id) => api.get(`/products/${id}`);
export const getFeaturedProductsApi = () => api.get("/products/featured");
export const createProductApi = (data) => api.post("/products", data);
export const updateProductApi = (id, data) => api.put(`/products/${id}`, data);
export const deleteProductApi = (id) => api.delete(`/products/${id}`);
export const addReviewApi = (id, data) => api.post(`/products/${id}/reviews`, data);
