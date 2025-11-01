'use client'
import { useRef, useState } from 'react'

type Props = {
  label: string
  multiple?: boolean
  onFiles: (files: File[]) => void
  accept?: string
}

export default function Uploader({ label, multiple, onFiles, accept }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [names, setNames] = useState<string[]>([])

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-gray-500">Click to select {multiple ? 'files' : 'file'} or drop here</p>
        </div>
        <button className="btn" onClick={() => inputRef.current?.click()}>Pilih</button>
      </div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          const files = Array.from(e.target.files || [])
          setNames(files.map(f => f.name))
          onFiles(files)
        }}
      />
      {names.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {names.map((n, i) => (
            <span key={i} className="badge">{n}</span>
          ))}
        </div>
      )}
    </div>
  )
}
