import { useQuery } from "@tanstack/react-query";
// import { useEffect, useState } from "react";
import {
  // getFriendRequests,
  // getOutgoingFriendReqs,
  // getRecommendedUsers,
  getUserFriends,
  // sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import { UsersIcon } from "lucide-react";

import RecommendedUsers from "../components/RecommendedUsers";
import FriendCard from "../components/FriendCard";
import PageLoader from "../components/PageLoader.jsx";
import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Meet Gopuram vasis
                </h2>
                <p className="opacity-70">
                  Discover other Gopuram members profile
                </p>
              </div>
            </div>
          </div>

          <RecommendedUsers />
        </section>
        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Your Friends
            </h2>
            <Link to="/notifications" className="btn btn-outline btn-sm">
              <UsersIcon className="mr-2 size-4" />
              Friend Requests
            </Link>
          </div>

          {loadingFriends ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
              {/* <PageLoader /> */}
            </div>
          ) : friends.length === 0 ? (
            <NoFriendsFound />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
