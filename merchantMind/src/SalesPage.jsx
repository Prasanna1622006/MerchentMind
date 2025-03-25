import React, { useState, useEffect } from "react";
import "./SalesPage.css";
import Sidebar from "./Sidebar";

const SalesPage = () => {
  const [sales, setSales] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(""); // Only one date filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    product_id: "",
    quantity: "",
    total_price: "",
    sale_date: "",
    customer_name: "",
    payment_method: "Cash",
  });

  // Fetch sales data
  const fetchSales = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/sales");
      if (!response.ok) throw new Error("Failed to fetch sales data");
      const data = await response.json();
      setSales(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit sale form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Sale added successfully!");
        fetchSales(); // Refresh sales list
        setIsFormVisible(false);
        setFormData({
          product_id: "",
          quantity: "",
          total_price: "",
          sale_date: "",
          customer_name: "",
          payment_method: "Cash",
        });
      } else {
        const data = await response.json();
        alert(`Failed to add sale: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Apply search and date filters
  const filteredSales = sales.filter((sale) => {
    const query = searchQuery.toLowerCase().trim(); // Normalize search query
    const saleDate = new Date(sale.sales_date).toISOString().split("T")[0];
  
    // Ensure all values are strings and normalize them
    const matchesQuery =
      !searchQuery ||
      sale.sales_id.toString().includes(query) ||
      sale.product_id.toString().includes(query) ||
      sale.customer_name.toLowerCase().includes(query) ||
      sale.payment_method.toLowerCase().includes(query) ||
      (sale.p_name && sale.p_name.toLowerCase().includes(query)); // Fix for product name search
  
    const matchesDate = !startDate || saleDate === startDate;
  
    return matchesQuery && matchesDate;
  });
  

  if (loading) return <p>Loading sales data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="sales-container">
        <header className="sales-header">
          <div className="search-bar-container">
            <input
              type="text"
              className="search-bar"
              placeholder="Search by ID, Name, etc."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <input
              type="date"
              className="date-filter"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <button className="add-sale-btn" onClick={() => setIsFormVisible(!isFormVisible)}>
            Add New Sale
          </button>
        </header>

        {isFormVisible && (
          <form onSubmit={handleSubmit} className="add-product-form">
            <input type="number" name="product_id" value={formData.product_id} onChange={handleInputChange} placeholder="Product ID" required />
            <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} placeholder="Quantity" required />
            <input type="number" step="0.01" name="total_price" value={formData.total_price} onChange={handleInputChange} placeholder="Total Price" required />
            <input type="text" name="customer_name" value={formData.customer_name} onChange={handleInputChange} placeholder="Customer Name" required />
            <select name="payment_method" className="payment" value={formData.payment_method} onChange={handleInputChange} required>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Net Banking">Net Banking</option>
              <option value="UPI">UPI</option>
            </select>
            <button type="submit" className="saleSubmitBtn">Submit Sale</button>
          </form>
        )}

        {filteredSales.length === 0 ? (
          <p>No matching sales records found.</p>
        ) : (
          <table className="sales-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Sale Date</th>
                <th>Customer Name</th>
                <th>Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.sales_id}>
                  <td>{sale.product_id || "N/A"}</td>
                  <td>{sale.p_name || "N/A"}</td>
                  <td>{sale.quantity || "N/A"}</td>
                  <td>{sale.total_price ? parseFloat(sale.total_price).toFixed(2) : "N/A"}</td>
                  <td>{sale.sales_date ? new Date(sale.sales_date).toLocaleDateString() : "N/A"}</td>
                  <td>{sale.customer_name || "N/A"}</td>
                  <td>{sale.payment_method || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SalesPage;
