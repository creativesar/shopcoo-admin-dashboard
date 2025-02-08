"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

const Category = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryWiseProducts, setCategoryWiseProducts] = useState<{ [key: string]: Product[] }>({});

  const categories = useMemo(() => ["tshirt", "short", "jeans", "hoodie", "shirt"], []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = `*[_type == "products"]{
          "id": _id,
          name,
          price,
          "image": image.asset->url,
          category
        }`;
        const result = await client.fetch(query);
        setProducts(result);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const categorized: { [key: string]: Product[] } = Object.fromEntries(categories.map(cat => [cat, []]));

    products.forEach((product) => {
      const category = product.category?.toLowerCase();
      if (categories.includes(category)) {
        categorized[category].push(product);
      }
    });

    setCategoryWiseProducts(categorized);
  }, [products, categories]);

  const handleProductClick = (productId: string) => {
    router.push(`/admin/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 md:ml-64">
      {/* Stylish Heading */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
        className="relative text-center"
      >
        <motion.h1
          className="text-6xl font-extrabold text-gray-900 tracking-tight leading-tight"
          style={{
            textShadow: "0px 4px 10px rgba(0,0,0,0.15)",
          }}
        >
          SHOP.CO Categories
        </motion.h1>
        <motion.div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-indigo-500 rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </motion.div>

      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-6xl space-y-12 pt-16"
      >
        {categories.map((category, index) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-3xl font-bold text-gray-700 mb-6">
              {category.charAt(0).toUpperCase() + category.slice(1)} Products
            </h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {categoryWiseProducts[category]?.length > 0 ? (
                categoryWiseProducts[category].map((product) => (
                  <motion.div
                    key={product.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow transition-all hover:shadow-lg cursor-pointer"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="h-16 w-16 rounded-lg overflow-hidden border border-gray-300 relative"
                      >
                        <Image
                          src={product.image || "/placeholder.jpg"}
                          alt={product.name}
                          layout="fill"
                          objectFit="cover"
                        />
                      </motion.div>
                      <span className="text-lg font-semibold text-gray-800">
                        {product.name}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-indigo-600">
                      €{product.price.toLocaleString()}
                    </span>
                  </motion.div>
                ))
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center text-gray-500"
                >
                  No products available in this category.
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Category;
