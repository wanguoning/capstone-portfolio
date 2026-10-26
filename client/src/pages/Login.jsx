import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { post } from '../api/client'
import { useAuth } from '../context/AuthContext'

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent'
const labelClass = 'block text-sm font-medium mb-1 text-ink'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Where to go after login: the protected page the user came from, else /admin.
  const from = location.state?.from?.pathname || '/admin'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const data = await post('/users/login', {
        email: form.email.trim(),
        password: form.password,
      })
      login({ _id: data._id, username: data.username, email: data.email }, data.token)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Login</h1>
      <p className="text-muted mb-8">Sign in to manage your portfolio and blog.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div>
          <label className={labelClass} htmlFor="login-email">
            Email
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="login-password">
            Password
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full px-4 py-2 rounded-md bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-60"
        >
          {submitting ? 'Signing in...' : 'Login'}
        </button>
      </form>

      <p className="text-sm text-muted mt-6">
        No account yet?{' '}
        <Link to="/register" className="text-accent hover:underline">
          Register
        </Link>
      </p>
    </div>
  )
}
