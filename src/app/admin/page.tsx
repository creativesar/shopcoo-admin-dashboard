"use client";

import { useAtom } from "jotai";
import { data, categoryData, store } from '@/app/components/DataFetching';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Product } from "@/app/components/interface";

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

  const parentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-6 md:ml-64">
      <motion.div
        className="w-full max-w-7xl space-y-12"
        variants={parentVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0"
          variants={childVariants}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-wide font-poppins">
            SHOP.CO Dashboard
          </h1>
          <motion.button
            onClick={handleProductsClick}
            className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 focus:ring-4 focus:ring-indigo-300 focus:outline-none"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            View Products
          </motion.button>
        </motion.div>

        {/* Bento Grid Layout */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          variants={parentVariants}
        >
          {/* Total Inventory Value */}
          <motion.div
            className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transform hover:scale-105 col-span-1 lg:col-span-2 transition-all"
            variants={childVariants}
          >
            <h2 className="text-3xl font-semibold text-gray-800 mb-4 font-poppins">
              Total Inventory Value
            </h2>
            <p className="text-6xl font-extrabold text-green-500">
              ${totalAmount.toLocaleString()}
            </p>
          </motion.div>

          {/* Total Stock Items */}
          <motion.div
            className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transform hover:scale-105 col-span-1 lg:col-span-2 transition-all"
            variants={childVariants}
          >
            <h2 className="text-3xl font-semibold text-gray-800 mb-4 font-poppins">
              Total Stock Items
            </h2>
            <p className="text-6xl font-extrabold text-blue-500">
              {totalStock.toLocaleString()}
            </p>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div
            className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all col-span-1 lg:col-span-3 transform hover:scale-105"
            variants={childVariants}
          >
            <h2 className="text-4xl font-extrabold text-gray-800 mb-8">
              Category Breakdown
            </h2>
            <motion.div
              className="space-y-6"
              variants={parentVariants}
            >
              {Object.entries(categoryAmounts)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => (
                  <motion.div
                    key={category}
                    className="flex justify-between items-center p-6 bg-gray-100 rounded-lg hover:bg-gray-200 transition-transform transform hover:scale-105"
                    variants={childVariants}
                  >
                    <span className="text-2xl font-semibold text-gray-700">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </span>
                    <span className="text-2xl font-bold text-indigo-600">
                      ${amount.toLocaleString()}
                    </span>
                  </motion.div>
                ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
