import { Link } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

const GroupChatCard = () => {
  const { authUser } = useAuthStore();
  console.log("authUser", authUser);
  const chatLink = authUser._id + "&" + "gopuram";

  return (
    <div className="card bg-primary hover:shadow-sm transition-shadow hover:scale-105">
      <div className="card-body p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12 accent-content">
            <img src="/gopuram.png" alt="gopuram" />
          </div>
          <h3 className="font-semibold truncate">Group Chat (Gopuram)</h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            To Whole Gopuram
          </span>
        </div>

        <Link to={`/message/${chatLink}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  );
};

export default GroupChatCard;
