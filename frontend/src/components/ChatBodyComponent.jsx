import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { getMessages } from "../lib/api";
import { getCleanTime } from "../lib/utils";
import { useSocketStore } from "../store/useSocketStore";
import { useAuthStore } from "../store/useAuthStore";

const ChatBodyComponent = ({ id, reciver }) => {
  const queryClient = useQueryClient();
  const chatId = id;
  const users = chatId.split("&");
  const senderId = users[0];
  const { authUser } = useAuthStore();

  const messagesEndRef = useRef(null);
  const socket = useSocketStore((state) => state.socket);

  const {
    data: messages = [],
    isLoading: loadingMessages,
    error: messagesError,
  } = useQuery({
    queryKey: ["chat-messages", id],
    queryFn: () => getMessages(id, socket),
  });

  // ✅ FIX: Attach socket listener inside useEffect
  useEffect(() => {
    if (!socket) return;

    const handleMessage = () => {
      queryClient.invalidateQueries({ queryKey: ["chat-messages", id] });
    };

    socket.on("recieved-message", handleMessage);

    return () => {
      socket.off("recieved-message", handleMessage); // ✅ cleanup to prevent multiple listeners
    };
  }, [socket, id, queryClient]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div>
      {loadingMessages ? (
        <p>Loading messages...</p>
      ) : messagesError ? (
        <p>Error loading messages.</p>
      ) : messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        messages.map((msg) => {
          const isSender = msg.senderId === senderId;
          const time =
            getCleanTime(msg.updatedAt) || getCleanTime(msg.createdAt);

          return (
            <div
              key={msg._id}
              className={`chat ${isSender ? "chat-end" : "chat-start"}`}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="User profile"
                    src={
                      isSender
                        ? authUser.profilePic || `../../public/user.png`
                        : reciver.profilePic || `../../public/user.png`
                    }
                  />
                </div>
              </div>

              {isSender ? (
                <div className="chat-header flex gap-2 items-end">
                  <time className="text-xs opacity-50">{time}</time>
                  {authUser.fullName}
                </div>
              ) : (
                <div className="chat-header flex gap-2 items-end">
                  {reciver.fullName}
                  <time className="text-xs opacity-50">{time}</time>
                </div>
              )}

              <div
                className={`chat-bubble shadow-sm hover:drop-shadow-md ${
                  isSender ? "bg-accent text-accent-content" : "bg-neutral text-neutral-content"
                }`}
              >
                {msg.text}
              </div>

              {msg.image && (
                <div
                  className={`chat-bubble  ${
                    isSender ? "bg-info text-white" : ""
                  }`}
                >
                  {msg.image}
                </div>
              )}
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatBodyComponent;
