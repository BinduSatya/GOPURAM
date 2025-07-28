import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getRecipient } from "../lib/api";
import ChatBodyComponent from "../components/ChatBodyComponent";
import ChatHeader from "../components/ChatHeader";
import ChatInput from "../components/ChatInput";
import ChatLoader from "../components/ChatLoader";
import { useSocketStore } from "../store/useSocketStore";

const ChatPage = () => {
  const { id } = useParams();
  let chatId, users, receiverId;
  chatId = id;
  users = chatId.split("&");
  receiverId = users[1];
  const { socket } = useSocketStore();
  socket.emit("register-user", users[0]);
  socket.on("welcome", (data) => console.log(data));

  const {
    data: recipient,
    isLoading: loadingRecipient,
    error: recipientError,
  } = useQuery({
    queryKey: ["recipient"],
    queryFn: () => getRecipient(receiverId),
  });

  return (
    <>
      {loadingRecipient ? (
        <div className="flex justify-center py-12  bg-base-100">
          <ChatLoader />
        </div>
      ) : recipientError ? (
        <>Error occured, contact BSAmarnadh</>
      ) : (
        <div className="flex flex-col h-full">
          <ChatHeader reciever={recipient} />

          <div className="flex-1 overflow-y-auto px-2 py-3 bg-base-100">
            <ChatBodyComponent id={chatId} receiver={recipient} />
          </div>

          <div className="border-red">
            <ChatInput id={chatId} />
          </div>
        </div>
      )}
    </>
  );
};
export default ChatPage;
