// Renders one portfolio project on the Projects grid.
export default function ProjectCard({ project }) {
  const { title, description, imageUrl, repoUrl, liveUrl, user } = project

  return (
    <article className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow flex flex-col">
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="w-full h-44 object-cover" loading="lazy" />
      ) : (
        <div className="w-full h-44 bg-gray-100 flex items-center justify-center text-muted text-sm">
          No image
        </div>
      )}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted text-sm leading-relaxed line-clamp-3">{description}</p>
        {user?.username && <p className="text-xs text-muted">by {user.username}</p>}
        <div className="mt-auto flex gap-4 pt-2">
          {repoUrl && (
            <a
              href={repoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-accent hover:underline"
            >
              Code
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-accent hover:underline"
            >
              Live Demo
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
