# Portfólio — Diogo Silva

Site pessoal, single-owner: marketing digital, SEO, conteúdo, web. Serve também como índice de projetos (`projects.html`).

## Stack

- **Frontend:** HTML + CSS + JS vanilla, sem build step.
- **Backend:** nenhum.
- **Base de dados:** nenhuma.
- **Estilos:** CSS puro com custom properties (`:root` em `assets/css/style.css`).
- **Testes:** nenhum.

## Como correr

Abrir `index.html` no browser, ou:

```bash
npx serve .
```

## Estrutura

- `assets/css/style.css` — base partilhada entre páginas (reset, nav, footer, botões, `.reveal`). Mexer aqui afeta as duas páginas.
- `assets/css/home.css` / `assets/css/projects.css` — só o que é exclusivo de cada página. Classe `.project-card` tem implementações **diferentes** em cada ficheiro (cartão grande com overlay no index, cartão de catálogo no projects) — não copiar estilos de um para o outro sem verificar o contexto.
- `assets/js/main.js` / `assets/js/projects.js` — cada página carrega só o seu próprio script.

## Convenções

- Ficheiros CSS/JS `kebab-case` ou `camelCase.js` conforme o `universal-project-structure.pdf` do utilizador.
- Imagens em `assets/img/`, nome descritivo (não `img1.jpg`).

## Regras deste projeto

- Site 100% estático — não introduzir framework, bundler ou dependências sem pedido explícito.
- Cada projeto novo entra em **dois sítios**: cartão em destaque no `index.html` (secção `#projetos`) e cartão completo no `projects.html` (grelha com filtro `data-category`).
- Logos com fundo sólido próprio (branco, cor de marca) usam a variante `.project-logo-thumb.framed` — evita que o filtro `grayscale`/`brightness` do cartão padrão estrague o logo.

## Decisões tomadas

- 2026-08-04 — Reestruturado de `index.html`/`projects.html` com CSS e JS inline para `assets/css/` + `assets/js/`, seguindo o template "Estático HTML" do `universal-project-structure.pdf` do utilizador. Motivo: ficheiros inline de 30k+ chars eram impossíveis de editar em segurança.
- 2026-08-04 — Pasta `imagens/` renomeada para `assets/img/` (convenção do template).
- 2026-08-04 — Projeto EsDomusTech (`https://esdomustech.lovable.app/`) adicionado como mais recente, com o logo oficial da marca como capa (`assets/img/domustech-logo.jpg`), usando a variante `.project-logo-thumb.framed`.
- 2026-08-07 — Nome da marca corrigido de "DomusTech" para "EsDomusTech" em todo o site.
- 2026-08-09 — Projeto "Fiat Flow Tracker" adicionado (index.html + projects.html). Usa thumb `.project-logo-thumb` com ícone SVG inline (sem asset de imagem). Link aponta para `https://fiat-flow-demo.vercel.app` — quem visita usa a interface diretamente, sem passar pelo repositório. Deploy dedicado do repo `fiat-flow-demo` (público no GitHub), dataset fictício (persona Miguel Lopes), base efémera em `/tmp`. App pessoal real (`fiat-flow-tracker`) continua privada, correndo só localmente.
- 2026-08-10 — Projeto "L'Essence Atelier" adicionado (index.html + projects.html), a substituir o placeholder "Próximo projeto" de e-commerce em construção. Loja de perfumaria fictícia com admin ao estilo Shopify (nome interno do repo: `rastro`, pasta local `Lovable/L'Essence Atelier`). Capa reaproveitada do `og-cover.jpg` do próprio projeto (`assets/img/lessence-atelier-cover.jpg`). Link aponta para `https://lessence-atelier.vercel.app`. Ficheiro placeholder antigo `ecommerce-proximo-projeto-cover.jpg` removido por ficar sem uso.
- 2026-08-11 — Link do EsDomusTech mudado de `https://esdomustech.lovable.app/` para `https://esdomustech.vercel.app/` (index.html + projects.html).
- 2026-08-29 — SneakerStreet e McLaren removidos de `projects.html` (só existiam ali, não em index.html). Grelha reordenada para EsDomusTech → TAIPAM → Fiat Flow Tracker → EVPM → L'Essence Atelier. `visibleCount` atualizado de 7 para 5. Pastas `SneakerStore/` e `McLarenSite/` não apagadas, ficam só sem link no site.

- 2026-09-19 — Projeto "Monopólio Tuga" adicionado (index.html + projects.html) em 4.ª posição. Jogo Monopólio no browser (React 19 + Vite + Three.js, pass-and-play 2–6 jogadores). Deploy dedicado no Vercel (projeto `mopolio-tuga`, equipa `diogoafonsosilva`) a partir de `MeuSite/Projetos/MONOPOLY`; o site só leva cartão + link para `https://mopolio-tuga.vercel.app` (build Vite fica fora deste site estático). Capa em WebP (`assets/img/monopolio-tuga-cover.webp`, primeira capa neste formato). `visibleCount` de 5 para 6. Index passa a ter 5 cartões numa grelha de 2 colunas (último fica sozinho). Nome do cartão é "Monopólio Tuga" (como na capa); o jogo em si e o URL Vercel continuam "Mopólio Tuga"/`mopolio-tuga` (ver CLAUDE.md do jogo: evitar "Monopoly" por marca Hasbro).

- 2026-10-06 — Redesign visual completo (mesma stack, mesma estrutura de ficheiros). Direção editorial escura e quente: Instrument Serif (display) + Geist (texto) + Geist Mono (labels/números), um único acento `--accent: #e8714a`, grão SVG fixo, tokens todos em `:root` de `style.css`. Index: hero com relógio do Porto e stats com count-up, marquee de competências, projetos em bento 12 colunas (classes `span-7` / `span-5` / `span-12 is-wide` — ao adicionar projeto, manter linhas a somar 12), competências e percurso em layout `.split` com cabeçalho sticky, contacto com botão de copiar email. Cartão inteiro clicável via `.project-link::before/::after` (stretched link) nas duas páginas. Projects: grelha 2 colunas com coluna direita desfasada, filtros com contagem automática + `aria-pressed`, estado vazio com reset. `.reveal` só esconde conteúdo quando `html.js` existe (sem JS, tudo visível). Acessibilidade: skip-link, `<main>`, focus ring, menu mobile, `prefers-reduced-motion`. Imagens: criadas versões `.webp` (originais mantidos); `og-cover.jpg` 1200×630 gerado para partilhas. TAIPAM e EVPM no catálogo passam a usar fotos "em Palco" em vez dos logos. Backup do estado anterior em `../Website-backup-2026-10-06/`.

## Não fazer

- Não juntar `home.css` e `projects.css` num só ficheiro — os dois definem `.project-card` de forma incompatível de propósito.
