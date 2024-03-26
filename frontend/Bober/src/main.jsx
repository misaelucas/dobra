import React from 'react'
import ReactDOM from 'react-dom/client' // Import createRoot from react-dom/client
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import Login from './components/Login.jsx' // Assuming you have a Login component
import AdminPage from './pages/AdminPage.jsx' // Import AdminPage component
import './index.css'
import { FormProvider } from './components/FormContext'

// Use createRoot from react-dom/client
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FormProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />{' '}
          {/* Route for the login page */}
          <Route path="/admin" element={<AdminPage />} />{' '}
          {/* Route for the admin page */}
          <Route path="/" element={<App />} />{' '}
          {/* Default route for other pages */}
        </Routes>
      </Router>
    </FormProvider>
  </React.StrictMode>
)
