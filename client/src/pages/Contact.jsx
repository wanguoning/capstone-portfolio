import { useState } from 'react'
import { post } from '../api/client'

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent'
const labelClass = 'block text-sm font-medium mb-1 text-ink'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('All fields are required.')
      return
    }
    setSubmitting(true)
    try {
      await post('/contact', {
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message,
      })
      setSuccess('Thanks for your message. I will get back to you soon.')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setError(err.message || 'Failed to send your message. Please try again later.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Contact</h1>
      <p className="text-muted mb-8">
        Have a project in mind or just want to say hello? Send me a message.
      </p>

      {success && (
        <div className="border border-green-200 bg-green-50 text-green-700 rounded-lg p-4 mb-6 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div>
          <label className={labelClass} htmlFor="contact-name">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="contact-email">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="contact-message">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={6}
            value={form.message}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded-md bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-60"
        >
          {submitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  )
}
