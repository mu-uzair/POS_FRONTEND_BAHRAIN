// socket.js
import { io } from "socket.io-client";

// ✅ CORRECT: Check environment variable first, then fallback to localhost
const SOCKET_SERVER_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// Create ONE persistent socket connection
const socket = io(SOCKET_SERVER_URL, {
  transports: ["websocket", "polling"], // ⚠️ Add "polling" as fallback
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// 🔍 Debug logging
socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
  console.log("📡 Connected to:", SOCKET_SERVER_URL);
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket connection error:", error.message);
  console.log("🔗 Attempted URL:", SOCKET_SERVER_URL);
});

socket.on("disconnect", (reason) => {
  console.warn("⚠️ Socket disconnected:", reason);
});

export default socket;