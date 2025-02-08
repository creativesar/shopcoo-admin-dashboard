import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client"; // Sanity ka client import karna zaroori hai

const useSalesData = () => {
  const [salesData, setSalesData] = useState<{ date: string; total: number }[]>([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const query = `*[_type == "order"]{ orderDate, totalAmount }`;
        const orders = await client.fetch(query);

        const salesMap: Record<string, number> = {};

        orders.forEach((order: { orderDate: string; totalAmount: number }) => {
          const date = new Date(order.orderDate).toLocaleDateString(); // Date ko format kar rahe hain
          salesMap[date] = (salesMap[date] || 0) + order.totalAmount; // Total add kar rahe hain
        });

        const formattedSales = Object.entries(salesMap).map(([date, total]) => ({
          date,
          total,
        }));

        setSalesData(formattedSales);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, []);

  return salesData;
};

export default useSalesData;
