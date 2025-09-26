import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(token: string | null) {
  if (!socket) {
    socket = io(import.meta.env.VITE_WS_BASE || "http://localhost:4000", {
      path: "/ws",
      transports: ["websocket"],
      withCredentials: true,
      auth: { token },
      autoConnect: !!token,
    });
  } else {
    socket.auth = { token };
    if (token && !socket.connected) socket.connect();
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
