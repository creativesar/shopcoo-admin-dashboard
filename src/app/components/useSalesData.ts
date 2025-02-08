"use client";

import { useState, useEffect } from 'react';

const useSalesData = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    // Fetch sales data from an API or other source
    fetch('/api/sales')
      .then(response => response.json())
      .then(data => setSalesData(data))
      .catch(error => console.error('Error fetching sales data:', error));
  }, []);

  return salesData;
};

export default useSalesData;
