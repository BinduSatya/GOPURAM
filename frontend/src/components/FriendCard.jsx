import { Link } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
// import { LANGUAGE_TO_FLAG } from "../constants";

// export function getLanguageFlag(language) {
//   if (!language) return null;

//   const langLower = language.toLowerCase();
//   // const countryCode = LANGUAGE_TO_FLAG[langLower];

//   if (countryCode) {
//     return (
//       <img
//         src={`https://flagcdn.com/24x18/${countryCode}.png`}
//         alt={`${langLower} flag`}
//         className="h-3 mr-1 inline-block"
//       />
//     );
//   }
//   return null;
// }
const FriendCard = ({ friend }) => {
  const { authUser } = useAuthStore();
  console.log("authUser", authUser);
  const chatLink = authUser._id + "&" + friend._id;

  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img src={friend.profilePic} alt={friend.fullName} />
          </div>
          <h3 className="font-semibold truncate">{friend.fullName}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            {/* {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage} */}
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
