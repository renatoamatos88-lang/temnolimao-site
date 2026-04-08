# Arquitetura — Site Tem no Limão (v1 estático)

Explicação de como o site funciona por dentro. Use este doc como mapa quando
precisar mexer em algo estruturalmente.

## Visão geral

```
┌─────────────────────────────────────────────────────┐
│  Navegador do usuário                               │
│                                                     │
│  ┌──────────────┐   ┌──────────────┐                │
│  │ index.html   │   │ localStorage │                │
│  │ (~1.9 MB)    │◄──┤ (admin data) │                │
│  └──────────────┘   └──────────────┘                │
│         │                                           │
│         ├── CSS inline (tema, layout, animações)    │
│         ├── JS inline (render, filtros, admin)      │
│         └── Arrays de dados (negócios, notícias...) │
└─────────────────────────────────────────────────────┘
                        ▲
                        │
                   HTTPS/CDN
                        │
┌─────────────────────────────────────────────────────┐
│  Vercel (edge CDN global)                           │
│  Serve os arquivos estáticos                        │
└─────────────────────────────────────────────────────┘
                        ▲
                        │
                    git push
                        │
┌─────────────────────────────────────────────────────┐
│  GitHub                                             │
│  renatoamatos88-lang/temnolimao-site                │
└─────────────────────────────────────────────────────┘
```

## Estrutura de arquivos

```
Site Final/
├── CLAUDE.md                 # Memória do projeto para o Claude
├── .gitignore                # Ignora .claude/, PNGs originais, etc.
├── index.html                # Tudo mora aqui: home + admin + JS + CSS
├── noticias.html             # Página dedicada de notícias
├── podcast.html              # Página dedicada de podcast
├── vagas.html                # Página dedicada de vagas
├── quem-somos.webp           # Foto da equipe (otimizada)
├── logo-doce-mordida.webp    # Logos de negócios locais (WebP)
├── logo-vivian-piacenti.webp
└── docs/                     # Documentação
    ├── ARQUITETURA.md
    ├── GUIA-EDICAO.md
    ├── CLONAR-PARA-CASA-VERDE.md
    └── ROADMAP.md
```

## Dentro do index.html

O arquivo é grande, mas segue uma ordem previsível. Use os marcadores de
comentário (`/* ═══ */` e `// ── ──`) como índice.

### Seções principais (em ordem de aparição)

1. **`<head>`** — metadados, fontes (async), favicons
2. **CSS inline** — ~2000 linhas
   - Variáveis CSS (`--dark`, `--lime`, etc.)
   - Reset + base
   - Hero (carrossel A/B)
   - Seções: Quem Somos, Negócios, Notícias, Podcast, Vagas, Depoimentos
   - Admin overlay (escopado em `#admin-overlay`)
   - Responsive (`@media (max-width: 768px)`)
3. **`<body>`**
   - Header/nav
   - Hero com 2 slides (A: "Tem no Limão", B: "Instagram")
   - Sessões de conteúdo
   - Footer
   - Admin overlay (escondido, só aparece com `#admin`)
4. **JavaScript inline** — ~1500 linhas
   - Arrays de dados (`_negociosDefault`, `vagas`, `podcasts`, etc.)
   - Funções de render (`renderCards`, `renderNews`, etc.)
   - Admin (CRUD, auth por senha, persistência)
   - Hero carrossel

## Dados: fluxo completo

### 1. Fonte de verdade no código
```js
// Por volta da linha 2258
const _negociosDefault = [
  { id:1, nome:'Migui', cat:'Materiais Elétricos', ... },
  { id:2, nome:'Fridali Shop', ... },
  // ... até id:35
];
let negocios = [..._negociosDefault];
```

Outros arrays seguem o mesmo padrão:
- `vagas` — vagas de emprego
- `podcasts` — episódios do podcast
- `noticias` — notícias do bairro
- `depoimentos` — depoimentos de clientes

### 2. Carregamento na página
```js
// Linha ~3361
const _savedDB = carregarDB();           // Lê localStorage
if (_savedDB) aplicarDB(_savedDB);       // Faz merge com defaults
renderFilterBar();
renderCards();
renderPodcast();
renderNews();
renderDep();
renderVagas();
```

### 3. Merge inteligente (`aplicarDB`)
Quando existe dado no `localStorage`, o código **preserva** tudo que o admin
salvou e adiciona as entradas novas do código que ainda não existiam:

```js
if (db.negocios) {
  const idsDB = new Set(db.negocios.map(n => n.id));
  const novas = _negociosDefault.filter(n => !idsDB.has(n.id));
  negocios = [...db.negocios, ...novas];
}
```

Isso resolve o problema "adicionei negócio no código e não apareceu":
o merge garante que tudo do código é aplicado sobre o localStorage,
sem sobrescrever edições feitas pelo admin.

### 4. Render
`renderCards()` lê `negocios`, filtra por categoria ativa e busca,
respeita `paused` (soft-delete), e injeta HTML no `#cards-grid`.

## Área admin

### Acesso
- URL: `#admin` ativa o overlay (linha ~3353)
- Senha: prompt simples, validada contra `localStorage[SENHA_KEY]`
- Senha padrão inicial definida na constante `SENHA`

### O que o admin faz
- CRUD completo de todos os arrays (negocios, vagas, podcasts, noticias, depoimentos)
- Configurações de seções (visibilidade, links de nav)
- Alterar senha
- Exportar/importar JSON do DB
- Zerar tudo (volta aos defaults do código)

### ⚠️ Limitações importantes
- **Dados só ficam no navegador do admin**. Se o admin edita no celular,
  as mudanças não aparecem no desktop, e vice-versa.
- Em caso de limpar o cache/dados do navegador, tudo volta aos defaults.
- **Não é seguro** para dados sensíveis. É um editor local, não um CMS.

### Persistência
```js
const DB_KEY    = 'tnl_db_v1';       // chave do localStorage
const SENHA_KEY = 'tnl_senha';        // chave da senha

function salvarDB() {
  const db = { negocios, vagas, podcasts, noticias, depoimentos, config, reels, igCfg };
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}
```

## Hero carrossel
- Dois slides: A (institucional) e B (Instagram)
- Fade automático a cada ~8s
- Dots clicáveis para navegar manualmente
- Em mobile, o slide A tem `background: var(--dark)` para evitar "vazamento"
  de conteúdo do slide B durante a transição

## Responsive
- Breakpoint principal: `@media (max-width: 768px)`
- Containers de grid usam `min-width: 0` para não overflowar em telas estreitas
- Botões do hero têm `min-height: 44px` (touch target mínimo)
- Fontes usam `clamp()` para escalar suavemente

## Segurança do admin (leve)
- `DOMPurify` carregado para sanitizar HTML em notícias antes de salvar
  (notícias permitem HTML rico)
- `escText()` e `escAttr()` para escape em render de cards
- **Não há autenticação server-side** — qualquer um com acesso ao
  navegador pode descobrir e editar o `localStorage`. Por isso a v2
  precisa de backend real.

## Por que tudo em um arquivo só?
Pragmatismo: o site começou num gerador no-code (Figma Make) e foi
extraído como HTML puro. Para a fase de validação, monolítico é mais
rápido para editar e deploy. Na v2 isso vira componentes separados em Next.js.
