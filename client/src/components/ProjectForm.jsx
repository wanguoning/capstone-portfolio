import { useState } from 'react'

const emptyValues = { title: '', description: '', imageUrl: '', repoUrl: '', liveUrl: '' }

// Normalize optional fields so backend null values never reach .trim().
const normalizeInitial = (init) => ({
  title: init?.title || '',
  description: init?.description || '',
  imageUrl: init?.imageUrl || '',
  repoUrl: init?.repoUrl || '',
  liveUrl: init?.liveUrl || '',
})

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent'
const labelClass = 'block text-sm font-medium mb-1 text-ink'

// Controlled form reused by the Admin page for creating and editing projects.
// Pass initialValues when editing; onSubmit receives the cleaned payload.
export default function ProjectForm({ initialValues = null, onSubmit, submitLabel = 'Save project' }) {
  const [form, setForm] = useState(initialValues ? normalizeInitial(initialValues) : emptyValues)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required.')
      return
    }
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim() || undefined,
        repoUrl: form.repoUrl.trim() || undefined,
        liveUrl: form.liveUrl.trim() || undefined,
      })
      if (!initialValues) setForm(emptyValues)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div>
        <label className={labelClass} htmlFor="project-title">
          Title *
        </label>
        <input
          id="project-title"
          name="title"
          value={form.title}
          onChange={handleChange}
          className={inputClass}
          required
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="project-description">
          Description *
        </label>
        <textarea
          id="project-description"
          name="description"
          rows={4}
          value={form.description}
          onChange={handleChange}
          className={inputClass}
          required
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="project-image">
          Image URL
        </label>
        <input
          id="project-image"
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          className={inputClass}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="project-repo">
            Repository URL
          </label>
          <input
            id="project-repo"
            name="repoUrl"
            value={form.repoUrl}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="project-live">
            Live URL
          </label>
          <input
            id="project-live"
            name="liveUrl"
            value={form.liveUrl}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
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
