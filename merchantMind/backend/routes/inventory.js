import express from "express"; 
import { getInventory, deleteProduct, getTotalStock } from "../controllers/inventoryController.js"; 
 
const router = express.Router(); 
 
router.get("/inventory", getInventory); 
router.get("/total-stock", getTotalStock); 
router.delete("/delete-product/:id", deleteProduct); 
 
export default router; 
