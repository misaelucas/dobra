import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAppContext } from '../contexts/AppContext'

const ProtectedRoute = ({ element: Element, roles = [] }) => {
  const { isAuthenticated, userRole } = useAppContext()

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (roles.length && !roles.includes(userRole)) {
    // Redirect to an unauthorized page or back to home if role is not allowed
    return <Navigate to="/" />
  }

  return <Element />
}

export default ProtectedRoute
