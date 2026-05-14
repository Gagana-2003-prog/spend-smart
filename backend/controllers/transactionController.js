import Transaction from "../models/Transaction.js";

export const addTransaction = async (req, res) => {
  try {
    const { title, amount, category, description, date } = req.body;

    const roundedAmount = Math.ceil(amount / 10) * 10;
    const savedAmount = roundedAmount - amount;

    const tx = await Transaction.create({
      userId: req.user._id,
      type: "expense",
      amount,
      roundedAmount,
      savedAmount,
      category,
      note: description,
      title,
      date,
    });

    res.status(201).json({ success: true, transaction: tx });
  } catch (error) {
    console.error("addTransaction error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getSummary = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const total = await Transaction.countDocuments({ userId: req.user._id });

    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ date: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const allTx = await Transaction.find({ userId: req.user._id });
    const totalExpenses = allTx.reduce((s, t) => s + t.amount, 0);

    res.json({
      success: true,
      expenses: transactions,        // ← frontend reads data.expenses
      totalExpenses,                 // ← frontend reads data.totalExpenses
      pagination: {
        totalPages: Math.ceil(total / pageSize),
        currentPage: page,
      },
    });
  } catch (error) {
    console.error("getSummary error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    res.json({ success: true });
  } catch (error) {
    console.error("deleteTransaction error:", error.message);
    res.status(500).json({ error: error.message });
  }
};