import React, { createContext, useContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode' // Named import as per your project's structure

const AppContext = createContext()

export const useAppContext = () => useContext(AppContext)

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode(token) // Use the function correctly
        const isExpired = decoded.exp * 1000 < Date.now()
        if (!isExpired) {
          setIsAuthenticated(true)
          setUserRole(decoded.role)
        } else {
          logout()
        }
      } catch (error) {
        console.log('Failed to decode JWT:', error)
        logout()
      }
    }
  }, [])

  const login = (token) => {
    localStorage.setItem('token', token)
    try {
      const decoded = jwtDecode(token)
      setIsAuthenticated(true)
      setUserRole(decoded.role)
    } catch (error) {
      console.error('Error decoding token:', error)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    setUserRole(null)
  }

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        userRole,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
