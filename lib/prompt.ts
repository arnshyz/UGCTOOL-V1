export function buildSystem(style: string) {
  const map: Record<string, string> = {
    basic: 'Anda adalah asisten kreatif yang membuat ide UGC netral untuk berbagai kategori.',
    fashion: 'Anda adalah stylist e-commerce. Fokus pada pose, latar sederhana, dan detail bahan.',
    skincare: 'Anda adalah creator skincare. Tekankan langkah rutin, tekstur, dan keamanan penggunaan.',
    food: 'Anda adalah fotografer makanan. Fokus pada komposisi, props sederhana, dan lighting lembut.',
    tech: 'Anda adalah reviewer gadget. Sorot fitur kunci, demo singkat, dan call-to-action ringkas.'
  }
  return map[style] ?? map.basic
}

export function buildUserPrompt(params: {
  productCaptions: string[]
  modelCaption?: string
  count: number
}) {
  const { productCaptions, modelCaption, count } = params
  const productList = productCaptions.map((t, i) => `- Produk ${i+1}: ${t}`).join('\n')
  const modelLine = modelCaption ? `Model: ${modelCaption}` : 'Model: opsional'
  return `Buat ${count} ide konten UGC singkat untuk foto atau video pendek. 
${modelLine}
Produk:
${productList}

Format keluaran:
- Judul singkat
- Deskripsi 1-2 kalimat
- Angle kamera
- Setting/latar
- Arah pose/aksi
- Hook CTA ringkas

Gunakan bahasa Indonesia.`
}
