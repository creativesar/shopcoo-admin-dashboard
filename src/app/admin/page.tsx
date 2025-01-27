"use client";

import { data } from '@/app/components/DataFetching';
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"; // Import framer-motion
import { Product } from "@/app/components/interface";

interface Dimensions {
  height: number;
  depth: number;
  width: number;
}

interface Rating {
  rate: number;
  count: number;
}

const Dashboard = () => {
  const router = useRouter();
  const [products] = useAtom(data); // Ensure that `data` is an array of Product objects
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [categoryWiseAmount, setCategoryWiseAmount] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    let total = 0;
    let totalQuantity = 0;
    let categoryAmounts: { [key: string]: number } = {};

    // Loop through products to calculate total inventory value and stock
    products.forEach((product: Product) => {
      const productTotal = product.stock * product.price; // Calculate total for each product
      total += productTotal; // Add to total inventory value
      totalQuantity += product.stock; // Add to total stock items

      // Group by category
      const category = product.category || 'Uncategorized';
      categoryAmounts[category] = (categoryAmounts[category] || 0) + productTotal;
    });

    // Set the calculated values to state
    setTotalAmount(total);
    setTotalStock(totalQuantity);
    setCategoryWiseAmount(categoryAmounts);
  }, [products]);

  const handleProductsClick = () => {
    router.push('/admin/product');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 md:ml-64">
      <motion.div
        className="w-full max-w-6xl space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <motion.div
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <h1 className="text-6xl font-extrabold text-black tracking-wide font-poppins">
            SHOP.CO Dashboard
          </h1>
          <motion.button
            onClick={handleProductsClick}
            className="px-8 py-4 bg-black text-white rounded-full shadow-lg hover:bg-gray-900 transition-all duration-300 transform hover:scale-110"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 250 }}
          >
            View Products
          </motion.button>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {/* Total Inventory Value (Spanning over two columns on larger screens) */}
          <motion.div
            className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-shadow transform hover:scale-105 col-span-1 lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className="text-3xl font-semibold text-gray-800 mb-4 font-poppins">
              Total Inventory Value
            </h2>
            <p className="text-5xl font-extrabold text-green-600">
              ${totalAmount.toLocaleString()}
            </p>
          </motion.div>

          {/* Total Stock Items (Spanning over two columns on larger screens) */}
          <motion.div
            className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-shadow transform hover:scale-105 col-span-1 lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <h2 className="text-3xl font-semibold text-gray-800 mb-4 font-poppins">
              Total Stock Items
            </h2>
            <p className="text-5xl font-extrabold text-blue-600">
              {totalStock.toLocaleString()}
            </p>
          </motion.div>

          {/* Category Breakdown (Single block with variable sizes for categories) */}
          <motion.div
            className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-shadow transform hover:scale-105 col-span-1 lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <h2 className="text-4xl font-extrabold text-gray-800 mb-8 font-poppins">
              Category Breakdown
            </h2>
            <div className="space-y-6">
              {Object.entries(categoryWiseAmount)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]: [string, number]) => (
                  <motion.div
                    key={category}
                    className="flex justify-between items-center p-6 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition-all transform hover:scale-105"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <span className="text-2xl font-semibold text-gray-700 font-poppins">
                      {category}
                    </span>
                    <span className="text-2xl font-bold text-indigo-600">
                      ${amount.toLocaleString()}
                    </span>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
