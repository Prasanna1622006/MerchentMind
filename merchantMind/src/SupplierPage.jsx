import React, { useState, useEffect } from "react";
import "./SupplierPage.css";
import Sidebar from "./Sidebar";
import { Trash2 } from "lucide-react"; // Import trash icon

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    product: "",
    quantity: "",
    purchase_cost: "",
  });
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Fetch suppliers from the backend
  const fetchSuppliers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/suppliers");
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);
  
  

  // Filter suppliers based on search query (name or product name)
  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      (supplier.name && supplier.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (supplier.p_name && supplier.p_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission for adding a new supplier
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/add-suppliers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
  
    if (response.ok) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        product: "",
        quantity: "",
        purchase_cost: "",
      });
      setIsFormVisible(false);
      fetchSuppliers(); // Fetch updated data after adding a supplier
    } else {
      alert("Failed to add supplier");
    }
  };
  
  // Handle supplier deletion
  const handleDeleteSupplier = async (supplierId) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/delete-supplier/${supplierId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete supplier");
      }

      // Remove the supplier from the UI after successful deletion
      setSuppliers((prevSuppliers) =>
        prevSuppliers.filter((s) => s.supplier_id !== supplierId)
      );
    } catch (error) {
      console.error("Error deleting supplier:", error.message);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="supplier-container">
        <header className="supplier-header">
          <div className="search-bar-container">
            <input
              type="text"
              className="search-bar"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className="add-supplier-btn"
            onClick={() => setIsFormVisible(!isFormVisible)}
          >
            Add New Supplier
          </button>
        </header>

        {isFormVisible && (
          <form onSubmit={handleFormSubmit} className="add-product-form">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Supplier Name"
              required
            />
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleInputChange}
              placeholder="Product Name"
              required
            />
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="Quantity"
              required
            />
            <input
              type="number"
              name="purchase_cost"
              value={formData.purchase_cost}
              onChange={handleInputChange}
              placeholder="Purchase Cost"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone"
              required
            />
            <button type="submit" className="submit-supplier-btn">
              Submit Supplier
            </button>
          </form>
        )}

        <table className="supplier-table">
          <thead>
            <tr>
              <th>Supplier Name</th>
              <th>Supplied Products</th>
              <th>Quantity</th>
              <th>Purchase Cost</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((supplier) => (
              <tr key={supplier.supplier_id}>
                <td>{supplier.name}</td>
                <td>{supplier.p_name}</td>
                <td>{supplier.quantity}</td>
                <td>{supplier.purchase_cost}</td>
                <td>{supplier.email}</td>
                <td>{supplier.phone_no}</td>
                <td>
                  <Trash2
                    className="delete-icon"
                    onClick={() => handleDeleteSupplier(supplier.supplier_id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierPage;
