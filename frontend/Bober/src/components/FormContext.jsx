import React, { createContext, useContext, useEffect, useState } from 'react'

const FormContext = createContext()

export const FormProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])
  return (
    <FormContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </FormContext.Provider>
  )
}

export const useFormContext = () => useContext(FormContext)
