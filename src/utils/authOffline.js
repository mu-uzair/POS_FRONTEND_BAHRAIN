// ============================================
// FILE 4: utils/offlineAuth.js (UPDATED)
// ============================================
import { load, save, remove, STORAGE_KEYS } from './offlineStore.js';
import CryptoJS from 'crypto-js';

const OFFLINE_EXPIRY_DAYS = 3; // 3-day policy

/**
 * Saves user credentials and session token for future offline logins.
 * Called only on successful ONLINE login.
 */
export async function saveOfflineSession(user, password, token) {
  const pwHash = CryptoJS.SHA256(password).toString();
  
  await save(STORAGE_KEYS.USER_DATA, user);
  await save(STORAGE_KEYS.AUTH_SESSION, {
    email: user.email, 
    pwHash: pwHash,
    token: token,
    lastOnline: Date.now(),
  });
  console.log('✅ Offline credentials saved successfully.');
}

/**
 * Attempts to authenticate the user using local credentials if offline.
 */
export async function tryOfflineLogin(email, password) {
  const savedAuth = await load(STORAGE_KEYS.AUTH_SESSION);
  
  if (!savedAuth) {
    throw new Error('No offline session found. You must log in once while online.');
  }

  // 1. Check Expiry
  const maxAgeMs = OFFLINE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  if (Date.now() - savedAuth.lastOnline > maxAgeMs) {
    throw new Error(`Offline login expired (max ${OFFLINE_EXPIRY_DAYS} days). Please connect to the internet to refresh.`);
  }

  // 2. Validate Password Hash
  const enteredHash = CryptoJS.SHA256(password).toString();
  if (savedAuth.email === email && savedAuth.pwHash === enteredHash) {
    // 3. Success: Restore token and user
    localStorage.setItem('authToken', savedAuth.token); 
    return await load(STORAGE_KEYS.USER_DATA);
  } else {
    throw new Error('Invalid credentials for offline login.');
  }
}

export async function clearOfflineSession() {
  await remove(STORAGE_KEYS.AUTH_SESSION);
  await remove(STORAGE_KEYS.USER_DATA);
  localStorage.removeItem('authToken');
}