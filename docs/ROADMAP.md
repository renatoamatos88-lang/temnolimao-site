# Roadmap — Tem no Limão

Visão geral da evolução do produto, das fases e da migração para a
stack definitiva.

## Fase atual (v1) — Site estático monolítico
**Estado:** No ar em `www.temnolimao.com.br`.

**Objetivo:** Validar o formato, capturar negócios, construir presença
no bairro, gerar conteúdo. Amador por dentro, profissional por fora.

**Stack:** HTML puro + Vercel + GitHub.

**Monetização inicial (fase de validação):** Vendas manuais via Instagram.
Cliente paga por fora (PIX, transferência), admin edita o site manualmente
para adicionar/destacar o negócio. Sem processamento automático.

**Limites conhecidos:**
- Não tem login real (só um lock client-side)
- Não tem pagamento automático
- Admin é por navegador (dados não sincronizam)
- Escala mal para milhares de negócios
- Um único repositório por bairro

---

## Fase intermediária — Expansão por bairros
Replicar o formato v1 para outros bairros vizinhos enquanto a v2 é construída:

- Tem na Casa Verde
- (outros bairros)

Cada bairro = repositório próprio + Vercel próprio + domínio próprio.
Ver `CLONAR-PARA-CASA-VERDE.md`.

Objetivo: **acumular conteúdo e audiência** enquanto v2 está em desenvolvimento.
Tudo que for cadastrado aqui será migrado para o banco da v2 no final.

---

## Fase definitiva (v2) — Plataforma completa

### Stack escolhida

| Camada | Tecnologia | Função |
|---|---|---|
| Framework | **Next.js 15** (App Router) + **TypeScript** | SSR, API routes, roteamento |
| Banco + Auth + Storage | **Supabase** | Postgres, autenticação, arquivos |
| Pagamento recorrente | **Stripe** | Assinaturas dos planos |
| Pagamento pontual BR | **Mercado Pago** | PIX, boleto, cartão |
| UI | **Tailwind CSS** + **shadcn/ui** | Componentes e styling |
| Forms | **react-hook-form** + **zod** | Validação type-safe |
| E-mails | **Resend** | Transacionais |
| Monitoramento | **Sentry** | Erros em produção |
| Deploy | **Vercel** (mantém) | Infra |

### Requisitos confirmados
- **3 tipos de usuário** com permissões diferentes:
  1. **Admin** (equipe TNL) — edita tudo, gerencia planos, aprova negócios
  2. **Negócio parceiro** — gerencia sua própria listagem (fotos, horário, contato)
  3. **Morador/visitante** — salva favoritos, recebe notificações, interage
- **Pagamento recorrente** — planos mensais/anuais para negócios listarem
- **Pagamento pontual** — anúncios e destaques por X dias

### Features por prioridade (rascunho — detalhar no plano de arquitetura)

**MVP (v2.0):**
- [ ] Auth com 3 roles (Supabase Auth + RLS)
- [ ] Importação dos dados da v1 (seed script do JSON para Supabase)
- [ ] CRUD de negócios na área admin
- [ ] Dashboard do negócio parceiro (editar própria listagem)
- [ ] Planos de assinatura (Stripe)
- [ ] Home pública atualizada com dados do banco
- [ ] SEO e performance (Next.js server components)
- [ ] E-mails transacionais (boas-vindas, reset senha, confirmação de pagamento)

**v2.1:**
- [ ] Área do morador (favoritos, perfil)
- [ ] Destaques pontuais (Mercado Pago)
- [ ] Notificações (e-mail ou push)
- [ ] Página individual de cada negócio (rota própria, SEO)
- [ ] Busca avançada (filtros combinados, localização)

**v2.2+:**
- [ ] Avaliações/reviews dos moradores
- [ ] Chat morador ↔ negócio
- [ ] Eventos do bairro (calendário, ingressos)
- [ ] Multi-bairro (workspaces na mesma plataforma)

### O que NÃO fazer na v2 (escopo protegido)
- Feed social estilo Instagram — fora do escopo
- Marketplace com carrinho — fora do escopo
- App mobile nativo — PWA resolve por enquanto
- IA generativa pra descrições — fase futura

### Camadas de segurança obrigatórias na v2
- **Senhas**: nunca armazenar, usar Supabase Auth (hash automático)
- **Dados de cartão**: nunca passam pelo servidor — Stripe Elements / MP SDK
- **RLS (Row Level Security)** habilitada em todas as tabelas — segurança no banco
- **Rate limiting** nas rotas sensíveis (login, pagamento, formulários)
- **CSRF protection** nas rotas mutantes
- **Input validation** em toda entrada de usuário (zod)
- **Environment variables** para secrets (nunca commitados)
- **Dependabot + CodeQL** ativos no GitHub
- **Claude Code Review** (ou CodeRabbit) automático em PRs
- **Sentry** para monitorar erros em produção
- **Staging environment** (Vercel Preview URLs) antes de cada merge

### Convenções da v2
- Fluxo Git: `main` (produção) ← PRs ← feature branches
- Commits e PRs em português
- Cada PR passa por revisão (humano + Claude Code Review)
- Cada PR tem Vercel Preview URL para teste visual antes do merge

---

## Timeline estimada (com delegação pesada ao Claude)

| Fase | Esforço efetivo |
|---|---|
| Plano de arquitetura detalhado (schema, fluxos, priorização) | 2-3 dias |
| Setup do projeto + auth base | 2-3 dias |
| Importação dos dados da v1 | 1-2 dias |
| Admin CRUD completo | 3-4 dias |
| Dashboard do negócio parceiro | 3-4 dias |
| Pagamento de planos (Stripe) | 4-5 dias |
| Home + páginas públicas | 2-3 dias |
| Testes, polish, deploy final | 2-3 dias |
| **Total MVP** | **~3-4 semanas de trabalho efetivo** |

Tempo de calendário depende da disponibilidade do usuário para
revisão visual, decisões de produto e testes.

---

## O que fazer antes de começar a v2

1. **Capturar o máximo de conteúdo possível na v1** (negócios, depoimentos, notícias)
2. **Validar o formato comercialmente** (há demanda real? quantos negócios topam pagar? qual preço aceito?)
3. **Definir os planos** (básico, premium, destaque) — quanto custa cada um, o que inclui
4. **Definir termos de uso e política de privacidade** (LGPD)
5. **Abrir uma sessão nova do Claude** com este `CLAUDE.md` como contexto
6. **Pedir o plano de arquitetura detalhado** antes de qualquer código
7. **Criar as contas dos serviços** (Supabase, Stripe, Mercado Pago, Resend, Sentry)

---

## Princípios do projeto

- **Não delegar decisões de produto** ao Claude. Ele ajuda a organizar opções, mas a escolha é do humano.
- **Segurança > velocidade**. Vale a pena gastar 1 dia a mais se ganha proteção.
- **Simples primeiro, elegante depois**. MVP funcional importa mais que código "bonito".
- **Repo limpo, commits descritivos**. Futuro-eu agradece.
- **Documentar decisões importantes** direto nos arquivos do projeto, não em apps externos que somem.
