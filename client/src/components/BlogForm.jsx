import { useState } from 'react'

const emptyValues = { title: '', content: '' }

const normalizeInitial = (init) => ({
  title: init?.title || '',
  content: init?.content || '',
})

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent'
const labelClass = 'block text-sm font-medium mb-1 text-ink'

// Controlled form reused by the Admin page for creating and editing blog posts.
// Pass initialValues when editing; onSubmit receives the cleaned payload.
export default function BlogForm({ initialValues = null, onSubmit, submitLabel = 'Save post' }) {
  const [form, setForm] = useState(initialValues ? normalizeInitial(initialValues) : emptyValues)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required.')
      return
    }
    try {
      await onSubmit({ title: form.title.trim(), content: form.content })
      if (!initialValues) setForm(emptyValues)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div>
        <label className={labelClass} htmlFor="blog-title">
          Title *
        </label>
        <input
          id="blog-title"
          name="title"
          value={form.title}
          onChange={handleChange}
          className={inputClass}
          required
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="blog-content">
          Content *
        </label>
        <textarea
          id="blog-content"
          name="content"
          rows={8}
          value={form.content}
          onChange={handleChange}
          className={inputClass}
          required
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 rounded-md bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-colors"
      >
        {submitLabel}
      </button>
    </form>
  )
}
