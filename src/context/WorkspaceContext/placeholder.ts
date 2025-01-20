export const accountsPlaceholder = {
  success: 1,
  data: {
    accounts: [
      {
        id: 'e2a8b7ee-54c0-4717-bc69-a2a6598edb6d',
        name: 'Personal EODH Account',
        accountOwner: 'james-hinton',
        workspaces: [
          {
            id: '66e1cf9f-b56c-4722-a9c9-e538d8abffa8',
            name: 'james-hinton',
            account: 'e2a8b7ee-54c0-4717-bc69-a2a6598edb6d',
            member_group: 'test',
            status: 'ready',
            stores: [
              {
                object: [
                  {
                    store_id: '3ba05c17-0cfc-4a48-a726-2e86d21b66c7',
                    name: 'workspaces-eodhp-test',
                    path: 'james-hinton/',
                    env_var: 'S3_BUCKET_WORKSPACE',
                    access_point_arn:
                      'arn:aws:s3:eu-west-2:312280911266:accesspoint/eodhp-test-gstjkhpo-james-hinton-s3',
                  },
                ],
                block: [
                  {
                    store_id: 'ed6563bd-1766-41ca-a4f3-883d51e8510c',
                    name: 'eodhp-test-GSTjKHpo-james-hinton-pv',
                    access_point_id: 'fsap-0449fe0580fbdbe25',
                    fs_id: 'fs-039b221a2c1209389',
                  },
                ],
              },
            ],
            last_updated: '2025-01-13T14:54:32.041766Z',
          },
        ],
      },
    ],
  },
};
