import React from 'react'
import { useAppContext } from './contexts/AppContext' // Import your context
import { useSelector } from 'react-redux' // Import useSelector from Redux
import './App.css'
import Form from './components/Form'
import Login from './pages/Login' // Hypothetical login form component

function App() {
  const { isAuthenticated, loading } = useAppContext()
  const notification = useSelector((state) => state.forms.notification) // Example Redux state usage

  if (loading) {
    return <div>Loading...</div> // Show a loading indicator while checking auth state
  }

  return (
    <>
      {isAuthenticated ? <Form /> : <Login />}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </>
  )
}

export default App
