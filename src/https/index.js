// import axios from "axios";
// import { data } from "react-router-dom";


// const api = axios.create({
//     baseURL: import.meta.env.VITE_BACKEND_URL,
//     withCredentials: true,
//     headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//     },
// });


// // API Endpoints

// // User Endpoints
// export const login = (data) => api.post("/api/user/login", data);
// export const register = (data) => api.post("/api/user/register", data);
// export const getUserData = () => api.get("/api/user");
// export const logout = () => api.post("/api/user/logout");

// // Table Endpoints
// export const addTable = (data) => api.post("/api/table", data);
// export const getTable = () => api.get("/api/table");


// // Status & Order update
// export const updateTable = ({ tableId, ...tableData }) => api.put(`/api/table/${tableId}/status`, tableData);



// // Table data (seats, tableNo, and now status) update
// export const updateTableData = (tableData) => {
    
//     const { _id, ...rest } = tableData; 
    
//     // The 'rest' object is sent as the request body, which now includes 'status'
//     return api.put(`/api/table/${_id}/data`, rest);
// };

// export const deleteTable = (tableId) => api.delete(`/api/table/${tableId}`);

// // Order Endpoints/Order

// export const getNextOrderNumber = () => api.get("/api/order/next-order-number");

// export const addOrder = (data) => api.post("/api/order", data);

// // Get orders since a specific timestamp
//  export const getOrders = (since) => api.get(`/api/order?since=${since}`);

// export const getOrdersByStatus = (status) => api.get(`/api/order/status/${status}`);
// // in your https.js or API file
// export const getOrderById = (orderId) => {
//     return api.get(`/api/order/${orderId}`); // matches your backend route
// };

// export const updateOrderStatus = ({ orderId, orderStatus }) =>
//     api.put(`/api/order/${orderId}`, { orderStatus });
// export const markSectionItemsReady = (orderId, section) =>
//     api.put(`/api/order/${orderId}/section-ready`, { section });
// // export const deleteOrder = (orderId) => api.delete(`/api/order/${orderId}`);

// // deleteOrder now optionally accepts a password
// export const deleteOrder = (orderId, password = null) =>
//   api.delete(`/api/order/${orderId}`, {
//     data: { password }, // axios allows sending body with DELETE this way
//   });

//   export const verifyAdminPassword = (password) => 
//   api.post("/api/user", { password });

// // For full order updates
// export const updateOrder = (orderId, orderData) =>
//     api.put(`/api/order/by-order-id/${orderId}`, orderData);



// export const completeAllOrders = async (filters) => {
//   const { data } = await api.patch('/api/order/complete-multiple', filters);
//   return data; // { success, modifiedCount, message }
// };



// // ✅ FIXED ENDPOINT
// export const assignDeliveryBoyToOrder = (orderId, deliveryBoyId) =>
//   api.patch(`/api/order/${orderId}/assign-delivery`, { deliveryBoyId });





// // Category Endpoints
// export const addCategory = (data) => api.post("/api/category", data);
// export const getCategories = () => api.get("/api/category");
// export const updateCategory = (categoryData) => {
//     const { _id, ...rest } = categoryData;
//     return api.put(`/api/category/${_id}`, rest);
// };
// export const deleteCategory = (categoryId) => api.delete(`/api/category/${categoryId}`);


// // Dish Endpoints
// export const addDish = (data) => api.post("/api/dish", data);
// export const getDishes = () => api.get("/api/dish");
// export const getDishesByCategory = (categoryId) => api.get(`/api/dish/category/${categoryId}`);

// //Edit Order Enpoints
// export const updateDish = (dishData) => {
//     const { _id, ...rest } = dishData;
//     return api.put(`/api/dish/${_id}`, rest);
// };
// export const deleteDish = (dishId) => api.delete(`/api/dish/${dishId}`);


// // Delivery Boy Endpoints
// // NOTE: We use 'patch' for update since it's typically for changing status (is_active) or details.
// export const addDeliveryBoy = (data) => api.post("/api/deliveryBoy", data);
// export const getDeliveryBoys = () => api.get("/api/deliveryBoy");
// // Update a delivery boy's details
// export const updateDeliveryBoy = (id, data) => api.patch(`/api/deliveryBoy/${id}`, data);
// // Delete a delivery boy by ID
// export const deleteDeliveryBoy = (id) => api.delete(`/api/deliveryBoy/${id}`);




// // --- Customer Lookup ---
// // GET: Searches for a customer record by phone number
// export const searchCustomer = (phone) => api.get(`/api/customers/search?phone=${phone}`);
// export const addCustomer = (data) => api.post("/api/customers", data);
// export const getCustomers = () => api.get('/api/customers');


// // All Endpoints for Inventory System 

// // Vendor Endpoints


// export const getAllVendors = () => api.get("/api/vendor");
// export const addVendor = (data) => api.post("/api/vendor", data);
// export const updateVendor = (vendorData) => {
//     const { _id, ...rest } = vendorData;
//     return api.put(`/api/vendor/${_id}`, rest);
// };
// export const deleteVendor = (_id) => api.delete(`/api/vendor/${_id}`);


// // Product Endpoints
// export const addProduct = (data) => api.post("/api/product", data);



// export const deleteProduct = (productId) => api.delete(`/api/product/${productId}`);

// export const updateProduct = (productData) => {
//     const { _id, ...rest } = productData;
//     return api.put(`/api/product/${_id}`, rest);
// };

// export const adjustStock = (productId, data) => api.patch(`/api/product/${productId}/stock`, data);

// // Add the getTransactions function
// export const getAllProducts = () => api.get("/api/product").then(res => res.data.data);




// // Fetch all transactions
// export const getTransactions = async () => {
//     const response = await api.get("/api/transactions");
//     return response.data;
// };
// // Delete a transaction
// export const deleteTransaction = async (transactionId) => {
//     const response = await api.delete(`/api/transactions/${transactionId}`);
//     return response.data;
// };



// // New function to fetch metrics
// export const getMetrics = async () => {
//     return api.get('/api/metrics').then(res => res.data);
// };





// // Inventory Category Endpoints

// export const addInventoryCategory = (data) => api.post("/api/inventory-category", data);


// export const getAllInventoryCategories = () =>
//   api.get("/api/inventory-category").then(res => res.data.data);

// export const getInventoryCategoryById = (id) =>
//   api.get(`/api/inventory-category/${id}`).then(res => res.data.data);

// export const updateInventoryCategory = (categoryData) => {
//   const { _id, ...rest } = categoryData;
//   return api.put(`/api/inventory-category/${_id}`, rest);
// };

// export const deleteInventoryCategory = (id) =>
//   api.delete(`/api/inventory-category/${id}`);


// // Dish Recipe Endpoints
// export const addDishRecipe = (data) => api.post("/api/dishRecipe", data);
// export const getAllDishRecipes = () => api.get("/api/dishRecipe");
// export const getDishRecipeById = (id) => api.get(`/api/dishRecipe/${id}`);
// export const getRecipeByDishAndVariation = (dishId, variationName) =>
//   api.get(`/api/dishRecipe/by/dish-variation?dishId=${dishId}&variationName=${variationName}`);
// export const updateDishRecipe = (id, data) => api.put(`/api/dishRecipe/${id}`, data);
// export const deleteDishRecipe = (id) => api.delete(`/api/dishRecipe/${id}`);



// // Recipe Transaction Endpoints
// export const getAllRecipeTransactions = () => api.get("/api/recipeTransactions");
// export const getRecipeTransactionById = (id) => api.get(`/api/recipeTransaction/${id}`);
// export const rollbackRecipeStock = (id) => api.post(`/api/recipeTransactions/${id}/rollback`);
// export const deleteRecipeTransaction = (id) => api.delete(`/api/recipeTransaction/${id}`);

// export const adjustStockByRecipeApi = ({ recipeId, quantity }) => 
//     api.post(`/api/dishRecipe/${recipeId}/stock-out`, {
//         qtyOfDishes: quantity,
//     });



// // ============================================
// // 📊 ANALYTICS APIs
// // ============================================

// /**
//  * Get dashboard analytics (revenue, orders, graphs)
//  * @param {number} dateRange - Number of days (7, 30, 90)
//  */
// export const getDashboardAnalytics = async (dateRange = 30) => {
//   try {
//     const response = await api.get('api/analytics/dashboard', {
//       params: { dateRange }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching dashboard analytics:', error);
//     throw error;
//   }
// };

// /**
//  * Get today's analytics (for home page)
//  */
// export const getTodayAnalytics = async () => {
//   try {
//     const response = await api.get('api/analytics/today');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching today analytics:', error);
//     throw error;
//   }
// };



// /**
//  * Get popular dishes
//  * @param {number} limit - Number of dishes to return
//  * @param {number} dateRange - Number of days to analyze (optional if using startDate/endDate)
//  * @param {string} startDate - Optional start date (ISO string)
//  * @param {string} endDate - Optional end date (ISO string)
//  */
// export const getPopularDishes = async (limit = 10, dateRange = 30, startDate = null, endDate = null) => {
//   try {
//     const params = {
//       limit,
//       ...(startDate && endDate ? { startDate, endDate } : { dateRange })
//     };
    
//     const response = await api.get('api/analytics/popular-dishes', {
//       params
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching popular dishes:', error);
//     throw error;
//   }
// };

// // ============================================
// // 📦 OPTIMIZED ORDER APIs
// // ============================================

// /**
//  * Get paginated orders with filters
//  * @param {Object} params - Query parameters
//  * @param {number} params.page - Page number
//  * @param {number} params.limit - Items per page
//  * @param {string} params.status - Order status filter
//  * @param {string} params.dateFilter - Date filter (Today, Yesterday, Custom, All)
//  * @param {string} params.startDate - Start date for custom filter
//  * @param {string} params.endDate - End date for custom filter
//  * @param {string} params.orderType - Order type filter
//  * @param {string} params.paymentMethod - Payment method filter
//  * @param {string} params.sortBy - Sort field
//  * @param {string} params.sortOrder - Sort order (asc, desc)
//  */
// export const getPaginatedOrders = async (params) => {
//   try {
//     const response = await api.get('api/optimized-orders/list', { params });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching paginated orders:', error);
//     throw error;
//   }
// };

// /**
//  * Get order statistics (counts by status)
//  * @param {Object} filters - Filter parameters
//  */
// export const getOrderStats = async (filters = {}) => {
//   try {
//     const response = await api.get('api/optimized-orders/stats', {
//       params: filters
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching order stats:', error);
//     throw error;
//   }
// };

// /**
//  * Get payment totals with filters
//  * @param {Object} filters - Filter parameters
//  */
// export const getPaymentTotals = async (filters = {}) => {
//   try {
//     const response = await api.get('api/optimized-orders/payments', {
//       params: filters
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching payment totals:', error);
//     throw error;
//   }
// };     


// utils/https/index.js - FIXED with proper offline blocking
import axios from "axios";
import { withSmartRequest, OfflineError, NetworkError, TimeoutError } from "../utils/smartRequest";
import { getOfflineState } from "../utils/offlineState"; 
import { enqueueSnackbar } from 'notistack';


// AXIOS INSTANCE CONFIGURATION


const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    timeout: 30000,
});

// ============================================
// REQUEST INTERCEPTOR - CRITICAL FAIL-FAST
// ============================================

api.interceptors.request.use(
    (config) => {
        // 🛑 CRITICAL: Block ALL requests if system is offline
        const offlineStateData = getOfflineState();
        const { isOffline } = offlineStateData;
        
        const url = config.url || 'unknown';
        const method = config.method?.toUpperCase() || 'REQUEST';
        
        // 🔍 DETAILED LOGGING
        // console.log(`🔍 [AXIOS INTERCEPTOR] ========== REQUEST INTERCEPTED ==========`);
        // console.log(`🔍 [AXIOS] ${method} ${url}`);
        // console.log(`🔍 [AXIOS] Offline State:`, offlineStateData);
        // console.log(`🔍 [AXIOS] Navigator Online:`, navigator.onLine);
        
        if (isOffline) {
            console.warn(`🚫 [AXIOS] ❌❌❌ BLOCKED BY INTERCEPTOR ❌❌❌`);
            console.warn(`🚫 [AXIOS] ${method} ${url}`);
            console.warn(`🚫 [AXIOS] Reason: isOffline = ${isOffline}`);
            console.log(`🔍 [AXIOS] ====================================================`);
            
            // Return rejected promise with OfflineError
            return Promise.reject(new OfflineError("System is offline. API call blocked."));
        }

        // console.log(`✅ [AXIOS] NOT BLOCKED - Request proceeding`);
        // console.log(`🔍 [AXIOS] ====================================================`);
        
        // Log request in development
        if (import.meta.env.MODE === 'development') {
            // console.log(`🌐 [API] ${method} ${url}`);
        }
        
        return config;
    },
    (error) => {
        console.error('❌ [API REQUEST] Error:', error);
        return Promise.reject(error);
    }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================

api.interceptors.response.use(
    (response) => {
        if (import.meta.env.MODE === 'development') {
            // console.log(`✅ [API] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
        }
        return response;
    },
    (error) => {
        // Skip if already an OfflineError (from request interceptor)
        if (error instanceof OfflineError || error.isOfflineError || error.isOffline) {
            return Promise.reject(error);
        }

        // Handle network errors
        if (!error.response) {
            if (error.code === 'ECONNABORTED') {
                console.error('⏱️ [API] Timeout:', error.config?.url);
                return Promise.reject(new TimeoutError('Request timeout'));
            } else if (error.message === 'Network Error') {
                console.error('🔌 [API] Network error:', error.config?.url);
                return Promise.reject(new NetworkError('Network connection failed'));
            }
        } else {
            // Handle HTTP errors
            const { status, data } = error.response;
            console.error(`❌ [API] Error ${status}:`, error.config?.url, data);

            if (status === 401) {
                console.warn('🔐 Unauthorized - Session may have expired');
            } else if (status === 403) {
                enqueueSnackbar('Access denied', { variant: 'error' });
            } else if (status === 404) {
                enqueueSnackbar('Resource not found', { variant: 'warning' });
            } else if (status >= 500) {
                enqueueSnackbar('Server error. Please try again.', { variant: 'error' });
            }
        }
        
        return Promise.reject(error);
    }
);

// ============================================
// USER ENDPOINTS
// ============================================

export const login = withSmartRequest(
    (data) => api.post("/api/user/login", data),
    { operationName: 'Login', enableRetry: false }
);

export const register = withSmartRequest(
    (data) => api.post("/api/user/register", data),
    { operationName: 'Register', enableRetry: false }
);

export const getUserData = withSmartRequest(
    () => api.get("/api/user"),
    { operationName: 'GetUserData', silent: true }
);

export const logout = withSmartRequest(
    () => api.post("/api/user/logout"),
    { operationName: 'Logout', enableRetry: false }
);

export const verifyAdminPassword = withSmartRequest(
    (password) => api.post("/api/user", { password }),
    { operationName: 'VerifyAdminPassword', enableRetry: false }
);

// ============================================
// TABLE ENDPOINTS
// ============================================

export const addTable = withSmartRequest(
    (data) => api.post("/api/table", data),
    { operationName: 'AddTable' }
);

export const getTable = withSmartRequest(
    () => api.get("/api/table"),
    { operationName: 'GetTable', silent: true }
);

export const updateTable = withSmartRequest(
    ({ tableId, ...tableData }) => api.put(`/api/table/${tableId}/status`, tableData),
    { operationName: 'UpdateTableStatus' }
);

export const updateTableData = withSmartRequest(
    (tableData) => {
        const { _id, ...rest } = tableData;
        return api.put(`/api/table/${_id}/data`, rest);
    },
    { operationName: 'UpdateTableData' }
);

export const deleteTable = withSmartRequest(
    (tableId) => api.delete(`/api/table/${tableId}`),
    { operationName: 'DeleteTable' }
);

// ============================================
// ORDER ENDPOINTS
// ============================================

export const getNextOrderNumber = withSmartRequest(
    () => api.get("/api/order/next-order-number"),
    { operationName: 'GetNextOrderNumber' }
);

export const addOrder = withSmartRequest(
    (data) => api.post("/api/order", data),
    { operationName: 'AddOrder', enableRetry: false }
);

export const getOrders = withSmartRequest(
    (since) => api.get(`/api/order?since=${since}`),
    { operationName: 'GetOrders', silent: true }
);

export const getOrdersByStatus = withSmartRequest(
    (status) => api.get(`/api/order/status/${status}`),
    { operationName: 'GetOrdersByStatus' }
);

export const getOrderById = withSmartRequest(
    (orderId) => api.get(`/api/order/${orderId}`),
    { operationName: 'GetOrderById' }
);

export const updateOrderStatus = withSmartRequest(
    ({ orderId, orderStatus }) => api.put(`/api/order/${orderId}`, { orderStatus }),
    { operationName: 'UpdateOrderStatus' }
);

export const markSectionItemsReady = withSmartRequest(
    (orderId, section) => api.put(`/api/order/${orderId}/section-ready`, { section }),
    { operationName: 'MarkSectionReady' }
);

export const deleteOrder = withSmartRequest(
    (orderId, password = null) => api.delete(`/api/order/${orderId}`, { data: { password } }),
    { operationName: 'DeleteOrder', enableRetry: false }
);

export const updateOrder = withSmartRequest(
    (orderId, orderData) => api.put(`/api/order/by-order-id/${orderId}`, orderData),
    { operationName: 'UpdateOrder' }
);

export const completeAllOrders = withSmartRequest(
    async (filters) => {
        const { data } = await api.patch('/api/order/complete-multiple', filters);
        return data;
    },
    { operationName: 'CompleteAllOrders' }
);

export const assignDeliveryBoyToOrder = withSmartRequest(
    (orderId, deliveryBoyId) => api.patch(`/api/order/${orderId}/assign-delivery`, { deliveryBoyId }),
    { operationName: 'AssignDeliveryBoy' }
);

// ============================================
// CATEGORY ENDPOINTS
// ============================================

export const addCategory = withSmartRequest(
    (data) => api.post("/api/category", data),
    { operationName: 'AddCategory' }
);

export const getCategories = withSmartRequest(
    () => api.get("/api/category"),
    { operationName: 'GetCategories', silent: true }
);

export const updateCategory = withSmartRequest(
    (categoryData) => {
        const { _id, ...rest } = categoryData;
        return api.put(`/api/category/${_id}`, rest);
    },
    { operationName: 'UpdateCategory' }
);

export const deleteCategory = withSmartRequest(
    (categoryId) => api.delete(`/api/category/${categoryId}`),
    { operationName: 'DeleteCategory' }
);

// ============================================
// DISH ENDPOINTS
// ============================================

export const addDish = withSmartRequest(
    (data) => api.post("/api/dish", data),
    { operationName: 'AddDish' }
);

export const getDishes = withSmartRequest(
    () => api.get("/api/dish"),
    { operationName: 'GetDishes', silent: true }
);

export const getDishesByCategory = withSmartRequest(
    (categoryId) => api.get(`/api/dish/category/${categoryId}`),
    { operationName: 'GetDishesByCategory' }
);

export const updateDish = withSmartRequest(
    (dishData) => {
        const { _id, ...rest } = dishData;
        return api.put(`/api/dish/${_id}`, rest);
    },
    { operationName: 'UpdateDish' }
);

export const deleteDish = withSmartRequest(
    (dishId) => api.delete(`/api/dish/${dishId}`),
    { operationName: 'DeleteDish' }
);

// ============================================
// DELIVERY BOY ENDPOINTS
// ============================================

export const addDeliveryBoy = withSmartRequest(
    (data) => api.post("/api/deliveryBoy", data),
    { operationName: 'AddDeliveryBoy' }
);

export const getDeliveryBoys = withSmartRequest(
    () => api.get("/api/deliveryBoy"),
    { operationName: 'GetDeliveryBoys', silent: true }
);

export const updateDeliveryBoy = withSmartRequest(
    (id, data) => api.patch(`/api/deliveryBoy/${id}`, data),
    { operationName: 'UpdateDeliveryBoy' }
);

export const deleteDeliveryBoy = withSmartRequest(
    (id) => api.delete(`/api/deliveryBoy/${id}`),
    { operationName: 'DeleteDeliveryBoy' }
);

// ============================================
// CUSTOMER ENDPOINTS
// ============================================

export const searchCustomer = withSmartRequest(
    (phone) => api.get(`/api/customers/search?phone=${phone}`),
    { operationName: 'SearchCustomer' }
);

export const addCustomer = withSmartRequest(
    (data) => api.post("/api/customers", data),
    { operationName: 'AddCustomer' }
);

export const getCustomers = withSmartRequest(
    () => api.get('/api/customers'),
    { operationName: 'GetCustomers', silent: true }
);

// ============================================
// VENDOR ENDPOINTS
// ============================================

export const getAllVendors = withSmartRequest(
    () => api.get("/api/vendor"),
    { operationName: 'GetAllVendors' }
);

export const addVendor = withSmartRequest(
    (data) => api.post("/api/vendor", data),
    { operationName: 'AddVendor' }
);

export const updateVendor = withSmartRequest(
    (vendorData) => {
        const { _id, ...rest } = vendorData;
        return api.put(`/api/vendor/${_id}`, rest);
    },
    { operationName: 'UpdateVendor' }
);

export const deleteVendor = withSmartRequest(
    (_id) => api.delete(`/api/vendor/${_id}`),
    { operationName: 'DeleteVendor' }
);

// ============================================
// PRODUCT ENDPOINTS
// ============================================

export const addProduct = withSmartRequest(
    (data) => api.post("/api/product", data),
    { operationName: 'AddProduct' }
);

export const deleteProduct = withSmartRequest(
    (productId) => api.delete(`/api/product/${productId}`),
    { operationName: 'DeleteProduct' }
);

export const updateProduct = withSmartRequest(
    (productData) => {
        const { _id, ...rest } = productData;
        return api.put(`/api/product/${_id}`, rest);
    },
    { operationName: 'UpdateProduct' }
);

export const adjustStock = withSmartRequest(
    (productId, data) => api.patch(`/api/product/${productId}/stock`, data),
    { operationName: 'AdjustStock' }
);

export const getAllProducts = withSmartRequest(
    () => api.get("/api/product").then(res => res.data.data),
    { operationName: 'GetAllProducts' }
);

// ============================================
// TRANSACTION ENDPOINTS
// ============================================

export const getTransactions = withSmartRequest(
    async () => {
        const response = await api.get("/api/transactions");
        return response.data;
    },
    { operationName: 'GetTransactions' }
);

export const deleteTransaction = withSmartRequest(
    async (transactionId) => {
        const response = await api.delete(`/api/transactions/${transactionId}`);
        return response.data;
    },
    { operationName: 'DeleteTransaction' }
);

// ============================================
// METRICS ENDPOINTS
// ============================================

export const getMetrics = withSmartRequest(
    async () => api.get('/api/metrics').then(res => res.data),
    { operationName: 'GetMetrics' }
);

// ============================================
// INVENTORY CATEGORY ENDPOINTS
// ============================================

export const addInventoryCategory = withSmartRequest(
    (data) => api.post("/api/inventory-category", data),
    { operationName: 'AddInventoryCategory' }
);

export const getAllInventoryCategories = withSmartRequest(
    () => api.get("/api/inventory-category").then(res => res.data.data),
    { operationName: 'GetAllInventoryCategories' }
);

export const getInventoryCategoryById = withSmartRequest(
    (id) => api.get(`/api/inventory-category/${id}`).then(res => res.data.data),
    { operationName: 'GetInventoryCategoryById' }
);

export const updateInventoryCategory = withSmartRequest(
    (categoryData) => {
        const { _id, ...rest } = categoryData;
        return api.put(`/api/inventory-category/${_id}`, rest);
    },
    { operationName: 'UpdateInventoryCategory' }
);

export const deleteInventoryCategory = withSmartRequest(
    (id) => api.delete(`/api/inventory-category/${id}`),
    { operationName: 'DeleteInventoryCategory' }
);

// ============================================
// DISH RECIPE ENDPOINTS
// ============================================

export const addDishRecipe = withSmartRequest(
    (data) => api.post("/api/dishRecipe", data),
    { operationName: 'AddDishRecipe' }
);

export const getAllDishRecipes = withSmartRequest(
    () => api.get("/api/dishRecipe"),
    { operationName: 'GetAllDishRecipes' }
);

export const getDishRecipeById = withSmartRequest(
    (id) => api.get(`/api/dishRecipe/${id}`),
    { operationName: 'GetDishRecipeById' }
);

export const getRecipeByDishAndVariation = withSmartRequest(
    (dishId, variationName) => 
        api.get(`/api/dishRecipe/by/dish-variation?dishId=${dishId}&variationName=${variationName}`),
    { operationName: 'GetRecipeByDishAndVariation' }
);

export const updateDishRecipe = withSmartRequest(
    (id, data) => api.put(`/api/dishRecipe/${id}`, data),
    { operationName: 'UpdateDishRecipe' }
);

export const deleteDishRecipe = withSmartRequest(
    (id) => api.delete(`/api/dishRecipe/${id}`),
    { operationName: 'DeleteDishRecipe' }
);

// ============================================
// RECIPE TRANSACTION ENDPOINTS
// ============================================

export const getAllRecipeTransactions = withSmartRequest(
    () => api.get("/api/recipeTransactions"),
    { operationName: 'GetAllRecipeTransactions' }
);

export const getRecipeTransactionById = withSmartRequest(
    (id) => api.get(`/api/recipeTransaction/${id}`),
    { operationName: 'GetRecipeTransactionById' }
);

export const rollbackRecipeStock = withSmartRequest(
    (id) => api.post(`/api/recipeTransactions/${id}/rollback`),
    { operationName: 'RollbackRecipeStock' }
);

export const deleteRecipeTransaction = withSmartRequest(
    (id) => api.delete(`/api/recipeTransaction/${id}`),
    { operationName: 'DeleteRecipeTransaction' }
);

export const adjustStockByRecipeApi = withSmartRequest(
    ({ recipeId, quantity }) => 
        api.post(`/api/dishRecipe/${recipeId}/stock-out`, { qtyOfDishes: quantity }),
    { operationName: 'AdjustStockByRecipe' }
);

// ============================================
// ANALYTICS ENDPOINTS
// ============================================

// export const getDashboardAnalytics = withSmartRequest(
//     async (dateRange = 30) => {
//         const response = await api.get('api/analytics/dashboard', {
//             params: { dateRange }
//         });
//         return response.data;
//     },
//     { operationName: 'GetDashboardAnalytics' }
// );

export const getDashboardAnalytics = withSmartRequest(
  async (filters = {}) => {
    const { dateRange = 30, orderType, startDate, endDate } = filters;
    
    // Build params object
    const params = { dateRange };
    
    // Add orderType if provided and not "All"
    if (orderType && orderType !== 'All') {
      params.orderType = orderType;
    }
    
    // Add custom date range if provided
    if (startDate && endDate) {
      params.startDate = startDate;
      params.endDate = endDate;
      delete params.dateRange; // Don't send dateRange when using custom dates
    }
    
    // console.log('📡 API Request Params:', params);
    
    const response = await api.get('api/analytics/dashboard', { params });
    
    // console.log('✅ API Response:', response.data);
    return response.data;
  },
  { operationName: 'GetDashboardAnalytics' }
);

export const getTodayAnalytics = withSmartRequest(
    async () => {
        const response = await api.get('api/analytics/today');
        return response.data;
    },
    { operationName: 'GetTodayAnalytics' }
);

export const getPopularDishes = withSmartRequest(
    async (limit = 10, dateRange = 30, startDate = null, endDate = null) => {
        const params = {
            limit,
            ...(startDate && endDate ? { startDate, endDate } : { dateRange })
        };
        const response = await api.get('api/analytics/popular-dishes', { params });
        return response.data;
    },
    { operationName: 'GetPopularDishes' }
);

// ============================================
// OPTIMIZED ORDER ENDPOINTS
// ============================================

export const getPaginatedOrders = withSmartRequest(
    async (params) => {
        const response = await api.get('api/optimized-orders/list', { params });
        return response.data;
    },
    { operationName: 'GetPaginatedOrders' }
);

export const getOrderStats = withSmartRequest(
    async (filters = {}) => {
        const response = await api.get('api/optimized-orders/stats', { params: filters });
        return response.data;
    },
    { operationName: 'GetOrderStats' }
);

export const getPaymentTotals = withSmartRequest(
    async (filters = {}) => {
        const response = await api.get('api/optimized-orders/payments', { params: filters });
        return response.data;
    },
    { operationName: 'GetPaymentTotals' }
);

// ============================================
// UTILITY EXPORTS
// ============================================

export { 
    OfflineError, 
    NetworkError, 
    TimeoutError
};

export default api;