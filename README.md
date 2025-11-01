# UGC Prompt Generator — Multi API (BYO-key)

Generator ide konten UGC dari deskripsi gambar produk. Memakai LLM dari beberapa provider.
Tidak menyimpan file. Multi provider dengan **bawa API key sendiri**.

## Fitur
- Upload gambar produk dan opsional gambar model (hanya sebagai keterangan).
- Pilih gaya prompt: basic, fashion, skincare, food, tech.
- Pilih provider: OpenRouter, Together, atau Hugging Face Inference.
- API route `/api/generate` yang menyatukan panggilan ke tiap provider.
- Siap deploy ke Vercel/Node server.

## Quick start
1. `cp .env.example .env` lalu isi key yang Anda punya.
2. `npm i`
3. `npm run dev` dan buka http://localhost:3000
4. Deploy ke Vercel: push repo ini, set environment sesuai `.env`.

## Catatan
- Beberapa provider menyediakan kredit gratis terbatas atau paket gratis. Kebijakan dapat berubah. Gunakan key Anda sendiri.
- Project ini hanya menghasilkan teks prompt UGC. Untuk menghasilkan gambar, sambungkan sendiri ke API image seperti Replicate/Fal/Stable Diffusion di route terpisah.

## Route
UI berada di `/dashboard/ugc-tool`. Halaman root akan redirect ke sana.

### OpenAI
Isi `OPENAI_API_KEY` dan `OPENAI_MODEL` (mis. `gpt-4o-mini`, `gpt-4.1-mini`, dll). Pilih provider **OpenAI** di panel.
