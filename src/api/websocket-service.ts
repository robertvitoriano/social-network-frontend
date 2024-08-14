import io from "socket.io-client";
//@ts-ignore
const socket = io(process.env.NEXT_PUBLIC_API_URL);

socket.on("connect", () => {
  console.log("Connected to WebSocket server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from WebSocket server");
});

export default socket;
