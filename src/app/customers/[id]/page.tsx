"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { motion } from "framer-motion";
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity } from "react-icons/fa";

interface Customer {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
}

const CustomerDetail = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const query = `*[_type == "customer" && _id == "${id}"]{
          "id": _id,
          fullName,
          email,
          phoneNumber,
          address,
          city
        }`;
        const result = await client.fetch(query);
        setCustomer(result[0] || null);
      } catch (error) {
        console.error("Error fetching customer details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchCustomer();
  }, [id]);

  if (loading) {
    return <div className="text-center py-10 text-xl animate-pulse">Loading...</div>;
  }

  if (!customer) {
    return <div className="text-center py-10 text-xl text-red-500">Customer not found</div>;
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-100 to-teal-200 flex flex-col items-center justify-center p-10 md:ml-64"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="w-full max-w-4xl space-y-10 py-14 relative z-10 bg-white p-10 rounded-3xl shadow-2xl border border-gray-300 backdrop-blur-md">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-teal-700 text-lg font-semibold hover:underline hover:text-teal-900 transition duration-300"
        >
          <FaArrowLeft /> Back
        </button>
        <motion.h1 
          className="text-6xl font-extrabold text-gray-900 drop-shadow-xl flex items-center gap-4" 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <FaUser className="text-teal-600" /> {customer.fullName}
        </motion.h1>
        <div className="bg-gray-50 p-8 rounded-xl shadow-lg border-l-8 border-teal-600 flex flex-col gap-6 text-lg">
          <p className="flex items-center gap-3"><FaEnvelope className="text-teal-600" /> <strong>Email:</strong> {customer.email}</p>
          <p className="flex items-center gap-3"><FaPhone className="text-teal-600" /> <strong>Phone:</strong> {customer.phoneNumber}</p>
          <p className="flex items-center gap-3"><FaMapMarkerAlt className="text-teal-600" /> <strong>Address:</strong> {customer.address}</p>
          <p className="flex items-center gap-3"><FaCity className="text-teal-600" /> <strong>City:</strong> {customer.city}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerDetail;