'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search } from 'lucide-react'

const CATEGORIES = [
  { slug: 'science', label: 'Science & Medicine' },
  { slug: 'technology', label: 'Technology & AI' },
  { slug: 'economics', label: 'Economics' },
  { slug: 'history', label: 'History & Society' },
  { slug: 'people', label: 'People' },
  { slug: 'organizations', label: 'Organizations' },
]

export default function Header() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <header style={{ background: 'var(--primary)', borderBottom: '3px solid var(--primary-dark)' }}>
      {/* Top bar */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl font-bold text-white tracking-tight">i<span style={{ color: '#93c5fd' }}>Pedia</span></span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
            />
          </div>
        </form>

        <Link href="/admin" className="text-xs font-medium px-3 py-1.5 rounded-lg text-white shrink-0"
          style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
          Admin
        </Link>
      </div>

      {/* Category nav */}
      <div className="max-w-6xl mx-auto px-4 pb-2 flex gap-1 overflow-x-auto">
        {CATEGORIES.map(c => (
          <Link key={c.slug} href={`/category/${c.slug}`}
            className="text-xs font-medium px-3 py-1.5 rounded-md whitespace-nowrap transition"
            style={{ color: 'rgba(255,255,255,0.8)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            {c.label}
          </Link>
        ))}
      </div>
    </header>
  )
}
