import { Link } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

const GroupChat = () => {
  const { authUser } = useAuthStore();
  console.log("authUser", authUser);
  const chatLink = authUser._id + "&" + "gopuram";
  
  return (
    <div className="card bg-base-200 hover:shadow-sm transition-shadow hover:scale-105">
      <div className="card-body p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12 accent-content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-users-icon lucide-users 	accent-content"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <path d="M16 3.128a4 4 0 0 1 0 7.744" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          </div>
          <h3 className="font-semibold truncate">Group Chat</h3>
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

export default GroupChat;
