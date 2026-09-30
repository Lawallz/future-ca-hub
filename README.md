# CA-ADS · Portal do estudante

Materiais, horários, comunidades, guias e mapa do IFSP Campus São Paulo em uma interface responsiva, com conteúdo disponível desde o primeiro carregamento.

## Recursos

- Busca global por recurso ou disciplina (`Ctrl/Cmd + K`).
- Período compartilhado entre materiais e horários; favoritos salvos neste navegador.
- Busca por disciplina, professor e sala, filtros de dia e exportação CSV da seleção.
- Mapa com busca de ambientes, seleção por teclado, zoom e acesso à planta original.
- Guias acessíveis, navegação mobile, link para pular ao conteúdo e preferência de movimento reduzido.
- Aviso offline e atualização da PWA mediante ação do visitante.

## Desenvolvimento

Use Node.js 22.12+ ou 24 e npm. Não há banco de dados nem `.env` obrigatório para consultar o portal.

```sh
git clone https://github.com/Lawallz/future-ca-hub.git
cd future-ca-hub
npm ci
npm run dev
```

```sh
npm test
npm run typecheck
npm run lint
npm run build
```

A configuração Lovable integra TanStack Start, React, Tailwind e Nitro. Não duplique esses plugins no Vite. A saída pública é `.output/public`; o service worker é gerado nessa mesma pasta. A implantação SSR utiliza a configuração Nitro existente.

## Manutenção do conteúdo

- `src/data/academics.ts`: disciplinas, links das pastas e registros da grade.
- `src/data/site.ts`: contatos, atalhos e seções pesquisáveis.
- `src/components/site/MapaCampus.tsx`: blocos e ambientes da planta.
- `src/components/site/Tutoriais.tsx`: orientações de acesso.
- `src/styles.css`: identidade visual, estados e adaptações responsivas.

A grade herdada **não informa semestre de vigência**, contém apenas alguns períodos e possui registros de Banco de Dados 2 no 1º período que precisam de confirmação. O portal sinaliza essa limitação. Confira a grade no SUAP antes de atualizar os dados. Ausência de registros não significa ausência de aulas.

Links externos dependem das permissões das pastas e dos administradores dos grupos. Convites genéricos de disciplinas foram substituídos por contato com o CA. A planta é uma referência estática, não localização em tempo real. Os guias direcionam aos canais existentes e não substituem editais.

Preferências e favoritos ficam apenas no navegador, não em uma conta. Se o armazenamento estiver indisponível, a interface continua funcionando na sessão. O cache offline depende de uma visita online anterior e não torna Google Drive, SUAP, Moodle ou WhatsApp disponíveis sem internet.

## Git e Lovable

O repositório permanece conectado ao Lovable. Revise alterações em branch/PR antes de integrar na branch conectada. Não faça force push nem reescreva histórico publicado.
