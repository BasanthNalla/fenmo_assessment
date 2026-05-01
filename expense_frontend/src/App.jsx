import React, { useState, useEffect, useCallback } from 'react';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import { createExpense, getExpenses, getCategories } from './api';
import './App.css';

/**
 * Main App component that orchestrates the expense tracker application.
 */
export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const formatDateTime = (date) =>
    date.toLocaleString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /**
   * Load expenses from the API with current filters
   */
  const loadExpenses = useCallback(async (categoryFilter = '') => {
    setIsLoading(true);
    setError('');
    try {
      const filters = categoryFilter ? { category: categoryFilter } : {};
      const data = await getExpenses(filters);
      setExpenses(data);
    } catch (err) {
      console.error('Error loading expenses:', err);
      setError('Failed to load expenses. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Load available categories
   */
  const loadCategories = useCallback(async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  }, []);

  /**
   * Initial load effect
   */
  useEffect(() => {
    loadExpenses();
    loadCategories();
  }, [loadExpenses, loadCategories]);

  /**
   * Handle new expense submission
   */
  const handleAddExpense = async (formData) => {
    setIsLoadingForm(true);
    setError('');
    setSuccessMessage('');

    try {
      await createExpense(formData);
      setSuccessMessage('Expense added successfully!');

      // Reload expenses and categories
      await loadExpenses(selectedCategory);
      await loadCategories();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error adding expense:', err);
      setError('Failed to add expense. Please try again.');
    } finally {
      setIsLoadingForm(false);
    }
  };

  /**
   * Handle category filter change
   */
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    loadExpenses(newCategory);
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <div className="app-header-top">
          <div>
            <h1>Personal Expense Tracker</h1>
            <p className="subtitle">Track and manage your personal expenses</p>
          </div>
          <div className="current-datetime">
            {formatDateTime(currentDateTime)}
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <div className="app-content">
        <ExpenseForm
          onSubmit={handleAddExpense}
          isLoading={isLoadingForm}
        />

        <ExpenseList
          expenses={expenses}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
