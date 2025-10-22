// socket.js
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:8000" || "https://pos-backend-bahrain.onrender.com";

// Create ONE persistent socket connection
const socket = io(SOCKET_SERVER_URL, {
  transports: ["websocket"], // faster, more stable
  reconnection: true,
  reconnectionAttempts: 5,
});

export default socket;
