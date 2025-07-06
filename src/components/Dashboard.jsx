import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Navbar from './Navbar';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const pieData = [
  { name: 'Food', value: 400, color: '#8884d8' },
  { name: 'Bills', value: 300, color: '#82ca9d' },
  { name: 'Travel', value: 300, color: '#ffc658' },
  { name: 'Other', value: 200, color: '#ff8042' }
];

const barData = [
  { month: 'Dec', amount: 80 },
  { month: 'Jan', amount: 100 },
  { month: 'Feb', amount: 150 },
  { month: 'Mar', amount: 170 },
  { month: 'Apr', amount: 150 },
  { month: 'May', amount: 160 }
];

const Dashboard = () => {
  const [categories, setCategories] = useState([
    { name: 'Food' },
    { name: 'Bills' },
    { name: 'Travel' },
  ]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [newExpense, setNewExpense] = useState([]);

  useEffect(() => {
    // Fetch categories from localStorage
    const storedCategories = JSON.parse(localStorage.getItem('categories')) || [];
    setCategories(storedCategories);
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleAmountChange = (e) => {
    setExpenseAmount(e.target.value);
  };

  const handleDateChange = (e) => {
    setExpenseDate(e.target.value);
  };

  const handleAddExpense = () => {
    if (selectedCategory && expenseAmount && expenseDate) {
      const newExpenseItem = {
        category: selectedCategory,
        amount: expenseAmount,
        date: expenseDate,
      };
      setNewExpense([...newExpense, newExpenseItem]);
      setExpenseAmount('');
      setExpenseDate('');
    } else {
      alert('Please fill out all fields');
    }
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="sidebar">
          <h3>Add Expense</h3>
          <label>Date</label>
          <input type="date" value={expenseDate} onChange={handleDateChange} />
          <label>Category</label>
          <select value={selectedCategory} onChange={handleCategoryChange}>
            {categories.map((cat, index) => (
              <option key={index} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <label>Amount</label>
          <input type="number" value={expenseAmount} onChange={handleAmountChange} placeholder="Enter amount" />
          <button className="add-btn" onClick={handleAddExpense}>
            Add Expense
          </button>
        </div>

        <div className="charts-section">
          <div className="top-charts">
            <div className="pie-box">
              <h4>Expense Breakdown</h4>
              <PieChart width={300} height={300}>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </div>

            <div className="alert-box">
              <h4>🔶 Budget Alert</h4>
              <p>You have exceeded your budget of <b>$150</b></p>
            </div>
          </div>

          <div className="bar-chart-box">
            <h4>Monthly Expenses</h4>
            <BarChart width={600} height={250} data={barData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;