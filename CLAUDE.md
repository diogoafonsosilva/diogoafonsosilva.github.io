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
- Cada projeto novo entra em **três sítios**: página própria em `projetos/<slug>.html` (copiar uma existente; secções O que é / O que faz / Stack / Decisões técnicas + links anterior/seguinte), cartão em destaque no `index.html` (secção `#projetos`) e cartão completo no `projects.html`. Os cartões ligam à página do projeto (`projetos/<slug>.html`), não ao site externo — o link externo vive no botão da página. Acrescentar também o URL ao `sitemap.xml` e atualizar os links anterior/seguinte do primeiro e último projeto.
- Todas as páginas carregam `assets/js/guard.js` no `<head>` (antes do script que adiciona `.js`) e levam `<meta name="robots" content="index, follow, noai, noimageai">` + `<meta name="tdm-reservation" content="1">`.
- **Domínio próprio:** antes de ligar um domínio ao GitHub Pages, acrescentá-lo a `ALLOWED_HOSTS` em `guard.js` e trocar `ORIGIN`. Sem isso o site redireciona-se em ciclo.
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
- 2026-10-11 — Link do EVPM mudado de `https://evpm.vercel.app` para `https://evpm.lovable.app` (só existe em projects.html). Projeto "Happy Hamburgers Ops" adicionado (index.html 05, `span-7` ao lado de L'Essence `span-5`, que deixa de ser `is-wide`; projects.html 07, categoria `web`). Gémeo digital 3D de cadeia de fast-food fictícia, repo local `Minha Logistica/SIMULATION SCENARIO 3D`, deploy Vercel `golden-grill-ops` → `https://happy-hamburgers.vercel.app`. Capa = screenshot do site live (`assets/img/happy-hamburgers-cover.webp`, 1600×1000). Stat "Projetos online" e `visibleCount` passam a 7.
- 2026-10-12 — Capa do Happy Hamburgers Ops trocada pela imagem de conceito feita pelo utilizador no ChatGPT (estética clara do redesign da app). Mesmo ficheiro `assets/img/happy-hamburgers-cover.webp`, agora 1600×894 (era screenshot 1600×1000).
- 2026-10-12 — Projeto "Botica Alecrim Ops" adicionado. No index.html **substitui** o Happy Hamburgers na posição 05 (`span-7`, pedido do utilizador: "tirar de lá os hamburgeres"); o Happy Hamburgers continua só no projects.html (07). No projects.html entra como 08, categoria `web`. Farmácia fictícia em corte (4 pisos: produção, venda, I&D, decisão), repo local `Minha Logistica/PHARMACY SCENARIO 3D`, deploy Vercel `botica-alecrim` → `https://botica-alecrim.vercel.app`. Capa = imagem de conceito do utilizador (`assets/img/botica-alecrim-cover.webp`, 1600×894); a imagem diz "Vitalis Pharma" e foi aceite assim pelo utilizador. Stat "Projetos online" e `visibleCount` passam a 8.

- 2026-10-14 — Projeto "Lousa" adicionado. Quadro branco colaborativo em tempo real (React + Canvas 2D, servidor Node com WebSockets; a demo publicada usa sincronização entre separadores). No index.html entra como 07 em `span-12 is-wide` (linha própria, depois do par EsDomusTech/…/L'Essence); no projects.html como 09, categoria `web`. Repo local `MeuSite/Projetos/lousa`, deploy Vercel `lousa-quadro` → `https://lousa-quadro.vercel.app` (publicar com `npm run deploy:vercel` nesse repo). Capa = captura do template de retrospetiva no quadro publicado (`assets/img/lousa-cover.webp`, 1600×790). A primeira capa (o hero da app, com título grande) chocava com o texto do cartão largo — evitar capas com muito texto em cartões `is-wide`. Stat "Projetos online" e `visibleCount` passam a 9.

- 2026-10-18 — Página própria por projeto em `projetos/<slug>.html` (9 páginas, estilos em `assets/css/project.css`, script `assets/js/project.js`). Conteúdo tirado do `package.json` e `CLAUDE.md`/`PRODUCT.md` de cada repo; detalhe técnico ao nível de decisão, sem segredos (IDs de CMS, tokens, nomes de ficheiros internos). Cartões do index e do catálogo passam a abrir a página do projeto ("Ver projeto"). Proteção anti-cópia/anti-bot: `robots.txt` bloqueia crawlers de IA e copiadores de sites (Google/Bing continuam), reserva TDM em `.well-known/tdmrep.json` (opt-out da Diretiva UE 2019/790, art. 4.º; precisa do `.nojekyll` para a pasta ser servida), `guard.js` (bloqueia clique direito, arrastar, seleção, atalhos de ver código/guardar, iframes de terceiros e redireciona clones alojados noutro domínio; o que for copiado vira "© Diogo Silva — URL"), CSS em `style.css` (`user-select: none`, imagens sem `pointer-events`). Footer passa a "todos os direitos reservados". `sitemap.xml` criado.
- 2026-10-18 — Hero das páginas de projeto em duas colunas (texto à esquerda, capa à direita, acima da dobra; empilha abaixo de 900px). Capas novas tiradas dos sites live: `lousa-cover.webp` (template de armazém, 1600×1000, substitui a retrospetiva) e `lessence-atelier-cover.webp` (homepage da loja, 1600×1000; o `.jpg` antigo de 512px fica só como legado). Projeto "Fisio em casa" adicionado: página `projetos/fisio-em-casa.html` (10), cartão no catálogo (10, `web`) e no index (08, `span-5` ao lado da Lousa, que deixa de ser `is-wide` e passa a `span-7`). Repo local `Minha Logistica/fisio-app`, Vercel `fisio-em-casa` → `https://fisio-em-casa-demo.vercel.app` (o nome curto `fisio-em-casa.vercel.app` é de outra conta). Capa = avatar na remada sentada (`assets/img/fisio-em-casa-cover.webp`). Stat "Projetos online" e `visibleCount` passam a 10.

## Não fazer

- Não juntar `home.css` e `projects.css` num só ficheiro — os dois definem `.project-card` de forma incompatível de propósito.
