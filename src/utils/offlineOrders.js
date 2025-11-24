// offlineOrders.js
import { load, save, remove } from './offlineStore.js';

// Key under which the array of pending orders is stored in IndexedDB (via localforage)
const OFFLINE_ORDERS_KEY = 'pendingOfflineOrders';

/**
 * Retrieves the list of orders saved locally while offline.
 * Returns an array of orders, or an empty array if none are found.
 */
export async function getOfflineOrders() {
    try {
        // 'load' returns the value from localforage, which could be null or undefined if nothing is saved yet.
        const orders = await load(OFFLINE_ORDERS_KEY);
        
        // Ensure we always return a valid array
        return Array.isArray(orders) ? orders : [];
    } catch (error) {
        console.error("Error loading offline orders:", error);
        return [];
    }
}

/**
 * Saves a new order to the local storage queue.
 * This function will be used on the order screen when the user is offline.
 * @param {object} orderData The order object to save.
 */
export async function saveOfflineOrder(orderData) {
    // Note: If your order data contains complex objects like MongoDB IDs or dates, 
    // ensure they are in a serializable format (like strings) before saving.
    const existingOrders = await getOfflineOrders();
    const newOrders = [...existingOrders, orderData];
    await save(OFFLINE_ORDERS_KEY, newOrders);
    console.log(`Order saved offline. Total pending: ${newOrders.length}`);
}

/**
 * Clears all pending offline orders after a successful sync to the backend.
 */
export async function clearOfflineOrders() {
    await remove(OFFLINE_ORDERS_KEY);
    console.log('All offline orders cleared after sync.');
}

