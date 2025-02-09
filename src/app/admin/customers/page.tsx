"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { motion } from "framer-motion";
import anime from "animejs";
import { FaSearch, FaUser } from "react-icons/fa";

interface Customer {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
}

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const router = useRouter();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const query = `*[_type == "customer"]{
          "id": _id,
          fullName,
          email,
          phoneNumber,
          address,
          city
        }`;
        const result = await client.fetch(query);
        setCustomers(result);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    anime({
      targets: ".customer-row",
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(100),
      easing: "easeOutQuad",
    });
  }, [customers]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(customers.map((customer) => customer.city)))],
    [customers]
  );

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || customer.city === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 md:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h1 
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 flex items-center gap-3 drop-shadow-lg" 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <FaUser className="text-blue-600" /> Customers
      </motion.h1>

      <div className="relative w-full max-w-lg mt-4 sm:mt-6">
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          className="w-full p-2 sm:p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-md"
          placeholder="Search by Name or Email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-md ${
              selectedCategory === category ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-lg mt-4 sm:mt-6 w-full max-w-6xl">
        <table className="min-w-full table-auto text-xs sm:text-sm md:text-base">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">Full Name</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">Email</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left hidden sm:table-cell">Phone</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left hidden md:table-cell">Address</th>
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left">City</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="customer-row border-t hover:bg-blue-100 cursor-pointer hover:shadow-md transition-all"
                  onClick={() => router.push(`/customers/${customer.id}`)}
                >
                  <td className="px-2 sm:px-4 py-2 sm:py-3 font-semibold">{customer.fullName}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-700">{customer.email}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-700 hidden sm:table-cell">{customer.phoneNumber}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-700 hidden md:table-cell">{customer.address}</td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-700">{customer.city}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-3 text-center text-gray-500">No customers found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Customers;