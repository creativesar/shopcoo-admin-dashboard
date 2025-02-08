"use client";

import { useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaBox, FaChartBar, FaList, FaUser, FaSignOutAlt, FaBars, FaShoppingBag } from "react-icons/fa";
import { motion } from "framer-motion";

const SideBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleNavigation = useCallback(
    async (path: string) => {
      if (pathname !== path) {
        setSidebarOpen(false);
        await router.push(path);
      }
    },
    [router, pathname]
  );

  const handleLogout = useCallback(() => {
    localStorage.removeItem("isLoggedIn");
    router.push("/");
  }, [router]);

  const navItems = [
    { path: "/admin", icon: <FaChartBar />, label: "Dashboard" },
    { path: "/admin/product", icon: <FaBox />, label: "Products" },
    { path: "/admin/category", icon: <FaList />, label: "Categories" },
    { path: "/admin/customers", icon: <FaUser />, label: "Customers" },
    { path: "/admin/Orders", icon: <FaUser />, label: "Orders" },
  ];

  return (
    <div className="z-50">
      {/* Sidebar Toggle Button */}
      <motion.button
        onClick={handleToggleSidebar}
        className="fixed top-5 left-5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-full shadow-xl z-50 focus:outline-none hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaBars size={24} />
      </motion.button>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: sidebarOpen ? "0%" : "-100%" }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900 to-black text-white z-40 shadow-2xl w-72 p-6 rounded-r-3xl border-r-4 border-indigo-600"
      >
        {/* SHOPCO Branding */}
        <motion.div
          className="flex items-center gap-3 text-white text-2xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FaShoppingBag className="text-indigo-400" size={28} />
          {sidebarOpen && <span>SHOPCO</span>}
        </motion.div>

        <nav className="flex flex-col gap-5 h-full">
          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-4 text-lg font-semibold bg-red-500 p-4 rounded-lg transition-all text-white shadow-lg hover:bg-red-600"
            whileHover={{ scale: 1.05, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSignOutAlt /> {sidebarOpen && "Logout"}
          </motion.button>

          {navItems.map((item) => (
            <motion.button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center gap-4 text-lg font-semibold p-4 rounded-lg transition-all 
                ${pathname === item.path 
                  ? "bg-indigo-600 text-white shadow-xl scale-105" 
                  : "text-gray-300 hover:bg-indigo-600 hover:text-white"}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.icon}
              {sidebarOpen && item.label}
            </motion.button>
          ))}
        </nav>
      </motion.aside>

      {/* Overlay */}
      {sidebarOpen && (
        <motion.div
          onClick={handleToggleSidebar}
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
        />
      )}
    </div>
  );
};

export default SideBar;
