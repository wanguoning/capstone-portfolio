function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Renders the comments array passed from the Blog Detail page.
export default function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return <p className="text-sm text-muted">No comments yet. Be the first to comment.</p>
  }

  return (
    <ul className="space-y-4">
      {comments.map((comment) => (
        <li key={comment._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">{comment.author?.username || 'Anonymous'}</span>
            <span className="text-xs text-muted">{formatDate(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-ink mt-2 whitespace-pre-line">{comment.body}</p>
        </li>
      ))}
    </ul>
  )
}
