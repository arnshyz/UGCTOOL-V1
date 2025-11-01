'use client'
import { useState } from 'react'
import Uploader from '@/components/Uploader'
import PromptStyleSelect from '@/components/PromptStyleSelect'

export default function Page() {
  const [productCaptions, setProductCaptions] = useState<string[]>([])
  const [modelCaption, setModelCaption] = useState<string>('')
  const [style, setStyle] = useState('basic')
  const [provider, setProvider] = useState<'openrouter'|'together'|'huggingface'|'openai'>('openrouter')
  const [count, setCount] = useState(8)
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState('')

  function readAsCaption(files: File[], setter: (s: string[]) => void) {
    // For demo we only keep the filenames as "captions"
    const captions = files.map(f => f.name.replace(/[-_]/g,' ').replace(/\.[a-zA-Z0-9]+$/,''))
    setter(captions)
  }

  async function generate() {
    setLoading(true)
    setOutput('')
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({
        provider, style, productCaptions, modelCaption: modelCaption || undefined, count
      })
    })
    const j = await res.json()
    setLoading(false)
    if (!j.ok) { setOutput('Error: ' + j.error); return }
    setOutput(j.text)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-9">
        <div className="card p-6 min-h-[240px] flex items-center justify-center text-gray-400">
          {output ? 
            <pre className="whitespace-pre-wrap text-sm w-full">{output}</pre> :
            <p className="text-sm">Belum ada output. Upload gambar produk dan klik Generate.</p>
          }
        </div>
      </div>
      <div className="lg:col-span-3 space-y-4">
        <div className="text-sm text-gray-500">Upload & Settings</div>
        <Uploader label="Product Images (PNG/JPG, max 3)" multiple accept="image/*" onFiles={(fs)=> readAsCaption(fs, setProductCaptions)} />
        <Uploader label="Model Image (Optional)" accept="image/*" onFiles={(fs)=> setModelCaption(fs[0]?.name || '')} />
        <PromptStyleSelect value={style} onChange={setStyle} />
        <div className="card p-4 space-y-2">
          <label className="text-sm font-medium">Provider</label>
          <select className="w-full border rounded-xl px-3 py-2" value={provider} onChange={e=>setProvider(e.target.value as any)}>
            <option value="openrouter">OpenRouter</option>
            <option value="together">Together</option>
            <option value="huggingface">Hugging Face Inference</option>
            <option value="openai">OpenAI</option>
          </select>
          <label className="text-sm font-medium mt-2">Jumlah ide</label>
          <input type="number" min={1} max={20} value={count} onChange={e=>setCount(parseInt(e.target.value||'1'))} className="w-full border rounded-xl px-3 py-2" />
          <button className="btn-primary w-full mt-2" onClick={generate} disabled={loading || productCaptions.length===0}>
            {loading ? 'Generating…' : 'Generate UGC'}
          </button>
          <p className="text-xs text-gray-500">Kunci API dikelola via environment server. BYO-key.</p>
        </div>
      </div>
    </div>
  )
}
