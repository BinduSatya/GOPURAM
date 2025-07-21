import { create } from "zustand";
import { io } from "socket.io-client";

export const useSocketStore = create((set) => ({
  socket: io("http://localhost:3000", { withCredentials: true }),
}));
