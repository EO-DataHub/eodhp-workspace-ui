import catalogueIcon from '@/assets/icons/catalogue.svg';
import credentialsIcon from '@/assets/icons/credentials.svg';
import datasetsIcon from '@/assets/icons/datasets.svg';
import invoicesIcon from '@/assets/icons/invoices.svg';
import linkedAccountsIcon from '@/assets/icons/linked-accounts.svg';
import membersIcon from '@/assets/icons/members.svg';
import notebooksIcon from '@/assets/icons/notebooks.svg';
import storesIcon from '@/assets/icons/stores.svg';
import workflowsIcon from '@/assets/icons/workflows.svg';
import { Catalogue } from '@/pages/Catalogue/Catalogue';
import { Credentials } from '@/pages/Credentials/Credentials';
import { Stores } from '@/pages/Stores/Stores';

export interface NavItem {
  label: string;
  subItems?: NavItem[];
  icon?: string;
  content?: React.ReactNode;
}

export const navItems: NavItem[] = [
  {
    label: 'Stores',
    icon: storesIcon,
    content: <Stores />,
  },
  {
    label: 'Catalogue',
    icon: catalogueIcon,
    content: <Catalogue />,
    subItems: [
      { label: 'Datasets', icon: datasetsIcon, content: <Catalogue defaultActiveTab={0} /> },
      { label: 'Notebooks', icon: notebooksIcon, content: <Catalogue defaultActiveTab={1} /> },
      { label: 'Workflows', icon: workflowsIcon, content: <Catalogue defaultActiveTab={2} /> },
    ],
  },
  { label: 'Linked accounts', icon: linkedAccountsIcon },
  { label: 'Invoices', icon: invoicesIcon },
  { label: 'Members', icon: membersIcon },
  { label: 'Credentials', icon: credentialsIcon, content: <Credentials /> },
];
