import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getRecipient } from "../lib/api";
import ChatBodyComponent from "../components/ChatBodyComponent";
import ChatHeader from "../components/ChatHeader";
import ChatInput from "../components/ChatInput";
import ChatLoader from "../components/ChatLoader";

const ChatPage = () => {
  const { id } = useParams();
  const chatId = id;
  const users = chatId.split("&");
  const receiverId = users[1];

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
        <div className="flex flex-col h-full bg-base-300">
          <ChatHeader fullName={recipient.fullName} />

          <div className="flex-1 overflow-y-auto px-2 py-3">
            <ChatBodyComponent id={chatId} />
          </div>

          <div className="border-t bg-white">
            <ChatInput id={chatId} />
          </div>
        </div>
      )}
    </>
  );
};
export default ChatPage;
