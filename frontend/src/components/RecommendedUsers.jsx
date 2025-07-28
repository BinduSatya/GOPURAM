import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  acceptFriendRequest,
  getFriendRequests,
  getOutgoingFriendReqs,
  getRecommendedUsers,
  sendFriendRequest,
} from "../lib/api";
// import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { capitialize } from "../lib/utils";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon } from "lucide-react";
const RecommendedUsers = () => {
  const queryClient = useQueryClient();

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
    onError: () => {
      console.log("error in fetching users");
    },
  });

  const { data: outgoingFriendReqs = [], isLoading: loadingOutgoingFriends } =
    useQuery({
      queryKey: ["outgoingFriendReqs"],
      queryFn: getOutgoingFriendReqs,
      onError: () => {
        console.log("error in fetching outgoing-reqs");
      },
    });
  // let incomingFriendReqs = [];
  // // let incomingFriendRes = [];
  // const { data: incomingFriendRes = {}, isLoading: loadingFriendRequests } =
  //   useQuery({
  //     queryKey: ["incomingFriendReqs"],
  //     queryFn: getFriendRequests,
  //     onSuccess: (incomingFriendReqs = incomingFriendRes.message),
  //     onError: () => {
  //       console.log("error in fetching incoming-reqs");
  //     },
  //   });

  const { data: incomingFriendReqs = [], isLoading: loadingFriendRequests } =
    useQuery({
      queryKey: ["incomingFriendReqs"],
      queryFn: getFriendRequests,
      onError: () => {
        console.log("error in fetching incoming-reqs");
      },
    });
  console.log("incomingFriendReqs areada", incomingFriendReqs.incomingReqs);

  const { mutate: sendRequestMutation, isLoading: isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: (data) => {
      console.log("data of req is", data);
      toast.success("Friend Request Sent");
      queryClient.invalidateQueries(["incomingFriendReqs.message"]);
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["friends"]);
      queryClient.invalidateQueries(["outgoingFriendReqs"]);
    },
    onError: (e) => {
      console.log("error while sending req", e);
    },
  });

  const { mutate: acceptRequest, isPending: acceptingRequest } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      console.log("success in accepting");
      toast.success("Friend Request Accepted");
      queryClient.invalidateQueries(["incomingFriendReqs.message"]);
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["friends"]);
      queryClient.invalidateQueries(["outgoingFriendReqs"]);
    },
    onError: (e) => {
      console.log("error occrured", e);
    },
  });

  return (
    <>
      {loadingUsers || loadingOutgoingFriends || loadingFriendRequests ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {incomingFriendReqs.incomingReqs.length > 0 &&
            incomingFriendReqs.incomingReqs.map((request) => {
              return (
                <div
                  key={request._id}
                  className="bg-base-200 mb-3 mr-3 transition hover:scale-105 hover:shadow-sm hover:opacity-100 active:scale-95 card card-border"
                >
                  <div className="card-body m-3 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="avatar size-16 rounded-full">
                        <img
                          src={
                            loadingFriendRequests
                              ? `/user.png`
                              : request?.sender?.profilePic || `/user.png`
                          }
                          alt={request.sender.fullName}
                        />
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg">
                          {request.sender.fullName}
                        </h3>
                        {request.sender.location && (
                          <div className="flex items-center text-xs opacity-70 mt-1">
                            <MapPinIcon className="size-3 mr-1" />
                            {request.sender.location}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <span className="badge badge-outline">
                        Learning:{" "}
                        {request?.sender?.learningSkill
                          ? capitialize(request.sender.learningSkill)
                          : "Not specified"}
                      </span>
                    </div>

                    <button
                      className={`btn w-full mt-2  btn-primary`}
                      onClick={() => acceptRequest(request._id)}
                      disabled={acceptingRequest || isPending}
                    >
                      Accpet Request
                    </button>
                  </div>
                </div>
              );
            })}
          {/* </div> */}
          {outgoingFriendReqs.length > 0 &&
            outgoingFriendReqs.map((request) => {
              console.log("request", request);
              return (
                <div
                  key={request._id}
                  className="bg-base-200  mb-3 mr-3 transition hover:scale-105 hover:shadow-sm hover:opacity-100 active:scale-95 card card-border"
                >
                  <div className="card-body p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="avatar size-16 rounded-full">
                        <img
                          src={
                            loadingOutgoingFriends
                              ? `/user.png`
                              : request?.recipient?.profilePic || `/user.png`
                          }
                          alt={
                            request?.recipient?.fullName || request.recipient
                          }
                        />
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg">
                          {request?.recipient?.fullName || request?.recipient}
                        </h3>
                        {request?.recipient?.location && (
                          <div className="flex items-center text-xs opacity-70 mt-1">
                            <MapPinIcon className="size-3 mr-1" />
                            {request?.recipient?.location}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <span className="badge badge-outline">
                        Learning:{" "}
                        {request?.recipient?.learningSkill
                          ? capitialize(request.recipient.learningSkill)
                          : "Not specified"}
                      </span>
                    </div>

                    <button
                      className={`btn w-full mt-2 btn-disabled `}
                      disabled={true}
                    >
                      <CheckCircleIcon className="size-4 mr-2" />
                      Request Sent
                    </button>
                  </div>
                </div>
              );
            })}
          {/* </div> */}

          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> */}
          {recommendedUsers.length > 0 &&
            recommendedUsers.map((user) => {
              return (
                <div
                  key={user._id}
                  className="bg-base-200 mb-3 mr-3 transition hover:scale-105 hover:shadow-sm hover:opacity-100 active:scale-95 card card-border"
                >
                  <div className="card-body p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="avatar size-16 rounded-full">
                        <img
                          src={user?.profilePic || `/user.png`}
                          alt={user.fullName}
                        />
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg">
                          {user.fullName}
                        </h3>
                        {user.location && (
                          <div className="flex items-center text-xs opacity-70 mt-1">
                            <MapPinIcon className="size-3 mr-1" />
                            {user.location}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <span className="badge badge-outline">
                        Learning:{" "}
                        {user?.learningSkill
                          ? capitialize(user?.learningSkill)
                          : "Not specified"}
                      </span>
                    </div>

                    {user.bio && (
                      <p className="text-sm opacity-70">{user.bio}</p>
                    )}

                    <button
                      className={`btn w-full mt-2 btn-secondary`}
                      onClick={() => sendRequestMutation(user._id)}
                    >
                      <UserPlusIcon className="size-4 mr-2" />
                      Send Friend Request
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
