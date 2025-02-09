"use client";

import { useAtom } from "jotai";
import { data, categoryData, store } from '@/app/components/DataFetching';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/app/components/interface";
import { motion } from "framer-motion";
import CountUp from "react-countup";

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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 py-16 md:py-20 md:ml-64">
      <div className="w-full max-w-6xl space-y-6 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Dashboard</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleProductsClick}
            className="px-6 py-3 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition"
          >
            View Products
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Inventory Value Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6 text-center"
          >
            <h2 className="text-xl font-medium text-gray-700">Total Inventory Value</h2>
            <p className="text-4xl font-semibold text-green-500">
              $<CountUp end={totalAmount} duration={2} separator="," />
            </p>
          </motion.div>

          {/* Total Stock Items Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-6 text-center"
          >
            <h2 className="text-xl font-medium text-gray-700">Total Stock Items</h2>
            <p className="text-4xl font-semibold text-blue-500">
              <CountUp end={totalStock} duration={2} separator="," />
            </p>
          </motion.div>
        </div>

        {/* Category Breakdown */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-xl font-medium text-gray-700 text-center">Category Breakdown</h2>
          <div className="space-y-3 mt-4">
            {Object.entries(categoryAmounts)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => (
                <motion.div
                  key={category}
                  whileHover={{ scale: 1.02 }}
                  className="flex justify-between items-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                  <span className="text-lg text-gray-700">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                  <span className="text-lg font-medium text-indigo-600">
                    ${amount.toLocaleString()}
                  </span>
                </motion.div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
