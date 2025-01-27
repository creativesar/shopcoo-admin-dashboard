"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Import Next.js Image component
import { client } from "@/sanity/lib/client";

const Category = () => {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [categoryWiseProducts, setCategoryWiseProducts] = useState<{ [key: string]: any[] }>({});
  const categories = ['tshirt', 'short', 'jeans', 'hoodie', 'shirt'];

  useEffect(() => {
    // Fetch products from Sanity
    const fetchProducts = async () => {
      const query = `*[_type == "products"]{
        sizes, price, name, description,
        "image": image.asset->url,
        "id": _id,
        colors, isNew, category
      }`;

      const result = await client.fetch(query);
      setProducts(result);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let categoryProducts: { [key: string]: any[] } = {};

    products.forEach((product) => {
      const category = product.category || 'Uncategorized';
      if (!categoryProducts[category]) {
        categoryProducts[category] = [];
      }
      categoryProducts[category].push(product);
    });

    // Ensure all categories are included in the breakdown, even if there are no products in some
    categories.forEach((category) => {
      if (!categoryProducts[category]) {
        categoryProducts[category] = [];
      }
    });

    setCategoryWiseProducts(categoryProducts);
  }, [products, categories]); // Added categories to dependency array

  const handleProductClick = (productId: string) => {
    router.push(`/admin/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-6 md:ml-64">
      <div className="w-full max-w-6xl space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-5xl font-extrabold text-black">
            SHOP.CO Categories
          </h1>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category} className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-extrabold text-gray-700 mb-6">
                {category.charAt(0).toUpperCase() + category.slice(1)} Products
              </h2>
              <div className="space-y-6">
                {categoryWiseProducts[category]?.length > 0 ? (
                  categoryWiseProducts[category].map((product) => (
                    <div
                      key={product.id}
                      className="flex justify-between items-center p-6 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors shadow-md"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 rounded-full overflow-hidden border border-gray-300 relative">
                          <Image
                            src={product.image || "/placeholder.jpg"}
                            alt={product.name}
                            layout="fill"
                            objectFit="cover"
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <span className="text-xl font-semibold text-gray-700">
                          {product.name}
                        </span>
                      </div>
                      <span className="text-xl font-bold text-indigo-600">
                        €{product.price.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleProductClick(product.id)}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        View Details
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No products available in this category.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
