import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  getFriendRequests,
  getOutgoingFriendReqs,
  getRecommendedUsers,
  sendFriendRequest,
} from "../lib/api";
import { useEffect, useState } from "react";
import { capitialize } from "../lib/utils";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon } from "lucide-react";

const RecommendedUsers = () => {
  const queryClient = new QueryClient();
  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const { data: outgoingFriendReqs, isLoading: loadingOutgoingFriends } =
    useQuery({
      queryKey: ["outgoingFriendReqs"],
      queryFn: getOutgoingFriendReqs,
    });

  const {
    data: incomingFriendReqs,
    isLoading: loadingFriendRequests,
    isSuccess,
  } = useQuery({
    queryKey: ["incomingFriendReqs"],
    queryFn: getFriendRequests,
    onError: () => {
      console.log("error in fetching reqs");
    },
  });
  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  if (isSuccess) {
    console.log("incomingFriendReqs", incomingFriendReqs);
  }
  return (
    <>
      {loadingUsers || loadingOutgoingFriends || loadingFriendRequests ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : recommendedUsers.length === 0 ? (
        <div className="card bg-base-200 p-6 text-center">
          <h3 className="font-semibold text-lg mb-2">
            No recommendations available
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedUsers.map((user) => {
            const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
            console.log("users are");

            return (
              <div
                key={user._id}
                className="bg-base-200 transition hover:scale-105 hover:shadow-sm hover:opacity-100 active:scale-95 card card-border"
              >
                <div className="card-body p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="avatar size-16 rounded-full">
                      <img
                        src={user.profilePic || `../../public/i.png`}
                        alt={user.fullName}
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg">{user.fullName}</h3>
                      {user.location && (
                        <div className="flex items-center text-xs opacity-70 mt-1">
                          <MapPinIcon className="size-3 mr-1" />
                          {user.location}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Languages with flags */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className="badge badge-outline">
                      Learning: {capitialize(user.learningSkill)}
                    </span>
                  </div>

                  {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}

                  {/* Action button */}
                  <button
                    className={`btn w-full mt-2 ${
                      hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                    } `}
                    onClick={() => sendRequestMutation(user._id)}
                    disabled={hasRequestBeenSent || isPending}
                  >
                    {hasRequestBeenSent ? (
                      <>
                        <CheckCircleIcon className="size-4 mr-2" />
                        Request Sent
                      </>
                    ) : (
                      <>
                        <UserPlusIcon className="size-4 mr-2" />
                        Send Friend Request
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default RecommendedUsers;
