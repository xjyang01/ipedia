import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Article } from '@/lib/types'

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  let articles: Article[] = []
  if (query) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,summary.ilike.%${query}%,tags.cs.{${query}}`)
      .order('created_at', { ascending: false })
      .limit(20)
    articles = (data ?? []) as Article[]
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">
        {query ? `Results for "${query}"` : 'Search iPedia'}
      </h1>
      {query && (
        <p className="text-sm mb-6" style={{ color: '#9ca3af' }}>
          {articles.length} article{articles.length !== 1 ? 's' : ''} found
        </p>
      )}

      {articles.length > 0 ? (
        <div className="flex flex-col gap-4">
          {articles.map(article => (
            <Link key={article.id} href={`/wiki/${article.slug}`}>
              <div className="card p-5 hover:shadow-md transition-shadow cursor-pointer flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                      {article.category_slug}
                    </span>
                    {article.verified_by && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--verified-light)', color: 'var(--verified)' }}>
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-base mb-1">{article.title}</h3>
                  <p className="text-sm leading-relaxed line-clamp-2" style={{ color: '#6b7280' }}>
                    {article.summary}
                  </p>
                </div>
                <span className="text-xs shrink-0 mt-1" style={{ color: '#9ca3af' }}>{article.read_time}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : query ? (
        <div className="card p-12 text-center">
          <p className="text-3xl mb-3">🔍</p>
          <p className="font-semibold mb-1">No articles found for "{query}"</p>
          <p className="text-sm" style={{ color: '#9ca3af' }}>Try different keywords or browse by category.</p>
        </div>
      ) : null}
    </div>
  )
}
