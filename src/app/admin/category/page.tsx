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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative text-center w-full"
      >
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight"
        >
          SHOP.CO Categories
        </motion.h1>
        <motion.div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 sm:w-32 h-1 bg-indigo-500 rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-7xl space-y-6 sm:space-y-8 md:space-y-10 pt-6 sm:pt-8 md:pt-12"
      >
        {categories.map((category, index) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-4 sm:mb-6">
              {category.charAt(0).toUpperCase() + category.slice(1)} Products
            </h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              {categoryWiseProducts[category]?.length > 0 ? (
                categoryWiseProducts[category].map((product) => (
                  <motion.div
                    key={product.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col items-center p-3 sm:p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-lg overflow-hidden border border-gray-300 relative"
                    >
                      <Image
                        src={product.image || "/placeholder.jpg"}
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                        className="hover:scale-105 transition-transform"
                      />
                    </motion.div>
                    <span className="mt-3 text-sm sm:text-base md:text-lg font-semibold text-gray-800 text-center">
                      {product.name}
                    </span>
                    <span className="mt-1 text-sm sm:text-base md:text-lg font-bold text-indigo-600">
                      €{product.price.toLocaleString()}
                    </span>
                  </motion.div>
                ))
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center text-gray-500 col-span-full"
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
