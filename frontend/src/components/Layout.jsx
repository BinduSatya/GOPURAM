import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = true }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsCompact(width < 760);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex">
      {showSidebar && !isMobile && <Sidebar isCompact={isCompact} />}
      <div className="flex-1 flex flex-col h-screen">
        {isMobile && (
          <Navbar
            isMobile={isMobile}
            setSidebarOpen={setSidebarOpen}
            sidebarOpen={sidebarOpen}
          />
        )}

        {isMobile && sidebarOpen && (
          <div className="fixed inset-0 z-40 flex">
            <Sidebar
              isCompact={true}
              mobile
              onClose={() => setSidebarOpen(false)}
            />
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
