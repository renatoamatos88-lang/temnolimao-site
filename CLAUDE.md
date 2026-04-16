# Tem no Limão — Site Institucional & Diretório

Este arquivo é carregado automaticamente em toda conversa com o Claude neste
projeto. Serve como memória persistente e guia rápido.

## O que é
Site institucional + diretório de negócios do bairro do Limão (São Paulo).
Publicado em **www.temnolimao.com.br**.

## Stack atual (fase 1 — site estático)
- **HTML puro** em um único arquivo monolítico: `index.html` (~1.9 MB)
- Sem build tools, sem framework, sem Node no client
- CSS e JS **inline** dentro do `index.html`
- Páginas auxiliares: `noticias.html`, `podcast.html`, `vagas.html`
- Imagens otimizadas em **WebP** via `sharp-cli`
- Deploy: Git push → GitHub → Vercel (auto-deploy em ~30s)

## Repositório & hospedagem
- GitHub: https://github.com/renatoamatos88-lang/temnolimao-site
- Host: Vercel (projeto `temnolimao-site`)
- Domínio: `www.temnolimao.com.br` via cPanel ValueServer
  - DNS `@` → A 216.198.79.1
  - DNS `www` → CNAME 04342f0afc6f244d.vercel-dns-017.com.
- SSL: automático (Let's Encrypt via Vercel)

## Fluxo de deploy
```bash
# Edita arquivos localmente
git add .
git commit -m "tipo: descrição curta"
git push
# Vercel detecta e publica em ~30s
```

## Convenções de commit
- Idioma: **português**
- Prefixos:
  - `feat:` — nova funcionalidade/conteúdo
  - `fix:` — correção de bug
  - `copy:` — ajuste de texto/copy
  - `refactor:` — reorganização sem mudança de comportamento
  - `docs:` — documentação
  - `chore:` — tarefas de manutenção

## Analytics & LGPD (ativo desde 09/04/2026)
- **GA4**: ID `G-G4ZK4ZT9XS` — instalado em todas as páginas HTML
- **Google Consent Mode v2**: implementado — GA4 inicia com `analytics_storage: denied`
- **Banner LGPD**: faixa fixa no rodapé com Aceitar/Rejeitar, salva em `localStorage` (`tnl_cookie_consent`)
- **Eventos GA4 customizados** ativos:
  - `parceiro_whatsapp_click` — clique no WhatsApp de um parceiro do diretório
  - `parceiro_site_click` — clique no site de um parceiro
  - `cadastro_click` — clique em CTA "Cadastre seu negócio" (WhatsApp TNL)
  - `filter_category` — uso de filtro de categoria no diretório
  - `directory_search` — busca no campo de pesquisa do diretório (debounce 1.5s)

## SEO (implementado em 16/04/2026)
- `sitemap.xml` — 4 páginas (index, vagas, noticias, podcast)
- `robots.txt` — allow all + referência ao sitemap
- **Canonical URLs**: `https://www.temnolimao.com.br/...` (com www.)
- **Schema.org**: WebSite + Organization + areaServed (Bairro do Limão) + SearchAction
- **Pendência manual**: solicitar indexação no Search Console para as 4 URLs

## Splash screen
- **Vídeo**: `gui-cartoon.webm` (VP8 alpha, 560px, 8s palindrome loop)
- **Fallback iOS**: `lemon-3d.webp` (560px, com canal alpha, animação CSS float)
- **Duração**: 2s após load (skipável por click/tap) + failsafe 3.5s
- Detecção iOS: `canPlayType('video/webm; codecs="vp8"')` + UA sniffing

## Diretório de negócios
- Array `_negociosDefault` no `index.html` (~linha 2549)
- **44 negócios** cadastrados (último ID: 44)
- Merge automático com `localStorage` via `aplicarDB()` para não perder entries
- Novos clientes do Tally: logos convertidos para WebP local (400px, `sharp-cli`)
- Categorias com filtro: Alimentação, Saúde, Estética, Academia, Eventos, Educação, Tecnologia, Serviços, Drone, Fotografia, Jóias/Acessórios, Loja, Imobiliária, Advocacia, Outro
- Paginação: 6 cards visíveis + "Carregar mais"

## Área admin
- Acesso: adicionar `/#admin` ao final da URL (ex: `www.temnolimao.com.br/#admin`)
- **Não é login real** — é um lock client-side para edições locais
- Persistência via `localStorage` do navegador (sem sincronização entre dispositivos)
- Senha armazenada em `localStorage` (chave `SENHA_KEY`)

## ⚠️ Quirk crítico: localStorage vs código
O site carrega dados do `localStorage` se existir, via função `aplicarDB()`.
Para **não perder** negócios adicionados diretamente no código (array
`_negociosDefault`), há um merge automático: entradas do código que não
existam no `localStorage` são adicionadas.

## Convenções de imagem
- **Sempre WebP** para imagens do site, via `sharp-cli`:
  ```bash
  sharp -i "original.png" -o "nome-kebab-case.webp" -f webp -q 82
  ```
- Para imagens com transparência, usar Node sharp API diretamente (sharp-cli perde alpha):
  ```bash
  NODE_PATH="C:\\Users\\ux-de\\AppData\\Roaming\\npm\\node_modules\\sharp-cli\\node_modules" node -e "
  const sharp = require('sharp');
  sharp('input.png').resize(560,560,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).webp({quality:80,alphaQuality:90}).toFile('output.webp')
  "
  ```
- PNG/JPG originais vão para o `.gitignore` (manter repo leve)
- Nomes em `kebab-case` sem espaços nem acentos

## Métricas — estado em 16/04/2026
- **159 usuários** (1-16 abr), 98,7% novos, 17s engajamento, 82,3% bounce
- **74,8%** do tráfego vem do Instagram, 20,1% Direct, 4,4% Google
- **91% São Paulo** — público-alvo correto
- Relatório completo no Notion: https://www.notion.so/344719e5f03281b88137e600dad11abc
- Template de métricas no Notion: https://www.notion.so/344719e5f0328163871cf03f38b92662

## Sprints — estado atual

### ✅ Sprint 1 — Engajamento (concluído 16/04/2026)
- Splash 4s→2s + skipável por tap
- Eventos GA4 customizados
- Banner LGPD + Consent Mode v2

### ✅ Sprint 2 — SEO (concluído 16/04/2026)
- sitemap.xml + robots.txt
- Canonical URLs corrigidos (www.)
- Schema.org (WebSite + Organization + areaServed)

### 🔜 Sprint 3 — Retenção (maio)
- Conteúdo rotativo na home
- Captura de contato (push/email)
- Página de Vagas ativa com vagas reais

### 🔜 Sprint 4 — Monetização (maio/junho)
- Destaque pago no diretório
- Landing pages por categoria
- CTA B2B para donos de negócios

## Ações que requerem confirmação explícita do usuário
- `git push --force`, `git reset --hard`, `rm -rf`, branch delete
- Alterar DNS ou configuração do Vercel
- Publicar mudanças que afetam fluxos críticos (admin, pagamentos futuros)

## Documentação neste repositório
- [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md) — como o site é estruturado por dentro
- [`docs/GUIA-EDICAO.md`](docs/GUIA-EDICAO.md) — passo a passo para adicionar/editar conteúdo
- [`docs/CLONAR-PARA-CASA-VERDE.md`](docs/CLONAR-PARA-CASA-VERDE.md) — como duplicar o site para outro bairro
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — migração futura para Next.js + Supabase + Stripe

## Projetos paralelos
- **Tem na Casa Verde** (ou nome similar) — clone do formato atual para bairro vizinho, mesma stack estática

## Próxima fase (v2) — stack definitiva
Next.js + TypeScript + Supabase + Stripe + Mercado Pago + Tailwind + shadcn/ui.
Inclui: dashboard analytics integrado no admin (GA4 Data API), multi-tenant.
Detalhes em `docs/ROADMAP.md`.
