'use client'

interface FreepikResultsProps {
  query: string | null
  loading: boolean
  error: string | null
  items: any[]
}

function findImageUrl(value: any, depth = 0): string | undefined {
  if (depth > 4 || value == null) return undefined
  if (typeof value === 'string') {
    if (/^https?:\/\/[^\s]+\.(?:jpe?g|png|gif|webp)(?:[?#][^\s]*)?$/i.test(value)) {
      return value
    }
    return undefined
  }
  if (Array.isArray(value)) {
    for (const entry of value) {
      const result = findImageUrl(entry, depth + 1)
      if (result) return result
    }
    return undefined
  }
  if (typeof value === 'object') {
    for (const key of Object.keys(value)) {
      const result = findImageUrl((value as Record<string, unknown>)[key], depth + 1)
      if (result) return result
    }
  }
  return undefined
}

function findAssetLink(value: any, depth = 0): string | undefined {
  if (depth > 3 || value == null) return undefined
  if (typeof value === 'string') {
    if (/^https?:\/\/[^\s]+freepik\.com[^\s]*$/i.test(value)) {
      return value
    }
    return undefined
  }
  if (Array.isArray(value)) {
    for (const entry of value) {
      const result = findAssetLink(entry, depth + 1)
      if (result) return result
    }
    return undefined
  }
  if (typeof value === 'object') {
    for (const key of Object.keys(value)) {
      const result = findAssetLink((value as Record<string, unknown>)[key], depth + 1)
      if (result) return result
    }
  }
  return undefined
}

export default function FreepikResults({ query, loading, error, items }: FreepikResultsProps) {
  const hasQuery = Boolean(query)

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="font-semibold">Referensi Freepik</div>
          {hasQuery ? (
            <p className="text-xs text-gray-500">Menampilkan hasil untuk: <span className="font-medium text-gray-700">{query}</span></p>
          ) : (
            <p className="text-xs text-gray-500">Nama file produk pertama dipakai sebagai kata kunci pencarian.</p>
          )}
        </div>
        {loading && <span className="text-xs text-gray-500">Loading…</span>}
      </div>

      {error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : null}

      {!error && hasQuery && !loading && items.length === 0 ? (
        <p className="text-sm text-gray-500">Tidak ada hasil yang cocok. Coba gunakan nama file yang lebih spesifik.</p>
      ) : null}

      {!error && items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {items.slice(0, 12).map((item, idx) => {
            const preview = findImageUrl(item)
            const link = findAssetLink(item) ?? `https://www.freepik.com/search?format=search&query=${encodeURIComponent(query ?? '')}`
            const key = (item && (item.id ?? item.slug ?? item.title)) ?? idx
            return (
              <a
                key={key}
                href={link}
                target="_blank"
                rel="noreferrer"
                className="block group overflow-hidden rounded-xl border border-gray-200"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt={item?.title ?? 'Freepik asset'}
                    className="w-full h-32 object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="w-full h-32 flex items-center justify-center text-xs text-gray-500 bg-gray-100">
                    Preview tidak tersedia
                  </div>
                )}
                <div className="px-3 py-2 text-xs text-gray-600 line-clamp-2 bg-white">
                  {item?.title ?? 'Buka di Freepik'}
                </div>
              </a>
            )
          })}
        </div>
      ) : null}

      {!hasQuery && (
        <p className="text-xs text-gray-500">
          Contoh: ubah nama file menjadi <code>tas-kulit-minimalis.jpg</code> agar pencarian lebih relevan.
        </p>
      )}
    </div>
  )
}
