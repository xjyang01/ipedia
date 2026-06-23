export const revalidate = 300

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Article } from '@/lib/types'

const CATEGORIES = [
  { slug: 'people',     emoji: '👤', label: 'People & Organizations', color: '#f59e0b' },
  { slug: 'science',    emoji: '🔬', label: 'Science & Medicine',     color: '#10b981' },
  { slug: 'technology', emoji: '💻', label: 'Technology & AI',        color: '#3b82f6' },
  { slug: 'economics',  emoji: '📈', label: 'Economics & Finance',    color: '#8b5cf6' },
  { slug: 'history',    emoji: '🌍', label: 'History & Society',      color: '#ef4444' },
]

function catMeta(slug: string) {
  return CATEGORIES.find(c => c.slug === slug) ?? { emoji: '📄', color: '#6b7280', label: slug }
}

function ArticleCard({ article }: { article: Article }) {
  const c = catMeta(article.category_slug)
  return (
    <Link href={`/${article.category_slug}/${article.slug}`}>
      <div className="card p-5 h-full hover:shadow-md transition-shadow cursor-pointer flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${c.color}20`, color: c.color }}>
            {c.emoji} {c.label}
          </span>
          {article.verified_by && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ background: 'var(--verified-light)', color: 'var(--verified)' }}>
              ✓ Verified
            </span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-base mb-1 leading-snug">{article.title}</h3>
          <p className="text-sm leading-relaxed line-clamp-3" style={{ color: '#6b7280' }}>
            {article.summary}
          </p>
        </div>
        <p className="text-xs" style={{ color: '#9ca3af' }}>{article.read_time}</p>
      </div>
    </Link>
  )
}

export default async function Home() {
  const supabase = await createClient()
  const [{ data: featured }, { data: recent }] = await Promise.all([
    supabase.from('articles').select('*').eq('status', 'published').eq('featured', true).limit(3),
    supabase.from('articles').select('*').eq('status', 'published').order('title', { ascending: true }).limit(50),
  ])

  return (
    <div className="flex flex-col gap-10">

      {/* Hero */}
      <div className="rounded-2xl p-10 text-center"
        style={{ background: 'linear-gradient(135deg, #1a56db, #1341b0)', color: 'white' }}>
        <h1 className="text-4xl font-bold mb-3 tracking-tight">
          i<span style={{ color: '#93c5fd' }}>Pedia</span>
        </h1>
        <p className="text-lg mb-1 opacity-90">The Verified Encyclopedia</p>
        <p className="text-sm opacity-70 max-w-lg mx-auto">
          AI-drafted articles on key topics in science, medicine, technology, economics, and history —
          verified by knowledgeable writers.
        </p>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-lg font-bold mb-4">Browse by Topic</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES.map(c => (
            <Link key={c.slug} href={`/category/${c.slug}`}>
              <div className="card p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-3xl mb-2">{c.emoji}</div>
                <p className="text-xs font-semibold leading-tight">{c.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured */}
      {featured && featured.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-4">⭐ Featured Articles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(featured as Article[]).map(a => <ArticleCard key={a.id} article={a} />)}
          </div>
        </div>
      )}

      {/* Recent */}
      {recent && recent.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-4">Articles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(recent as Article[]).map(a => <ArticleCard key={a.id} article={a} />)}
          </div>
        </div>
      )}

      {/* Empty state */}
      {(!recent || recent.length === 0) && (
        <div className="card p-16 text-center">
          <p className="text-4xl mb-4">📖</p>
          <p className="font-semibold text-lg mb-2">No articles published yet</p>
          <p className="text-sm mb-6" style={{ color: '#9ca3af' }}>
            Go to the admin panel to create and publish the first article.
          </p>
          <Link href="/admin"
            className="inline-block px-6 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: 'var(--primary)' }}>
            Open Admin →
          </Link>
        </div>
      )}
    </div>
  )
}
