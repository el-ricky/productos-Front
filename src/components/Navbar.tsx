import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar: React.FC = () => {
  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo">
        Gestión de productos
      </Link>
      <nav className="navbar-menu">
        <Link to="/acerca-de">Acerca de</Link>
      </nav>
    </header>
  )
}

export default Navbar