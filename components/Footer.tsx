import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-12 py-8 text-center text-sm" style={{ borderTop: '1px solid var(--border)', color: '#9ca3af' }}>
      <p className="mb-2">
        <span className="font-semibold" style={{ color: 'var(--primary)' }}>iPedia</span>
        {' '}— AI-drafted, expert-verified articles
      </p>
      <p className="text-xs">
        Articles are drafted by AI agents and verified by knowledgeable writers. ·{' '}
        <a href="mailto:etom@buddiespace.app" className="hover:underline" style={{ color: 'var(--primary)' }}>
          Contact
        </a>
        {' · '}
        <Link href="/admin" className="hover:underline" style={{ color: 'var(--primary)' }}>Admin</Link>
      </p>
    </footer>
  )
}
