import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
  // variables
  authUser: null,
  isAuthenticated: false,
  isSignedIn: false,
  isOnBoarded: false,
  isLoading: false,
  isUpdatingProfile: false,
  isCheckingAuth: false,
  // methods
  checkAuth: async () => {
    set({ isCheckingAuth: true, isLoading: true });

    try {
      const res = await axiosInstance.get("/auth/me");
      console.log("res from frontend", res.data.user);
      if (res.data.user) {
        set({
          authUser: res.data.user,
          isSignedIn: true,
          isAuthenticated: true,
          isCheckingAuth: false,
          isLoading: false,
          isOnboarded: res.data.user.isOnboarded,
        });
      } else {
        set({
          isSignedIn: false,
          isOnBoarded: false,
          isLoading: false,
          isAuthenticated: false,
          isUpdatingProfile: false,
          isCheckingAuth: false,
        });
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      set({ isCheckingAuth: false, isSignedIn: false, isLoading: false });
    }
  },
}));
