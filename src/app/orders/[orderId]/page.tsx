import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Order {
  _id: string;
  customer: {
    fullName: string;
  };
  totalAmount: number;
  shippingAddress: string;
  status: string;
  orderDate: string;
  orderId: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default async function OrderDetails({ params }: { params: { orderId: string } }) {
  console.log("Received params:", params);

  const orderId = params.orderId;

  if (!orderId) {
    console.error("Error: Order ID is undefined");
    return <p className="text-red-500 text-center">Error: Order ID is missing</p>;
  }

  const query = `*[_type == "order" && orderId == $orderId][0]`;
  const order: Order | null = await client.fetch(query, { orderId: `${orderId}` });

  if (!order) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:ml-64 flex flex-col items-center animate-fade-in">
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg transform transition duration-500 ease-in-out scale-100 hover:scale-105">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Order Details</h1>

        <div className="space-y-4">
          <p className="text-lg font-semibold">Order ID: <span className="text-teal-600">{order.orderId}</span></p>
          <p className="text-lg font-semibold">Customer: {order.customer.fullName}</p>
          <p className="text-lg font-semibold">Status: <span className={`font-bold ${order.status === 'delivered' ? 'text-green-500' : 'text-yellow-500'}`}>{order.status.toUpperCase()}</span></p>
          <p className="text-lg font-semibold">Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
          <p className="text-lg font-semibold">Total Amount: <span className="text-teal-600">${order.totalAmount}</span></p>
          <p className="text-lg font-semibold">Shipping Address: {order.shippingAddress}</p>
        </div>
      </div>

      <Link href="/admin/Orders">
        <button className="mt-6 bg-black text-white py-2 px-6 rounded-lg shadow-md hover:bg-gray-800 transition transform duration-300 ease-in-out hover:scale-105">
          Back to Orders
        </button>
      </Link>
    </div>
  );
}