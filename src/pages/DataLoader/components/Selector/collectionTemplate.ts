export const collectionTemplate = {
  id: 'simple-collection',
  type: 'Collection',
  stac_version: '1.1.0',
  description: 'A minimal STAC collection template.',
  license: 'CC-BY-4.0',
  extent: {
    spatial: {
      bbox: [[-180, -90, 180, 90]],
    },
    temporal: {
      interval: [['2021-01-01T00:00:00Z', null]],
    },
  },
  summaries: {
    'eo:bands': ['B04'],
  },
  links: [
    {
      rel: 'self',
      href: 'https://example.com/simple-collection.json',
      type: 'application/json',
    },
    {
      rel: 'parent',
      href: '',
      type: 'application/json',
    },
  ],
};
