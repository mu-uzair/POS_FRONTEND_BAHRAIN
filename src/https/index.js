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



// Table data (seats, tableNo, and now status) update
export const updateTableData = (tableData) => {
    
    const { _id, ...rest } = tableData; 
    
    // The 'rest' object is sent as the request body, which now includes 'status'
    return api.put(`/api/table/${_id}/data`, rest);
};

export const deleteTable = (tableId) => api.delete(`/api/table/${tableId}`);

// Order Endpoints/Order
export const addOrder = (data) => api.post("/api/order", data);

// Get orders since a specific timestamp
 export const getOrders = (since) => api.get(`/api/order?since=${since}`);

export const getOrdersByStatus = (status) => api.get(`/api/order/status/${status}`);
// in your https.js or API file
export const getOrderById = (orderId) => {
    return api.get(`/api/order/${orderId}`); // matches your backend route
};

export const updateOrderStatus = ({ orderId, orderStatus }) =>
    api.put(`/api/order/${orderId}`, { orderStatus });
export const markSectionItemsReady = (orderId, section) =>
    api.put(`/api/order/${orderId}/section-ready`, { section });
// export const deleteOrder = (orderId) => api.delete(`/api/order/${orderId}`);

// deleteOrder now optionally accepts a password
export const deleteOrder = (orderId, password = null) =>
  api.delete(`/api/order/${orderId}`, {
    data: { password }, // axios allows sending body with DELETE this way
  });

  export const verifyAdminPassword = (password) => 
  api.post("/api/user", { password });

// For full order updates
export const updateOrder = (orderId, orderData) =>
    api.put(`/api/order/by-order-id/${orderId}`, orderData);


// ✅ FIXED ENDPOINT
export const assignDeliveryBoyToOrder = (orderId, deliveryBoyId) =>
  api.patch(`/api/order/${orderId}/assign-delivery`, { deliveryBoyId });





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


// Delivery Boy Endpoints
// NOTE: We use 'patch' for update since it's typically for changing status (is_active) or details.
export const addDeliveryBoy = (data) => api.post("/api/deliveryBoy", data);
export const getDeliveryBoys = () => api.get("/api/deliveryBoy");
// Update a delivery boy's details
export const updateDeliveryBoy = (id, data) => api.patch(`/api/deliveryBoy/${id}`, data);
// Delete a delivery boy by ID
export const deleteDeliveryBoy = (id) => api.delete(`/api/deliveryBoy/${id}`);




// --- Customer Lookup ---
// GET: Searches for a customer record by phone number
export const searchCustomer = (phone) => api.get(`/api/customers/search?phone=${phone}`);
export const addCustomer = (data) => api.post("/api/customers", data);
export const getCustomers = () => api.get('/api/customers');


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





// Inventory Category Endpoints

export const addInventoryCategory = (data) => api.post("/api/inventory-category", data);


export const getAllInventoryCategories = () =>
  api.get("/api/inventory-category").then(res => res.data.data);

export const getInventoryCategoryById = (id) =>
  api.get(`/api/inventory-category/${id}`).then(res => res.data.data);

export const updateInventoryCategory = (categoryData) => {
  const { _id, ...rest } = categoryData;
  return api.put(`/api/inventory-category/${_id}`, rest);
};

export const deleteInventoryCategory = (id) =>
  api.delete(`/api/inventory-category/${id}`);


// Dish Recipe Endpoints
export const addDishRecipe = (data) => api.post("/api/dishRecipe", data);
export const getAllDishRecipes = () => api.get("/api/dishRecipe");
export const getDishRecipeById = (id) => api.get(`/api/dishRecipe/${id}`);
export const getRecipeByDishAndVariation = (dishId, variationName) =>
  api.get(`/api/dishRecipe/by/dish-variation?dishId=${dishId}&variationName=${variationName}`);
export const updateDishRecipe = (id, data) => api.put(`/api/dishRecipe/${id}`, data);
export const deleteDishRecipe = (id) => api.delete(`/api/dishRecipe/${id}`);



// Recipe Transaction Endpoints
export const getAllRecipeTransactions = () => api.get("/api/recipeTransactions");
export const getRecipeTransactionById = (id) => api.get(`/api/recipeTransaction/${id}`);
export const rollbackRecipeStock = (id) => api.post(`/api/recipeTransactions/${id}/rollback`);
export const deleteRecipeTransaction = (id) => api.delete(`/api/recipeTransaction/${id}`);

export const adjustStockByRecipeApi = ({ recipeId, quantity }) => 
    api.post(`/api/dishRecipe/${recipeId}/stock-out`, {
        qtyOfDishes: quantity,
    });
