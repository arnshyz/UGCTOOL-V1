export type Provider = 'openrouter' | 'together' | 'huggingface' | 'openai'

export function providerFromEnv(p: Provider) {
  switch (p) {
    case 'openrouter':
      return { name: 'OpenRouter', key: process.env.OPENROUTER_API_KEY, model: process.env.OPENROUTER_MODEL || 'openrouter/auto' }
    case 'together':
      return { name: 'Together', key: process.env.TOGETHER_API_KEY, model: process.env.TOGETHER_MODEL || 'meta-llama/Meta-Llama-3-70B-Instruct-Turbo' }
    case 'huggingface':
      return { name: 'Hugging Face Inference', key: process.env.HUGGINGFACE_API_KEY, model: process.env.HF_MODEL || 'mistralai/Mixtral-8x7B-Instruct-v0.1' }
    case 'openai':
      return { name: 'OpenAI', key: process.env.OPENAI_API_KEY, model: process.env.OPENAI_MODEL || 'gpt-4o-mini' }
  }
}

export function assertHasKey(p: Provider, key?: string) {
  if (!key) throw new Error(`API key untuk ${p} belum di-set.`)
}
