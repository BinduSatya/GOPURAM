import { axiosInstance } from "./axios";
// import { io } from "socket.io-client";
// import { useAuthStore } from "../store/useAuthStore";
// import { useSocketStore } from "../store/useSocketStore";

// const { socket } = useSocketStore;
// const socket = io("http://localhost:3000", { withCredentials: true });

export const signup = async (signupData) => {
  // const { authUser } = useAuthStore;
  const response = await axiosInstance.post("/auth/signup", signupData);
  if (response?.data.success) {
    console.log("after check auth");
    return response?.data?.user;
  }
  return response?.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  console.log("response?.data", response?.data?.user);
  if (response?.data?.success) {
    console.log("before check auth");
    // checkAuth;
    console.log("after check auth");
    return response.data.user;
  }
  return response?.data?.message;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  console.log("logged out data", response.data);
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

export const getRecipient = async (id) => {
  try {
    const res = await axiosInstance.get(`/users/get-user/${id}`);
    if (res.data.success) {
      return res.data.user;
    } else {
      return res.data.message;
    }
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  // console.log(response.data.user);
  return response.data;
};

export async function getUserFriends() {
  const response = await axiosInstance.get("/users/friends");
  console.log("user friends are", response.data.friends);
  if (response.data.success) {
    return response.data.friends;
  } else {
    return response.data.message;
  }
}

export async function getRecommendedUsers() {
  const response = await axiosInstance.get("/users/get-users");
  if (response.data.success) {
    console.log("resp", response.data.recommendedUsers);
    return response.data.recommendedUsers;
  } else {
    return response.data.message;
  }
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  if (response.data.success) {
    console.log("outgoings reqs are", response.data.outgoingRequests);
    return response.data.outgoingRequests;
  } else {
    return response.data.message;
  }
}

export async function sendFriendRequest(userId) {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  if (response.data.success) {
    return response.data.friendRequest;
  } else {
    return response.data.message;
  }
}

export async function getFriendRequests() {
  const response = await axiosInstance.get("/users/friend-requests");
  if (response.data.success) {
    console.log("incoming reqs are", response.data.message);
    return response.data.message;
  } else return null;
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(
    `/users/friend-request/${requestId}/accept`
  );
  console.log("accepted", response.data);
  return response.data.message;
}

export const getAllMemories = async () => {
  const response = await axiosInstance.get("/memories/all");
  return response.data.message;
};

export const postMemory = async (memoryData) => {
  const response = await axiosInstance.post(
    "/memories/post-memory",
    memoryData
  );
  return response;
};

export const getMessages = async (id) => {
  const response = await axiosInstance.get(`/chat/${id}`);
  if (response.data.success) {
    console.log("messages are", response.data.messages);
    return response.data.messages;
  } else {
    return response.data.message;
  }
};

export const postMessage = async (msgDetails, socket) => {
  console.log("came to post message");

  const response = await axiosInstance.post(`/chat/send-message`, msgDetails);
  let receiverId = msgDetails.get("receiverId");
  console.log("receiverId is", receiverId);
  socket.emit("send-message", receiverId);
  if (response.data.success) {
    return response.data.message;
  } else {
    return response.data.message;
  }
};

export const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJjYTcwY2E0ZS01ODczLTRiY2QtODdjYS1mNzIzMjNkOWExZTgiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTc1Mzc3MTQ3OSwiZXhwIjoxNzY5MzIzNDc5fQ.FUlyEMWv5QCDCziaJVxl_q3BY-H3t8-zn49nE2twUEk";

export const createMeeting = async ({ token }) => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  //Destructuring the roomId from the response
  const { roomId } = await res.json();
  return roomId;
};
