export const revalidate = 300

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Article } from '@/lib/types'

const CATEGORIES: Record<string, { emoji: string; label: string; color: string; description: string }> = {
  people:        { emoji: '👤', label: 'People',        color: '#f59e0b', description: 'Biographies of scientists, clinicians, innovators, and public figures' },
  organizations: { emoji: '🏛️', label: 'Organizations', color: '#f97316', description: 'Research institutes, companies, foundations, and scientific societies' },
  science:    { emoji: '🔬', label: 'Science & Medicine',     color: '#10b981', description: 'Biology, genetics, oncology, neuroscience, and clinical medicine' },
  technology: { emoji: '💻', label: 'Technology & AI',        color: '#3b82f6', description: 'Computing, artificial intelligence, engineering, and software' },
  economics:  { emoji: '📈', label: 'Economics & Finance',    color: '#8b5cf6', description: 'Markets, economic policy, business history, and finance' },
  history:    { emoji: '🌍', label: 'History & Society',      color: '#ef4444', description: 'World history, culture, politics, and social science' },
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cat = CATEGORIES[slug]
  if (!cat) notFound()

  const supabase = await createClient()
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .eq('category_slug', slug)
    .order('title', { ascending: true })

  return (
    <div>
      {/* Header */}
      <div className="rounded-2xl p-8 mb-8"
        style={{ background: `linear-gradient(135deg, ${cat.color}15, ${cat.color}05)`, border: `1px solid ${cat.color}30` }}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{cat.emoji}</span>
          <h1 className="text-2xl font-bold">{cat.label}</h1>
        </div>
        <p className="text-sm" style={{ color: '#6b7280' }}>{cat.description}</p>
        <p className="text-xs mt-2 font-medium" style={{ color: cat.color }}>
          {articles?.length ?? 0} article{articles?.length !== 1 ? 's' : ''}
        </p>
      </div>

      {articles && articles.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(articles as Article[]).map(article => (
            <Link key={article.id} href={`/${article.category_slug}/${article.slug}`}>
              <div className="card p-5 h-full hover:shadow-md transition-shadow cursor-pointer flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  {article.verified_by && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--verified-light)', color: 'var(--verified)' }}>
                      ✓ Verified
                    </span>
                  )}
                  {article.featured && <span className="text-xs">⭐</span>}
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
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-3xl mb-3">{cat.emoji}</p>
          <p className="font-semibold mb-1">No articles in this category yet</p>
          <Link href="/admin"
            className="inline-block mt-4 px-5 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: 'var(--primary)' }}>
            Add Article →
          </Link>
        </div>
      )}
    </div>
  )
}
