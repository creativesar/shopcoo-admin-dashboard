"use client";

import { useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaBox, FaChartBar, FaList, FaUser, FaTimes, FaBars, FaSignOutAlt } from "react-icons/fa";

const SideBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const handleNavigation = useCallback(async (path: string) => {
    if (pathname !== path) {
      setSidebarOpen(false);
      await router.push(path);
    }
  }, [router, pathname]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("isLoggedIn");
    router.push("/");
  }, [router]);

  const navItems = [
    { path: "/admin", icon: <FaChartBar />, label: "Dashboard" },
    { path: "/admin/product", icon: <FaBox />, label: "Products" },
    { path: "/admin/category", icon: <FaList />, label: "Categories" },
    { path: "/admin/customers", icon: <FaUser />, label: "Customers" },
    { path: "/admin/orders", icon: <FaUser />, label: "Orders" },
  ];

  return (
    <div className="z-50">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 bg-black text-white w-full fixed top-0 left-0 z-10 md:hidden shadow-lg">
        <h1 className="text-xl font-bold tracking-wide">SHOP.CO Admin</h1>
        <button
          onClick={handleToggleSidebar}
          className="text-white text-2xl focus:outline-none hover:scale-110 transition-transform"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 bg-gray-900 text-white h-full z-20 shadow-lg transform transition-transform duration-300 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold tracking-wide">SHOP.CO</h1>
          <button
            onClick={handleToggleSidebar}
            className="text-white text-2xl md:hidden focus:outline-none hover:scale-110 transition-transform"
          >
            <FaTimes />
          </button>
        </div>
        
        <nav className="flex flex-col p-4 gap-4">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center gap-3 text-sm font-medium p-3 rounded-lg transition-colors
                ${pathname === item.path 
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-sm font-medium hover:bg-red-600 p-3 rounded-lg transition-colors text-red-400 hover:text-white mt-auto"
          >
            <FaSignOutAlt /> Logout
          </button>
        </nav>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={handleToggleSidebar}
          className="fixed inset-0 bg-black opacity-50 md:hidden"
        />
      )}
    </div>
  );
};

export default SideBar;
