"use client";

import { useAtom } from "jotai";
import { data, categoryData, store } from '@/app/components/DataFetching';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/app/components/interface";
import SalesChart from "./SalesChart/page";
import { motion } from "framer-motion";

const Dashboard = () => {
  const router = useRouter();
  const [products] = useAtom(data, { store });
  const [categoryAmounts] = useAtom(categoryData, { store });
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalStock, setTotalStock] = useState(0);

  useEffect(() => {
    let total = 0;
    let totalQuantity = 0;

    products.forEach((product: Product) => {
      const productTotal = product.stock * product.price;
      total += productTotal;
      totalQuantity += product.stock;
    });

    setTotalAmount(total);
    setTotalStock(totalQuantity);
  }, [products]);

  const handleProductsClick = () => {
    router.push('/admin/product');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 py-20 md:ml-64">
      {/* Fixed SalesChart at the Top */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-5xl bg-white rounded-md shadow p-6 mb-6"
      >
        <h2 className="text-lg font-medium text-gray-700 text-center">Sales Overview</h2>
        <SalesChart />
      </motion.div>
      
      <div className="w-full max-w-5xl space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleProductsClick}
            className="px-5 py-2 bg-indigo-500 text-white rounded-md shadow hover:bg-indigo-600 transition"
          >
            View Products
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-md shadow p-6 text-center"
          >
            <h2 className="text-lg font-medium text-gray-700">Total Inventory Value</h2>
            <p className="text-3xl font-semibold text-green-500">${totalAmount.toLocaleString()}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-md shadow p-6 text-center"
          >
            <h2 className="text-lg font-medium text-gray-700">Total Stock Items</h2>
            <p className="text-3xl font-semibold text-blue-500">{totalStock.toLocaleString()}</p>
          </motion.div>
        </div>

        {/* Category Breakdown */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white rounded-md shadow p-6"
        >
          <h2 className="text-lg font-medium text-gray-700 text-center">Category Breakdown</h2>
          <div className="space-y-3 mt-4">
            {Object.entries(categoryAmounts)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => (
                <motion.div
                  key={category}
                  whileHover={{ scale: 1.02 }}
                  className="flex justify-between items-center p-4 bg-gray-100 rounded-md hover:bg-gray-200 transition"
                >
                  <span className="text-md text-gray-700">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                  <span className="text-md font-medium text-indigo-600">${amount.toLocaleString()}</span>
                </motion.div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
