'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Article, ArticleRef, ArticleSection } from '@/lib/types'
import { Plus, Trash2 } from 'lucide-react'

const CATEGORIES = [
  { slug: 'people',     label: 'People' },
  { slug: 'organizations', label: 'Organizations' },
  { slug: 'science',    label: 'Science & Medicine' },
  { slug: 'technology', label: 'Technology & AI' },
  { slug: 'economics',  label: 'Economics & Finance' },
  { slug: 'history',    label: 'History & Society' },
]

type Props = {
  article?: Article
  refs?: ArticleRef[]
}

export default function ArticleForm({ article, refs = [] }: Props) {
  const router = useRouter()
  const isEdit = !!article

  const [form, setForm] = useState({
    title: article?.title ?? '',
    slug: article?.slug ?? '',
    summary: article?.summary ?? '',
    category_slug: article?.category_slug ?? 'science',
    status: article?.status ?? 'draft',
    ai_generated: article?.ai_generated ?? true,
    verified_by: article?.verified_by ?? '',
    featured: article?.featured ?? false,
    read_time: article?.read_time ?? '5 min read',
    tags: article?.tags?.join(', ') ?? '',
  })

  const [sections, setSections] = useState<ArticleSection[]>(
    article?.body && article.body.length > 0
      ? article.body
      : [{ heading: 'Introduction', content: '' }]
  )

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function autoSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  function addSection() {
    setSections(s => [...s, { heading: '', content: '' }])
  }

  function removeSection(i: number) {
    setSections(s => s.filter((_, idx) => idx !== i))
  }

  function updateSection(i: number, field: 'heading' | 'content', val: string) {
    setSections(s => s.map((sec, idx) => idx === i ? { ...sec, [field]: val } : sec))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean)
    const payload = {
      ...form,
      tags,
      body: sections,
      verified_by: form.verified_by || null,
      verified_at: form.verified_by ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }

    const res = await fetch('/api/admin/article', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, id: article?.id }),
    })

    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'Failed to save'); setLoading(false); return }

    setSuccess('Saved!')
    setLoading(false)
    setTimeout(() => router.push('/admin'), 800)
  }

  const inputClass = "w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2"
  const inputStyle = { borderColor: '#e5e7eb', background: 'var(--card)' }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Basic info */}
      <div className="card p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-sm uppercase tracking-wide" style={{ color: '#9ca3af' }}>Basic Info</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input required value={form.title} onChange={e => {
            setForm(f => ({ ...f, title: e.target.value, slug: isEdit ? f.slug : autoSlug(e.target.value) }))
          }} className={inputClass} style={inputStyle} placeholder="Article title" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug *</label>
          <input required value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
            className={inputClass} style={inputStyle} placeholder="url-friendly-slug" />
          <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>URL: /wiki/{form.slug || 'slug'}</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Summary *</label>
          <textarea required rows={3} value={form.summary}
            onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
            className={inputClass + ' resize-none'} style={inputStyle}
            placeholder="1-2 sentence summary shown in article cards and at the top of the article" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select required value={form.category_slug}
              onChange={e => setForm(f => ({ ...f, category_slug: e.target.value }))}
              className={inputClass} style={inputStyle}>
              {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}
              className={inputClass} style={inputStyle}>
              <option value="draft">Draft</option>
              <option value="verified">Verified (not public)</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Verified by</label>
            <input value={form.verified_by} onChange={e => setForm(f => ({ ...f, verified_by: e.target.value }))}
              className={inputClass} style={inputStyle} placeholder="Expert name (optional)" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Read time</label>
            <input value={form.read_time} onChange={e => setForm(f => ({ ...f, read_time: e.target.value }))}
              className={inputClass} style={inputStyle} placeholder="5 min read" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
          <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
            className={inputClass} style={inputStyle} placeholder="genetics, cancer, epigenetics" />
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.ai_generated}
              onChange={e => setForm(f => ({ ...f, ai_generated: e.target.checked }))} />
            AI-drafted
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.featured}
              onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
            ⭐ Featured
          </label>
        </div>
      </div>

      {/* Body sections */}
      <div className="card p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm uppercase tracking-wide" style={{ color: '#9ca3af' }}>Article Sections</h2>
          <button type="button" onClick={addSection}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium"
            style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Plus size={13} /> Add Section
          </button>
        </div>

        {sections.map((sec, i) => (
          <div key={i} className="flex flex-col gap-2 p-4 rounded-xl" style={{ background: 'var(--muted)' }}>
            <div className="flex items-center gap-2">
              <input value={sec.heading}
                onChange={e => updateSection(i, 'heading', e.target.value)}
                placeholder="Section heading"
                className="flex-1 border rounded-lg px-3 py-1.5 text-sm font-semibold outline-none"
                style={{ borderColor: '#e5e7eb', background: 'white' }} />
              {sections.length > 1 && (
                <button type="button" onClick={() => removeSection(i)}
                  className="p-1.5 rounded-lg hover:bg-red-50 transition" style={{ color: '#ef4444' }}>
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <textarea rows={6} value={sec.content}
              onChange={e => updateSection(i, 'content', e.target.value)}
              placeholder="Section content (use blank lines to separate paragraphs)"
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none resize-y"
              style={{ borderColor: '#e5e7eb', background: 'white', fontFamily: 'Georgia, serif', lineHeight: 1.7 }} />
          </div>
        ))}
      </div>

      {error && <p className="text-sm px-4 py-3 rounded-xl bg-red-50 text-red-600">{error}</p>}
      {success && <p className="text-sm px-4 py-3 rounded-xl bg-green-50 text-green-700">{success}</p>}

      <div className="flex gap-3">
        <button type="button" onClick={() => router.push('/admin')}
          className="flex-1 py-3 rounded-xl text-sm border font-medium"
          style={{ borderColor: 'var(--border)' }}>
          Cancel
        </button>
        <button type="submit" disabled={loading}
          className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
          style={{ background: 'var(--primary)' }}>
          {loading ? 'Saving...' : success ? 'Saved ✓' : isEdit ? 'Save Changes' : 'Create Article'}
        </button>
      </div>
    </form>
  )
}
