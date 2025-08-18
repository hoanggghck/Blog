// test-notification.ts
import { io } from "socket.io-client";

const socket = io("http://localhost:3088", {
  auth: {
    token: "Bearer yourAccessToken", // giống client.handshake.auth?.token
  },
  extraHeaders: {
    refreshtoken: "yourRefreshToken", // giống client.handshake.headers['refreshtoken']
  },
});

socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);

  // join vào room theo userId (ví dụ: userId = 123)
  socket.emit("join", "123");
});

socket.on("joined", (data) => {
  console.log("📌 Joined room:", data);
});

socket.on("notification", (msg) => {
  console.log("🔔 Notification:", msg);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected");
});
