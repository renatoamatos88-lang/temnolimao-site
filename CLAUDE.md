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
  - `cta_click` — todos os CTAs principais do site; parâmetro `cta_id`:
    - `quero_site` — botão "Quero meu site" (hero)
    - `cadastro_negocio` — botão "Cadastre seu negócio" (nav, hero, footer)
    - `fale_conosco` — botão "Fale conosco" / "WhatsApp" (seção fale conosco, footer)
    - `anunciar` — link "Anuncie" (footer)
    - `parceria` — link "Parcerias" (footer)
    - `vaga_interesse` — botão de interesse em vaga (seção vagas)
    - `whatsapp_geral` — botão flutuante WA e outros sem texto específico
    - `ig_follow` — botão "Seguir no Instagram" (hero)
  - Parâmetro `location`: id da `<section>` mais próxima, ou `header` / `footer` / `float`
  - `parceiro_whatsapp_click` — clique no WhatsApp de um parceiro do diretório (não incluso no cta_click)
  - `parceiro_site_click` — clique no site de um parceiro (não incluso no cta_click)
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
- **43 negócios** cadastrados (IDs 1–43 contíguos; cada entrada tem campo `entrada:'YYYY-MM-DD'`)
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
- Eventos GA4 customizados (base)
- Banner LGPD + Consent Mode v2

### ✅ Sprint 2 — SEO (concluído 16/04/2026)
- sitemap.xml + robots.txt
- Canonical URLs corrigidos (www.)
- Schema.org (WebSite + Organization + areaServed)

### ✅ Sprint 2.1 — Analytics CTAs (concluído 05/05/2026)
- Tracking de todos os CTAs principais: `cadastro_negocio`, `quero_site`, `anunciar`
- Cobertura: nav desktop, nav mobile, hero, banner CTA, footer

### 🔜 Sprint 3 — Retenção (maio/2026)
- Conteúdo rotativo na home
- Captura de contato (push/email)
- Página de Vagas ativa com vagas reais

### 🔜 Sprint 3.1 — Analytics pendente (junto com Sprint 3)
- Scroll depth: disparar evento aos 25%, 50% e 100% da página
- Botão flutuante WhatsApp: evento `cta_click` com `cta_id: whatsapp_geral` e `location: float`
- Redes sociais do header (IG, TikTok, YouTube): evento `social_click` com `rede` e `location: header`
- "Fale conosco" na seção Quem Somos: evento `cta_click` com `cta_id: fale_conosco`

### 🔜 Sprint 4 — Monetização (maio/junho/2026)
- Destaque pago no diretório
- Landing pages por categoria
- CTA B2B para donos de negócios

---

## Decisões em aberto — resolver antes de iniciar a v2

### 1. Método de autenticação (login)
Supabase Auth está definido como ferramenta. O **método** ainda não foi decidido:
- **Email + senha**: mais familiar, mais atrito no cadastro
- **Magic link** (link por e-mail): sem senha, boa UX, depende do e-mail do usuário
- **Login social** (Google): menor atrito, mas cria dependência de terceiro
- Recomendação: magic link para moradores + email/senha para negócios e admin

### 2. Gateway de pagamento
- **AbacatePay**: R$0,80 fixo por PIX — ideal para assinaturas baratas (R$25–49/mês), API voltada a SaaS/Next.js, checkout white-label embedded
- **Mercado Pago**: percentual variável, mais reconhecido pelo usuário final, ecossistema maior
- **Stripe**: melhor para cobranças internacionais e webhooks robustos, pode ser retaguarda
- **Decisão pendente com o sócio**: AbacatePay (PIX recorrente principal) + Stripe (fallback/cartão internacional)?

### 3. Checkout: embedded vs redirect
- **Embedded** (dentro do site): melhor UX, mais controle visual, mais complexidade técnica
- **Redirect** (para página do gateway): mais simples de implementar, menos controle
- Roadmap atual indica embedded (Stripe Elements / AbacatePay white-label)
- **Confirmar com sócio** antes de começar a v2

### 4. Expansão por bairros (Casa Verde)
- **Risco alto**: criar repositório separado por bairro gera dívida técnica exponencial
- Cada melhoria precisaria ser replicada manualmente em todos os bairros
- **Opção A**: aguardar v2 com arquitetura multi-tenant (subdomínios via middleware.ts no Next.js)
- **Opção B**: criar repo temporário para Casa Verde com prazo definido de aposentadoria quando v2 estiver pronta
- **Decisão pendente**

### 5. Planos de assinatura
- Quais planos existirão? (ex: Básico, Premium, Destaque)
- Qual o preço de cada um?
- O que cada plano inclui?
- **Decisão de produto — definir antes de codar qualquer coisa de pagamento**

---

## Plano de execução v2 — passo a passo

### Fase 0 — Pré-requisitos (fazer antes de escrever uma linha de código)
- [ ] Decidir método de auth (magic link / email+senha / social)
- [ ] Decidir gateway principal (AbacatePay vs Mercado Pago) com sócio
- [ ] Decidir embedded vs redirect no checkout
- [ ] Definir planos e preços (Básico, Premium, Destaque)
- [ ] Decidir estratégia Casa Verde (aguardar v2 ou repo temporário)
- [ ] Criar contas: Supabase, AbacatePay ou MP, Stripe, Resend, Sentry
- [ ] Ler "Platforms Starter Kit" da Vercel (boilerplate multi-tenant Next.js)

### Fase 1 — Setup e fundação (estimativa: 2–3 dias)
- [ ] Criar repositório Next.js 15 + TypeScript + Tailwind + shadcn/ui
- [ ] Configurar Supabase (banco + auth)
- [ ] Implementar auth com os 3 roles: Admin, Negócio parceiro, Morador
- [ ] Configurar RLS no Supabase desde o primeiro dia (não deixar para depois)
- [ ] Setup JWT em HttpOnly cookies (nunca localStorage para auth)
- [ ] Configurar middleware.ts para roteamento multi-tenant por subdomínio

### Fase 2 — Migração de dados (estimativa: 1–2 dias)
- [ ] Script de seed: exportar array `_negociosDefault` (43 negócios) para Supabase
- [ ] Modelar schema: tabela `negocios` com campos jsonb para horários/links variáveis
- [ ] Adicionar índices B-tree nas chaves de RLS (empresa_id, auth.uid)
- [ ] Validar migração: todos os 43 negócios visíveis na home

### Fase 3 — Admin e dashboard do negócio (estimativa: 3–4 dias)
- [ ] Painel Admin (equipe TNL): CRUD completo de negócios, usuários, planos
- [ ] Dashboard do Negócio parceiro: editar própria listagem, ver métricas básicas
- [ ] Substituir o localStorage admin atual pelo backend real

### Fase 4 — Pagamento (estimativa: 4–5 dias — parte mais complexa)
- [ ] Integrar gateway escolhido (AbacatePay ou MP) para PIX recorrente
- [ ] Configurar webhooks de pagamento (confirmação, falha, cancelamento de assinatura)
- [ ] Stripe como retaguarda para cartão internacional (opcional no MVP)
- [ ] Testar fluxo completo: cadastro → plano → pagamento → acesso liberado

### Fase 5 — Home pública + SEO (estimativa: 2–3 dias)
- [ ] Home com dados do banco (substituir o HTML estático atual)
- [ ] Rotas individuais por negócio: `/negocios/[slug]` com metadados únicos
- [ ] Landing pages por categoria: `/categoria/alimentacao`, etc.
- [ ] Manter GA4 com todos os eventos já mapeados

### Fase 6 — Polish e deploy (estimativa: 2–3 dias)
- [ ] E-mails transacionais via Resend (boas-vindas, reset senha, confirmação de pagamento)
- [ ] Sentry para monitoramento de erros
- [ ] Testes do fluxo completo em staging (Vercel Preview URL)
- [ ] Deploy em produção + migração do domínio `www.temnolimao.com.br`

**Estimativa total MVP: ~3–4 semanas de trabalho efetivo**
(Atenção: webhooks de pagamento e RLS são os pontos de maior atrito — reservar tempo extra)

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
