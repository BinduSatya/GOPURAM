import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  console.log("response is", response);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
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

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

export async function getUserFriends() {
  const response = await axiosInstance.get("/users/friends");
  // console.log("user friends are", response.data);
  if (response.data.success) {
    return response.data.friends;
  } else {
    return response.data.message;
  }
}

export async function getRecommendedUsers() {
  const response = await axiosInstance.get("/users/get-users");
  if (response.data.success) {
    return response.data.recommendedUsers;
  } else {
    return response.data.message;
  }
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  if (response.data.success) {
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
    return response.data.incomingReqs, response.data.acceptedReqs;
  } else {
    return response.data.message;
  }
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(
    `/users/friend-request/${requestId}/accept`
  );
  return response.data.message;
}

// export async function getStreamToken() {
//   const response = await axiosInstance.get("/chat/token");
//   return response.data;
// }
// /users/friend-requests
// /users/memories-form

export const postMemory = async (memoryData) => {
  const response = await axiosInstance.post("/users/memories-form", memoryData);
  return response.data.data;
};

export const getMessages = async (userId) => {
  const response = await axiosInstance.get(`/chat/${userId}`);
  if (response.data.success) {
    return response.data.messages;
  } else {
    return response.data.message;
  }
};
