// Backend - Controllers (controllers/invoiceController.js)

import db from "../config/db.js";


export const getPendingInvoices = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        invoices.*, 
        products.p_name,
        TO_BASE64(invoices.invoice_file_path) AS invoice_file_path
      FROM invoices 
      JOIN products ON invoices.product_id = products.product_id;
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending invoices' });
  }
};


export const approveInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    await db.query('UPDATE invoices SET status = ?, updated_at = NOW() WHERE invoice_id = ?', ['Approved', invoiceId]);
    res.json({ message: 'Invoice approved successfully' });
  } catch (error) {
    console.error('Error approving invoice:', error);
    res.status(500).json({ error: 'Failed to approve invoice' });
  }
};

export const declineInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    await db.query('DELETE FROM invoices WHERE invoice_id = ?', [invoiceId]);
    res.json({ message: 'Invoice declined successfully' });
  } catch (error) {
    console.error('Error declining invoice:', error);
    res.status(500).json({ error: 'Failed to decline invoice' });
  }
};

