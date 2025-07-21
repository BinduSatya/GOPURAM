import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // <640px = mobile (sm in Tailwind)
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar is shown based on screen size */}
      {showSidebar && !isMobile && (
        <Sidebar compact={window.innerWidth < 1024} /> 
        // <1024px = show only icons, else full sidebar
      )}

      <div className="flex-1 flex flex-col h-screen">
        {/* Navbar with hamburger menu for mobile */}
        {isMobile && (
          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}

        {/* Mobile Sidebar Drawer */}
        {isMobile && sidebarOpen && (
          <div className="fixed inset-0 z-40 flex">
            <Sidebar mobile onClose={() => setSidebarOpen(false)} />
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={() => setSidebarOpen(false)}
            />
          </div>
        )}

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
