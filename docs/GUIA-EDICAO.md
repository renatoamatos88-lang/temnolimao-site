# Guia de edição — Tem no Limão

Passo a passo prático para atualizar o site sem precisar entender o código
todo. Todos os exemplos editam o arquivo `index.html` na raiz do projeto.

> Depois de qualquer edição, sempre:
> ```bash
> git add .
> git commit -m "tipo: descrição curta"
> git push
> ```
> O Vercel publica automaticamente em ~30 segundos.

## 1. Adicionar um novo negócio

### 1.1. Otimizar a logo
Salve a logo original (PNG/JPG) na pasta do projeto com nome sem espaços
problemáticos. Depois converta para WebP:

```bash
sharp -i "Logo Original.png" -o "logo-nome-negocio.webp" -f webp -q 82
```

Adicione o PNG original ao `.gitignore` para manter o repo leve:
```
# Imagens originais não otimizadas
Logo Original.png
```

### 1.2. Editar o array `_negociosDefault`
No `index.html`, por volta da linha **2258**, existe o array com todos os
negócios. Encontre o último `id` usado (hoje `id:35`) e adicione o próximo.

```js
{ id:36, nome:'Nome do Negócio',  cat:'Alimentação',  desc:'Descrição curta atrativa.',  logo:'logo-nome-negocio.webp',  logoCls:'',  end:'Rua Exemplo, 123 - Limão',  hora:'Seg–Sex 9h–18h',  tipo:'wpp', wpp:'5511999999999' },
```

**Campos:**
- `id` — número único sequencial
- `nome` — nome exibido no card
- `cat` — categoria (deve existir em `const CATS`; se não, adicione ali também)
- `desc` — descrição de até ~100 caracteres
- `logo` — caminho relativo do arquivo `.webp`
- `logoCls` — `''` (padrão), `'lg'` (logo maior), ou `'dark'` (logo com fundo escuro)
- `end` — endereço completo (vira link para Google Maps)
- `hora` — horário de funcionamento em texto livre
- `tipo` — `'wpp'` para WhatsApp, `'site'` para site externo
- `wpp` — número com código do país (ex: `5511999999999`) — usado se `tipo:'wpp'`
- `siteUrl` — URL completa — usado se `tipo:'site'`
- `paused: true` — opcional, esconde o card sem apagar

### 1.3. Categorias
Lista oficial está em:
```js
const CATS = ['Todos','Alimentação','Saúde','Estética','Academia','Eventos','Educação','Tecnologia','Serviços','Drone','Fotografia'];
```
Adicione novas aqui se necessário. Também considere adicionar um emoji
correspondente na função `getCatEmoji()` logo acima.

## 2. Editar um negócio existente
Use `Ctrl+F` no editor, procure pelo `nome` do negócio dentro de
`_negociosDefault` e altere os campos desejados.

**⚠️ Atenção ao localStorage:** Se você editou um negócio no código, mas
o navegador de quem acessa já tem ele salvo no `localStorage`, a versão
antiga continuará aparecendo até que:
- O cache/dados do site sejam limpos, ou
- A entrada seja editada via admin (`#admin`) e salva por cima

Para alterações importantes, avise os admins para limparem o cache ou
fazerem a edição também pelo admin.

## 3. Adicionar notícia, podcast, vaga ou depoimento

Mesma lógica dos negócios. Os arrays ficam no `index.html`:
- `noticias` — busque por `let noticias = [`
- `podcasts` — busque por `let podcasts = [`
- `vagas` — busque por `let vagas = [`
- `depoimentos` — busque por `let depoimentos = [`

Cada array tem a própria estrutura. Abra um item existente como referência
e copie o formato.

## 4. Alterar textos do hero (home)

Os textos do hero ficam no HTML, não nos arrays. Busque por:
- **Slide A** (institucional): `tnl-hero-slide-a`
- **Slide B** (Instagram): `tnl-hero-slide-b`

Altere os textos dentro das tags `<h1>`, `<p class="tnl-hero-subtitle">`, etc.

## 5. Alterar a foto "Quem Somos"
1. Salve a nova foto na pasta do projeto
2. Converta para WebP:
   ```bash
   sharp -i "nova-foto.png" -o "quem-somos.webp" -f webp -q 82
   ```
3. Se o nome for diferente de `quem-somos.webp`, atualize a referência
   no `index.html` (`<img class="tnl-qs-img" src="quem-somos.webp" ...>`)
4. Adicione o PNG/JPG original ao `.gitignore`

## 6. Adicionar nova página (estilo noticias.html)
1. Copie `noticias.html` como base
2. Renomeie para o novo nome
3. Atualize o `<title>`, `<h1>` e conteúdo
4. Mantenha o mesmo `<head>` (fontes assíncronas)
5. Adicione link na navegação do `index.html`

## 7. Mudar cores do tema
No topo do CSS inline do `index.html`, procure por:
```css
:root {
  --dark: #161a0e;
  --lime: #b8ec3a;
  /* ... outras variáveis */
}
```
Alterações aqui refletem em todo o site.

## 8. Troubleshooting

### "Minha alteração no código não aparece no site"
Possíveis causas:
1. **Você não fez push ainda** — `git push`
2. **Vercel ainda está publicando** — espere ~30s e atualize (Ctrl+F5)
3. **localStorage sobrescrevendo** — o admin local tem versão diferente.
   Entre em `/#admin` e verifique/atualize, ou limpe o cache do navegador.
4. **Cache do navegador** — Ctrl+Shift+R força reload

### "O site quebrou depois do meu push"
1. Veja o último commit: `git log -1`
2. Reverta rapidamente: `git revert HEAD && git push`
3. Investigue com calma depois

### "Imagem ficou muito pesada"
Use `sharp-cli` com qualidade menor:
```bash
sharp -i "original.png" -o "nome.webp" -f webp -q 70
```

## 9. O que NÃO mexer sem cuidado
- Estrutura do `<div id="admin-overlay">` — pode quebrar o admin
- Função `aplicarDB()` e `renderCards()` — são o coração do carregamento
- Meta tags do `<head>` (SEO, Open Graph)
- Arquivo `.gitignore` (só adicione, raramente remova)
