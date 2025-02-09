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
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl overflow-hidden">
      <motion.main
        className="flex-1 w-full max-w-7xl mx-auto overflow-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-between mb-6"
        >
          <motion.h1
            whileHover={{ scale: 1.05 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight"
          >
            SHOP.CO - Products
          </motion.h1>
        </motion.div>

        <motion.div
          className="mb-6 w-full max-w-md mx-auto"
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
            className="w-full p-3 sm:p-4 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </motion.div>

        <motion.div
          className="overflow-x-auto bg-white/50 backdrop-blur-lg shadow-2xl rounded-xl p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <table className="w-full table-auto border-collapse text-xs sm:text-sm md:text-base">
            <thead className="bg-indigo-700 text-white">
              <tr>
                <th className="p-2 sm:p-3 text-left">Image</th>
                <th className="p-2 sm:p-3 text-left">Name</th>
                <th className="p-2 sm:p-3 text-left">Price</th>
                <th className="p-2 sm:p-3 text-left">Sizes</th>
                <th className="p-2 sm:p-3 text-left">Colors</th>
                <th className="p-2 sm:p-3 text-left">Status</th>
                <th className="p-2 sm:p-3 text-left">Details</th>
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
                    <td className="p-2 sm:p-3">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg overflow-hidden border border-gray-300"
                      >
                        <Image
                          src={product.imageUrl || "/placeholder.jpg"}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </motion.div>
                    </td>
                    <td className="p-2 sm:p-3 font-medium">{product.name}</td>
                    <td className="p-2 sm:p-3 font-bold text-indigo-600">${product.price}</td>
                    <td className="p-2 sm:p-3">{product.sizes?.join(", ") || "N/A"}</td>
                    <td className="p-2 sm:p-3">{product.colors?.join(", ") || "N/A"}</td>
                    <td className="p-2 sm:p-3">
                      <span className={`px-2 py-1 rounded-full text-sm ${product.isNew ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-800"}`}>
                        {product.isNew ? "New" : "Regular"}
                      </span>
                    </td>
                    <td className="p-2 sm:p-3">
                      <motion.button whileHover={{ scale: 1.05 }} className="text-indigo-600 hover:text-indigo-800 font-semibold transition-all">
                        View Details
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-500">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>
      </motion.main>
    </div>
  );
}