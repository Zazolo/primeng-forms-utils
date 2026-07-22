# LLM Implementation Manual

Este documento descreve como outra LLM deve entender, manter e expandir a biblioteca `primeng-forms-utils`.

## Objetivo da biblioteca

A biblioteca existe para permitir que paginas Angular descrevam formularios em TypeScript, sem templates HTML extensos para cada tela.

A responsabilidade da biblioteca e:

- receber uma lista de campos;
- criar ou complementar um `FormGroup`;
- renderizar os campos com componentes PrimeNG atuais;
- organizar os campos em grid responsivo de 12 colunas;
- exibir labels, dicas rapidas e mensagens de erro;
- padronizar a saida de valor dos componentes;
- permitir customizacao visual declarativa por campo.

A responsabilidade da biblioteca nao e:

- persistir dados;
- executar submit;
- decidir fluxo de negocio;
- substituir logica de validacao externa mais complexa.

## Componentes principais

### `DynamicFormComponent`

Arquivo: `src/lib/components/dynamic-form.component.ts`

Responsabilidades:

- receber `fields: DynamicFieldConfig[]`;
- receber opcionalmente `form?: FormGroup`;
- receber `errorTranslations`;
- criar um `FormGroup` se ele nao vier pronto;
- garantir que os controles descritos em `fields` existam no `FormGroup`;
- renderizar os campos em um grid de 12 colunas com gap de `8px`.

Regras importantes:

- nao renderizar botao de submit;
- nao emitir evento de submit;
- nao tomar decisao de persistencia;
- manter comportamento responsivo;
- preservar o contrato de largura padrao `6/12` quando `colSpan` nao for informado.

### `DynamicFieldComponent`

Arquivo: `src/lib/components/dynamic-field.component.ts`

Responsabilidades:

- receber um `FormGroup`;
- receber a configuracao de um campo;
- escolher qual componente PrimeNG usar;
- renderizar label no topo ou ao lado;
- mostrar icone de ajuda com tooltip;
- aplicar `colSpan` no grid;
- resolver e exibir erro do controle;
- aplicar tokens visuais vindos de `appearance`.

Regras importantes:

- o host usa `display: contents` para que a `div` interna com classes de grid participe corretamente do layout;
- valores derivados usados por PrimeNG, como data convertida para `Date`, devem ser estabilizados e nao recriados em getters a cada ciclo;
- toda extensao de novos tipos deve passar por esse componente.

### `DynamicFormBuilderService`

Arquivo: `src/lib/services/dynamic-form-builder.service.ts`

Responsabilidades:

- criar `FormControl`s com `initialValue`, `disabled` e validators;
- montar um `FormGroup` inteiro com base em `fields`;
- adicionar controles faltantes em um `FormGroup` ja existente.

Regras:

- nao remover controles existentes automaticamente;
- nao reconfigurar silenciosamente um controle externo ja existente;
- preservar compatibilidade com formularios montados pela pagina consumidora.

## Contrato de configuracao

Arquivo: `src/lib/models/dynamic-field-config.ts`

O contrato central e `DynamicFieldConfig`.

Campos importantes:

- `name`: nome do `FormControl`.
- `type`: tipo do campo.
- `label`: texto visivel do campo.
- `colSpan`: tamanho do campo no grid, de `1` a `12`.
- `labelPosition`: `'top' | 'side'`.
- `hint`: texto auxiliar fixo abaixo do campo.
- `quickHint`: tooltip acionado pelo icone `i`.
- `options`: lista declarativa de opcoes para `select`, `radio` e `checkbox` em grupo.
- `optionLayout`: `'vertical' | 'horizontal'` para `radio` e `checkbox` em grupo.
- `validators`: lista simplificada de validadores declarativos.
- `controlValidators`: validators Angular customizados.
- `enumConfig`: configuracao especifica para campo de enumeracao.
- `imageConfig`: configuracao especifica para upload de imagem.
- `moneyConfig`: configuracao especifica para campo monetario.
- `percentConfig`: configuracao especifica para campo percentual.
- `dateConfig`: configuracao especifica para campo de data UTC.
- `appearance`: customizacao visual por campo.

## Tipos de campo atuais

Os tipos atualmente suportados sao:

- `text`
- `number`
- `money`
- `percent`
- `textarea`
- `select`
- `radio`
- `enum`
- `image`
- `date`
- `checkbox`

Ao adicionar um novo tipo:

1. atualizar `DynamicFieldType`;
2. adicionar propriedades novas ao contrato se necessario;
3. implementar o rendering em `DynamicFieldComponent`;
4. documentar o novo tipo no README e neste manual;
5. verificar se o valor emitido pelo componente e consistente com o `FormControl`.

## Campo de enumeracao

O tipo `enum` existe para cenarios onde o consumidor possui uma enumeracao TypeScript e quer:

- escolher quais valores aparecem;
- definir label amigavel por opcao;
- definir icone opcional por item;
- escolher se os icones devem aparecer.

Estrutura:

- `enumConfig.values`: objeto da enumeracao;
- `enumConfig.showIcons`: habilita ou nao os icones;
- `enumConfig.options`: mapeia cada valor para `label` e `icon`.

Regra importante:

- a biblioteca nao deve inferir labels automaticamente a partir do nome bruto da enum se o contrato ja exige `options`.

## Campo de imagem

O tipo `image` existe para upload de avatar ou imagem quadrada com preview local.

Estrutura:

- `imageConfig.variant`: `'square' | 'avatar'`;
- `imageConfig.accept`: mime types aceitos no input;
- `imageConfig.emptyLabel`: texto exibido quando nao houver imagem;
- `imageConfig.changeLabel`: texto do acionador de upload.

Comportamento esperado:

- o valor do `FormControl` deve ser o `File` selecionado;
- se o valor do controle for uma `string`, ela deve ser interpretada como URL de preview existente;
- se o valor do controle tiver `{ previewUrl: string }`, essa URL tambem pode ser usada como preview;
- ao selecionar um arquivo, o componente deve gerar preview local;
- object URLs devem ser liberadas no destroy para evitar vazamento.

## Campo monetario

O tipo `money` existe para valores numericos com formatacao monetaria ou decimal com simbolo.

Estrutura:

- `moneyConfig.currency`: codigo da moeda;
- `moneyConfig.locale`: locale de exibicao;
- `moneyConfig.mode`: `'currency' | 'decimal'`;
- `moneyConfig.currencyDisplay`: `'symbol' | 'code' | 'name'`;
- `moneyConfig.minFractionDigits`: minimo de casas decimais;
- `moneyConfig.maxFractionDigits`: maximo de casas decimais;
- `moneyConfig.prefix` e `moneyConfig.suffix`: textos adicionais opcionais.

Comportamento esperado:

- o valor do `FormControl` deve continuar numerico;
- a formatacao visual deve ficar sob responsabilidade do `p-input-number`.

## Campo percentual

O tipo `percent` existe para valores numericos com sufixo de percentual.

Estrutura:

- `percentConfig.minFractionDigits`: minimo de casas decimais;
- `percentConfig.maxFractionDigits`: maximo de casas decimais;
- `percentConfig.prefix`: texto opcional antes do valor;
- `percentConfig.suffix`: texto opcional apos o valor, com `%` por padrao.

Comportamento esperado:

- o valor do `FormControl` deve continuar numerico;
- a apresentacao visual deve usar `p-input-number`.

## Campo de data UTC

O tipo `date` deve persistir a data em formato UTC no `FormControl`.

Comportamento esperado:

- a interface visual usa `p-datepicker`;
- o valor gravado no controle deve ser uma string ISO UTC;
- a biblioteca padroniza a data no inicio do dia UTC;
- ao reabrir o campo, a string UTC e convertida novamente para um `Date` visual;
- a LLM nao deve usar getters que retornam `new Date(...)` em todo ciclo de render.

Exemplo de valor persistido:

- `2026-07-04T00:00:00.000Z`

## Validadores externos para data UTC

A biblioteca exporta validadores para uso externo no `FormGroup`.

Exemplos:

- `utcDateNotBeforeTodayValidator()`
- `utcDateNotAfterTodayValidator()`
- `utcDateMinValidator(date)`
- `utcDateMaxValidator(date)`

Regras:

- esses validadores devem ser usados via `controlValidators`;
- a biblioteca nao deve acoplar regras de data diretamente no campo;
- as mensagens de erro continuam resolvidas via `errorTranslations`.

## Campos de radio e checkbox

`radio` deve receber `options` e gravar um unico valor no `FormControl`.

`checkbox` tem dois modos:

- binario, quando nao possui `options`;
- grupo, quando possui `options`, gravando um array de valores selecionados.

Regras:

- `optionLayout` controla se o grupo aparece na horizontal ou vertical;
- `checkbox` binario grava booleano;
- grupos de checkbox nao devem gravar booleano, e sim array;
- em grupos, o `p-checkbox` deve receber o array compartilhado e o `[value]` da opcao;
- labels das opcoes devem vir de `options`, nao de valores inferidos.

## Sistema de layout

O formulario usa grid de 12 colunas.

Regras:

- o container do formulario usa `grid grid-cols-12 gap-2`;
- cada campo ocupa `col-span-12` por padrao no mobile;
- em telas `md` para cima, o campo usa `md:col-span-N` conforme `colSpan`;
- quando `colSpan` nao e informado, o default atual e `6`;
- `colSpan` aceita apenas valores entre `1` e `12`;
- os spans precisam ser aplicados no elemento que realmente participa do grid.

Se a LLM alterar o layout:

- nao remover a compatibilidade mobile;
- nao substituir o grid de 12 colunas por largura fixa;
- nao esconder a capacidade do consumidor de controlar a largura por campo.

## Sistema de labels e ajuda

O label pode ficar:

- acima do campo com `labelPosition: 'top'`;
- ao lado do campo com `labelPosition: 'side'`.

O `quickHint` deve ser exibido em um icone com tooltip do PrimeNG.
Se o campo possuir validator `required`, a label deve mostrar `*` antes do texto.

Regras:

- o tooltip so aparece quando `quickHint` existir;
- o asterisco deve ser derivado da configuracao do campo;
- o checkbox binario e tratado de forma especial, porque o label fica ao lado do controle;
- a acessibilidade minima deve ser mantida com `aria-label` no botao de ajuda.

## Sistema de aparencia

Arquivo principal:

- `src/lib/models/dynamic-field-config.ts`

A configuracao `appearance` serve para customizar tokens visuais por campo.

Propriedades atuais:

- `borderColor`
- `hoverBorderColor`
- `focusBorderColor`
- `invalidBorderColor`
- `backgroundColor`
- `textColor`
- `placeholderColor`
- `focusRingColor`
- `borderRadius`

Regras:

- preferir CSS variables oficiais do PrimeNG em vez de seletores internos frageis;
- aplicar a customizacao no wrapper do campo, nao via manipulacao imperativa de DOM;
- preservar o comportamento padrao quando `appearance` nao for informado;
- se um novo componente passar a respeitar mais tokens, expandir a mesma API em vez de criar outra.

## Sistema de erros

Arquivos:

- `src/lib/utils/error-message.utils.ts`
- `src/lib/models/dynamic-field-config.ts`

As mensagens de erro devem ser resolvidas a partir de:

1. `field.validators[].message`, se houver mensagem customizada no proprio campo;
2. `errorTranslations[errorKey]`, se houver traducao fornecida pelo consumidor;
3. mensagens padrao da biblioteca.

Regras:

- usar o primeiro erro ativo do `FormControl`;
- nao codificar textos finais diretamente no componente;
- manter a traducao centralizada no utilitario.

## Fluxo recomendado de renderizacao

Quando a pagina consumidora usa o componente:

1. define o array `fields`;
2. opcionalmente cria um `FormGroup` externo;
3. passa `fields`, `form` e `errorTranslations` para `pfu-dynamic-form`;
4. o `DynamicFormComponent` cria ou complementa o `FormGroup`;
5. o `DynamicFieldComponent` renderiza cada campo;
6. os erros aparecem conforme estado do controle (`dirty` ou `touched`);
7. o submit e disparado fora da biblioteca.

## Regras para futuras extensoes

Se outra LLM for implementar novos componentes PrimeNG, siga estas regras:

- preservar a API declarativa atual;
- nao introduzir submit interno;
- nao acoplar servicos HTTP;
- nao misturar regra de negocio com rendering;
- manter `DynamicFieldConfig` como fonte principal de configuracao;
- preferir propriedades explicitas em vez de inferencia magica;
- atualizar documentacao sempre que um novo tipo ou comportamento for adicionado.

## O que fazer ao implementar um novo campo

Checklist minimo:

1. adicionar o novo valor ao union `DynamicFieldType`;
2. definir propriedades extras no contrato, se necessario;
3. implementar o bloco `ngSwitch` correspondente;
4. garantir leitura e escrita corretas no `FormControl`;
5. validar integracao com label, `hint`, `quickHint`, erros e layout;
6. validar responsividade e `colSpan`;
7. atualizar README;
8. atualizar este manual.

## O que evitar

- criar APIs diferentes para cada campo sem necessidade;
- embutir textos fixos demais nos componentes;
- assumir que todo consumidor usa o mesmo idioma;
- alterar o valor do `FormControl` para formatos inesperados;
- depender de estrutura interna fragil de DOM do PrimeNG;
- reintroduzir componentes deprecated como `p-dropdown`, `p-calendar` ou `pInputTextarea`.

## Resumo operacional para outra LLM

Se voce precisar evoluir esta biblioteca:

1. leia `dynamic-field-config.ts` primeiro;
2. depois leia `dynamic-form.component.ts` e `dynamic-field.component.ts`;
3. ajuste `dynamic-form-builder.service.ts` apenas se a estrutura do controle mudar;
4. centralize mensagens em `error-message.utils.ts`;
5. documente qualquer nova capacidade no README e neste arquivo.
