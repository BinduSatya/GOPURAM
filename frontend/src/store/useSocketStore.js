import { create } from "zustand";
import { io } from "socket.io-client";

export const useSocketStore = create((set) => ({
  socket: io( import.meta.env.VITE_BASE_URL_SOCKET, { withCredentials: true }),
}));
