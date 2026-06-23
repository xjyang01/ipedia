import { createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createServiceClient()
  const body = await req.json()

  const { id, tags, ...rest } = body
  const payload = {
    ...rest,
    tags: Array.isArray(tags) ? tags : [],
    verified_by: rest.verified_by || null,
    verified_at: rest.verified_by ? rest.verified_at : null,
  }

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
  const { id, ...payload } = body

  const { data, error } = await supabase.from('articles').update(payload).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const supabase = await createServiceClient()
  const { id } = await req.json()
  const { error } = await supabase.from('articles').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
