import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { get } from '../api/client'
import { useAuth } from '../context/AuthContext'
import CommentList from '../components/CommentList'
import CommentForm from '../components/CommentForm'

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogDetail() {
  const { id } = useParams()
  const { token } = useAuth()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadPost = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await get(`/blog/${id}`)
      setPost(data)
    } catch (err) {
      setError(err.message || 'Failed to load this post.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadPost()
  }, [loadPost])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-muted">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="border border-red-200 bg-red-50 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <p className="text-red-600 text-sm flex-1">{error}</p>
          <button
            onClick={loadPost}
            className="px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50 transition-colors"
          >
            Retry
          </button>
        </div>
        <Link to="/blog" className="inline-block mt-4 text-sm text-accent hover:underline">
          Back to Blog
        </Link>
      </div>
    )
  }

  if (!post) return null

  // Split the body into paragraphs on blank lines; preserve single line breaks inside.
  const paragraphs = (post.content || '').split(/\n{2,}/).filter((p) => p.trim() !== '')

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <Link to="/blog" className="text-sm text-muted hover:text-accent transition-colors">
        &larr; Back to Blog
      </Link>

      <h1 className="text-3xl font-bold mt-4">{post.title}</h1>
      <p className="text-sm text-muted mt-2">
        {post.author?.username} · {formatDate(post.createdAt)}
      </p>

      <div className="mt-8 space-y-4 text-ink leading-relaxed">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        <CommentList comments={post.comments || []} />

        <div className="mt-8">
          {token ? (
            <CommentForm postId={post._id} onCommented={loadPost} />
          ) : (
            <p className="text-sm text-muted">
              Please{' '}
              <Link
                to="/login"
                state={{ from: { pathname: `/blog/${post._id}` } }}
                className="text-accent hover:underline"
              >
                log in
              </Link>{' '}
              to leave a comment.
            </p>
          )}
        </div>
      </section>
    </article>
  )
}
