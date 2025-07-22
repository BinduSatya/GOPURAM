import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, MenuIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = ({ isMobile, setSidebarOpen }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          {isMobile && (
            <button
              className="btn btn-ghost btn-circle"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              <MenuIcon className="h-6 w-6 text-base-content opacity-70" />
            </button>
          )}
          {isChatPage && (
            <Link to="/" className="flex items-center gap-2.5">
              <ShipWheelIcon className="size-9 text-primary" />
              <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                GOPURAM
              </span>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link to={"/notifications"}>
            <button className="btn btn-ghost btn-circle">
              <BellIcon className="h-6 w-6 text-base-content opacity-70" />
            </button>
          </Link>

          <ThemeSelector />

          <div className="avatar">
            <div className="w-9 rounded-full">
              <img
                src={authUser?.profilePic || `../../public/i.png`}
                alt="User Avatar"
              />
            </div>
          </div>

          <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
