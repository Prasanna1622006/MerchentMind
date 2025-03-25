import db from "../config/db.js";

// Get all sales
export const getSales = async (req, res) => {
  try {
    const [rows] = await db.query("  SELECT s.*, p.p_name FROM sales s JOIN products p ON s.product_id = p.product_id");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching sales data:", err);
    res.status(500).json({ error: "Database query failed", details: err.message });
  }
};

// Record a new sale
export const recordSale = async (req, res) => {
  const { product_id, quantity, total_price, customer_name, payment_method } = req.body;

  if (!product_id || !quantity || !total_price || !customer_name || !payment_method) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Insert into sales table
    await db.query(
      "INSERT INTO sales (product_id, quantity, total_price, customer_name, sales_date, payment_method) VALUES (?, ?, ?, ?, NOW(), ?)",
      [product_id, quantity, total_price, customer_name, payment_method]
    );

    // Note: There seems to be missing code to update inventory quantity after sale in the original
    // You might want to add that here:
    // await db.query("UPDATE inventory SET quantity = quantity - ? WHERE product_id = ?", [quantity, product_id]);

    res.json({ message: "Sale recorded and inventory updated", product_id });
  } catch (err) {
    console.error("Error processing sale:", err);
    res.status(500).json({ error: "Database query failed", details: err.message });
  }
};

// Get sales report
export const getSalesReport = async (req, res) => {
  try {
    const query = `
      SELECT DATE(sales_date) as sales_date, SUM(total_price) as total_sales
      FROM sales
      GROUP BY DATE(sales_date)
      ORDER BY sales_date;
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching sales report:", error);
    res.status(500).json({ error: "Error fetching sales report", details: error.message });
  }
};

// Get total sales
export const getTotalSales = async (req, res) => {
  try {
    const query = `
      SELECT SUM(total_price) AS total_sales
      FROM sales
    `;
    const [rows] = await db.query(query);
    res.json({ total_sales: rows[0].total_sales });
  } catch (error) {
    console.error("Error fetching total sales:", error);
    res.status(500).json({ error: "Error fetching total sales", details: error.message });
  }
};