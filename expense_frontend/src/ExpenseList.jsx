import React from 'react';
import './ExpenseList.css';

/**
 * Component to display and manage a list of expenses.
 * Shows expenses in a table format with filtering and sorting controls.
 */
export default function ExpenseList({
  expenses,
  categories,
  selectedCategory,
  onCategoryChange,
  isLoading,
  error,
}) {
  const calculateTotal = () => {
    return expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAmount = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  if (error) {
    return (
      <div className="expense-list-container">
        <div className="error-state">
          <p>Error loading expenses: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="expense-list-container">
      <h2>Your Expenses</h2>

      <div className="controls">
        <div className="filter-group">
          <label htmlFor="category-filter">Filter by Category:</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={onCategoryChange}
            disabled={isLoading}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && <div className="loading-state">Loading expenses...</div>}

      {!isLoading && expenses.length === 0 ? (
        <div className="empty-state">
          <p>No expenses found. Add one to get started!</p>
        </div>
      ) : (
        <>
          <div className="expenses-table-wrapper">
            <table className="expenses-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th className="amount-column">Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(expense => (
                  <tr key={expense.id}>
                    <td>{formatDate(expense.date)}</td>
                    <td>
                      <span className="category-badge">{expense.category}</span>
                    </td>
                    <td>{expense.description}</td>
                    <td className="amount-column">{formatAmount(expense.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="total-section">
            <strong>Total:</strong>
            <span className="total-amount">{formatAmount(calculateTotal())}</span>
          </div>
        </>
      )}
    </div>
  );
}
