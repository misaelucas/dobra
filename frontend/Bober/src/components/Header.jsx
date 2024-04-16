import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check local storage for the presence of a token to set authentication status
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    navigate('/login')
  }

  return (
    <header className="bg-slate-800 text-white p-4 shadow-md">
      <nav className="container mx-auto flex justify-center ring-2 ring-green-400/50 rounded-xl space-x-4">
        <NavLink
          to="/form"
          className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
        >
          Formulário
        </NavLink>
        {!isAuthenticated && (
          <NavLink
            to="/login"
            className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
          >
            Login
          </NavLink>
        )}
        {isAuthenticated && (
          <NavLink
            to="/admin"
            className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
          >
            Admin
          </NavLink>
        )}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
          >
            Sair
          </button>
        )}
      </nav>
    </header>
  )
}

export default Header
