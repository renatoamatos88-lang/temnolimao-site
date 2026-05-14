# Tem no Limão — Site Institucional & Diretório

Este arquivo é carregado automaticamente em toda conversa com o Claude neste
projeto. Serve como memória persistente e guia rápido.

## O que é
Site institucional + diretório de negócios do bairro do Limão (São Paulo).
Publicado em **www.temnolimao.com.br**.

## Stack atual (fase 1 — site estático)
- **HTML**: `index.html` — estrutura e dados
- **CSS**: `tnl-style.css` — arquivo separado (migrado do inline)
- **JS**: `tnl-app.js` — arquivo separado (migrado do inline)
- Páginas auxiliares: `noticias.html`, `podcast.html`, `vagas.html`
- Logos dos parceiros: pasta `Logo Negocios/` — arquivos WebP locais (400px, q82)
- Imagens otimizadas em **WebP** via `sharp-cli`
- Deploy: Git push → GitHub → Vercel (auto-deploy em ~30s)
- ⚠️ **Não há `defer` no script tag do tnl-app.js** — ordem de execução é crítica

## Repositório & hospedagem
- GitHub: https://github.com/renatoamatos88-lang/temnolimao-site
- Host: Vercel (projeto `temnolimao-site`)
- Domínio: `www.temnolimao.com.br` via cPanel ValueServer
  - DNS `@` → A 216.198.79.1
  - DNS `www` → CNAME 04342f0afc6f244d.vercel-dns-017.com.
- SSL: automático (Let's Encrypt via Vercel)

## Fluxo de deploy
```bash
git add arquivo1 arquivo2
git commit -m "tipo: descrição curta"
git push
# Vercel detecta e publica em ~30s
```

## Convenções de commit
- Idioma: **português**
- Prefixos: `feat:` `fix:` `copy:` `refactor:` `docs:` `chore:`

## Identidade visual — cores Destaque
- **`--limao` (#C8E04A)**: cor principal do site (CTAs gerais, links, destaques de texto)
- **`--amarelo` (#FFC20F)**: cor exclusiva do plano **Destaque** — badge, borda, nome, checks, botão
- Toda referência ao plano Destaque deve usar `--amarelo`, nunca `--limao`

## Analytics & LGPD (ativo desde 09/04/2026)
- **GA4**: ID `G-G4ZK4ZT9XS` — instalado em todas as páginas HTML
- **Google Consent Mode v2**: implementado — GA4 inicia com `analytics_storage: denied`
- **Banner LGPD**: faixa fixa no rodapé com Aceitar/Rejeitar, salva em `localStorage` (`tnl_cookie_consent`)
- **Eventos GA4 customizados** ativos:
  - `cta_click` — parâmetro `cta_id`:
    - `cadastro_negocio` — nav, hero, strip diretório, seção para-negocios, popup
    - `quero_site`, `fale_conosco`, `anunciar`, `parceria`, `vaga_interesse`, `whatsapp_geral`, `ig_follow`
  - `parceiro_whatsapp_click`, `parceiro_site_click`, `filter_category`, `directory_search`
  - Parâmetro `location`: id da section mais próxima, ou `header` / `footer` / `float` / `popup`

## SEO (implementado em 16/04/2026)
- `sitemap.xml` — 4 páginas; `robots.txt` — allow all
- Canonical URLs: `https://www.temnolimao.com.br/...` (com www.)
- Schema.org: WebSite + Organization + areaServed + SearchAction

## Splash screen
- **Vídeo**: `gui-cartoon.webm` (VP8 alpha, 560px, 8s palindrome loop)
- **Fallback iOS**: `lemon-3d.webp` (560px, com canal alpha, animação CSS float)
- **Duração**: 2s após load (skipável por click/tap) + failsafe 3.5s

## Diretório de negócios
- Array `_negociosDefault` no **`tnl-app.js`**
- **43 negócios** cadastrados (IDs 1–43); logos em `Logo Negocios/*.webp`
- Merge automático com `localStorage` via `aplicarDB()` para não perder entries
- Categorias com filtro; paginação: 6 cards visíveis + "Carregar mais"
- Strip de Destaques (`id="destaque-strip"`) no topo do diretório — curadoria manual no JS

## Funil de captação de parceiros (implementado em 14/05/2026)
- **Fluxo:** CTA "Cadastrar negócio" → âncora `#para-negocios` → seção com planos → botão → Tally
- **Formulário Tally (público):** https://tally.so/r/2EkGlD
- **Formulário Tally (editar):** https://tally.so/forms/2EkGlD/edit
- Tally conectado ao Google Sheets (pasta Drive TNL Parceiros) via integração nativa
- **Links de pagamento:** ⚠️ PENDENTE — sócio precisa gerar 2 links no Nubank PJ
  - Parceiro: R$49,90 → link não gerado ainda
  - Destaque: R$99,90 → link não gerado ainda
  - Quando disponíveis: configurar redirect condicional no Tally baseado no plano selecionado
- **PIX recorrente futuro:** Nubank PJ não tem PIX recorrente nativo. Para automação de renovação futura: **Asaas** (recomendado) ou Mercado Pago Assinaturas

## Popup de engajamento (implementado em 14/05/2026)
- Trigger: **10 segundos** OU **40% de scroll** (o que ocorrer primeiro)
- Exibe uma vez por sessão (`sessionStorage` key: `tnl_popup_shown`)
- Conteúdo: card perfil @temnolimao (21k seguidores) + planos Parceiro/Destaque
- Fecha por botão ✕ ou clique fora — `window.tnlPopupDismiss()` é global
- CSS: glassmorphism, layout 2 colunas desktop / coluna no mobile (<600px)

## Seção "Para Negócios" (`id="para-negocios"`)
- Posição na página: entre o diretório e o Podcast
- **Não aparece no menu de navegação** — acessível via CTAs ao longo da página
- Exibe os 2 planos com preços, benefícios e botões para o Tally
- Botões: "Quero ser Parceiro" e "Quero ser Destaque"

## Navegação (estado atual)
- Desktop e mobile: Negócios · Quem Somos · Vagas · Notícias · Podcast *(Em breve)* · Mídia Kit *(Em breve)*
- Botão CTA no header: "Cadastrar negócio" → `#para-negocios`
- Glassmorphism no nav: `background: rgba(22,26,14,0.55)` + `backdrop-filter: blur(20px)`

## Área admin
- Acesso: `www.temnolimao.com.br/#admin`
- Lock client-side — não é login real
- Persistência via `localStorage` (sem sync entre dispositivos)

## ⚠️ Quirk crítico: localStorage vs código
O site carrega dados do `localStorage` se existir, via `aplicarDB()`.
Merge automático: entradas do código que não existam no `localStorage` são adicionadas.

## Convenções de imagem
- **Sempre WebP** via `sharp-cli`: `sharp -i "original.png" -o "nome.webp" -f webp -q 82`
- Para imagens com transparência, usar Node sharp API (sharp-cli perde alpha):
  ```bash
  NODE_PATH="C:\\Users\\ux-de\\AppData\\Roaming\\npm\\node_modules\\sharp-cli\\node_modules" node -e "
  const sharp = require('sharp');
  sharp('input.png').resize(400).webp({quality:82}).toFile('output.webp')
  "
  ```
- PNG/JPG originais no `.gitignore`; nomes em `kebab-case`

## Métricas — estado em 16/04/2026
- 159 usuários (1-16 abr), 98,7% novos, 17s engajamento, 82,3% bounce
- 74,8% Instagram · 20,1% Direct · 4,4% Google · 91% São Paulo
- Relatório Notion: https://www.notion.so/344719e5f03281b88137e600dad11abc

## Sprints — estado atual

### ✅ Sprint 1 — Engajamento (concluído 16/04/2026)
- Splash + GA4 + Banner LGPD + Consent Mode v2

### ✅ Sprint 2 — SEO (concluído 16/04/2026)
- sitemap.xml · robots.txt · Canonical URLs · Schema.org

### ✅ Sprint 2.1 — Analytics CTAs (concluído 05/05/2026)
- Tracking: `cadastro_negocio`, `quero_site`, `anunciar` em nav, hero, banner, footer

### ✅ Sprint 4 — Monetização v1 (concluído 14/05/2026)
- Logos migradas do Figma CDN para `Logo Negocios/` (WebP local)
- Strip de Destaques no topo do diretório
- Strip CTA com planos Parceiro/Destaque abaixo do diretório (layout horizontal no desktop)
- Seção "Para Negócios" com planos e preços (`id="para-negocios"`)
- Funil completo: todos os CTAs → `#para-negocios` → Tally
- Popup de engajamento (Instagram + planos, 10s / 40% scroll)
- Identidade visual Destaque consolidada em `--amarelo` (#FFC20F) em todo o site

### 🔜 Sprint 4.1 — Pagamento (próxima)
- [ ] Sócio gera 2 links no Nubank PJ (R$49,90 e R$99,90)
- [ ] Configurar redirect condicional no Tally (plano selecionado → link correto)
- [ ] Avaliar migração para PIX recorrente (Asaas ou Mercado Pago) quando volume justificar

### 🔜 Sprint 3 — Retenção (pendente)
- Conteúdo rotativo na home
- Captura de contato (push/email)
- Página de Vagas ativa com vagas reais

### 🔜 Sprint 3.1 — Analytics pendente
- Scroll depth: 25%, 50%, 100%
- Botão flutuante WA: `cta_click` / `whatsapp_geral` / `location: float`
- Redes sociais header: `social_click` com `rede` e `location: header`

### 🔜 Pendências visuais / produto
- [ ] **Player de música** — botão flutuante para música "Tem no Limão" do Guigo (arquivo de áudio pendente)
- [ ] **Barra de busca** — reposicionamento em aberto
- [ ] **Mídia Kit** — criar PDF/página; item no nav marcado "Em breve"
- [ ] **Mensagem para o grupo TNL** — rascunho pronto, aguarda envio manual

---

## Decisões fechadas (14/05/2026)

| Tema | Decisão |
|---|---|
| Planos e preços | Parceiro R$49,90 · Destaque R$99,90 |
| Funil de captação | Tally form → pagamento (sem WhatsApp obrigatório) |
| Formulário | https://tally.so/r/2EkGlD |
| Controle de parceiros | Google Sheets no Drive |
| Gateway agora | Nubank PJ — links manuais (sem PIX recorrente) |
| Gateway futuro | Asaas ou Mercado Pago (PIX recorrente + email de renovação) |
| Casa Verde | Adiado — foco no TNL Limão até modelo estar rodando |
| CSS/JS | Arquivos separados (tnl-style.css, tnl-app.js) |

## Decisões em aberto — v2

### 1. Método de autenticação
- Email + senha (recomendado para negócios) ou Magic link
- Aguarda início da v2

### 2. Checkout
- Redirect agora (Nubank) · Embedded na v2
- Confirmar gateway da v2 com sócio (AbacatePay vs Asaas vs MP)

### 3. Expansão por bairros
- Casa Verde adiada; na v2 → multi-tenant com subdomínios

---

## Plano de execução v2
Detalhes em `docs/ROADMAP.md`.
Stack: Next.js 15 + TypeScript + Supabase + Tailwind + shadcn/ui + gateway a definir.

## Ações que requerem confirmação explícita do usuário
- `git push --force`, `git reset --hard`, `rm -rf`, branch delete
- Alterar DNS ou configuração do Vercel
- Publicar mudanças que afetam fluxos críticos

## Documentação neste repositório
- [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md) — estrutura do site
- [`docs/GUIA-EDICAO.md`](docs/GUIA-EDICAO.md) — adicionar/editar conteúdo
- [`docs/DECISOES-PRODUTO.md`](docs/DECISOES-PRODUTO.md) — decisões de produto com histórico
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — migração para v2
