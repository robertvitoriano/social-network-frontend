import io from "socket.io-client";

const socket = io(
  process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:3334"
);

socket.on("connect", () => {
  console.log("Connected to WebSocket server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from WebSocket server");
});

export default socket;
