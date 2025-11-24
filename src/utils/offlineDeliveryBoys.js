// utils/offlineDelivery.js
import { load, save } from './offlineStore.js';
import { getDeliveryBoys } from '../https/index.js'; // your API helper

const OFF_DELIVERY_BOYS = 'offline:deliveryBoys';

/**
 * Fetch delivery boys from server once and store locally
 */
export async function fetchDeliveryBoys() {
  try {
    const res = await getDeliveryBoys();
    const deliveryBoys = res.data?.data || [];

    await save(OFF_DELIVERY_BOYS, deliveryBoys);
    console.log(`✅ Fetched ${deliveryBoys.length} delivery boys`);
    return deliveryBoys;
  } catch (err) {
    console.warn('⚠️ Failed to fetch delivery boys:', err.message || err);
    // fallback to cached data
    const deliveryBoys = (await load(OFF_DELIVERY_BOYS)) || [];
    return deliveryBoys;
  }
}

/**
 * Get cached delivery boys from IndexedDB
 */
export async function getCachedDeliveryBoys() {
  return (await load(OFF_DELIVERY_BOYS)) || [];
}
