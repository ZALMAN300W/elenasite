import type { CollectionConfig } from 'payload';

export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: 'Услуга',
    plural: 'Услуги',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'term'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Название услуги',
      required: true,
    },
    {
      name: 'price',
      type: 'text',
      label: 'Отображаемая цена (напр. от 5 000 ₽)',
      required: true,
    },
    {
      name: 'numericPrice',
      type: 'number',
      label: 'Цена для оплаты (число)',
      required: true,
    },
    {
      name: 'term',
      type: 'text',
      label: 'Срок выполнения',
      required: true,
    },
    {
      name: 'desc',
      type: 'textarea',
      label: 'Краткое описание',
      required: true,
    },
    {
      name: 'features',
      type: 'array',
      label: 'Что входит в услугу',
      labels: {
        singular: 'Пункт',
        plural: 'Пункты',
      },
      fields: [
        {
          name: 'item',
          type: 'text',
          label: 'Описание пункта',
          required: true,
        },
      ],
    },
  ],
};