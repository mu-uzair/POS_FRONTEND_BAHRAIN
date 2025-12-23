import { isReallyOnline } from "./isReallyOnline";

let lastStatus = navigator.onLine;

export async function checkOnlineStatus() {
  const actual = await isReallyOnline();
  lastStatus = actual;
  return actual;
}

export function isOnline() {
  return lastStatus;
}
