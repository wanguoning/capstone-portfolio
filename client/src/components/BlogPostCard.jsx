import { Link } from 'react-router-dom'

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Renders one blog post preview on the Blog list page.
export default function BlogPostCard({ post }) {
  return (
    <article className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold">
        <Link to={`/blog/${post._id}`} className="hover:text-accent transition-colors">
          {post.title}
        </Link>
      </h3>
      <p className="text-xs text-muted mt-1">
        {post.author?.username} · {formatDate(post.createdAt)}
      </p>
      <p className="text-muted text-sm leading-relaxed mt-3 line-clamp-3">{post.content}</p>
      <Link to={`/blog/${post._id}`} className="inline-block mt-3 text-sm text-accent hover:underline">
        Read more
      </Link>
    </article>
  )
}
