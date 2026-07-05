import { DynamicErrorTranslations, DynamicFieldConfig } from 'primeng-forms-utils';

export enum ShowcaseRole {
  ProductOwner = 'product-owner',
  Designer = 'designer',
  Engineer = 'engineer'
}

export const showcaseErrorTranslations: DynamicErrorTranslations = {
  required: 'Este campo e obrigatorio.',
  email: 'Informe um e-mail valido.',
  minlength: ({ errorValue }) =>
    `Minimo de ${(errorValue as { requiredLength: number }).requiredLength} caracteres.`,
  maxlength: ({ errorValue }) =>
    `Maximo de ${(errorValue as { requiredLength: number }).requiredLength} caracteres.`,
  min: ({ errorValue }) => `Valor minimo: ${(errorValue as { min: number }).min}.`,
  max: ({ errorValue }) => `Valor maximo: ${(errorValue as { max: number }).max}.`,
  pattern: 'Formato invalido.'
};

export const showcaseFields: DynamicFieldConfig[] = [
  {
    name: 'fullName',
    type: 'text',
    label: 'Nome completo',
    colSpan: 6,
    initialValue: 'Marina Costa',
    placeholder: 'Ex.: Marina Costa',
    quickHint: 'Esse valor aparece no topo do cadastro.',
    appearance: {
      borderColor: '#0f766e',
      hoverBorderColor: '#0d9488',
      focusBorderColor: '#0f766e',
      focusRingColor: 'rgba(15, 118, 110, 0.18)',
      borderRadius: '0.75rem'
    },
    validators: [
      { type: 'required' },
      { type: 'minLength', value: 3 }
    ]
  },
  {
    name: 'email',
    type: 'text',
    label: 'E-mail',
    colSpan: 6,
    initialValue: 'marina@empresa.com',
    placeholder: 'marina@empresa.com',
    validators: [
      { type: 'required' },
      { type: 'email' }
    ]
  },
  {
    name: 'role',
    type: 'enum',
    label: 'Perfil',
    labelPosition: 'top',
    colSpan: 6,
    initialValue: ShowcaseRole.Engineer,
    placeholder: 'Selecione o perfil',
    enumConfig: {
      values: ShowcaseRole,
      showIcons: true,
      options: [
        {
          enumValue: ShowcaseRole.ProductOwner,
          label: 'Product Owner',
          icon: 'pi pi-briefcase'
        },
        {
          enumValue: ShowcaseRole.Designer,
          label: 'Designer',
          icon: 'pi pi-palette'
        },
        {
          enumValue: ShowcaseRole.Engineer,
          label: 'Engineer',
          icon: 'pi pi-code'
        }
      ]
    }
  },
  {
    name: 'squad',
    type: 'select',
    label: 'Squad',
    labelPosition: 'side',
    colSpan: 6,
    initialValue: 'core-platform',
    placeholder: 'Escolha a squad',
    options: [
      { label: 'Growth', value: 'growth' },
      { label: 'Core Platform', value: 'core-platform' },
      { label: 'Onboarding', value: 'onboarding' }
    ]
  },
  {
    name: 'bio',
    type: 'textarea',
    label: 'Resumo',
    colSpan: 12,
    initialValue: 'Formulario de showcase para validar renderizacao, payload e estados.',
    hint: 'Bom lugar para validar labels, hint e comportamento de erro.',
    placeholder: 'Descreva rapidamente o objetivo deste formulario.',
    validators: [
      { type: 'maxLength', value: 180 }
    ]
  },
  {
    name: 'budget',
    type: 'money',
    label: 'Budget mensal',
    colSpan: 4,
    initialValue: 25000,
    placeholder: 'R$ 0,00',
    moneyConfig: {
      currency: 'BRL',
      locale: 'pt-BR'
    }
  },
  {
    name: 'conversionTarget',
    type: 'percent',
    label: 'Meta de conversao',
    colSpan: 4,
    initialValue: 18.5,
    placeholder: '0,00%',
    percentConfig: {
      minFractionDigits: 1,
      maxFractionDigits: 2
    }
  },
  {
    name: 'headcount',
    type: 'number',
    label: 'Pessoas na iniciativa',
    colSpan: 4,
    initialValue: 5,
    placeholder: '0',
    validators: [
      { type: 'min', value: 1 }
    ]
  },
  {
    name: 'kickoffDate',
    type: 'date',
    label: 'Kickoff',
    colSpan: 6,
    initialValue: '2026-07-04T00:00:00.000Z',
    dateConfig: {
      dateFormat: 'dd/mm/yy',
      showIcon: true,
      placeholder: 'Selecione a data'
    }
  },
  {
    name: 'status',
    type: 'radio',
    label: 'Status',
    colSpan: 6,
    initialValue: 'build',
    optionLayout: 'horizontal',
    options: [
      { label: 'Discovery', value: 'discovery' },
      { label: 'Build', value: 'build' },
      { label: 'Rollout', value: 'rollout' }
    ]
  },
  {
    name: 'highlights',
    type: 'checkbox',
    label: 'Recursos em destaque',
    colSpan: 6,
    initialValue: ['hints', 'image-preview'],
    optionLayout: 'vertical',
    options: [
      { label: 'Hints rapidos', value: 'hints' },
      { label: 'Layout side label', value: 'side-label' },
      { label: 'Upload com preview', value: 'image-preview' }
    ]
  },
  {
    name: 'acceptTerms',
    type: 'checkbox',
    label: 'Termos',
    colSpan: 6,
    initialValue: true,
    placeholder: 'Aceito publicar este payload no console do demo',
    quickHint: 'Exemplo de checkbox binario com label inline.'
  },
  {
    name: 'avatar',
    type: 'image',
    label: 'Avatar do projeto',
    colSpan: 12,
    hint: 'Aceita PNG, JPEG e WebP com preview imediato.',
    imageConfig: {
      variant: 'avatar',
      accept: 'image/png,image/jpeg,image/webp',
      emptyLabel: 'Nenhuma imagem selecionada',
      changeLabel: 'Escolher imagem'
    }
  }
];

export const showcaseInitialValue: Record<string, unknown> = {
  fullName: 'Marina Costa',
  email: 'marina@empresa.com',
  role: ShowcaseRole.Engineer,
  squad: 'core-platform',
  bio: 'Formulario de showcase para validar renderizacao, payload e estados.',
  budget: 25000,
  conversionTarget: 18.5,
  headcount: 5,
  kickoffDate: '2026-07-04T00:00:00.000Z',
  status: 'build',
  highlights: ['hints', 'image-preview'],
  acceptTerms: true
};
