import db from "../config/db.js";

// Get all inventory items
export const getInventory = async (req, res) => {
  try {
    const query =
      "SELECT i.*, p.* FROM inventory i INNER JOIN products p ON i.product_id = p.product_id";
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    console.error("Error fetching inventory:", err);
    res
      .status(500)
      .json({ error: "Database query failed", details: err.message });
  }
};

// Get total stock
export const getTotalStock = async (req, res) => {
  try {
    const query = `
      SELECT p.p_name, i.quantity AS stock
      FROM inventory i
      JOIN products p ON i.product_id = p.product_id
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching total stock:", error);
    res
      .status(500)
      .json({ error: "Error fetching total stock", details: error.message });
  }
};

// Delete a product from inventory
export const deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    // Delete from inventory first
    const [result] = await db.query(
      "DELETE FROM inventory WHERE product_id = ?",
      [productId]
    );

    // Now delete from products
    const [result2] = await db.query(
      "DELETE FROM products WHERE product_id = ?",
      [productId]
    );

    if (result2.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found in products" });
    }

    res.status(200).json({
      message: "Product deleted from products and inventory successfully",
    });
  } catch (err) {
    console.error("Error deleting from products:", err);
    res
      .status(500)
      .json({ error: "Error deleting from products", details: err.message });
  }
};


