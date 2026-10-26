import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { post } from '../api/client'

// Controlled comment form for a blog post. Used only when the user is logged in.
export default function CommentForm({ postId, onCommented }) {
  const { token } = useAuth()
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!body.trim()) {
      setError('Comment cannot be empty.')
      return
    }
    setSubmitting(true)
    try {
      await post(
        `/blog/${postId}/comments`,
        { body: body.trim() },
        { token, requireAuth: true }
      )
      setBody('')
      if (onCommented) onCommented()
    } catch (err) {
      setError(err.message || 'Failed to post comment.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <textarea
        rows={3}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write a comment..."
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
      />
      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 rounded-md bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-60"
      >
        {submitting ? 'Posting...' : 'Post comment'}
      </button>
    </form>
  )
}
