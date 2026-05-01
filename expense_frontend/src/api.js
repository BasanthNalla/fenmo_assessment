/**
 * API service for communicating with the expense backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Create a new expense
 */
export const createExpense = async (expenseData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenseData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Get all expenses with optional filters
 */
export const getExpenses = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.category) {
      params.append('category', filters.category);
    }
    
    if (filters.sort) {
      params.append('sort', filters.sort);
    }

    const url = `${API_BASE_URL}/expenses/${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }

    const data = await response.json();
    // Handle paginated response
    return data.results || data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get unique categories from all expenses
 */
export const getCategories = async () => {
  try {
    const expenses = await getExpenses();
    const categories = [...new Set(expenses.map(e => e.category))].sort();
    return categories;
  } catch (error) {
    throw error;
  }
};
