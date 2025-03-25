import express from "express";
import {
  getSuppliers,
  addSupplier,
  deleteSupplier,
  getSupplierAnalytics,
  getTotalPurchaseCost,
  getSupp
} from "../controllers/supplierController.js";

const router = express.Router();

router.get("/suppliers", getSuppliers);
router.get("/getsupp",getSupp)
router.post("/add-suppliers", addSupplier);
router.delete("/delete-supplier/:id", deleteSupplier);
router.get("/supplier-analytics", getSupplierAnalytics);
router.get("/total-purchase-cost", getTotalPurchaseCost);

export default router;