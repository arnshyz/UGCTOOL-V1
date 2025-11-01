'use client'
type Props = {
  value: string
  onChange: (v: string) => void
}
const STYLES = [
  { id: 'basic', name: 'Basic - Diverse & Flexible' },
  { id: 'fashion', name: 'Fashion/Outfit' },
  { id: 'skincare', name: 'Skincare/Beauty' },
  { id: 'food', name: 'Food/Beverage' },
  { id: 'tech', name: 'Tech/Gadgets' },
]
export default function PromptStyleSelect({ value, onChange }: Props) {
  return (
    <div className="card p-4">
      <p className="text-sm font-medium">Prompt Style</p>
      <select value={value} onChange={e => onChange(e.target.value)} className="mt-2 w-full border rounded-xl px-3 py-2">
        {STYLES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
      <p className="text-xs text-gray-500 mt-2">Pilih style untuk menyesuaikan templat prompt.</p>
    </div>
  )
}
