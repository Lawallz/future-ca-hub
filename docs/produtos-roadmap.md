# Produtos e roadmap

As seções usam o visual existente e as âncoras `#produtos` e `#roadmap`, disponíveis desde o primeiro carregamento.

## Catálogo

Edite `src/data/products.ts`. O catálogo começa vazio porque não foram informados produtos, imagens, preços ou estoque reais. O estado vazio permite consultar o CA. Não publique produtos de demonstração como ofertas reais.

Cada produto aceita `id` único, `name`, `description`, `priceInCents` (inteiro não negativo, ou `null` para sob consulta), `image` opcional, `options` opcionais (tamanhos/variantes) e `available`. Adicione imagens locais em `public/produtos/` e use caminhos `/produtos/nome.webp`. O contato `salesContact` reutiliza o WhatsApp já cadastrado no portal; confirme com o CA antes de abrir vendas.

O visitante escolhe quantidade de 1 a 10 e uma opção, quando houver, e abre uma mensagem no WhatsApp. Não há checkout, cobrança, confirmação automática, estoque transacional nem painel administrativo. Pagamento, disponibilidade e retirada dependem da confirmação do CA.

## Roadmap

Edite `src/data/roadmap.ts`. Os 37 códigos, semestres, categorias, a indicação optativa de Libras e as 15 setas foram transcritos da imagem fornecida. Os nomes descritivos seguem as disciplinas já listadas no portal. Não inferir requisitos adicionais pela sequência dos números; por exemplo, a imagem não liga ENG1 a ENG2, e liga LPG1 diretamente a LPG3.

Cada entrada informa `code`, `name`, `semester`, `area`, `prerequisites` e `optional` quando aplicável. Pré-requisitos são diretos; o painel de dependências é derivado desses dados, evitando manter duas listas divergentes. A interface deixa claro que a imagem não substitui a matriz vigente nem as regras de matrícula.

## Horários preservados

Base: branch `fix/schedule-hero-map`, commit `f7819b4` (Atualização dos Horários). O arquivo de horários permanece idêntico ao desse commit. Existem diferenças de código entre cadastro de horários e imagem do roadmap (por exemplo, SPOBD2/SPOBDD2 e SPOLOG3/SPOLPG1); esta entrega não reclassifica nem renomeia os registros enviados pelo responsável.

## Verificação

Em Node.js 22.18+ ou 24:

```sh
node --test tests/portal-data.test.mjs
npx tsc --noEmit
npm run build
```
