import express from "express";
import { getMonthlyStats } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/monthly-stats", getMonthlyStats);

export default router;
