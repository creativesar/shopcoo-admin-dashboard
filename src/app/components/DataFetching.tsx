"use client";

import { atom, Provider } from 'jotai';
import { createStore } from 'jotai/vanilla';
import { Product } from "./interface";
import { client } from "@/sanity/lib/client";
import { useAtom } from "jotai";
import { useEffect } from 'react';

// Create a single store instance
export const store = createStore();

// Define your atoms
export const data = atom<Product[]>([]);

const DataFetching = () => {
  const [, setProducts] = useAtom(data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = `*[_type == "products"]{
          sizes, price, name, description,
          "image": image.asset->url,
          "id": _id,
          colors, isNew, stock
        }`;
        const fetchedProducts = await client.fetch(query);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, []); // Only run once on mount

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
