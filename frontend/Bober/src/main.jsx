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
import ExpenseForm from './components/ExpenseForm'
import { Provider } from 'react-redux' // Import Provider from react-redux
import store from './redux/store' // Import your Redux store

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute
                  element={AdminPage}
                  roles={['admin', 'receptionist']}
                />
              }
            />
            <Route
              path="/form"
              element={
                <ProtectedRoute
                  element={Form}
                  roles={['receptionist', 'admin']}
                />
              }
            />
            <Route
              path="/despesas"
              element={
                <ProtectedRoute element={ExpenseForm} roles={['admin']} />
              }
            />
          </Routes>
        </Router>
      </Provider>
    </AppProvider>
  </React.StrictMode>
)
