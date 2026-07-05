# primeng-forms-utils

Biblioteca utilitaria para Angular + PrimeNG focada em formularios dinamicos.

## Objetivo

Centralizar a definicao de campos, validacoes, layout e saida de valor em uma configuracao TypeScript, evitando templates grandes e repetitivos nas paginas Angular.

## O que a biblioteca faz

- monta ou complementa um `FormGroup`;
- aplica validacoes declarativas e validadores Angular customizados;
- renderiza os componentes PrimeNG atuais, como `p-select`, `p-datepicker`, `pTextarea` e `p-inputNumber`;
- organiza os campos em grid de 12 colunas responsivo;
- suporta labels acima ou ao lado do campo;
- exibe asterisco antes da label quando o campo for obrigatorio;
- exibe dica rapida por meio de um icone com tooltip;
- suporta `text`, `number`, `money`, `percent`, `textarea`, `select`, `enum`, `image`, `date`, `radio` e `checkbox`;
- suporta grupos de `checkbox` com valor em array;
- suporta upload de imagem com preview local;
- persiste campos de data como string UTC no `FormControl`;
- permite customizar aparencia de campos por configuracao;
- resolve mensagens de erro via configuracao do campo, traducoes externas e fallback padrao.

## O que a biblioteca nao faz

- nao executa submit;
- nao persiste dados;
- nao toma decisoes de negocio;
- nao faz upload automatico de arquivos.

## Componentes principais

- `DynamicFormComponent`: componente raiz do formulario.
- `DynamicFieldComponent`: adaptador que escolhe qual componente PrimeNG renderizar.
- `DynamicFormBuilderService`: cria ou complementa `FormGroup`.
- `dynamic-field-config.ts`: contratos centrais da biblioteca.

## Layout padrao

- o formulario usa grid de 12 colunas;
- no mobile, cada campo ocupa `12/12`;
- a partir de `md`, se `colSpan` nao for informado, o campo ocupa `6/12`;
- quando a soma dos spans ultrapassa 12, o proximo campo quebra para a linha de baixo automaticamente;
- o espacamento entre campos e `8px`.

## Aparencia por campo

Cada campo pode receber um bloco opcional `appearance` para sobrescrever tokens visuais do PrimeNG no proprio campo.

Exemplo:

```ts
appearance: {
  borderColor: '#0f766e',
  hoverBorderColor: '#0d9488',
  focusBorderColor: '#0f766e',
  invalidBorderColor: '#dc2626',
  backgroundColor: '#ffffff',
  textColor: '#0f172a',
  placeholderColor: '#64748b',
  focusRingColor: 'rgba(15, 118, 110, 0.18)',
  borderRadius: '0.75rem'
}
```

Observacoes:

- hoje essa customizacao cobre principalmente `text`, `textarea` e `select`;
- a API foi desenhada para crescer para outros componentes sem mudar o contrato do consumidor.

## Exemplo

```ts
import { FormGroup } from '@angular/forms';
import {
  DynamicErrorTranslations,
  DynamicFieldConfig,
  utcDateNotBeforeTodayValidator
} from 'primeng-forms-utils';

enum UserRole {
  Admin = 'admin',
  Reviewer = 'reviewer',
  User = 'user'
}

const form = new FormGroup({});

const errorTranslations: DynamicErrorTranslations = {
  required: 'Esse campo e obrigatorio.',
  email: 'Informe um e-mail valido.',
  minlength: ({ errorValue }) => `Minimo de ${(errorValue as { requiredLength: number }).requiredLength} caracteres.`,
  maxlength: ({ errorValue }) => `Maximo de ${(errorValue as { requiredLength: number }).requiredLength} caracteres.`,
  min: ({ errorValue }) => `Valor minimo: ${(errorValue as { min: number }).min}.`,
  max: ({ errorValue }) => `Valor maximo: ${(errorValue as { max: number }).max}.`,
  pattern: 'Formato invalido.'
};

const fields: DynamicFieldConfig[] = [
  {
    name: 'name',
    type: 'text',
    label: 'Nome',
    placeholder: 'Informe o nome',
    quickHint: 'Esse nome sera exibido no cadastro principal.',
    appearance: {
      borderColor: '#0f766e',
      hoverBorderColor: '#0d9488',
      focusBorderColor: '#0f766e',
      focusRingColor: 'rgba(15, 118, 110, 0.18)'
    },
    validators: [{ type: 'required' }, { type: 'minLength', value: 3 }]
  },
  {
    name: 'role',
    type: 'enum',
    label: 'Perfil',
    colSpan: 6,
    labelPosition: 'side',
    placeholder: 'Selecione um perfil',
    enumConfig: {
      values: UserRole,
      showIcons: true,
      options: [
        { enumValue: UserRole.Admin, label: 'Administrador', icon: 'pi pi-shield' },
        { enumValue: UserRole.Reviewer, label: 'Revisor', icon: 'pi pi-eye' },
        { enumValue: UserRole.User, label: 'Usuario', icon: 'pi pi-user' }
      ]
    }
  },
  {
    name: 'price',
    type: 'money',
    label: 'Preco',
    colSpan: 6,
    moneyConfig: {
      currency: 'BRL',
      locale: 'pt-BR',
      currencyDisplay: 'symbol',
      minFractionDigits: 2,
      maxFractionDigits: 2
    }
  },
  {
    name: 'startDate',
    type: 'date',
    label: 'Data inicial',
    colSpan: 6,
    dateConfig: {
      dateFormat: 'dd/mm/yy',
      showIcon: true
    },
    controlValidators: [utcDateNotBeforeTodayValidator()]
  },
  {
    name: 'permissions',
    type: 'checkbox',
    label: 'Permissoes',
    colSpan: 6,
    optionLayout: 'vertical',
    initialValue: ['read', 'create'],
    options: [
      { label: 'Ler', value: 'read' },
      { label: 'Criar', value: 'create' },
      { label: 'Remover', value: 'delete' }
    ]
  }
];
```

```html
<pfu-dynamic-form
  [form]="form"
  [fields]="fields"
  [errorTranslations]="errorTranslations"
/>
```

## Demo visual

Existe um app Angular standalone em [demo/README.md](C:/bibliotecas/primeng-forms-utils/demo/README.md:1) para validar visualmente:

- layout responsivo em grid de 12 colunas;
- `colSpan` padrao `6/12` quando nao informado;
- todos os tipos de campo suportados;
- customizacao visual por `appearance`;
- payload em tempo real e snapshot de submit.

## Diretiva de loading

Use a diretiva `pfuLoading` em qualquer container para sobrepor a area com um painel branco semitransparente e spinner central.

```ts
import { LoadingDirective } from 'primeng-forms-utils';
```

```html
<div [pfuLoading]="isLoading">
  Conteudo do container
</div>
```

## Proximos passos recomendados

1. Cobrir mais tokens visuais em `appearance`, inclusive `checkbox`, `radio`, `datepicker` e `inputnumber`.
2. Adicionar testes unitarios para builder, layout e rendering condicional.
3. Publicar snapshots visuais do demo para facilitar revisao em PR.

## Documentacao para LLMs

Existe um manual dedicado para implementacao e extensao por outras LLMs em [docs/LLM_IMPLEMENTATION_MANUAL.md](C:/bibliotecas/primeng-forms-utils/docs/LLM_IMPLEMENTATION_MANUAL.md:1).
