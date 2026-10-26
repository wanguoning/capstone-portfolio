import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm transition-colors ${
      isActive ? 'text-accent font-medium' : 'text-muted hover:text-ink'
    }`

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg tracking-tight" onClick={closeMenu}>
          Wang Guoning
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {publicLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
          {token ? (
            <>
              <NavLink to="/admin" className={linkClass}>
                Admin Dashboard
              </NavLink>
              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-2 text-sm rounded-md border border-gray-300 text-ink hover:bg-gray-50 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={linkClass}>
                Register
              </NavLink>
            </>
          )}
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-md text-muted hover:bg-gray-100"
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <nav className="md:hidden border-t border-gray-200 px-4 py-2 flex flex-col gap-1">
          {publicLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClass}
              end={link.to === '/'}
              onClick={closeMenu}
            >
              {link.label}
            </NavLink>
          ))}
          {token ? (
            <>
              <NavLink to="/admin" className={linkClass} onClick={closeMenu}>
                Admin Dashboard
              </NavLink>
              <button
                onClick={handleLogout}
                className="mt-1 px-3 py-2 text-sm rounded-md border border-gray-300 text-ink hover:bg-gray-50 transition-colors text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass} onClick={closeMenu}>
                Login
              </NavLink>
              <NavLink to="/register" className={linkClass} onClick={closeMenu}>
                Register
              </NavLink>
            </>
          )}
        </nav>
      )}
    </header>
  )
}
