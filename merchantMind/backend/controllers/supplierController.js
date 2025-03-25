import db from "../config/db.js";

// Get all suppliers
export const getSuppliers = async (req, res) => {
  try {
    const query = `
      SELECT s.*, p.*, ps.* 
      FROM product_supplied ps
      INNER JOIN suppliers s ON s.supplier_id = ps.supplier_id
      INNER JOIN products p ON ps.product_id = p.product_id;
    `;
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    console.error("Error fetching suppliers:", err);
    res.status(500).json({ error: "Database query failed", details: err.message });
  }
};

export const getSupp = async (req, res) => {
  try {
    const query = `
      SELECT * FROM suppliers;
    `;
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    console.error("Error fetching suppliers:", err);
    res.status(500).json({ error: "Database query failed", details: err.message });
  }
};

// Add a new supplier
export const addSupplier = async (req, res) => {
  const { name, email, phone, product_name, quantity, purchase_cost } = req.body;

  try {
    // Start a transaction
    await db.beginTransaction();

    // Insert into suppliers table
    const [supplierResult] = await db.query(
      "INSERT INTO suppliers (name, email, phone_no) VALUES (?, ?, ?)",
      [name, email, phone]
    );
    const supplier_id = supplierResult.insertId;

    // Lookup product in products table
    const [productResult] = await db.query(
      "SELECT product_id FROM products WHERE p_name = ?",
      [product_name]
    );

    if (productResult.length === 0) {
      await db.rollback();
      console.error("Product not found");
      return res.status(500).json({ error: "Product not found" });
    }

    const product_id = productResult[0].product_id;

    // Insert into product_supplied table
    await db.query(
      "INSERT INTO product_supplied (product_id, supplier_id, quantity, supplied_date, purchase_cost) VALUES (?, ?, ?, NOW(), ?)",
      [product_id, supplier_id, quantity, purchase_cost]
    );

    // Commit transaction
    await db.commit();

    res.status(200).json({
      message: "Supplier and product supplied added successfully",
      supplier_id,
      product_id,
    });
  } catch (err) {
    await db.rollback();
    console.error("Error adding supplier:", err);
    res.status(500).json({ error: "Database query failed", details: err.message });
  }
};

// Delete a supplier
export const deleteSupplier = async (req, res) => {
  const supplierId = req.params.id;

  try {
    const [result] = await db.query(
      "DELETE FROM product_supplied WHERE supplier_id = ?",
      [supplierId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Supplier not found in product_supplied table" });
    }

    res.status(200).json({ message: "Supplier deleted from product_supplied successfully" });
  } catch (err) {
    console.error("Error deleting supplier:", err);
    res.status(500).json({ error: "Error deleting supplier", details: err.message });
  }
};

// Get supplier analytics
export const getSupplierAnalytics = async (req, res) => {
  try {
    const query = `
      SELECT s.name, COUNT(ps.product_id) AS products_supplied
      FROM suppliers s
      LEFT JOIN product_supplied ps ON s.supplier_id = ps.supplier_id
      GROUP BY s.supplier_id
      ORDER BY products_supplied DESC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching supplier analytics:", error);
    res.status(500).json({
      error: "Error fetching supplier analytics",
      details: error.message,
    });
  }
};

// Get total purchase cost
export const getTotalPurchaseCost = async (req, res) => {
  try {
    const query = `
      SELECT SUM(quantity * purchase_cost) AS total_purchase_cost
      FROM product_supplied
    `;
    const [rows] = await db.query(query);
    res.json({ total_purchase_cost: rows[0].total_purchase_cost });
  } catch (error) {
    console.error("Error fetching total purchase cost:", error);
    res.status(500).json({
      error: "Error fetching total purchase cost",
      details: error.message,
    });
  }
};