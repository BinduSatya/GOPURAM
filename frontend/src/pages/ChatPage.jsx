import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMessages, getRecipient, postMessage } from "../lib/api";
import { useState, useEffect, useRef } from "react";
// import { Image } from "lucide-react";
// import { useRef } from "react";

const ChatPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [messageText, setMessageText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  // const fileUploadRef = useRef(null);
  // const [msgDetails, setMsgDetails] = useState({});

  const chatId = id;
  const users = chatId.split("&");
  const senderId = users[0];
  const receiverId = users[1];
  const messagesEndRef = useRef(null);

  const {
    data: messages = [],
    isLoading: loadingMessages,
    error: messagesError,
  } = useQuery({
    queryKey: ["chat-messages", id],
    queryFn: () => getMessages(id),
  });

  const {
    data: sender,
    isLoading: loadingSender,
    error: senderError,
  } = useQuery({
    queryKey: ["sender"],
    queryFn: () => getRecipient(senderId),
  });

  const {
    data: recipient,
    isLoading: loadingRecipient,
    error: recipientError,
  } = useQuery({
    queryKey: ["recipient"],
    queryFn: () => getRecipient(receiverId),
  });

  const { mutate: sendMsg, isLoading: sending } = useMutation({
    mutationFn: (newMsg) => postMessage(newMsg),
    onSuccess: () => {
      setMessageText("");
      setImageFile(null);
      queryClient.invalidateQueries(["chat-messages", id]);
    },
  });

  const handleSend = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    const newMsg = {
      senderId,
      receiverId,
      messageText,
      imageFile,
    };
    sendMsg(newMsg);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  //   if (messageText.trim() || imageFile) {
  //     const vale = await postMessage(newMsg);
  //     console.log("vale", vale);
  //     queryClient.invalidateQueries(["chat-messages", id]);
  //     setMessageText("");
  //     setImageFile(null);
  //   }
  // };

  // const handleImageClick = () => {
  //   fileUploadRef.current.click();
  // };

  // const handleImageChange = (e) => {
  //   setImageFile(e.target.files[0]);

  return (
    <div className="w-full h-screen flex flex-col bg-gray-100">
      {!loadingMessages && !loadingSender && !loadingRecipient && (
        <>
          <header className="p-4 bg-blue-600 text-white text-lg font-bold">
            Chat with User: {recipient.fullName}
          </header>
          {/* Scrollable messages area */}
          <main className="flex-1 overflow-y-auto p-4 space-y-3">
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
                  className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg shadow text-sm break-words ${
                    msg.senderId === senderId
                      ? "ml-auto bg-blue-500 text-white"
                      : "mr-auto bg-green-600 text-white"
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
          {/* Fixed input box */}
          <form
            onSubmit={handleSend}
            className="p-4 bg-white border-t flex gap-2 sticky bottom-0"
            autoComplete="off"
            encType="multipart/form-data"
          >
            <input
              type="text"
              name="input-message"
              id="send-message"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={sending}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition disabled:opacity-50 focus:ring-2 focus:ring-blue-400"
              disabled={sending || (!messageText.trim() && !imageFile)}
            >
              Send
            </button>
          </form>
        </>
      )}
    </div>
  );
};
export default ChatPage;
