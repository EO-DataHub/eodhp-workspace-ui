import credentialsIcon from '@/assets/icons/credentials.svg';
import linkedAccountsIcon from '@/assets/icons/linked-accounts.svg';
import membersIcon from '@/assets/icons/members.svg';
import storesIcon from '@/assets/icons/stores.svg';
import uploadIcon from '@/assets/icons/upload.svg';
import { Credentials } from '@/pages/Credentials/Credentials';
import LinkedAccounts from '@/pages/LinkedAccounts/LinkedAccounts';
import Members from '@/pages/Members/Members';
import { Stores } from '@/pages/Stores/Stores';

export interface NavItem {
  label: string;
  subItems?: NavItem[];
  icon?: string;
  content?: React.ReactNode;
}

export const navItems: NavItem[] = [
  { label: 'Members', icon: membersIcon, content: <Members /> },
  { label: 'Data Loader', icon: uploadIcon },
  { label: 'Linked accounts', icon: linkedAccountsIcon, content: <LinkedAccounts /> },
  // { label: 'Invoices', icon: invoicesIcon, content: <Invoices /> },
  { label: 'Credentials', icon: credentialsIcon, content: <Credentials /> },
  {
    label: 'Stores',
    icon: storesIcon,
    content: <Stores />,
  },
];
