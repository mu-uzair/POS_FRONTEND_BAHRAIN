// utils/offlineCustomers.js
import { load, save } from './offlineStore.js';
import { getCustomers } from '../https/index.js'; // your API helper

const OFF_CUSTOMERS = 'offline:customers';

/**
 * Fetch customers from server once and store locally
 */
export async function fetchCustomers() {
  try {
    const res = await getCustomers();
    const customers = res.data?.data || [];

    await save(OFF_CUSTOMERS, customers);
    console.log(`✅ Fetched ${customers.length} customers`);
    return customers;
  } catch (err) {
    console.warn('⚠️ Failed to fetch customers:', err.message || err);
    // fallback to cached data
    const customers = (await load(OFF_CUSTOMERS)) || [];
    return customers;
  }
}

/**
 * Get cached customers from IndexedDB
 */
export async function getCachedCustomers() {
  return (await load(OFF_CUSTOMERS)) || [];
}
