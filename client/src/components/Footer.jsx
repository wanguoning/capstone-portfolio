export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between gap-4 text-sm text-muted">
        <p>© {new Date().getFullYear()} Wang Guoning (24998015). All rights reserved.</p>
        <div className="flex gap-5">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-accent transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-accent transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="mailto:hello@example.com"
            className="hover:text-accent transition-colors"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  )
}
