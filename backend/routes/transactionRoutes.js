import express from "express";
import { addTransaction, getSummary, deleteTransaction }
  from "../controllers/transactionController.js";

const router = express.Router();

router.post("/add", addTransaction);
router.get("/summary", getSummary);
router.delete("/:id", deleteTransaction);

export default router;