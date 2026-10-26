import { Link } from 'react-router-dom'

const skills = [
  'JavaScript',
  'React',
  'Node.js',
  'Express',
  'MongoDB',
  'Tailwind CSS',
  'Git',
  'HTML & CSS',
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-20 md:py-28">
          <p className="text-accent font-medium text-sm tracking-wide">
            Hello, welcome to my portfolio
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-3">Wang Guoning</h1>
          <p className="text-muted text-lg mt-4 max-w-2xl leading-relaxed">
            Computer Science student building web applications with React, Express and MongoDB.
            This site showcases my projects and notes, and hosts my blog on web development.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link
              to="/projects"
              className="px-4 py-2 rounded-md bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-colors"
            >
              View Projects
            </Link>
            <Link
              to="/contact"
              className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Contact Me
            </Link>
          </div>
        </div>
      </section>

      {/* About Me */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold mb-6">About Me</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4 text-muted leading-relaxed">
            <p>
              My name is Wang Guoning (student ID 24998015). I am a Computer Science student
              interested in full-stack web development, databases and software engineering.
            </p>
            <p>
              I enjoy turning ideas into working interfaces, learning new frameworks, and building
              small tools that solve everyday problems. This portfolio and blog are part of my
              Web Data Management and Application capstone project.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Skills</h3>
            <ul className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <li key={skill} className="px-3 py-1 rounded-full bg-gray-100 text-sm text-ink">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex gap-6 text-sm">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:underline"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:underline"
          >
            LinkedIn
          </a>
          <a href="mailto:hello@example.com" className="text-accent hover:underline">
            Email
          </a>
        </div>
      </section>
    </div>
  )
}
