import { createServiceClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ArticleForm from '@/components/ArticleForm'
import type { Article, ArticleRef } from '@/lib/types'

export default async function EditArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createServiceClient()

  const [{ data: article }, { data: refs }] = await Promise.all([
    supabase.from('articles').select('*').eq('slug', slug).single(),
    supabase.from('article_refs').select('*').eq('article_id', slug).order('ref_number'),
  ])

  if (!article) notFound()

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Article</h1>
      <ArticleForm article={article as Article} refs={(refs ?? []) as ArticleRef[]} />
    </div>
  )
}
