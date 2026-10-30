# Partituras Espíritas

Código-fonte do site [partiturasespiritas.com.br](https://www.partiturasespiritas.com.br) (React + Vite + Tailwind, hospedado no Firebase Hosting).

> O código em `src/` foi reconstruído a partir do build publicado em produção (versão `04d81fe2c33e18e8`, de 17/08/2026).
> Nomes de componentes, funções e arquivos foram restaurados; algumas variáveis internas ainda têm nomes curtos herdados da minificação.
> A pasta `_build-original/` guarda o build original apenas como referência — não é publicada.

## Comandos

```bash
npm install            # instala as dependências (uma vez)
npm run dev            # servidor local em http://localhost:5173
npm run build          # gera a versão final em dist/
npm run deploy:preview # publica em um link de teste (não afeta o site no ar)
npm run deploy         # publica no site oficial
```

## Estrutura

- `src/App.jsx` — rotas do site
- `src/pages/` — páginas públicas; `src/pages/admin/` — painel administrativo (`/admin`)
- `src/components/` — componentes compartilhados (layout, leitor de PDF, carrosséis…)
- `src/lib/firebase.js` — configuração do Firebase, login e utilidades
- `public/` — arquivos estáticos (ícones, manifest, imagem de compartilhamento, texturas)
