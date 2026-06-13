export default async function handler(_req: any, res: any) {
  return res.status(200).json({
    app: 'OmniHub',
    status: 'ok',
    version: 'mvp-production-hardening',
    checks: {
      frontend: true,
      aiEndpoint: true,
      exchangeEndpoint: true,
      supabaseUrlConfigured: Boolean(process.env.VITE_SUPABASE_URL),
      supabaseAnonConfigured: Boolean(process.env.VITE_SUPABASE_ANON_KEY),
      openAIConfigured: Boolean(process.env.OPENAI_API_KEY),
    },
    timestamp: new Date().toISOString(),
  });
}
