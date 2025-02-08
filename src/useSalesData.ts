'use client';

import { useState, useEffect } from 'react';

const useSalesData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch or generate sales data here
    const fetchData = async () => {
      const response = await fetch('/api/sales');
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, []);

  return data;
};

export default useSalesData;
