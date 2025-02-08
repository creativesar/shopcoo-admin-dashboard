"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FaBox,
  FaChartBar,
  FaList,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaShoppingBag,
} from "react-icons/fa";
import { motion } from "framer-motion";

const SideBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const sidebarRef = useRef(null);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  interface NavItem {
    path: string;
    icon: JSX.Element;
    label: string;
  }

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
        className="fixed top-5 left-5 bg-black text-white p-3 rounded-full shadow-xl z-50 focus:outline-none hover:scale-110 transition-transform"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaBars size={24} />
      </motion.button>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-white text-gray-900 z-40 shadow-xl w-60 p-6 transition-all duration-500 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* SHOPCO Branding */}
        <motion.div
          className="flex items-center gap-3 text-gray-900 text-2xl font-bold mt-16 mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FaShoppingBag className="text-black" size={28} />
          <span>SHOPCO</span>
        </motion.div>

        <nav className="flex flex-col gap-5 mt-6">
          {/* Navigation Items */}
          {navItems.map((item, index) => (
            <motion.button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center gap-4 text-lg font-semibold p-3 rounded-lg transition-all ${
                pathname === item.path
                  ? "bg-black text-white shadow-md scale-105"
                  : "text-gray-700 hover:bg-gray-200 hover:text-black hover:shadow-md"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.icon}
              <span>{item.label}</span>
            </motion.button>
          ))}
        </nav>

        {/* Logout Button */}
        <motion.button
          onClick={handleLogout}
          className="absolute bottom-8 left-6 right-6 flex items-center gap-4 text-lg font-semibold bg-red-500 p-3 rounded-lg text-white shadow-lg hover:bg-red-600 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </motion.button>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <motion.div
          onClick={handleToggleSidebar}
          className="fixed inset-0 bg-black opacity-40 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
        />
      )}
    </div>
  );
};

export default SideBar;
