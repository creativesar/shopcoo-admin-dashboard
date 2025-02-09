"use client";

import { client } from "@/sanity/lib/client";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
import anime from "animejs";

interface Order {
  _id: string;
  customer: {
    fullName: string;
  };
  totalAmount: number;
  shippingAddress: string;
  status: string;
  orderDate: string;
  orderId: string;
  items: Array<{
    quantity: number;
  }>;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const query = `*[_type == "order"]{
          _id,
          customer->{ fullName },
          totalAmount,
          status,
          orderDate,
          orderId,
          items,
          shippingAddress
        }`;
        const data = await client.fetch(query);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    anime({
      targets: "tr",
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(100),
      easing: "easeOutQuad",
    });
  }, [orders]);

  const filteredOrders = orders.filter(
    (order) =>
      (order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "" || order.status === statusFilter)
  );

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col items-center w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 md:mb-10 text-center tracking-wide drop-shadow-lg">
        Orders
      </h1>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6 w-full max-w-4xl px-4">
        <input
          type="text"
          className="w-full p-3 sm:p-4 border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all"
          placeholder="Search by Order ID or Customer Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <FaSpinner className="animate-spin text-blue-500" size={40} />
        </div>
      ) : (
        <motion.div 
          className="overflow-x-auto bg-white shadow-2xl rounded-2xl p-4 md:p-6 w-full max-w-6xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <table className="w-full text-left text-gray-600 border-collapse text-xs sm:text-sm md:text-base">
            <thead className="bg-gradient-to-r from-blue-300 to-blue-500 text-white">
              <tr>
                <th className="px-2 sm:px-4 md:px-6 py-3 rounded-tl-2xl">Order ID</th>
                <th className="px-2 sm:px-4 md:px-6 py-3">Customer</th>
                <th className="px-2 sm:px-4 md:px-6 py-3">Status</th>
                <th className="px-2 sm:px-4 md:px-6 py-3">Items</th>
                <th className="px-2 sm:px-4 md:px-6 py-3">Date</th>
                <th className="px-2 sm:px-4 md:px-6 py-3 rounded-tr-2xl">Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <motion.tr 
                    key={order._id} 
                    className="border-b hover:bg-gray-100 transition-all cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                  >
                    <td className="px-2 sm:px-4 md:px-6 py-3 text-blue-500 font-semibold">
                      <Link href={`/orders/${order.orderId}`}>{order.orderId}</Link>
                    </td>
                    <td className="px-2 sm:px-4 md:px-6 py-3 font-medium">{order.customer?.fullName || "N/A"}</td>
                    <td className="px-2 sm:px-4 md:px-6 py-3 font-bold" style={{ color: order.status === 'delivered' ? 'green' : 'red' }}>{order.status.toUpperCase()}</td>
                    <td className="px-2 sm:px-4 md:px-6 py-3">{order.items.length}</td>
                    <td className="px-2 sm:px-4 md:px-6 py-3">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="px-2 sm:px-4 md:px-6 py-3 font-semibold">${order.totalAmount.toFixed(2)}</td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-6">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      )}
    </motion.div>
  );
}