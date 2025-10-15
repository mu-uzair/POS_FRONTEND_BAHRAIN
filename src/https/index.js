import axios from "axios";
import { data } from "react-router-dom";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});


// API Endpoints

// User Endpoints
export const login = (data) => api.post("/api/user/login", data);
export const register = (data) => api.post("/api/user/register", data);
export const getUserData = () => api.get("/api/user");
export const logout = () => api.post("/api/user/logout");

// Table Endpoints
export const addTable = (data) => api.post("/api/table", data);
export const getTable = () => api.get("/api/table");


// Status & Order update
export const updateTable = ({ tableId, ...tableData }) => api.put(`/api/table/${tableId}/status`, tableData);

// Table data (seats & tableNumber) update
export const updateTableData = (tableData) => {
    const { _id, ...rest } = tableData;
    return api.put(`/api/table/${_id}/data`, rest);
};

export const deleteTable = (tableId) => api.delete(`/api/table/${tableId}`);

// Order Endpoints/Order
export const addOrder = (data) => api.post("/api/order", data);
export const getOrders = () => api.get("/api/order");
export const updateOrderStatus = ({ orderId, orderStatus }) =>
    api.put(`/api/order/${orderId}`, { orderStatus });
export const deleteOrder = (orderId) => api.delete(`/api/order/${orderId}`);
// For full order updates
export const updateOrder = (orderId, orderData) =>
    api.put(`/api/order/by-order-id/${orderId}`, orderData);


// Category Endpoints
export const addCategory = (data) => api.post("/api/category", data);
export const getCategories = () => api.get("/api/category");
export const updateCategory = (categoryData) => {
    const { _id, ...rest } = categoryData;
    return api.put(`/api/category/${_id}`, rest);
};
export const deleteCategory = (categoryId) => api.delete(`/api/category/${categoryId}`);


// Dish Endpoints
export const addDish = (data) => api.post("/api/dish", data);
export const getDishes = () => api.get("/api/dish");
export const getDishesByCategory = (categoryId) => api.get(`/api/dish/category/${categoryId}`);

//Edit Order Enpoints
export const updateDish = (dishData) => {
    const { _id, ...rest } = dishData;
    return api.put(`/api/dish/${_id}`, rest);
};
export const deleteDish = (dishId) => api.delete(`/api/dish/${dishId}`);



// All Endpoints for Inventory System 

// Vendor Endpoints


export const getAllVendors = () => api.get("/api/vendor");
export const addVendor = (data) => api.post("/api/vendor", data);
export const updateVendor = (vendorData) => {
    const { _id, ...rest } = vendorData;
    return api.put(`/api/vendor/${_id}`, rest);
};
export const deleteVendor = (_id) => api.delete(`/api/vendor/${_id}`);


// Product Endpoints
export const addProduct = (data) => api.post("/api/product", data);



export const deleteProduct = (productId) => api.delete(`/api/product/${productId}`);

export const updateProduct = (productData) => {
    const { _id, ...rest } = productData;
    return api.put(`/api/product/${_id}`, rest);
};

export const adjustStock = (productId, data) => api.patch(`/api/product/${productId}/stock`, data);

// Add the getTransactions function
export const getAllProducts = () => api.get("/api/product").then(res => res.data.data);




// Fetch all transactions
export const getTransactions = async () => {
    const response = await api.get("/api/transactions");
    return response.data;
};
// Delete a transaction
export const deleteTransaction = async (transactionId) => {
    const response = await api.delete(`/api/transactions/${transactionId}`);
    return response.data;
};



// New function to fetch metrics
export const getMetrics = async () => {
    return api.get('/api/metrics').then(res => res.data);
};



