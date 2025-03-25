import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import "./InventoryPage.css";
import Sidebar from "../Sidebar";

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showInventoryForm, setShowInventoryForm] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [newProduct, setNewProduct] = useState({
    product_id: "",
    p_name: "",
    category: "",
    price: "",
    quantity: "",
    threshold: "",
    supplier_id: "",
  });

  const [newInventory, setNewInventory] = useState({
    product_id: "",
    quantity: "",
  });

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/inventory");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/getsupp");
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = Object.values(product).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );

    const productDate = new Date(product.created_at);
    const isWithinDateRange =
      (!startDate || productDate >= new Date(startDate)) &&
      (!endDate || productDate <= new Date(endDate));

    return matchesSearch && isWithinDateRange;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInventoryInputChange = (e) => {
    const { name, value } = e.target;
    setNewInventory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddInventory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/add-inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newInventory),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Failed to add inventory");
      }
  
      setNewInventory({ product_id: "", quantity: "" });
      setShowInventoryForm(false);
      window.location.reload();  // Refreshes the page to show the updated list
    } catch (error) {
      console.error("Error adding inventory:", error.message);
    }
  };
  

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/add-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Failed to add product");
      }

      await fetchProducts();
      setNewProduct({
        product_id: "",
        p_name: "",
        category: "",
        price: "",
        quantity: "",
        threshold: "",
        supplier_id: "",
      });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding product:", error.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/delete-product/${productId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        alert("Product Cannot be Deleted");
        return;
      }

      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error.message);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="inventory-container">
        <header className="inventory-header">
          <div className="search-bar-container">
            <input
              type="text"
              className="search-bar"
              placeholder="Search Products"
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
          {/* <button
            className="add-product-btn"
            onClick={() => setShowInventoryForm(!showInventoryForm)}
          >
            Add Inventory
          </button> */}
          <button
            className="add-product-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            Add New Product
          </button>
        </header>

        {/* {showInventoryForm && (
          <form className="add-product-form" onSubmit={handleAddInventory}>
            <div className="form-group">
              <label>Product ID:</label>
              <input
                type="text"
                name="product_id"
                value={newInventory.product_id}
                onChange={handleInventoryInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Quantity:</label>
              <input
                type="number"
                name="quantity"
                value={newInventory.quantity}
                onChange={handleInventoryInputChange}
                required
              />
            </div>
            <button type="submit">Add Inventory</button>
          </form>
        )} */}

        {showAddForm && (
          <form className="add-product-form" onSubmit={handleAddProduct}>
            {Object.keys(newProduct).map((key) =>
              key === "supplier_id" ? (
                <div className="form-group" key={key}>
                  <label>Supplier:</label>
                  <select
                    name={key}
                    value={newProduct[key]}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((supplier) => (
                      <option
                        key={supplier.supplier_id}
                        value={supplier.supplier_id}
                      >
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="form-group" key={key}>
                  <label>{key.replace("_", " ").toUpperCase()}:</label>
                  <input
                    type={
                      key === "price" ||
                      key === "quantity" ||
                      key === "threshold"
                        ? "number"
                        : "text"
                    }
                    name={key}
                    value={newProduct[key]}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )
            )}
            <button type="submit">Add Product</button>
          </form>
        )}

<table className="inventory-table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.product_id}>
              <td>{product.product_id}</td>
              <td>{product.p_name}</td>
              <td>{product.category}</td>
              <td>{product.price}</td>
              <td>{product.quantity}</td>
              <td>
                {product.created_at
                  ? new Date(product.created_at).toLocaleString()
                  : "N/A"}
              </td>
              <td>
                {product.updated_at
                  ? new Date(product.updated_at).toLocaleString()
                  : "N/A"}
              </td>
              <td>
                <Trash2
                  className="delete-icon"
                  onClick={() => handleDeleteProduct(product.product_id)}
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

export default InventoryPage;
