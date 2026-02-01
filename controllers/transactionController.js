const Transaction = require('../models/Transaction');

// @desc    Add a new transaction
// @route   POST /api/transactions
// @access  Private
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
    console.error("ADD ERROR:", error);
    return res.status(500).json({
      success: false,
      error: 'Server Error: ' + error.message
    });
  }
};

// @desc    Get all transactions for the logged-in user
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    console.error("GET ERROR:", error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
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

    // --- SMART DELETE LOGIC (WITH DEBUG LOGS) ---
    const now = new Date();
    
    // 1. Get the time the button was actually clicked (System Timestamp)
    // Fallback: If 'createdAt' doesn't exist (old data), use the 'date' field.
    const entryTime = transaction.createdAt ? new Date(transaction.createdAt) : new Date(transaction.date);
    
    // 2. Calculate the difference in hours
    const diffTime = Math.abs(now - entryTime);
    const diffHours = diffTime / (1000 * 60 * 60);

    console.log(`🗑️ DELETE DEBUG:`);
    console.log(`   - ID: ${transaction._id}`);
    console.log(`   - Entry Time (Used): ${entryTime.toISOString()}`);
    console.log(`   - Server Time (Now): ${now.toISOString()}`);
    console.log(`   - Age in Hours: ${diffHours.toFixed(2)} hours`);

    // 3. Block if older than 24 hours (Increased limit for safety during demo)
    if (diffHours > 24) {
      console.log(`   ❌ BLOCKED: Transaction is too old.`);
      return res.status(400).json({
        success: false,
        error: `⏳ Security Lock: Cannot delete transactions older than 24 hours. (Item is ${diffHours.toFixed(1)}h old)`
      });
    }
    // ------------------------------------------

    await transaction.deleteOne();
    console.log(`   ✅ SUCCESS: Deleted.`);

    return res.status(200).json({
      success: true,
      data: {}
    });

  } catch (error) {
    console.error("DELETE ERROR:", error);
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};