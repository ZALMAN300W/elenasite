import type { CollectionConfig } from 'payload';

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: {
    singular: 'Отзыв',
    plural: 'Отзывы',
  },
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'service', 'rating'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'author',
      type: 'text',
      label: 'Имя автора / клиента',
      required: true,
    },
    {
      name: 'service',
      type: 'text',
      label: 'Оказанная услуга',
      required: true,
    },
    {
      name: 'rating',
      type: 'number',
      label: 'Оценка (от 1 до 5)',
      required: true,
      defaultValue: 5,
      min: 1,
      max: 5,
    },
    {
      name: 'text',
      type: 'textarea',
      label: 'Текст отзыва',
      required: true,
    },
  ],
};