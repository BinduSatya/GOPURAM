import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { getMessages, getRecipient } from "../lib/api";
import { getCleanTime } from "../lib/utils";
import { useSocketStore } from "../store/useSocketStore";
import { useAuthStore } from "../store/useAuthStore";
import { X } from "lucide-react";
import NoMessages from "./NoMessages";

const ChatBodyComponent = ({ id, receiver }) => {
  const queryClient = useQueryClient();
  const chatId = id;
  const users = chatId.split("&");
  const senderId = users[0];
  const { authUser } = useAuthStore();
  const messagesEndRef = useRef(null);
  const socket = useSocketStore((state) => state.socket);
  const [recipientMap, setRecipientMap] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  const {
    data: messages = [],
    isLoading: loadingMessages,
    error: messagesError,
  } = useQuery({
    queryKey: ["chat-messages", id],
    queryFn: () => getMessages(id),
  });

  useEffect(() => {
    let isMounted = true;
    if (users[1] === "gopuram") {
      const loadRecipients = async () => {
        const unknownIds = new Set();
        messages.forEach((msg) => {
          if (!recipientMap[msg.senderId]) {
            unknownIds.add(msg.senderId);
          }
        });

        const recipients = await Promise.all(
          Array.from(unknownIds).map(getRecipient)
        );

        const map = {};
        recipients.forEach((user) => {
          if (user) map[user._id] = user;
        });

        if (isMounted) {
          setRecipientMap((prev) => ({ ...prev, ...map }));
        }
      };

      if (messages.length > 0) {
        loadRecipients();
      }
    }

    return () => {
      isMounted = false;
    };
  }, [messages, recipientMap]);

  useEffect(() => {
    if (!socket) return;
    const handleMessage = () => {
      queryClient.invalidateQueries(["chat-messages", id]);
    };
    socket.on("recieved-message", handleMessage);
    return () => {
      socket.off("recieved-message", handleMessage);
    };
  }, [socket, queryClient]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setPreviewImage(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative">
      {loadingMessages ? (
        <p>Loading messages...</p>
      ) : messagesError ? (
        <p>Error loading messages.</p>
      ) : messages.length === 0 ? (
        <NoMessages user={receiver} />
      ) : (
        messages.map((msg) => {
          const isSender = msg.senderId === senderId;
          const time =
            getCleanTime(msg.updatedAt) || getCleanTime(msg.createdAt);
          const isGroupMessage = msg.receiverId === undefined;
          const user = isGroupMessage
            ? recipientMap[msg.senderId]
            : receiver;

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
                        ? authUser.profilePic || "/user.png"
                        : user?.profilePic || "/user.png"
                    }
                  />
                </div>
              </div>

              <div className="chat-header flex gap-2 items-end">
                {user?.fullName || "Unknown"}
                <time className="text-xs opacity-50 select-none">{time}</time>
              </div>

              {msg?.text && msg?.image ? (
                <>
                  <div
                    className={`m-2 rounded-lg shadow-lg ${
                      isSender
                        ? "bg-accent text-accent-content"
                        : "bg-neutral text-neutral-content"
                    }`}
                    onClick={() => setPreviewImage(msg.image)}
                  >
                    <img
                      src={msg.image}
                      className="rounded-lg transition max-w-[300px] object-cover active:scale-95 cursor-pointer hover:opacity-90 hover:scale-105"
                      alt="sent"
                    />
                  </div>
                  <div
                    className={`chat-bubble shadow-sm ${
                      isSender
                        ? "bg-accent text-accent-content"
                        : "bg-neutral text-neutral-content"
                    }`}
                  >
                    {msg.text}
                  </div>
                </>
              ) : msg.text ? (
                <div
                  className={`chat-bubble shadow-sm ${
                    isSender
                      ? "bg-accent text-accent-content"
                      : "bg-neutral text-neutral-content"
                  }`}
                >
                  {msg.text}
                </div>
              ) : (
                <div
                  className={`mt-2 rounded-lg`}
                  onClick={() => setPreviewImage(msg.image)}
                >
                  <img
                    src={msg.image}
                    className="rounded-lg transition max-w-[300px] object-cover active:scale-95 cursor-pointer hover:opacity-90 hover:scale-105"
                    alt="sent"
                  />
                </div>
              )}
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />

      {previewImage && (
        <div
          className="fixed inset-0 bg-base-200 bg-opacity-80 flex justify-center items-center z-50"
          onClick={() => {
            setPreviewImage(null);
          }}
        >
          <div className="relative">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-80"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewImage}
              alt="enlarged"
              className="max-h-[90vh] max-w-[90vw] rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBodyComponent;
