import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import "./invoicePage.css";

const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Pending"); // Default filter is Pending

  const fetchInvoices = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/pending"); // Make sure this endpoint returns all invoices
      const data = await response.json();
      setInvoices(data);
      setFilteredInvoices(data.filter(invoice => invoice.status === "Pending"));
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (invoiceId) => {
    try {
      await fetch(`http://localhost:5000/api/approve/${invoiceId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      fetchInvoices();
    } catch (error) {
      console.error("Error accepting invoice:", error);
    }
  };

  const handleReject = async (invoiceId) => {
    try {
      await fetch(`http://localhost:5000/api/decline/${invoiceId}`, {
        method: "DELETE"
      });
      fetchInvoices();
    } catch (error) {
      console.error("Error rejecting invoice:", error);
    }
  };

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);

    if (selectedFilter === "All") {
      setFilteredInvoices(invoices);
    } else {
      setFilteredInvoices(invoices.filter(invoice => invoice.status === selectedFilter));
    }
  };

  const handleViewPdf = (invoice) => {
    const blob = new Blob([Uint8Array.from(atob(invoice.invoice_file_path), c => c.charCodeAt(0))], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="invoice-container">
        <h1>Invoices</h1>
        
        <div className="filter-container">
          <label>Filter by Status: </label>
          <select value={filter} onChange={handleFilterChange}>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Declined">Declined</option>
            <option value="All">All</option>
          </select>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Generated At</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.invoice_id}>
                    <td>{invoice.invoice_id}</td>
                    <td>{invoice.product_id}</td>
                    <td>{invoice.p_name}</td>
                    <td>
                      {invoice.created_at
                        ? new Date(invoice.created_at).toLocaleString()
                        : "N/A"}
                    </td>
                    <td>{invoice.status}</td>
                    <td>
                      <button className="ViewPDF" onClick={() => handleViewPdf(invoice)}>
                        View PDF
                      </button>
                      {invoice.status === "Pending" && (
                        <>
                          <button className="Accept"
                            onClick={() => handleAccept(invoice.invoice_id)}
                          >
                            Accept
                          </button>
                          <button className="Reject"
                            onClick={() => handleReject(invoice.invoice_id)}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No Invoices Available</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default InvoicePage;
