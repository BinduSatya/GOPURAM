import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSignedIn: false,
  isOnBoarded: false,
  isLoading: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    set({ isCheckingAuth: true, isLoading: true });

    try {
      const res = await axiosInstance.get("/auth/me");
      set({
        authUser: res.data.user,
        isSignedIn: true,
        isCheckingAuth: false,
        isLoading: false,
        isAuthenticated: true,
        isOnboarded: res.data.user.isOnboarded,
      });
    } catch (error) {
      console.error("Error checking authentication:", error);
      set({ isCheckingAuth: false, isSignedIn: false, isLoading: false });
    }
  },
}));
