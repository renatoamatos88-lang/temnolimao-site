// Vercel Serverless Function
// Lê parceiros aprovados do Airtable e retorna JSON pro site.
// Endpoint: GET /api/parceiros
//
// Env vars necessárias (configuradas no painel Vercel):
//   - AIRTABLE_TOKEN: Personal Access Token com escopo data.records:read na base Parceiros

const BASE_ID = 'appZ2fnxgGjGZDJpt';
const TABLE = 'Negócios';
const VIEW = 'Aprovados (site)';

module.exports = async function handler(req, res) {
  // CORS — permite o site consumir de qualquer origem (mesmo sendo mesma-origem, útil pra dev)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const TOKEN = process.env.AIRTABLE_TOKEN;
  if (!TOKEN) {
    return res.status(500).json({ error: 'AIRTABLE_TOKEN não configurado' });
  }

  const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE)}`
    + `?view=${encodeURIComponent(VIEW)}`
    + `&pageSize=100`;

  try {
    const r = await fetch(url, {
      headers: { 'Authorization': `Bearer ${TOKEN}` }
    });

    if (!r.ok) {
      const txt = await r.text().catch(() => '');
      return res.status(r.status).json({
        error: 'Airtable API error',
        status: r.status,
        detail: txt.slice(0, 500)
      });
    }

    const data = await r.json();

    // Transforma pro formato que o site espera (mesmo shape de _negociosDefault)
    const parceiros = (data.records || []).map(rec => {
      const f = rec.fields || {};
      const logoArr = Array.isArray(f['Logo']) ? f['Logo'] : [];
      const logoUrl = logoArr[0] && logoArr[0].url ? logoArr[0].url : '';

      return {
        airtableId: rec.id,
        nome: f['Nome'] || '',
        cat: f['Categoria'] || 'Outro',
        desc: f['Descrição'] || '',
        end: f['Endereço'] || '',
        wpp: String(f['Whatsapp'] || '').replace(/\D/g, ''),
        insta: f['Instagram'] || '',
        site: f['Site'] || '',
        logo: logoUrl,
        email: f['Email'] || '',
        resp: f['Responsável'] || ''
      };
    });

    // Cache edge 60s + stale-while-revalidate 5min
    // Quer dizer: Vercel guarda a resposta por 60s, e por até 5 min serve stale
    // enquanto revalida em background. Aprovações novas aparecem em ~1 min.
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

    return res.status(200).json({
      ok: true,
      count: parceiros.length,
      parceiros
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Erro ao buscar do Airtable',
      message: err.message
    });
  }
};
