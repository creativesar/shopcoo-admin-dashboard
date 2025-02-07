"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { motion } from "framer-motion";
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
      className="min-h-screen bg-white flex flex-col items-center justify-center p-10 md:ml-64 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-500 opacity-20 blur-3xl rounded-full"></div>
      <div className="w-full max-w-6xl space-y-10 py-14 relative z-10">
        <motion.h1 
          className="text-6xl font-extrabold text-gray-900 flex items-center gap-4 drop-shadow-lg" 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <FaUser className="text-teal-600" /> Customers
        </motion.h1>

        <motion.div 
          className="mb-6 relative w-full md:w-1/3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-teal-500 transition-all duration-300 shadow-lg hover:shadow-2xl bg-white"
            placeholder="Search by Name or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </motion.div>

        <motion.div 
          className="flex space-x-4 overflow-x-auto pb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 ${
                selectedCategory === category ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </motion.div>

        <div className="overflow-x-auto bg-white rounded-xl shadow-2xl backdrop-blur-lg">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-teal-600 text-white text-xl">
                <th className="px-6 py-4 text-left">Full Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Phone</th>
                <th className="px-6 py-4 text-left">Address</th>
                <th className="px-6 py-4 text-left">City</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer, index) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-t hover:bg-teal-100 cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => router.push(`/customers/${customer.id}`)}
                  >
                    <td className="px-6 py-4 font-semibold">{customer.fullName}</td>
                    <td className="px-6 py-4 text-gray-700">{customer.email}</td>
                    <td className="px-6 py-4 text-gray-700">{customer.phoneNumber}</td>
                    <td className="px-6 py-4 text-gray-700">{customer.address}</td>
                    <td className="px-6 py-4 text-gray-700">{customer.city}</td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500 text-xl">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Customers;
