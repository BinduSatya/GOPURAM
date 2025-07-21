// import { useParams } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postMessage } from "../lib/api";
import { useState } from "react";
import { SendHorizonal } from "lucide-react";
import { useSocketStore } from "../store/useSocketStore";

const ChatInput = ({ id }) => {
  const socket = useSocketStore((state) => state.socket);
  //   const { id } = useParams();
  const chatId = id;
  const users = chatId.split("&");
  const senderId = users[0];
  const receiverId = users[1];
  //   const id = senderId + "&" + receiverId;
  const queryClient = useQueryClient();
  const [messageText, setMessageText] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const { mutate: sendMsg, isLoading: sending } = useMutation({
    mutationFn: (newMsg) => postMessage(newMsg, socket),
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
  return (
    <div>
      <form
        onSubmit={handleSend}
        className="p-4 flex gap-4 sticky bottom-0"
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
          className="flex-1 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent bg-base-100 border border-neutral-300 text-base-content"
          disabled={sending}
        />
        <button
          type="submit"
          className="bg-accent hover:bg-secondary text-white px-4 py-2 rounded-full shadow transition transform active:scale-95 disabled:bg-neutral-500 cursor-pointer"
          disabled={sending || (!messageText.trim() && !imageFile)}
        >
          <SendHorizonal />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
