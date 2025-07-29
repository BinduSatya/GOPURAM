import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postMessage } from "../lib/api";
import { useState } from "react";
import { SendHorizonal, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { useSocketStore } from "../store/useSocketStore";

const ChatInput = ({ id }) => {
  const socket = useSocketStore((state) => state.socket);
  const chatId = id;
  const users = chatId.split("&");
  const senderId = users[0];
  const receiverId = users[1];

  const queryClient = useQueryClient();
  const [messageText, setMessageText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const { mutate: sendMsg, isLoading: sending } = useMutation({
    mutationFn: (newMsg) => postMessage(newMsg, socket),
    onSuccess: () => {
      setMessageText("");
      setImageFile(null);
      setPreviewUrl(null);
      setLoading(false);
      queryClient.invalidateQueries(["chat-messages", id]);
    },
    onMutate: () => {
      setMessageText("");
      setImageFile(null);
      setPreviewUrl(null);
    },
  });

  const handleSend = async (e) => {
    e.preventDefault();
    if (!messageText.trim() && !imageFile) return;

    const newMsg = {
      senderId,
      receiverId,
      messageText,
      imageFile,
    };
    const formData = new FormData();
    formData.append("senderId", senderId);
    formData.append("receiverId", receiverId);
    formData.append("messageText", messageText);
    if (newMsg.imageFile) {
      formData.append("imageFile", imageFile);
    }
    sendMsg(formData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  return (
    <div>
      {previewUrl && (
        <div className="p-2 flex items-center gap-2">
          <img
            src={previewUrl}
            alt="preview"
            className="w-16 h-16 object-cover rounded"
          />
          <button onClick={removeImage} className="text-alert hover:text-error">
            <X />
          </button>
        </div>
      )}

      <form
        onSubmit={handleSend}
        className="p-4 flex gap-2 items-center sticky bottom-0"
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

        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <ImageIcon className="text-accent hover:text-secondary" />
        </label>

        <button
          type="submit"
          className="bg-accent hover:bg-secondary text-white px-4 py-2 rounded-full shadow transition transform active:scale-95 disabled:bg-neutral-500 cursor-pointer"
          disabled={sending || loading || (!messageText.trim() && !imageFile)}
        >
          <SendHorizonal />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
