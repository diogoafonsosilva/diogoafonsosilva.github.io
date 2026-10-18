# Diogo Silva — Portfólio

Site pessoal de Diogo Silva: marketing digital, SEO, conteúdo, email marketing e projetos web.

## Stack

HTML / CSS / JS vanilla — sem build step, sem dependências.

## Estrutura

```
Website/
├── index.html              página principal (hero, projetos em destaque, competências, experiência, contacto)
├── projects.html           arquivo completo de projetos, com filtros por categoria
├── projetos/               uma página por projeto (o que é, funcionalidades, stack, decisões)
├── robots.txt / sitemap.xml
├── .well-known/tdmrep.json reserva de direitos de text and data mining
├── assets/
│   ├── css/
│   │   ├── style.css       base partilhada (reset, nav, footer, botões, secções, reveal)
│   │   ├── home.css        estilos exclusivos do index.html
│   │   └── projects.css    estilos exclusivos do projects.html
│   ├── js/
│   │   ├── main.js         scroll do nav + animação reveal (index.html)
│   │   └── projects.js     scroll, reveal e filtros (projects.html)
│   └── img/                fotos, logos e capas de projetos
├── .editorconfig
├── .gitignore
└── README.md
```

## Correr localmente

Abrir `index.html` diretamente no browser, ou servir a pasta com qualquer servidor estático:

```bash
npx serve .
```

## Adicionar um novo projeto

1. Colocar a imagem/logo em `assets/img/`.
2. Copiar uma página de `projetos/` e adaptar o conteúdo; acrescentar o URL ao `sitemap.xml`.
3. Copiar um `<article class="project-card">` existente em `index.html` (secção "Projetos em destaque") e em `projects.html` (grelha completa), ajustando texto, link e `data-category`.
4. Categorias de filtro disponíveis em `projects.html`: `web`, `brand`, `ecommerce`, `lovable`, `data`.
