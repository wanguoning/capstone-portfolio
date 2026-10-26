import { useCallback, useEffect, useState } from 'react'
import { get, post, put, del } from '../api/client'
import { useAuth } from '../context/AuthContext'
import ProjectForm from '../components/ProjectForm'
import BlogForm from '../components/BlogForm'

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
}

const tabButtonClass = (active) =>
  `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
    active ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-ink'
  }`

const actionButtonClass =
  'px-3 py-1.5 rounded-md border border-gray-300 text-sm hover:bg-gray-50 transition-colors'

export default function Admin() {
  const { token, user } = useAuth()
  const [tab, setTab] = useState('projects')

  // Projects state
  const [projects, setProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [projectsError, setProjectsError] = useState('')
  const [projectMode, setProjectMode] = useState('idle') // idle | create | edit
  const [editingProject, setEditingProject] = useState(null)

  // Blog state
  const [posts, setPosts] = useState([])
  const [postsLoading, setPostsLoading] = useState(true)
  const [postsError, setPostsError] = useState('')
  const [postMode, setPostMode] = useState('idle') // idle | create | edit
  const [editingPost, setEditingPost] = useState(null)

  const loadProjects = useCallback(async () => {
    setProjectsLoading(true)
    setProjectsError('')
    try {
      const data = await get('/projects', { token, requireAuth: true })
      setProjects(Array.isArray(data) ? data : [])
    } catch (err) {
      setProjectsError(err.message || 'Failed to load projects.')
    } finally {
      setProjectsLoading(false)
    }
  }, [token])

  const loadPosts = useCallback(async () => {
    setPostsLoading(true)
    setPostsError('')
    try {
      const data = await get('/blog', { token, requireAuth: true })
      setPosts(Array.isArray(data) ? data : [])
    } catch (err) {
      setPostsError(err.message || 'Failed to load blog posts.')
    } finally {
      setPostsLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadProjects()
    loadPosts()
  }, [loadProjects, loadPosts])

  // ---- Project handlers ----
  const handleProjectCreate = async (payload) => {
    await post('/projects', payload, { token, requireAuth: true })
    setProjectMode('idle')
    loadProjects()
  }

  const handleProjectUpdate = async (payload) => {
    await put(`/projects/${editingProject._id}`, payload, { token, requireAuth: true })
    setProjectMode('idle')
    setEditingProject(null)
    loadProjects()
  }

  const handleProjectDelete = async (project) => {
    if (!window.confirm('Delete this project? This action cannot be undone.')) return
    try {
      await del(`/projects/${project._id}`, { token, requireAuth: true })
      loadProjects()
    } catch (err) {
      setProjectsError(err.message || 'Failed to delete project.')
    }
  }

  const cancelProjectForm = () => {
    setProjectMode('idle')
    setEditingProject(null)
  }

  // ---- Blog handlers ----
  const handlePostCreate = async (payload) => {
    await post('/blog', payload, { token, requireAuth: true })
    setPostMode('idle')
    loadPosts()
  }

  const handlePostUpdate = async (payload) => {
    await put(`/blog/${editingPost._id}`, payload, { token, requireAuth: true })
    setPostMode('idle')
    setEditingPost(null)
    loadPosts()
  }

  const handlePostDelete = async (post) => {
    if (!window.confirm('Delete this post? This action cannot be undone.')) return
    try {
      await del(`/blog/${post._id}`, { token, requireAuth: true })
      loadPosts()
    } catch (err) {
      setPostsError(err.message || 'Failed to delete post.')
    }
  }

  const cancelPostForm = () => {
    setPostMode('idle')
    setEditingPost(null)
  }

  const isAuthor = (post) => post.author?._id === user?._id

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-muted mb-8">Manage your portfolio projects and blog posts.</p>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 mb-8">
        <button
          className={tabButtonClass(tab === 'projects')}
          onClick={() => setTab('projects')}
        >
          Projects
        </button>
        <button className={tabButtonClass(tab === 'blog')} onClick={() => setTab('blog')}>
          Blog Posts
        </button>
      </div>

      {/* ---- Projects panel ---- */}
      {tab === 'projects' && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Projects</h2>
            {projectMode === 'idle' && (
              <button
                onClick={() => setProjectMode('create')}
                className="px-3 py-1.5 rounded-md bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-colors"
              >
                New Project
              </button>
            )}
          </div>

          {projectMode === 'create' && (
            <div className="border border-gray-200 rounded-xl p-5 mb-6 bg-gray-50">
              <h3 className="font-medium mb-4">New Project</h3>
              <ProjectForm onSubmit={handleProjectCreate} submitLabel="Create Project" />
            </div>
          )}

          {projectMode === 'edit' && editingProject && (
            <div className="border border-gray-200 rounded-xl p-5 mb-6 bg-gray-50">
              <h3 className="font-medium mb-4">Edit Project</h3>
              <ProjectForm
                initialValues={editingProject}
                onSubmit={handleProjectUpdate}
                submitLabel="Update Project"
              />
              <button onClick={cancelProjectForm} className="mt-3 text-sm text-muted hover:text-ink">
                Cancel
              </button>
            </div>
          )}

          {projectsLoading && <p className="text-muted">Loading...</p>}

          {projectsError && (
            <div className="border border-red-200 bg-red-50 text-red-600 rounded-lg p-4 text-sm mb-4">
              {projectsError}
            </div>
          )}

          {!projectsLoading && !projectsError && projects.length === 0 && (
            <p className="text-muted">No projects yet.</p>
          )}

          <ul className="space-y-3">
            {projects.map((project) => (
              <li
                key={project._id}
                className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <div className="flex-1">
                  <p className="font-medium">{project.title}</p>
                  <p className="text-sm text-muted line-clamp-2">{project.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingProject(project)
                      setProjectMode('edit')
                    }}
                    className={actionButtonClass}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleProjectDelete(project)} className={actionButtonClass}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---- Blog panel ---- */}
      {tab === 'blog' && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Blog Posts</h2>
            {postMode === 'idle' && (
              <button
                onClick={() => setPostMode('create')}
                className="px-3 py-1.5 rounded-md bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-colors"
              >
                New Post
              </button>
            )}
          </div>

          {postMode === 'create' && (
            <div className="border border-gray-200 rounded-xl p-5 mb-6 bg-gray-50">
              <h3 className="font-medium mb-4">New Post</h3>
              <BlogForm onSubmit={handlePostCreate} submitLabel="Create Post" />
            </div>
          )}

          {postMode === 'edit' && editingPost && (
            <div className="border border-gray-200 rounded-xl p-5 mb-6 bg-gray-50">
              <h3 className="font-medium mb-4">Edit Post</h3>
              <BlogForm
                initialValues={editingPost}
                onSubmit={handlePostUpdate}
                submitLabel="Update Post"
              />
              <button onClick={cancelPostForm} className="mt-3 text-sm text-muted hover:text-ink">
                Cancel
              </button>
            </div>
          )}

          {postsLoading && <p className="text-muted">Loading...</p>}

          {postsError && (
            <div className="border border-red-200 bg-red-50 text-red-600 rounded-lg p-4 text-sm mb-4">
              {postsError}
            </div>
          )}

          {!postsLoading && !postsError && posts.length === 0 && (
            <p className="text-muted">No blog posts yet.</p>
          )}

          <ul className="space-y-3">
            {posts.map((post) => (
              <li
                key={post._id}
                className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <div className="flex-1">
                  <p className="font-medium">{post.title}</p>
                  <p className="text-sm text-muted">
                    {post.author?.username} · {formatDate(post.createdAt)}
                  </p>
                </div>
                {isAuthor(post) && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingPost(post)
                        setPostMode('edit')
                      }}
                      className={actionButtonClass}
                    >
                      Edit
                    </button>
                    <button onClick={() => handlePostDelete(post)} className={actionButtonClass}>
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
