import React, { useEffect, useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useAppContext } from '../contexts/AppContext' // Verify the path

function Header() {
  const { isAuthenticated, setIsAuthenticated, userRole, setUserRole } =
    useAppContext()

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setIsAuthenticated(true)
        setUserRole(decoded.role)
      } catch (error) {
        console.error('Error decoding token:', error)
        setIsAuthenticated(false)
        setUserRole('')
      }
    }
  }, [setIsAuthenticated, setUserRole])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    setUserRole('')
    navigate('/login')
  }
  return (
    <header className="bg-slate-800 text-white p-4 shadow-md">
      <nav className="container mx-auto flex justify-center ring-2 ring-green-400/50 rounded-xl space-x-4">
        {isAuthenticated && (
          <NavLink
            to="/form"
            className="text-gray-300 hover:bg-green-500 hover:scale-125 hover:text-white transition duration-300 ease-in-out rounded-md px-3 py-2 text-sm font-medium"
          >
            Formulário
          </NavLink>
        )}
        {!isAuthenticated && (
          <NavLink
            to="/login"
            className="text-gray-300 hover:bg-green-500 hover:scale-125 hover:text-white transition duration-300 ease-in-out rounded-md px-3 py-2 text-sm font-medium"
          >
            Login
          </NavLink>
        )}
        {isAuthenticated &&
          (userRole === 'admin' || userRole === 'receptionist') && (
            <NavLink
              to="/admin"
              className="text-gray-300 hover:bg-green-500 hover:scale-125 hover:text-white transition duration-300 ease-in-out rounded-md px-3 py-2 text-sm font-medium"
            >
              Admin
            </NavLink>
          )}
        {isAuthenticated && userRole === 'admin' && (
          <>
            <NavLink
              to="/despesas"
              className="text-gray-300 hover:bg-green-500 hover:scale-125 hover:text-white transition duration-300 ease-in-out rounded-md px-3 py-2 text-sm font-medium"
            >
              Despesas
            </NavLink>
          </>
        )}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="text-gray-300 hover:bg-green-500 hover:scale-125 hover:text-white transition duration-300 ease-in-out rounded-md px-3 py-2 text-sm font-medium"
          >
            Sair
          </button>
        )}
      </nav>
    </header>
  )
}

export default Header
