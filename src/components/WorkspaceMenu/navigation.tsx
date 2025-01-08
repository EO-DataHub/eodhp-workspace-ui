import ComingSoon from './ComingSoon';

export interface NavItem {
  label: string;
  subItems?: NavItem[];
  icon?: string;
  content?: React.ReactNode;
}

export const navItems: NavItem[] = [
  {
    label: 'Stores',
    icon: './icons/stores.svg',
    content: <ComingSoon title="This is a test" />,
  },
  {
    label: 'Catalogue',
    icon: './icons/catalogue.svg',
    subItems: [
      { label: 'Datasets', icon: './icons/datasets.svg' },
      { label: 'Notebooks', icon: './icons/notebooks.svg' },
      { label: 'Workflows', icon: './icons/workflows.svg' },
    ],
  },
  { label: 'Linked accounts', icon: './icons/linked-accounts.svg' },
  { label: 'Invoices', icon: './icons/invoices.svg' },
  { label: 'Members', icon: './icons/members.svg' },
  { label: 'Credentials', icon: './icons/credentials.svg' },
];
