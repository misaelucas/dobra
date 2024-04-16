// src/main.jsx

import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App'
import Login from './pages/Login'
import AdminPage from './pages/AdminPage'
import Form from './components/Form'
import ProtectedRoute from './components/ProtectedRoute'

import { AppProvider } from './contexts/AppContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={<ProtectedRoute element={AdminPage} />}
          />
          <Route path="/form" element={<ProtectedRoute element={Form} />} />{' '}
          {/* Protected route for the form */}
        </Routes>
      </Router>
    </AppProvider>
  </React.StrictMode>
)
