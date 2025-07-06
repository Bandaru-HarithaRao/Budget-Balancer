// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/wealthpulse', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Models
const User = require('./models/User');
const Expenses = require('./models/Expenses');

// Helper function to get username from identifier
const getUsernameFromIdentifier = async (identifier) => {
  const user = await User.findOne({
    $or: [
      { username: identifier },
      { email: identifier }
    ]
  });
  return user ? user.username : null;
};

// Register Route
app.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error("Registration error:", error.message);
    
    // Duplicate key error
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      return res.status(400).json({ error: `${duplicateField} already exists` });
    }
    
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    
    // Find user by username OR email
    const user = await User.findOne({
      $or: [
        { username: identifier },
        { email: identifier }
      ]
    });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    res.status(200).json({ 
      message: 'Login successful',
      username: user.username  // Return username for frontend to store
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== EXPENSES API ROUTES ====================

// GET all expenses for a user
app.get('/api/expenses/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const username = await getUsernameFromIdentifier(identifier);
    
    if (!username) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const expenses = await Expenses.find({ username }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Get expenses error:", error.message);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// GET aggregated expenses by category for a user (showing latest entry per category)
app.get('/api/expenses/categories/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const username = await getUsernameFromIdentifier(identifier);
    
    if (!username) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const categoryTotals = await Expenses.aggregate([
      { $match: { username } },
      {
        $group: {
          _id: '$category',
          totalSpent: { $sum: '$amount' },
          count: { $sum: 1 },
          latestDate: { $max: '$date' }
        }
      },
      { $sort: { latestDate: -1 } }
    ]);
    
    // Get the latest expense details for each category
    const categories = await Promise.all(categoryTotals.map(async (cat) => {
      const latestExpense = await Expenses.findOne({
        username,
        category: cat._id
      }).sort({ date: -1 });
      
      return {
        name: cat._id,
        totalSpent: cat.totalSpent,
        count: cat.count,
        latestDate: cat.latestDate,
        latestAmount: latestExpense ? latestExpense.amount : 0,
        latestExpenseId: latestExpense ? latestExpense._id : null
      };
    }));
    
    res.status(200).json(categories);
  } catch (error) {
    console.error("Get categories error:", error.message);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET all expenses for a specific category
app.get('/api/expenses/category/:identifier/:category', async (req, res) => {
  try {
    const { identifier, category } = req.params;
    const username = await getUsernameFromIdentifier(identifier);
    
    if (!username) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Decode the category name to handle special characters
    const decodedCategory = decodeURIComponent(category);
    
    const expenses = await Expenses.find({ 
      username, 
      category: decodedCategory 
    }).sort({ date: -1 }); // Sort by date in descending order (newest first)
    
    console.log(`Fetching expenses for category: ${decodedCategory}, found: ${expenses.length} expenses`);
    
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Get category expenses error:", error.message);
    res.status(500).json({ error: 'Failed to fetch category expenses' });
  }
});

// POST add new expense
app.post('/api/expenses', async (req, res) => {
  try {
    const { identifier, category, amount, date } = req.body;
    
    if (!identifier || !category || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const username = await getUsernameFromIdentifier(identifier);
    
    if (!username) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const newExpense = new Expenses({
      username,
      category,
      amount: parseFloat(amount),
      date: date ? new Date(date) : new Date()
    });
    
    await newExpense.save();
    res.status(201).json({ 
      message: 'Expense added successfully',
      expense: newExpense
    });
  } catch (error) {
    console.error("Add expense error:", error.message);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

// PUT update expense
app.put('/api/expenses/:expenseId', async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { category, amount, date } = req.body;
    
    const updateData = {};
    if (category) updateData.category = category;
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (date) updateData.date = new Date(date);
    
    const updatedExpense = await Expenses.findByIdAndUpdate(
      expenseId,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.status(200).json({
      message: 'Expense updated successfully',
      expense: updatedExpense
    });
  } catch (error) {
    console.error("Update expense error:", error.message);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// DELETE expense
app.delete('/api/expenses/:expenseId', async (req, res) => {
  try {
    const { expenseId } = req.params;
    
    const deletedExpense = await Expenses.findByIdAndDelete(expenseId);
    
    if (!deletedExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.status(200).json({
      message: 'Expense deleted successfully',
      expense: deletedExpense
    });
  } catch (error) {
    console.error("Delete expense error:", error.message);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// DELETE all expenses for a category
app.delete('/api/expenses/category/:identifier/:category', async (req, res) => {
  try {
    const { identifier, category } = req.params;
    const username = await getUsernameFromIdentifier(identifier);
    
    if (!username) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Decode the category name to handle special characters
    const decodedCategory = decodeURIComponent(category);
    
    const result = await Expenses.deleteMany({ username, category: decodedCategory });
    
    res.status(200).json({
      message: `Deleted ${result.deletedCount} expenses from category: ${decodedCategory}`
    });
  } catch (error) {
    console.error("Delete category expenses error:", error.message);
    res.status(500).json({ error: 'Failed to delete category expenses' });
  }
});

// PUT update category name for all expenses
app.put('/api/expenses/category/:identifier/:oldCategory', async (req, res) => {
  try {
    const { identifier, oldCategory } = req.params;
    const { newCategory } = req.body;
    
    if (!newCategory) {
      return res.status(400).json({ error: 'New category name is required' });
    }
    
    const username = await getUsernameFromIdentifier(identifier);
    
    if (!username) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Decode the old category name to handle special characters
    const decodedOldCategory = decodeURIComponent(oldCategory);
    
    const result = await Expenses.updateMany(
      { username, category: decodedOldCategory },
      { $set: { category: newCategory } }
    );
    
    res.status(200).json({
      message: `Updated ${result.modifiedCount} expenses from category: ${decodedOldCategory} to ${newCategory}`
    });
  } catch (error) {
    console.error("Update category name error:", error.message);
    res.status(500).json({ error: 'Failed to update category name' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
