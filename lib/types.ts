export type Category = {
  id: string
  name: string
  slug: string
  description: string
  emoji: string
  article_count: number
}

export type ArticleSection = {
  heading: string
  content: string
}

export type Article = {
  id: string
  slug: string
  title: string
  summary: string
  body: ArticleSection[]
  category_slug: string
  tags: string[]
  status: 'draft' | 'verified' | 'published'
  ai_generated: boolean
  verified_by: string | null
  verified_at: string | null
  featured: boolean
  read_time: string
  view_count: number
  created_at: string
  updated_at: string
}

export type ArticleRef = {
  id: string
  article_id: string
  ref_number: number
  title: string
  authors: string | null
  year: number | null
  url: string | null
}
