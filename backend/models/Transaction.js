import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type:          { type: String, enum: ["income", "expense"], required: true },
  amount:        { type: Number, required: true },
  roundedAmount: { type: Number, required: true },
  savedAmount:   { type: Number, default: 0 },
  title:         { type: String, required: true },
  category:      { type: String, default: "General" },
  note:          { type: String, default: "" },
  date:          { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);