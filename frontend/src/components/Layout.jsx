import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen flex">
      {showSidebar && <Sidebar />}

      <div className="flex-1 flex flex-col h-screen">
        {/* Navbar fixed at top */}
        <Navbar />

        {/* Main content takes remaining space */}
        <main className="flex-1  overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
