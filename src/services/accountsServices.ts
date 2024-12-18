import { Account } from '@/typings/global';

const API_BASE_ACCOUNTS_URL = '/api/accounts';
const API_BASE_ACCOUNT_URL = '/api/account';

const response = {
  success: 1,
  data: {
    accounts: [
      {
        id: '3e870932-b01b-4180-98d9-a39c9af51931',
        name: 'New EODH Development account',
        accountOwner: 'jlangstone-tpzuk',
        workspaces: [
          {
            id: '93b9cbb8-7eff-4ca7-8d21-770dc2db1c74',
            name: 'jlangstone-tpzuk',
            account: '3e870932-b01b-4180-98d9-a39c9af51931',
            member_group: '/dev',
            status: 'ready',
            stores: [
              {
                object: null,
                block: null,
              },
            ],
            last_updated: '2024-12-10T16:40:19.87538Z',
          },
          {
            id: 'e4f9e8dd-af3c-46e4-a307-b4720c8ee255',
            name: 'wsm020',
            account: '3e870932-b01b-4180-98d9-a39c9af51931',
            member_group: '/dev',
            status: 'ready',
            stores: [
              {
                object: [
                  {
                    store_id: '5a854de7-de99-428b-b574-9e0f7c33cf40',
                    name: 'workspaces-eodhp-dev',
                    path: '/wsm020',
                    env_var: 'S3_BUCKET_WORKSPACE',
                    access_point_arn:
                      'arn:aws:s3:eu-west-2:312280911266:accesspoint/eodhp-dev-y4jfxod4-wsm020-s3',
                  },
                ],
                block: [
                  {
                    store_id: '9f8ff361-c1fd-4afb-b8b8-f6e638310b77',
                    name: 'eodhp-dev-y4jFxoD4-wsm020-pv',
                    access_point_id: 'fsap-0adb105feb0878842',
                    fs_id: 'fs-045e65dcd4e24f91d',
                  },
                ],
              },
            ],
            last_updated: '2024-12-12T11:17:31.577645Z',
          },
          {
            id: 'e4f9e8dd-af3c-46e4-a307-b4720c8ee256',
            name: 'shahidraza-telespazio',
            account: '3e870932-b01b-4180-98d9-a39c9af51931',
            member_group: '/dev',
            status: 'ready',
            stores: [
              {
                object: null,
                block: null,
              },
            ],
            last_updated: '2024-12-12T11:17:31.577645Z',
          },
        ],
      },
    ],
  },
};

export const getAccounts = async (): Promise<Account[]> => {
  try {
    return response.data.accounts;
    // const response = await fetch(`${API_BASE_ACCOUNTS_URL}`, {
    //   credentials: 'include',
    // });
    // if (response.ok) {
    //   const accounts = await response.json();
    //   return accounts;
    // }
    // throw new Error('Failed to get accounts');
  } catch (error) {
    console.error('Error getting accounts:', error);
    throw error;
  }
};
