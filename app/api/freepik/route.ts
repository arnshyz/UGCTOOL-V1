import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const QuerySchema = z.object({
  q: z.string().min(1, 'Parameter "q" wajib diisi'),
  page: z.coerce.number().int().min(1).max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  sort: z.string().optional(),
  type: z.string().optional(),
  orientation: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const query = QuerySchema.parse(Object.fromEntries(req.nextUrl.searchParams))
    const key = process.env.FREEPIK_API_KEY

    if (!key) {
      return NextResponse.json({ ok: false, error: 'FREEPIK_API_KEY belum di-set.' }, { status: 500 })
    }

    const params = new URLSearchParams()
    params.set('term', query.q)
    params.set('page', String(query.page ?? 1))
    params.set('limit', String(query.limit ?? 24))
    params.set('locale', 'en-US')
    if (query.sort) params.set('sort', query.sort)
    if (query.type) params.set('type', query.type)
    if (query.orientation) params.set('orientation', query.orientation)

    const res = await fetch(`https://api.freepik.com/v1/resources?${params.toString()}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${key}`,
      }
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json(
        { ok: false, error: 'Gagal memanggil Freepik API', status: res.status, details: text?.slice(0, 2000) },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json({ ok: true, data })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ ok: false, error: err?.message || 'Unknown error' }, { status: 400 })
  }
}
