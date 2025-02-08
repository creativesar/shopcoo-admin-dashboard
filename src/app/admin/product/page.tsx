"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/app/components/interface";
import { client } from "@/sanity/lib/client";
import { motion } from "framer-motion";

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      const query = `*[_type == "products"]{
        sizes, price, name, description,
        "imageUrl": image.asset->url,
        "id": _id,
        colors, isNew
      }`;
      const result = await client.fetch(query);
      setProducts(result);
      setFilteredProducts(result);
    };

    fetchProducts();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      (product.colors?.join(", ") || "").toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 backdrop-blur-lg overflow-hidden p-6 rounded-xl shadow-2xl">
      {/* Main Content */}
      <motion.main
        className="flex-1 p-8 md:ml-64 z-10 overflow-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Animated Heading */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center justify-between mb-8"
        >
          <motion.h1
            whileHover={{ scale: 1.05 }}
            className="text-5xl font-extrabold text-gray-900 tracking-tight leading-tight drop-shadow-lg"
          >
            SHOP.CO - Products
          </motion.h1>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="mb-6 max-w-xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <motion.input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search products by name or color..."
            whileFocus={{ scale: 1.05 }}
            className="w-full p-4 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white/30 backdrop-blur-md"
          />
        </motion.div>

        {/* Products Table */}
        <motion.div
          className="overflow-auto bg-white/50 backdrop-blur-lg shadow-2xl rounded-xl p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-700 text-white rounded-t-lg">
              <tr>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Sizes</th>
                <th className="p-4 text-left">Colors</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="border-b hover:bg-gray-200 transition-all"
                  >
                    <td className="p-4">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="h-14 w-14 rounded-lg overflow-hidden border border-gray-300 relative"
                      >
                        <Image
                          src={product.imageUrl || "/placeholder.jpg"}
                          alt={product.name}
                          layout="fill"
                          objectFit="cover"
                        />
                      </motion.div>
                    </td>
                    <td className="p-4 font-medium text-gray-700">{product.name}</td>
                    <td className="p-4 font-bold text-indigo-600">${product.price}</td>
                    <td className="p-4 font-medium text-gray-700">
                      {product.sizes?.join(", ") || "N/A"}
                    </td>
                    <td className="p-4 font-medium text-gray-700">
                      {product.colors?.join(", ") || "N/A"}
                    </td>
                    <td className="p-4">
                      <motion.span
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          product.isNew
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {product.isNew ? "New" : "Regular"}
                      </motion.span>
                    </td>
                    <td className="p-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold transition-all"
                      >
                        View Details
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <td colSpan={7} className="p-4 text-center text-gray-500">
                    No products found.
                  </td>
                </motion.tr>
              )}
            </tbody>
          </table>
        </motion.div>
      </motion.main>
    </div>
  );
}