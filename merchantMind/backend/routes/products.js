import express from "express"; 
import { addProducts, getProductSales, getTopSellingProducts,addinventory} from "../controllers/productController.js"; 
 
const router = express.Router(); 
 
router.post("/add-products", addProducts); 
router.post("/add-inventory", addinventory);
router.get("/product-sales", getProductSales); 
router.get("/top-selling-products", getTopSellingProducts); 
 
export default router; 
