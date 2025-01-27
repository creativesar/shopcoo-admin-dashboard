"use client";

import { atom, Provider } from 'jotai';
import { createStore } from 'jotai/vanilla';
import { Product } from "./interface";
import { client } from "@/sanity/lib/client";
import { useAtom } from "jotai";
import { useEffect } from 'react';

// Create a single store instance
export const store = createStore();

// Define atoms for different data types
export const data = atom<Product[]>([]);
export const categoryData = atom<{ [key: string]: number }>({});

const DataFetching = () => {
  const [, setProducts] = useAtom(data);
  const [, setCategoryAmounts] = useAtom(categoryData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products with category information
        const query = `*[_type == "products"]{
          "id": _id,
          name,
          price,
          "image": image.asset->url,
          category,
          stock,
          "totalAmount": price * stock
        }`;
        
        const products = await client.fetch(query);
        setProducts(products);

        // Calculate category-wise amounts
        const categoryAmounts = products.reduce((acc: { [key: string]: number }, product: any) => {
          const category = product.category || 'Uncategorized';
          acc[category] = (acc[category] || 0) + (product.totalAmount || 0);
          return acc;
        }, {});

        setCategoryAmounts(categoryAmounts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [setProducts, setCategoryAmounts]);

  return null;
};

// Create a wrapper component for Jotai Provider
export function JotaiProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <DataFetching />
      {children}
    </Provider>
  );
}

export default DataFetching;
