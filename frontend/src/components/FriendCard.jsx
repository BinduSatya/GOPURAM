import { Link } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

const FriendCard = ({ friend }) => {
  const { authUser } = useAuthStore();
  console.log("authUser", authUser);
  const chatLink = authUser._id + "&" + friend._id;

  return (
    <div className="card bg-base-200 hover:shadow-sm transition-shadow hover:scale-105">
      <div className="card-body p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img
              src={friend.profilePic || "../../public/user.png"}
              alt={friend.fullName}
            />
          </div>
          <h3 className="font-semibold truncate">{friend.fullName}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            Location: {friend.location || "Warangal"}
          </span>
          <span className="badge badge-outline text-xs">
            {/* {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage} */}
            Learning: {friend.learningSkill || "Reading"}
          </span>
        </div>

        <Link to={`/message/${chatLink}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  );
};
export default FriendCard;
