import { load, save, remove } from './offlineStore.js';
import CryptoJS from 'crypto-js';

const OFFLINE_AUTH_KEY = 'offlineAuth';
const OFFLINE_USER_KEY = 'offlineUser';
const OFFLINE_EXPIRY_DAYS = 3; // Enforcing the 3-day policy

/**
 * Saves user credentials and session token for future offline logins.
 * Called only on successful ONLINE login.
 */
export async function saveOfflineSession(user, password, token) {
  // Hash the password for local comparison
  const pwHash = CryptoJS.SHA256(password).toString();
  
  // Store the user profile (minus password) and the current token
  await save(OFFLINE_USER_KEY, user);
  await save(OFFLINE_AUTH_KEY, {
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
  const savedAuth = await load(OFFLINE_AUTH_KEY);
  
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
    // NOTE: You are currently using cookies via the backend, but we store the token 
    // here anyway as a fallback for the POS client. We will primarily restore 
    // the user profile for the application state.
    localStorage.setItem('authToken', savedAuth.token); 
    return await load(OFFLINE_USER_KEY);
  } else {
    throw new Error('Invalid credentials for offline login.');
  }
}

export async function clearOfflineSession() {
  await remove(OFFLINE_AUTH_KEY);
  await remove(OFFLINE_USER_KEY);
  // Do NOT remove the cookie here, as it's an HttpOnly cookie and must be cleared by the server (which happens on logout).
}
