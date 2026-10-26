import { useCallback, useEffect, useState } from 'react'
import { get } from '../api/client'
import ProjectCard from '../components/ProjectCard'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadProjects = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await get('/projects')
      setProjects(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load projects.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Projects</h1>
      <p className="text-muted mb-8">A selection of my work and experiments.</p>

      {loading && <p className="text-muted">Loading...</p>}

      {!loading && error && (
        <div className="border border-red-200 bg-red-50 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <p className="text-red-600 text-sm flex-1">{error}</p>
          <button
            onClick={loadProjects}
            className="px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <p className="text-muted">No projects published yet.</p>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
