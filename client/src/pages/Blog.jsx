import { useCallback, useEffect, useState } from 'react'
import { get } from '../api/client'
import BlogPostCard from '../components/BlogPostCard'

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadPosts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await get('/blog')
      setPosts(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load blog posts.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Blog</h1>
      <p className="text-muted mb-8">Notes on web development, learning and projects.</p>

      {loading && <p className="text-muted">Loading...</p>}

      {!loading && error && (
        <div className="border border-red-200 bg-red-50 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <p className="text-red-600 text-sm flex-1">{error}</p>
          <button
            onClick={loadPosts}
            className="px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <p className="text-muted">No blog posts published yet.</p>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <BlogPostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
