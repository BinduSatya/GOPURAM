import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
  authUser: null,
  isAuthenticated: false,
  isSignedIn: false,
  isOnBoarded: false,
  isLoading: true,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  checkAuth: async () => {
    set({ isCheckingAuth: true, isLoading: true });
    try {
      const res = await axiosInstance.get("/auth/me");
      if (res.data.success) {
        set({
          authUser: res.data.user,
          isSignedIn: true,
          isAuthenticated: true,
          isCheckingAuth: false,
          isLoading: false,
          isOnboarded: res?.data?.user?.isOnboarded,
        });
      } else {
        console.log(res.data.message);
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
      console.log("Error checking authentication:", error);
      set({ isCheckingAuth: false, isSignedIn: false, isLoading: false });
    }
  },
  checkOutAuth: async () => {
    set({
      isCheckingAuth: false,
      isLoading: false,
      authUser: null,
      isAuthenticated: false,
      isSignedIn: false,
      isOnBoarded: false,
      isUpdatingProfile: false,
    });
  },
}));
