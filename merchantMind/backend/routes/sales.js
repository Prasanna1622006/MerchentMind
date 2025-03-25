import express from "express"; 
import { 
  getSales, 
  recordSale, 
  getSalesReport, 
  getTotalSales 
} from "../controllers/salesController.js"; 
 
const router = express.Router(); 
 
router.get("/sales", getSales); 
router.post("/sale", recordSale); 
router.get("/sales-report", getSalesReport); 
router.get("/total-sales", getTotalSales); 
 
export default router; 
