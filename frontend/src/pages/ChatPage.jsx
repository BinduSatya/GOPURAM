import { useParams } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

const ChatPage = () => {
  const { id } = useParams();
  // const { authUser } = useAuthStore();
  const { authUser } = useAuthStore();
  

  console.log(authUser._id, " is the authUser in ChatPage");
  return (
    <div>
      <h1>This is chatpage</h1>
      <p>Chat ID: {id}</p>
      {/* Add your chat component here */}
    </div>
  );
};

export default ChatPage;
