import React from 'react'
import { useAppContext } from './contexts/AppContext' // Import your context
import './App.css'
import Form from './components/Form'
import Header from './components/Header'
import LoginForm from './pages/Login' // Hypothetical login form component

function App() {
  const { isAuthenticated } = useAppContext()

  return (
    <>
      {isAuthenticated ? <Form /> : <LoginForm />}
    </>
  )
}

export default App
