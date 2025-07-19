import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { getMessages } from "../lib/api";

const ChatComponent = ({ id }) => {
  const chatId = id;
  const users = chatId.split("&");
  const senderId = users[0];
  const messagesEndRef = useRef(null);

  const {
    data: messages = [],
    isLoading: loadingMessages,
    error: messagesError,
  } = useQuery({
    queryKey: ["chat-messages", id],
    queryFn: () => getMessages(id),
  });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div>
      <main className="flex-1 overflow-y-auto p-4 space-y-3 bg-base-300">
        {loadingMessages ? (
          <p>Loading messages...</p>
        ) : messagesError ? (
          <p>Error loading messages.</p>
        ) : messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 btn-ghost py-2 rounded-lg shadow text-sm break-words ${
                msg.senderId === senderId
                  ? "ml-auto bg-accent text-white"
                  : "mr-auto bg-info text-white"
              }`}
            >
              <span>{msg.text}</span>
              {msg.image && (
                <img
                  src={msg.image}
                  alt="chat-img"
                  className="max-w-xs mt-2 rounded"
                />
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </main>
    </div>
  );
};

export default ChatComponent;
