import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../contexts/AppContext'
import Header from '../components/Header'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('') // State for storing error messages
  const navigateTo = useNavigate()
  const { login } = useAppContext()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        login(data.token) // Save the login token using context (if your context handles this)
        navigateTo('/form') // Redirect user to form page
      } else {
        const errorData = await response.json() // Attempt to read the error message if provided
        setErrorMessage(errorData.message || 'Falhou, veja sua senha/usuário.')
      }
    } catch (error) {
      console.error('Error during login:', error)
      setErrorMessage('Login failed due to server error.')
    }
  }

  return (
    <div className="!bg-slate-800">
      {' '}
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-800">
        <div className="max-w-md w-full px-6 py-8 bg-white shadow-md rounded-md border rounded   ring-offset-4 ring-2 ring-green-400/50 ring-offset-slate-800">
          <h2 className="text-2xl font-semibold text-center mb-6 rounded  	">
            Entrar
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Usuário:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Senha:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm text-center">{errorMessage}</p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 mt-2 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
