import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'MISSING'
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'MISSING'

  const supabase = createClient(url.trim(), key.trim(), {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  // Try a simple select first
  const { data, error } = await supabase.from('articles').select('id, title').limit(1)

  return NextResponse.json({
    url_length: url.length,
    url_ends_with_slash: url.endsWith('/'),
    url_prefix: url.slice(0, 30),
    key_length: key.length,
    select_error: error ? { message: error.message, code: error.code } : null,
    select_data: data,
  })
}
