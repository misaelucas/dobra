import React from 'react'
import { NavLink } from 'react-router-dom'

function Header() {
  const activeStyle = 'text-blue-500 '

  return (
    <header className="bg-slate-800 text-white p-4 shadow-md">
      <nav className="container mx-auto flex justify-center space-x-4">
        <NavLink
          to="/"
          exact
          className="py-2 px-4 hover:text-gray-300 transition-colors"
          activeClassName={activeStyle}
        >
          Home
        </NavLink>
        <NavLink
          to="/login"
          className="py-2 px-4 hover:text-gray-300 transition-colors"
          activeClassName={activeStyle}
        >
          Login
        </NavLink>
        <NavLink
          to="/admin"
          className="py-2 px-4 hover:text-gray-300 transition-colors"
          activeClassName={activeStyle}
        >
          Admin
        </NavLink>
      </nav>
    </header>
  )
}

export default Header
