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

## Área admin
- Acesso: adicionar `/#admin` ao final da URL (ex: `www.temnolimao.com.br/#admin`)
- **Não é login real** — é um lock client-side para edições locais
- Persistência via `localStorage` do navegador (sem sincronização entre dispositivos)
- Senha armazenada em `localStorage` (chave `SENHA_KEY`)

## ⚠️ Quirk crítico: localStorage vs código
O site carrega dados do `localStorage` se existir, via função `aplicarDB()`
(em `index.html` ~linha 2586). Para **não perder** negócios adicionados
diretamente no código (array `_negociosDefault`), há um merge automático:
entradas do código que não existam no `localStorage` são adicionadas.

Ver `docs/ARQUITETURA.md#persistencia` para detalhes.

## Convenções de imagem
- **Sempre WebP** para imagens do site, via `sharp-cli`:
  ```bash
  sharp -i "original.png" -o "nome-kebab-case.webp" -f webp -q 82
  ```
- PNG/JPG originais vão para o `.gitignore` (manter repo leve)
- Nomes em `kebab-case` sem espaços nem acentos

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
- **Tem na Casa Verde** (ou nome similar) — clone do formato atual para bairro vizinho, mesma stack estática, captura de mercado enquanto o site v2 é construído.

## Próxima fase (v2) — stack definitiva
Next.js + TypeScript + Supabase + Stripe + Mercado Pago + Tailwind + shadcn/ui.
Detalhes em `docs/ROADMAP.md`. A migração para v2 deve ser feita em **sessão nova**
do Claude, com este `CLAUDE.md` carregado como contexto.
