"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/app/components/interface";
import { client } from "@/sanity/lib/client";
import { motion } from "framer-motion"; // Import framer-motion

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Fetch products from Sanity
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

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/");
  };

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 overflow-hidden">
      {/* Main Content */}
      <motion.main
        className="flex-1 p-8 md:ml-64 z-10 overflow-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between mb-8 py-12">
          <motion.h1
            className="text-5xl font-extrabold text-gray-900"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Products
          </motion.h1>
          <motion.button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-all transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            Logout
          </motion.button>
        </div>

        {/* Search Bar */}
        <motion.div
          className="mb-6 max-w-xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search products by name or color..."
            className="w-full p-4 border rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all transform hover:scale-105"
          />
        </motion.div>

        {/* Products Table */}
        <motion.div
          className="overflow-auto bg-white shadow-xl rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 text-white">
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
                filteredProducts.map((product) => (
                  <motion.tr
                    key={product._id}
                    className="border-b hover:bg-gray-100 transition-all transform hover:scale-105"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <td className="p-4">
                      <div className="h-14 w-14 rounded-full overflow-hidden border border-gray-300 relative">
                        <Image
                          src={product.imageUrl || "/placeholder.jpg"}
                          alt={product.name}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-full"
                        />
                      </div>
                    </td>
                    <td className="p-4 font-medium text-gray-700">{product.name}</td>
                    <td className="p-4 font-bold text-green-600">${product.price}</td>
                    <td className="p-4 font-medium text-gray-700">
                      {product.sizes?.join(", ") || "N/A"}
                    </td>
                    <td className="p-4 font-medium text-gray-700">
                      {product.colors?.join(", ") || "N/A"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                          product.isNew
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {product.isNew ? "New" : "Regular"}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => {
                          /* Add view details handler */
                        }}
                        className="text-blue-600 hover:text-blue-800 font-semibold transition-all transform hover:scale-105"
                      >
                        View Details
                      </button>
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
