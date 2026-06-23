import { createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

function sanitize(body: Record<string, unknown>) {
  return {
    slug:          body.slug,
    title:         body.title,
    summary:       body.summary,
    body:          body.body,
    category_slug: body.category_slug,
    tags:          Array.isArray(body.tags) ? body.tags : [],
    status:        body.status ?? 'draft',
    ai_generated:  body.ai_generated ?? true,
    verified_by:   (body.verified_by as string) || null,
    verified_at:   body.verified_by ? new Date().toISOString() : null,
    featured:      body.featured ?? false,
    read_time:     body.read_time ?? '5 min read',
    updated_at:    new Date().toISOString(),
  }
}

export async function POST(req: NextRequest) {
  const supabase = await createServiceClient()
  const body = await req.json()
  const payload = sanitize(body)

  const { data, error } = await supabase.from('articles').insert(payload).select().single()
  if (error) {
    console.error('Supabase insert error:', JSON.stringify(error))
    return NextResponse.json({ error: error.message + ' | code: ' + error.code }, { status: 400 })
  }
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  const supabase = await createServiceClient()
  const body = await req.json()
  const { id } = body
  const payload = sanitize(body)

  const { data, error } = await supabase.from('articles').update(payload).eq('id', id).select().single()
  if (error) {
    console.error('Supabase update error:', JSON.stringify(error))
    return NextResponse.json({ error: error.message + ' | code: ' + error.code }, { status: 400 })
  }
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const supabase = await createServiceClient()
  const { id } = await req.json()
  const { error } = await supabase.from('articles').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
