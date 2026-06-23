import { createServiceClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Article } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'

export default async function AdminPage() {
  const supabase = await createServiceClient()
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  const all = (articles ?? []) as Article[]
  const published = all.filter(a => a.status === 'published')
  const drafts = all.filter(a => a.status !== 'published')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">iPedia Admin</h1>
          <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>
            {published.length} published · {drafts.length} drafts
          </p>
        </div>
        <Link href="/admin/new"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition"
          style={{ background: 'var(--primary)' }}>
          + New Article
        </Link>
      </div>

      {all.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-3xl mb-3">📝</p>
          <p className="font-semibold mb-4">No articles yet</p>
          <Link href="/admin/new"
            className="inline-block px-6 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: 'var(--primary)' }}>
            Create First Article →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {all.map(article => (
            <div key={article.id} className="card p-5 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    article.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : article.status === 'verified'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {article.status}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                    {article.category_slug}
                  </span>
                  {article.featured && <span className="text-xs">⭐</span>}
                  {article.verified_by && (
                    <span className="text-xs" style={{ color: 'var(--verified)' }}>✓ {article.verified_by}</span>
                  )}
                </div>
                <p className="font-semibold truncate">{article.title}</p>
                <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
                  {formatDistanceToNow(new Date(article.updated_at), { addSuffix: true })}
                  {' · '}{article.read_time}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {article.status === 'published' && (
                  <Link href={`/wiki/${article.slug}`} target="_blank"
                    className="text-xs px-3 py-1.5 rounded-lg border hover:bg-gray-50 transition"
                    style={{ borderColor: 'var(--border)' }}>
                    View
                  </Link>
                )}
                <Link href={`/admin/edit/${article.slug}`}
                  className="text-xs px-3 py-1.5 rounded-lg text-white hover:opacity-90 transition"
                  style={{ background: 'var(--primary)' }}>
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
