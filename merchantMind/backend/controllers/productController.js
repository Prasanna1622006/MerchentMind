import db from "../config/db.js";


export const addProducts = async (req, res) => {
  const { product_id, p_name, category, price, quantity, threshold, supplier_id } = req.body;
  console.log("Received data:", req.body);

  if (!product_id || !p_name || !category || !price || !quantity || !threshold || !supplier_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [checkProductResult] = await db.query(
      "SELECT * FROM products WHERE product_id = ?",
      [product_id]
    );

    if (checkProductResult.length > 0) {
      return res.json({ message: "Product already exists", product_id });
    }

    await db.query(
      "INSERT INTO products (product_id, p_name, category, price, threshold, supplier_id) VALUES (?, ?, ?, ?, ?, ?)",
      [product_id, p_name, category, price, threshold, supplier_id]
    );

    const [checkInventoryResult] = await db.query(
      "SELECT * FROM inventory WHERE product_id = ?",
      [product_id]
    );

    if (checkInventoryResult.length > 0) {
      await db.query(
        "UPDATE inventory SET quantity = quantity + ?, updated_at = CURRENT_TIMESTAMP WHERE product_id = ?",
        [quantity, product_id]
      );
      res.json({ message: "Inventory updated successfully", product_id });
    } else {
      await db.query(
        "INSERT INTO inventory (product_id, quantity) VALUES (?, ?)",
        [product_id, quantity]
      );
      res.json({ message: "Inventory added successfully", product_id });
    }
  } catch (err) {
    console.error("Error adding product:", err.sqlMessage || err.message);
    res.status(500).json({ error: "Database query failed", details: err.sqlMessage || err.message });
  }
};

export const addinventory = async (req, res) => {
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity) {
    return res.status(400).json({ error: 'Product ID and Quantity are required' });
  }

  const query = 'INSERT INTO inventory (product_id, quantity, created_at, updated_at) VALUES (?, ?, NOW(), NOW())';
  
  try {
    db.query(query, [product_id, quantity], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'Product ID already exists in inventory' });
        }
        console.error('Error adding inventory:', err);
        return res.status(500).json({ error: 'Failed to add inventory' });
      }
      res.status(201).json({ message: 'Inventory added successfully' });
    });
  } catch (error) {
    console.error('Unexpected Error:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};


export const getTopSellingProducts = async (req, res) => {
  try {
    const query = `
      SELECT p.p_name, SUM(s.quantity) AS total_sold
      FROM sales s
      JOIN products p ON s.product_id = p.product_id
      GROUP BY p.product_id
      ORDER BY total_sold DESC
      LIMIT 5;
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching top-selling products:", error);
    res.status(500).json({ error: "Error fetching top-selling products", details: error.message });
  }
};



export const getProductSales = async (req, res) => {
  try {
    const query = `
      SELECT 
        p.p_name AS product_name, 
        COALESCE(SUM(s.quantity), 0) AS total_sold, 
        i.quantity AS remaining_stock
      FROM products p
      LEFT JOIN sales s ON p.product_id = s.product_id
      INNER JOIN inventory i ON p.product_id = i.product_id
      GROUP BY p.product_id, i.quantity
      ORDER BY p.p_name;
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching product sales data:", error);
    res.status(500).json({ error: "Error fetching product sales data", details: error.message });
  }
};


