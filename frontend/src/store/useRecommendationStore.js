import { create } from "zustand";
import { getUserFriends } from "../lib/api";

export const useRecommendationStore = create((set) => ({
  friends: [],
  gettingFriends: false,
  sentRequests: [],
  gettingSentRequests: false,
  pendingRequests: [],
  gettingPendingRequests: false,

  getFriends: async () => {
    set({ gettingFriends: true });
    try {
      const frnds = await getUserFriends();
      //   if (frnds.length > 0) {
      set({ friends: frnds, gettingFriends: false });
      console.log("got frnds", frnds);
      //   } else {
      //     console.log("error in geting friends");
      //   }
    } catch (error) {
      console.log("error in geting friends", error);
    }
  },
}));
