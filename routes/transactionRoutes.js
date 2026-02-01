const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// This one line creates both routes!
// GET /api/transactions -> Fetches your list (Protected)
// POST /api/transactions -> Adds a new one (Protected)

module.exports = router;
const { addTransaction, getTransactions, deleteTransaction } = require('../controllers/transactionController');

router.route('/')
  .get(protect, getTransactions)
  .post(protect, addTransaction);

router.route('/:id').delete(protect, deleteTransaction); // <--- Add this