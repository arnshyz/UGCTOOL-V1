import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { buildSystem, buildUserPrompt } from '@/lib/prompt'
import { providerFromEnv, assertHasKey, Provider } from '@/lib/providers'

const Body = z.object({
  provider: z.enum(['openrouter','together','huggingface','openai']),
  style: z.string().default('basic'),
  productCaptions: z.array(z.string()).min(1),
  modelCaption: z.string().optional(),
  count: z.number().min(1).max(20).default(8),
})

export async function POST(req: NextRequest) {
  try {
    const body = Body.parse(await req.json())
    const system = buildSystem(body.style)
    const user = buildUserPrompt({
      productCaptions: body.productCaptions,
      modelCaption: body.modelCaption,
      count: body.count
    })

    const text = await callProvider(body.provider, system, user)
    return NextResponse.json({ ok: true, text })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ ok: false, error: String(e.message || e) }, { status: 400 })
  }
}

async function callProvider(p: Provider, system: string, user: string): Promise<string> {
  const conf = providerFromEnv(p)
  assertHasKey(p, conf.key)

  if (p === 'openrouter') {
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${conf.key}`,
      },
      body: JSON.stringify({
        model: conf.model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.7
      })
    })
    const j = await r.json()
    return j.choices?.[0]?.message?.content ?? JSON.stringify(j)
  }

  if (p === 'together') {
    const r = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${conf.key}`,
      },
      body: JSON.stringify({
        model: conf.model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.7
      })
    })
    const j = await r.json()
    return j.choices?.[0]?.message?.content ?? JSON.stringify(j)
  }

  if (p === 'huggingface') {
    const r = await fetch(`https://api-inference.huggingface.co/models/${conf.model}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${conf.key}`,
      },
      body: JSON.stringify({ 
        inputs: `${system}\n\n${user}`,
        parameters: { max_new_tokens: 800, temperature: 0.7, return_full_text: false }
      })
    })
    const j = await r.json()
    const text = Array.isArray(j) ? (j[0]?.generated_text ?? '') : (j.generated_text ?? '')
    return text || JSON.stringify(j)
  }

  if (p === 'openai') {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${conf.key}`,
      },
      body: JSON.stringify({
        model: conf.model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.7
      })
    })
    const j = await r.json()
    const text = j.choices?.[0]?.message?.content
    if (text) return text
    // Fallback if error shape
    return JSON.stringify(j)
  }

  throw new Error('Unsupported provider')
}
