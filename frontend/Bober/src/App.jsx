import React from 'react'
import { useAppContext } from './contexts/AppContext'
import { useSelector } from 'react-redux'
import './App.css'
import Form from './components/Form'
import Login from './pages/Login'

function App() {
  const { isAuthenticated, loading } = useAppContext()
  const notification = useSelector((state) => state.forms.notification)

  if (loading) {
    return <div>Loading...</div> 
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
