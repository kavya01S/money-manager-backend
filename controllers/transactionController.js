const Transaction = require('../models/Transaction');

// @desc    Add a new transaction
// @route   POST /api/transactions
exports.addTransaction = async (req, res) => {
  try {
    const { amount, type, category, division, description, date } = req.body;

    const transaction = await Transaction.create({
      user: req.user.id, // Comes from auth middleware
      amount,
      type,
      category,
      division,
      description,
      date
    });

    return res.status(201).json({
      success: true,
      data: transaction
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error: ' + error.message
    });
  }
};

// @desc    Get all transactions for the logged-in user
// @route   GET /api/transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'No transaction found'
      });
    }

    // Make sure user owns the transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized'
      });
    }

    // --- SMART 12-HOUR RULE ---
    const now = new Date();
    
    // 1. Get the time the button was actually clicked (System Timestamp)
    // Fallback: If 'createdAt' doesn't exist (old data), use the 'date' field.
    const entryTime = transaction.createdAt ? new Date(transaction.createdAt) : new Date(transaction.date);
    
    // 2. Calculate the difference in hours
    const diffTime = Math.abs(now - entryTime);
    const diffHours = diffTime / (1000 * 60 * 60);

    // 3. Block if older than 12 hours
    if (diffHours > 12) {
      return res.status(400).json({
        success: false,
        error: '⏳ Cannot delete transactions created more than 12 hours ago!'
      });
    }
    // --------------------------

    await transaction.deleteOne();

    return res.status(200).json({
      success: true,
      data: {}
    });

  } catch (error) {
    console.error(error); // Helpful for debugging logs in Render
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};