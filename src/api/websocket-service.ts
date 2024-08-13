import io from "socket.io-client";

const socket = io("https://main-backend.robertvitoriano.com:3334");

socket.on("connect", () => {
  console.log("Connected to WebSocket server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from WebSocket server");
});

export default socket;
