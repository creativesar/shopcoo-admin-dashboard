import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import useSalesData from "@/app/components/useSalesData"; // Ensure this path is correct

const SalesChart = () => {
  const salesData = useSalesData();

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:scale-105 w-full max-w-4xl">
      <h2 className="text-3xl font-semibold text-gray-800 mb-4 font-poppins">Sales Over Time</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={salesData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#4F46E5" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
