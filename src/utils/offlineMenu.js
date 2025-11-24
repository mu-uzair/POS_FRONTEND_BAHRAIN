// utils/offlineMenu.js
import { load, save } from './offlineStore.js';
import { getCategories, getDishes } from '../https/index.js'; // use your API helpers

const OFF_CATEGORIES = 'offline:categories';
const OFF_DISHES = 'offline:dishes';

/**
 * Fetch categories and dishes from server once and store locally.
 */
export async function fetchInitialData() {
  try {
    // 1️⃣ Fetch categories
    const catRes = await getCategories();
    const categories = catRes.data?.data || [];

    // 2️⃣ Fetch dishes
    const dishRes = await getDishes();
    const dishes = dishRes.data?.data || [];

    // 3️⃣ Save both locally
    await save(OFF_CATEGORIES, categories);
    await save(OFF_DISHES, dishes);

    console.log(`✅ Fetched ${categories.length} categories and ${dishes.length} dishes`);
    return { categories, dishes };
  } catch (err) {
    console.warn('⚠️ Failed to fetch initial data:', err.message || err);
    // fallback to cached data if available
    const categories = (await load(OFF_CATEGORIES)) || [];
    const dishes = (await load(OFF_DISHES)) || [];
    return { categories, dishes };
  }
}

/**
 * Get locally cached categories and dishes
 */
export async function getCachedInitialData() {
  const categories = (await load(OFF_CATEGORIES)) || [];
  const dishes = (await load(OFF_DISHES)) || [];
  return { categories, dishes };
}
