import { Account } from '@/typings/global';

const API_BASE_ACCOUNTS_URL = '/api/accounts';
// const API_BASE_ACCOUNT_URL = '/api/account';

export const getAccounts = async (): Promise<Account[]> => {
  try {
    const response = await fetch(`${API_BASE_ACCOUNTS_URL}`, {
      credentials: 'include',
    });
    if (response.ok) {
      const json = await response.json();
      return json.data.accounts;
    }
    throw new Error('Failed to get accounts');
  } catch (error) {
    console.error('Error getting accounts:', error);
    throw error;
  }
};
