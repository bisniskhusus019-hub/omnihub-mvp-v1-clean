export default async function handler(req: any, res: any) {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD', {
      headers: { Accept: 'application/json' },
    });
    const data = await response.json();

    if (!response.ok || data.result === 'error') {
      return res.status(200).json({ mode: 'fallback', base: 'USD', rates: null, updatedAt: null });
    }

    return res.status(200).json({
      mode: 'live',
      base: data.base_code || 'USD',
      rates: data.rates || {},
      updatedAt: data.time_last_update_utc || null,
    });
  } catch {
    return res.status(200).json({ mode: 'fallback', base: 'USD', rates: null, updatedAt: null });
  }
}
