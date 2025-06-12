import credentialsIcon from '@/assets/icons/credentials.svg';
import invoicesIcon from '@/assets/icons/invoices.svg';
import linkedAccountsIcon from '@/assets/icons/linked-accounts.svg';
import membersIcon from '@/assets/icons/members.svg';
import uploadIcon from '@/assets/icons/upload.svg';
import { Credentials } from '@/pages/Credentials/Credentials';
import DataLoader from '@/pages/DataLoader/DataLoader';
import Invoices from '@/pages/Invoices/Invoices';
import LinkedAccounts from '@/pages/LinkedAccounts/LinkedAccounts';
import Members from '@/pages/Members/Members';

export interface NavItem {
  label: string;
  subItems?: NavItem[];
  icon?: string;
  content?: React.ReactNode;
}

export const navItems: NavItem[] = [
  { label: 'Members', icon: membersIcon, content: <Members /> },
  { label: 'Metadata Loader', icon: uploadIcon, content: <DataLoader /> },
  { label: 'Linked accounts', icon: linkedAccountsIcon, content: <LinkedAccounts /> },
  { label: 'Invoices', icon: invoicesIcon, content: <Invoices /> },
  { label: 'Credentials', icon: credentialsIcon, content: <Credentials /> },
];
