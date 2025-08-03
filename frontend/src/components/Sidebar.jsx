import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import {
  BellIcon,
  FerrisWheel,
  HomeIcon,
  LogOutIcon,
  TentTree,
  // ShipWheelIcon,
  UsersIcon,
  Video,
} from "lucide-react";
import useLogout from "../hooks/useLogout";
import ThemeSelector from "./ThemeSelector";
import { useAuthStore } from "../store/useAuthStore.js";
import toast from "react-hot-toast";

const Sidebar = ({ isCompact = false, mobile = false, onClose }) => {
  const { logoutMutation, onSuccess } = useLogout();
  if (onSuccess) {
    toast.onSuccess("Logged out successfullt");
  }
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  const { checkOutAuth } = useAuthStore();
  const navItems = [
    { to: "/", label: "Home", icon: <HomeIcon className="size-5" /> },
    {
      to: "/friends",
      label: "Friends",
      icon: <UsersIcon className="size-5" />,
    },
    {
      to: "/notifications",
      label: "Notifications",
      icon: <BellIcon className="size-5" />,
    },
    {
      to: "/memories",
      label: "Memories",
      icon: <FerrisWheel className="size-5" />,
    },
    {
      to: "/video-calls",
      label: "Make a Call",
      icon: <Video className="size-5" />,
    },
  ];

  return (
    <aside
      className={`
        ${isCompact ? "w-20" : "w-64"} 
        bg-base-200 border-r border-base-300 flex flex-col select-none h-screen top-0 
        ${mobile ? "fixed left-0 z-40" : ""}
      `}
    >
      <div className="p-5 border-b border-base-300">
        <Link
          to="/"
          onClick={mobile ? onClose : undefined}
          className="flex flex-row gap-2"
        >
          {/* <TentTree className="size-9 text-primary" /> */}
          <img
            src="temple-gopuram.svg"
            alt="temple"
            className="size-9 text-primary"
          />
          {!isCompact && (
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              GOPURAM
            </span>
          )}
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, label, icon }) => (
          <Link
            key={to}
            to={to}
            onClick={mobile ? onClose : undefined}
            className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
              currentPath === to ? "btn-active" : ""
            }`}
          >
            {icon}
            {!isCompact && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-base-300 mt-auto">
        <div
          className={`flex ${
            isCompact ? "flex-col" : "flex-row"
          } justify-center items-center gap-3`}
        >
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img
                src={authUser?.profilePic || "/user.png"}
                alt="User Avatar"
              />
            </div>
          </div>

          {!isCompact && (
            <div className="flex-1 text-center">
              <p className="font-semibold text-sm">{authUser?.fullName}</p>
              <p className="text-xs text-success flex items-center justify-center gap-1">
                <span className="size-2 rounded-full bg-success inline-block" />
                Online
              </p>
            </div>
          )}

          <ThemeSelector />

          <button
            className="btn btn-ghost btn-circle"
            onClick={() => {
              checkOutAuth();
              logoutMutation();
            }}
          >
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
