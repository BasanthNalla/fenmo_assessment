# Expense Tracker - Full Stack Application

A production-like personal expense tracker built with Django (backend), React (frontend), and SQLite (database).

## Table of Contents

1. [Features](#features)
2. [Project Structure](#project-structure)
3. [Tech Stack](#tech-stack)
4. [Prerequisites](#prerequisites)
5. [Installation & Setup](#installation--setup)
6. [Running the Application](#running-the-application)
7. [API Documentation](#api-documentation)
8. [Design Decisions](#design-decisions)
9. [Deployment Guide](#deployment-guide)

## Features

### Core Features (Completed)
- ✅ Create new expense entries with amount, category, description, and date
- ✅ View list of all expenses
- ✅ Filter expenses by category
- ✅ Sort expenses by date (newest first)
- ✅ Display total amount of visible expenses
- ✅ Handle duplicate requests (idempotency for network retries)
- ✅ Form validation with error messages
- ✅ Loading states and error handling
- ✅ Responsive UI design

### Nice-to-Have Features (Completed)
- ✅ Real-time category suggestions
- ✅ Basic input validation (prevent negative amounts, future dates)
- ✅ Loading and error states in UI
- ✅ Clean, modern styling with gradient backgrounds

## Project Structure

```
fenmo_assessment/
├── expense_backend/          # Django REST API
│   ├── expense_project/      # Project settings
│   │   ├── settings.py       # Django configuration
│   │   ├── urls.py          # URL routing
│   │   └── wsgi.py          # WSGI application
│   ├── expenses/            # Expense app
│   │   ├── models.py        # Database models
│   │   ├── views.py         # API views (ViewSets)
│   │   ├── serializers.py   # DRF serializers
│   │   ├── urls.py          # App URL routing
│   │   ├── admin.py         # Django admin config
│   │   ├── migrations/      # Database migrations
│   ├── manage.py            # Django management script
│   ├── requirements.txt      # Python dependencies
│   └── .env.example         # Environment variables template
│
├── expense_frontend/         # React Frontend
│   ├── src/
│   │   ├── App.jsx          # Main app component
│   │   ├── App.css          # App styling
│   │   ├── ExpenseForm.jsx  # Form component
│   │   ├── ExpenseForm.css  # Form styling
│   │   ├── ExpenseList.jsx  # List component
│   │   ├── ExpenseList.css  # List styling
│   │   ├── api.js           # API client
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── index.html           # HTML template
│   ├── package.json         # Node dependencies
│   ├── vite.config.js       # Vite configuration
│   └── .gitignore
│
└── README.md                # This file
```

## Tech Stack

### Backend
- **Framework**: Django 4.2
- **API**: Django REST Framework 3.14
- **Database**: SQLite
- **Language**: Python 3.8+
- **CORS**: django-cors-headers

### Frontend
- **Framework**: React 18.2
- **Build Tool**: Vite 4.3
- **Styling**: CSS3
- **HTTP Client**: Fetch API

### Database
- **Type**: SQLite
- **ORM**: Django ORM
- **Storage**: Local file (db.sqlite3) in project folder

## Prerequisites

### Backend Requirements
- pip or poetry
- (SQLite is included with Python) or higher
- pip or poetry

### Frontend Requirements
- Node.js 16 or higher
- npm or yarn

## Installation & Setup
Backend (No Database Setup Required!)
### 2. Set Up Backend

```bash
# Navigate to backend directory
cd expense_backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env if needed (optional - defaults are fine for development)
# SECRET_KEY=your-secret-key-here (auto-generated)
# ALLOWED_HOSTS=localhost,127.0.0.1 (default)

# Run migrations
python manage.py migrate

# Create superuser (optional, for admin panel)
python manage.py createsuperuser

# Verify backend setup
python manage.py check
```

### 3. Set Up Frontend

```bash
# Navigate to frontend directory
cd expense_frontend

# Install dependencies
npm install

# Create .env file (optional)
echo "VITE_API_URL=http://localhost:8000/api" > .env.local
```

## Running the Application

### Terminal 1: Start Backend Server

```bash
cd expense_backend

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows

# Start Django development server
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### Terminal 2: Start Frontend Development Server

```bash
cd expense_frontend

# Start Vite development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Access the Application

- **Frontend**: Open `http://localhost:3000` in your browser
- **Admin Panel**: `http://localhost:8000/admin` (login with superuser credentials)
- **API Documentation**: `http://localhost:8000/api/expenses/`

## API Documentation

### Endpoints

#### GET /api/expenses/
Retrieve a list of all expenses with optional filtering and sorting.

**Query Parameters:**
- `category` (optional): Filter by category (case-insensitive)
- `sort` (optional): Sort order - `date_desc` (default, newest first) or `date_asc`

**Example:**
```bash
# Get all expenses
GET /api/expenses/

# Filter by category
GET /api/expenses/?category=Food

# Sort by oldest first
GET /api/expenses/?sort=date_asc

# Combine filters
GET /api/expenses/?category=Transport&sort=date_asc
```

**Response:**
```json
{
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "amount": "45.50",
      "category": "Food",
      "description": "Lunch at downtown restaurant",
      "date": "2024-05-01",
      "created_at": "2024-05-01T12:30:00Z"
    }
  ]
}
```

#### POST /api/expenses/
Create a new expense entry.

**Request Body:**
```json
{
  "amount": 45.50,
  "category": "Food",
  "description": "Lunch at downtown restaurant",
  "date": "2024-05-01"
}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "amount": "45.50",
  "category": "Food",
  "description": "Lunch at downtown restaurant",
  "date": "2024-05-01",
  "created_at": "2024-05-01T12:30:00Z"
}
```

**Error Response:**
```json
{
  "amount": ["Amount must be greater than 0."],
  "category": ["Category is required."]
}
```

### Data Model

```
Expense
├── id (UUID, Primary Key)
├── amount (Decimal, max 10 digits, 2 decimal places)
├── category (String, 100 chars)
├── description (String, 255 chars)
├── date (Date)
├── created_at (DateTime, Auto-set on creation)
└── idempotency_key (String, unique, for handling retries)
```

## Design Decisions

### 1. Idempotency Handling
**Decision**: Generate SHA256 hash of request data as idempotency key.
**Rationale**: Ensures duplicate POST requests due to network issues or user retries are handled gracefully. The same request data always produces the same expense entry, preventing duplicates.

**How it works**:
- When a user submits the form multiple times with the same data, the API returns the existing expense instead of creating a new one
- Handles real-world scenarios where users click submit multiple times or refresh after submission

### 2. Database Choice: SQLite
**Decision**: Use SQLite for development and production.
**Rationale**: 
- No external database server needed
- Data stored in project folder (db.sqlite3)
- Perfect for small to medium applications
- Easy deployment and backup
- Fast enough for most use cases
- Better for offline development

### 3. Frontend Framework: React with Vite
**Decision**: React with Vite bundler instead of Create React App.
**Rationale**:
- Vite provides faster development with instant HMR (Hot Module Replacement)
- Smaller bundle size for faster production builds
- Modern, lightweight setup suitable for this project scope
- Better developer experience with faster feedback loop

### 4. API Architecture: Django REST Framework ViewSets
**Decision**: Use DRF ViewSets with ModelSerializer.
**Rationale**:
- Provides built-in CRUD operations out of the box
- Automatic request/response serialization
- Built-in validation framework
- Standard REST conventions
- Good balance of power and simplicity

### 5. State Management: React Hooks (useState, useCallback)
**Decision**: Use React hooks instead of Redux/Context API.
**Rationale**:
- Application complexity is low enough to handle with local component state
- No need for complex global state management
- Reduces bundle size
- Simpler mental model for maintainability

### 6. CORS Configuration
**Decision**: Allowed specific origins (`localhost:3000`) instead of wildcard.
**Rationale**:
- Better security posture
- Prevents accidental CORS vulnerabilities
- Easy to update for production domains

### 7. Decimal Type for Amounts
**Decision**: Use Django DecimalField, not FloatingPoint.
**Rationale**:
- Prevents floating-point precision errors with currency
- Essential for financial applications
- Allows exact decimal representation

### 8. Validation Strategy
**Decision**: Client-side validation + server-side validation.
**Rationale**:
- Client-side provides immediate feedback to users
- Server-side ensures data integrity regardless of client behavior
- Defense-in-depth approach

## Deployment Guide

### Production Backend Deployment (Example: Heroku)

1. **Prepare for Production**
```bash
# Update settings.py for production
# Set DEBUG = False
# Add production domain to ALLOWED_HOSTS
# Use strong SECRET_KEY from environment
# Configure database for production
```

2. **Create Procfile**
```
web: gunicorn expense_project.wsgi
```

3. **Deploy**
```bash
# Install production dependencies
pip install gunicorn whitenoise

# Push to Heroku
git push heroku main
```

4. **Run migrations on production**
```bash
heroku run python manage.py migrate
```

### Production Frontend Deployment (Example: Vercel)

1. **Build for production**
```bash
npm run build
```

2. **Deploy**
```bash
# Using Vercel CLI
vercel
# Or push to GitHub and auto-deploy with Vercel
```

3. **Configure API endpoint**
```bash
# Set VITE_API_URL environment variable to production API URL
```


## Important Notes

### Network Resilience
- The frontend is built to handle slow or failed API responses gracefully
- Loading states inform users when data is being fetched
- Error messages guide users when something goes wrong
- Form retry logic ensures user data isn't lost

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires ES6+ JavaScript support
- Requires CSS Grid/Flexbox support

### Performance Optimization
- Frontend uses React.useCallback to prevent unnecessary re-renders
- API responses are cached locally
- Lazy-loading of categories
- Minimal external dependencies

### Security Considerations
- CORS properly configured
- No sensitive data in frontend code
- Environment variables for database credentials
- CSRF protection (Django default)
- Input validation on both client and server

## Troubleshooting

### Database Connection Error
```
**Solution**: Ensure Django migrations have been run (`python manage.py migrate`). SQLite uses a local file, not a server
```
**Solution**: Ensure PostgreSQL is running and credentials in .env are correct.

### CORS Error in Browser
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Ensure backend is running and frontend URL is in ALLOWED_HOSTS.

### Port Already in Use
**Solution**: 
```bash
# Find process using port 8000 or 3000
# Windows: netstat -ano | findstr :8000
# macOS/Linux: lsof -i :8000
# Kill the process or use a different port
```

## Future Enhancements

- User authentication and multi-user support
- Expense categories management
- Monthly/quarterly/yearly summary reports
- Recurring expenses
- Data export (CSV, PDF)
- Mobile app
- Budget tracking and alerts
- Receipt attachments
- Comments and notes on expenses

---
SQLite
**Created**: May 2024  
**Stack**: Django 4.2 | React 18.2 | PostgreSQL | Vite 4.3