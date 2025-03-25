import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { format } from "date-fns";
import "./DashboardPage.css";
import Sidebar from "./Sidebar";

Chart.register(...registerables);

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [productSalesData, setProductSalesData] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState({
    month: "",
    totalSales: 0,
    totalPurchase: 0,
    profitOrLoss: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/sales-report")
      .then((res) => res.json())
      .then((data) => {
        setSalesData(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching sales report");
        setLoading(false);
      });

    fetch("http://localhost:5000/api/product-sales")
      .then((res) => res.json())
      .then((data) => {
        const formattedData = data.map((item) => ({
          ...item,
          total_sold: Number(item.total_sold),
          remaining_stock: Number(item.remaining_stock),
        }));
        setProductSalesData(formattedData);
      })
      .catch(() => {
        setError("Error fetching product sales data");
        setLoading(false);
      });

    fetch("http://localhost:5000/api/monthly-stats")
      .then((res) => res.json())
      .then((data) => {
        setMonthlyStats(data);
      })
      .catch(() => {
        setError("Error fetching monthly statistics");
      });
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  // Sales Trends (Line Chart)
  const salesChartData = {
    labels: salesData.map((data) => format(new Date(data.sales_date), "MM/dd")),
    datasets: [
      {
        label: "Total Sales (₹)",
        data: salesData.map((data) => data.total_sales),
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        fill: true,
      },
    ],
  };

  // Stock Overview (Bar Chart)
  const productChartData = {
    labels: productSalesData.map((data) => data.product_name),
    datasets: [
      {
        label: "Quantity Sold",
        data: productSalesData.map((data) => data.total_sold),
        backgroundColor: "#4CAF50",
      },
      {
        label: "Remaining Stock",
        data: productSalesData.map((data) => data.remaining_stock),
        backgroundColor: "#FF5733",
      },
    ],
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-container">
        
        {/* Centered Month Display */}
        <div className="month-display">
          {monthlyStats?.currentMonth || "Loading..."}
        </div>

        {/* Monthly Stats */}
        <div className="stats-container">
          <div className="stat-card sales">Total Sales: ₹{monthlyStats.totalSales}</div>
          <div className="stat-card purchase">Total Purchase Cost: ₹{monthlyStats.totalPurchase}</div>
          <div className={`stat-card profit ${monthlyStats.profitOrLoss >= 0 ? "profit" : "loss"}`}>
            {monthlyStats.profitOrLoss >= 0 ? "Profit" : "Loss"}: ₹{monthlyStats.profitOrLoss}
          </div>
        </div>

        {/* Charts Row (Side-by-Side) */}
        <div className="charts-row">
          <div className="chart-container">
            <h3>Sales Trends</h3>
            <Line data={salesChartData} />
          </div>

          <div className="chart-container">
            <h3>Stock Overview</h3>
            <Bar data={productChartData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
