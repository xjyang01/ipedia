import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Article, ArticleRef } from '@/lib/types'

export const revalidate = 300

const CATEGORIES: Record<string, { emoji: string; label: string; color: string }> = {
  people:     { emoji: '👤', label: 'People & Organizations', color: '#f59e0b' },
  science:    { emoji: '🔬', label: 'Science & Medicine',     color: '#10b981' },
  technology: { emoji: '💻', label: 'Technology & AI',        color: '#3b82f6' },
  economics:  { emoji: '📈', label: 'Economics & Finance',    color: '#8b5cf6' },
  history:    { emoji: '🌍', label: 'History & Society',      color: '#ef4444' },
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const [{ data: article }, { data: refs }] = await Promise.all([
    supabase.from('articles').select('*').eq('slug', slug).eq('status', 'published').single(),
    supabase.from('article_refs').select('*').eq('article_id', slug).order('ref_number'),
  ])

  if (!article) notFound()

  const a = article as Article
  const cat = CATEGORIES[a.category_slug] ?? { emoji: '📄', label: a.category_slug, color: '#6b7280' }

  return (
    <div className="max-w-3xl mx-auto">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6" style={{ color: '#9ca3af' }}>
        <Link href="/" className="hover:underline" style={{ color: 'var(--primary)' }}>iPedia</Link>
        <span>›</span>
        <Link href={`/category/${a.category_slug}`} className="hover:underline" style={{ color: 'var(--primary)' }}>
          {cat.label}
        </Link>
        <span>›</span>
        <span>{a.title}</span>
      </div>

      {/* Article header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: `${cat.color}20`, color: cat.color }}>
            {cat.emoji} {cat.label}
          </span>
          {a.verified_by && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
              style={{ background: 'var(--verified-light)', color: 'var(--verified)' }}>
              ✓ Verified by {a.verified_by}
            </span>
          )}
          {a.ai_generated && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'var(--ai-light)', color: 'var(--ai)' }}>
              🤖 AI-drafted
            </span>
          )}
          <span className="text-xs" style={{ color: '#9ca3af' }}>{a.read_time}</span>
        </div>

        <h1 className="text-3xl font-bold mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
          {a.title}
        </h1>
        <p className="text-base leading-relaxed font-medium border-l-4 pl-4"
          style={{ color: '#4b5563', borderColor: 'var(--primary)' }}>
          {a.summary}
        </p>
      </div>

      {/* Table of contents */}
      {a.body && a.body.length > 1 && (
        <div className="card p-5 mb-8">
          <p className="text-sm font-bold mb-3">Contents</p>
          <ol className="list-decimal list-inside flex flex-col gap-1">
            {a.body.map((section, i) => (
              <li key={i}>
                <a href={`#section-${i}`} className="text-sm hover:underline"
                  style={{ color: 'var(--primary)' }}>
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Article body */}
      <div className="article-body">
        {a.body && a.body.map((section, i) => (
          <div key={i} id={`section-${i}`} className="mb-8">
            <h2 className="text-xl font-bold mb-3 pb-1"
              style={{ fontFamily: 'Georgia, serif', borderBottom: '1px solid var(--border)' }}>
              {section.heading}
            </h2>
            {section.content.split('\n\n').map((para, j) => (
              <p key={j}>{para}</p>
            ))}
          </div>
        ))}
      </div>

      {/* References */}
      {refs && refs.length > 0 && (
        <div className="mt-10 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
          <h2 className="text-base font-bold mb-4">References</h2>
          <ol className="list-decimal list-inside flex flex-col gap-2">
            {(refs as ArticleRef[]).map(ref => (
              <li key={ref.id} className="text-sm" style={{ color: '#4b5563' }}>
                {ref.authors && <span>{ref.authors}. </span>}
                {ref.url ? (
                  <a href={ref.url} target="_blank" rel="noopener noreferrer"
                    className="hover:underline" style={{ color: 'var(--primary)' }}>
                    {ref.title}
                  </a>
                ) : ref.title}
                {ref.year && <span> ({ref.year})</span>}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Tags */}
      {a.tags && a.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {a.tags.map(tag => (
            <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`}>
              <span className="text-xs px-3 py-1 rounded-full hover:opacity-80 transition"
                style={{ background: 'var(--muted)', color: '#6b7280' }}>
                #{tag}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
