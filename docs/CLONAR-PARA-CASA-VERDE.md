# Clonar o site para outro bairro (ex: Casa Verde)

Guia para criar um site novo reutilizando todo o formato do Tem no Limão.
A ideia é ter rapidamente um "Tem na Casa Verde" (ou nome equivalente)
no ar, capturando negócios locais enquanto a plataforma definitiva é construída.

## Estratégia
Cada bairro = **repositório próprio + projeto Vercel próprio + domínio próprio**.

Vantagens:
- Independência total entre sites
- Pode testar mudanças em um sem afetar o outro
- Cada um pode ter sua própria equipe admin
- Migração futura para a v2 é um projeto à parte

Desvantagem:
- Melhorias feitas em um site precisam ser replicadas manualmente nos outros
- Aceitável durante a fase de validação; na v2 (Next.js + Supabase) tudo
  vira um sistema só com múltiplos "espaços" por bairro.

## Passo a passo

### 1. Criar o novo repositório local
```bash
# Fora da pasta atual
cp -r "Site Final" "Site Casa Verde"
cd "Site Casa Verde"
rm -rf .git
git init
```

### 2. Limpar o conteúdo específico do Limão
No `index.html`, substituir:

**Nome e branding:**
- `Tem no Limão` → `Tem na Casa Verde`
- `temnolimao.com.br` → `temnacasaverde.com.br` (quando tiver o domínio)
- URLs do Instagram, WhatsApp institucional, etc.

**Dados:**
- Array `_negociosDefault` — começar vazio ou pré-popular com negócios de Casa Verde
- `noticias`, `podcasts`, `vagas`, `depoimentos` — esvaziar
- `_igCfg` e `_reelsCfg` — atualizar para o Instagram do novo bairro

**Hero:**
- Texto, estatísticas (bairros, moradores), imagens

**Seção "Quem Somos":**
- Texto e foto específicos

### 3. Ajustar identidade visual (opcional)
As cores do tema (`--dark`, `--lime`, etc.) podem ser mantidas — isso cria
uma "família visual" entre os bairros. Ou alteradas para diferenciar.

Se mantiver a mesma paleta, trocar apenas:
- Logo/wordmark
- Nome do bairro em todos os textos
- Cores secundárias (opcional)

### 4. Criar repositório no GitHub
```bash
gh repo create temnacasaverde-site --public --source=. --remote=origin --push
```

Ou manualmente via github.com → novo repositório → copiar remote → push.

### 5. Conectar ao Vercel
- vercel.com → New Project
- Selecionar o novo repositório
- Framework Preset: **Other**
- Root Directory: `./`
- Deploy

Em poucos segundos fica no ar em `temnacasaverde-site.vercel.app`.

### 6. Apontar domínio próprio (quando tiver)
Mesmo processo que foi feito com `temnolimao.com.br`:
1. Comprar domínio (Registro.br, GoDaddy, Hostinger, etc.)
2. Adicionar no Vercel → Domains → Add
3. Copiar os registros DNS mostrados (A + CNAME)
4. Configurar no painel DNS do domínio
5. Aguardar propagação (5 min a 1h)

### 7. Adaptar a área admin
A senha padrão (`SENHA` no código) deve ser **diferente** para cada site.
Busque por `SENHA_KEY` e `const SENHA` no `index.html`.

A chave do localStorage também pode ser diferenciada:
```js
const DB_KEY = 'tncv_db_v1';  // tncv = tem na casa verde
```

Isso evita conflito caso o mesmo admin use múltiplos sites do mesmo navegador.

## Checklist de items para revisar

Antes de publicar o novo bairro, passe por essa lista:

- [ ] Nome do bairro atualizado em todos os textos (Ctrl+F por "Limão")
- [ ] `<title>` e meta tags atualizadas (SEO)
- [ ] Open Graph (`og:title`, `og:description`, `og:image`)
- [ ] Favicon
- [ ] Array `_negociosDefault` limpo ou pré-populado
- [ ] Array `noticias`, `vagas`, `podcasts`, `depoimentos` esvaziados
- [ ] Estatísticas do hero (bairros, moradores, seguidores)
- [ ] Links do Instagram, WhatsApp, redes
- [ ] Foto "Quem Somos" substituída
- [ ] Logo/wordmark substituído
- [ ] Senha admin padrão trocada
- [ ] `DB_KEY` do localStorage diferenciada
- [ ] `.gitignore` ajustado se houver imagens específicas
- [ ] Domínio apontado
- [ ] SSL verificado (automático pela Vercel)
- [ ] Teste de admin (#admin) funcional
- [ ] Teste de responsive mobile

## Fluxo depois de publicado
Idêntico ao TNL atual: editar arquivos → `git add/commit/push` → Vercel
atualiza em ~30s.

## Quando migrar tudo para a v2
Quando a plataforma nova (Next.js + Supabase) estiver pronta, cada site
de bairro deixa de ser um repositório separado e vira um **workspace**
dentro da plataforma única, com dados isolados por bairro no banco.

Toda a captação de conteúdo feita nos sites estáticos **é aproveitada**:
os arrays JS podem ser exportados para JSON e importados no Supabase via
seed script. Não é trabalho perdido, é acúmulo de dados.
