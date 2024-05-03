import React, { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode' // Make sure to correct the import statement

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null) // Define the userRole state
  const [loading, setLoading] = useState(true) // Define the loading state

  const login = (token) => {
    localStorage.setItem('token', token)
    try {
      const decoded = jwtDecode(token)
      setIsAuthenticated(true)
      setUserRole(decoded.role)
    } catch (error) {
      console.error('Error decoding token:', error)
      setIsAuthenticated(false)
      setUserRole(null)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    setUserRole(null)
  }
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setIsAuthenticated(true)
        setUserRole(decoded.role)
      } catch (error) {
        console.error('Failed to decode JWT:', error)
        setIsAuthenticated(false)
        setUserRole(null)
      }
    }
    setLoading(false)
  }, [])

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        userRole,
        setUserRole,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
