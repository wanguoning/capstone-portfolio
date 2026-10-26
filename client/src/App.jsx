import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import { setNavigateHandler } from './api/client'

function AppShell() {
  const navigate = useNavigate()

  // Expose navigate() to the API client so a 401 can redirect to /login.
  useEffect(() => {
    setNavigateHandler(navigate)
  }, [navigate])

  return (
    <div className="min-h-screen flex flex-col bg-white text-ink">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <div className="max-w-5xl mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-semibold mb-2">Page not found</h1>
                <p className="text-muted">The page you are looking for does not exist.</p>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
