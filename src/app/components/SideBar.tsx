"use client";

import Link from "next/link";
import { useState } from "react";
import { FaBox, FaChartBar, FaList, FaUser, FaTimes, FaBars, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

const SideBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev); // Toggle the sidebar state
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/");
  };

  return (
    <div className="z-50">
      {/* Header for Mobile - Shows Menu Button */}
      <div className="flex items-center justify-between p-4 bg-blue-700 text-white w-full fixed top-0 left-0 z-10 md:hidden shadow-lg">
        <h1 className="text-xl font-bold tracking-wide">SHOP.CO Admin</h1>
        <button
          onClick={handleToggleSidebar} // Toggle sidebar on button click
          className="text-white text-2xl focus:outline-none hover:scale-110 transition-transform"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />} {/* Change icon based on sidebar state */}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 bg-gray-900 text-white h-full z-20 shadow-lg transform transition-transform duration-300 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`} // Toggle class based on sidebarOpen state
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
          <Link href="/admin" className="flex items-center gap-3 text-sm font-medium hover:bg-gray-800 p-3 rounded-lg transition-colors">
            <FaChartBar className="text-lg" /> Dashboard
          </Link>
          <Link href="/admin/product" className="flex items-center gap-3 text-sm font-medium hover:bg-gray-800 p-3 rounded-lg transition-colors">
            <FaBox className="text-lg" /> Products
          </Link>
          <Link href="/admin/category" className="flex items-center gap-3 text-sm font-medium hover:bg-gray-800 p-3 rounded-lg transition-colors">
            <FaList className="text-lg" /> Categories
          </Link>
          <Link href="/admin/customer" className="flex items-center gap-3 text-sm font-medium hover:bg-gray-800 p-3 rounded-lg transition-colors">
            <FaUser className="text-lg" /> Customers
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 text-sm font-medium hover:bg-gray-800 p-3 rounded-lg transition-colors">
            <FaUser className="text-lg" /> Orders
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-sm font-medium hover:bg-red-600 p-3 rounded-lg transition-colors text-red-400"
          >
            <FaSignOutAlt className="text-lg" /> Logout
          </button>
        </nav>
      </aside>

      {/* Overlay - Closes Sidebar when clicked */}
      {sidebarOpen && (
        <div
          onClick={handleToggleSidebar} // Close sidebar when overlay is clicked
          className="fixed inset-0 bg-black opacity-50 md:hidden"
        ></div>
      )}
    </div>
  );
};

export default SideBar;
