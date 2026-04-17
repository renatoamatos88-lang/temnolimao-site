// Vercel Serverless Function
// Busca Open Graph tags de uma URL externa e retorna JSON estruturado.
// Endpoint: GET /api/link-preview?url=https://...
//
// Usado no admin (aba Notícias) para auto-preencher campos a partir de um link.

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const target = req.query.url;
  if (!target || !/^https?:\/\//i.test(target)) {
    return res.status(400).json({ error: 'Parâmetro "url" inválido ou ausente.' });
  }

  try {
    const response = await fetch(target, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TemNoLimaoBot/1.0; +https://www.temnolimao.com.br)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      return res.status(502).json({ error: `Site retornou status ${response.status}` });
    }

    const html = await response.text();

    const pick = (re) => {
      const m = html.match(re);
      return m ? m[1].trim().replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>') : '';
    };

    const meta = (prop) => pick(new RegExp(`<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)["']`, 'i'))
                        || pick(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${prop}["']`, 'i'));

    const titulo   = meta('og:title') || meta('twitter:title') || pick(/<title[^>]*>([^<]+)<\/title>/i);
    const excerpt  = meta('og:description') || meta('twitter:description') || meta('description');
    const img      = meta('og:image') || meta('twitter:image');
    const siteName = meta('og:site_name');
    const autor    = meta('article:author') || meta('author') || siteName;
    const pubTime  = meta('article:published_time') || meta('og:updated_time') || '';

    let data = '';
    if (pubTime) {
      const dt = new Date(pubTime);
      if (!isNaN(dt)) {
        const meses = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
        data = `${dt.getDate()} ${meses[dt.getMonth()]} ${dt.getFullYear()}`;
      }
    }

    const leit = excerpt ? `${Math.max(2, Math.round(excerpt.split(/\s+/).length / 50))} min` : '';

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json({
      titulo, excerpt, img, autor, data, leit,
      fonte: target,
      siteName,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Falha ao buscar URL: ' + err.message });
  }
};
