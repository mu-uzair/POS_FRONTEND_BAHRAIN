// getOrdersOffline.js
import { load, save } from './offlineStore.js';
import { getOrders } from '../https/index.js';

const OFF_ORDERS = 'offline:orders';
const OFF_METADATA = 'offline:meta';
const SIX_HRS_MS = 6 * 60 * 60 * 1000; // 6 hours

let refreshInterval;

export async function fetchAndCacheRecentOrders() {
  try {
    const since = Date.now() - SIX_HRS_MS;
    const res = await getOrders(since);
    const newOrders = res.data?.data || [];
    const oldOrders = (await load(OFF_ORDERS)) || [];

    const combined = [...oldOrders, ...newOrders];
    const uniqueMap = new Map();
    for (const order of combined) {
      uniqueMap.set(order._id || order.orderId, order);
    }

    const cleanedOrders = Array.from(uniqueMap.values()).filter(o => {
      const created = new Date(o.createdAt).getTime();
      return created >= since;
    });

    await save(OFF_ORDERS, cleanedOrders);
    await save(OFF_METADATA, { lastOrdersSync: Date.now() });

    console.log(`✅ Cached recent orders: ${cleanedOrders.length}`);
    return cleanedOrders;
  } catch (err) {
    console.warn('⚠️ Failed to fetch recent orders:', err.message || err);
    return (await load(OFF_ORDERS)) || [];
  }
}

export async function getCachedOrders() {
  const orders = (await load(OFF_ORDERS)) || [];
  const since = Date.now() - SIX_HRS_MS;
  return orders.filter(o => new Date(o.createdAt).getTime() >= since);
}

// Start background refresh safely
export function startAutoRefresh(intervalMs = 60 * 1000) {
  if (refreshInterval) return;
  refreshInterval = setInterval(() => {
    if (navigator.onLine) fetchAndCacheRecentOrders();
  }, intervalMs);
}

export function stopAutoRefresh() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}
