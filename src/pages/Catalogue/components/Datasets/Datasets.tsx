import placeholderimg from '@/assets/icons/100x100.svg';

import { Row } from '../Row/Row';

const PLACEHOLDER_ROWS = [
  {
    title: 'Global Land Cover',
    description: 'High-resolution global land cover dataset for 2021',
    dateRange: '2021-01-01 - 2021-12-31',
    action: [
      {
        label: 'View Dataset',
        onClick: () => console.log('View clicked'),
      },
    ],
    thumbnail: placeholderimg,
  },
  {
    title: 'Sea Surface Temperature',
    description: 'Daily sea surface temperature data for the year 2021',
    dateRange: '2021-01-01 - 2021-12-31',
    action: [
      {
        label: 'View Dataset',
        onClick: () => console.log('View clicked'),
      },
    ],
    thumbnail: placeholderimg,
  },
  {
    title: 'Forest Cover Change',
    description: 'Annual forest cover change detection from 2020 to 2021',
    dateRange: '2020-01-01 - 2021-12-31',
    action: [
      {
        label: 'View Dataset',
        onClick: () => console.log('View clicked'),
      },
    ],
    thumbnail: placeholderimg,
  },
  {
    title: 'Urban Expansion',
    description: 'Urban area expansion data for major cities in 2021',
    dateRange: '2021-01-01 - 2021-12-31',
    action: [
      {
        label: 'View Dataset',
        onClick: () => console.log('View clicked'),
      },
    ],
    thumbnail: placeholderimg,
  },
];

export const Datasets = () => {
  return (
    <div>
      {PLACEHOLDER_ROWS.map((row, index) => (
        <Row key={index} {...row} />
      ))}
    </div>
  );
};
