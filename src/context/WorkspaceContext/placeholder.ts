export const accountsPlaceholder = {
  success: 1,
  data: {
    accounts: [
      {
        id: 'a9f1c3b2-64d3-47a1-bf10-c9b3f7e1234d',
        name: 'Sample Test Account',
        accountOwner: 'alex-smith',
        workspaces: [
          {
            id: '42d9f8b7-c76e-44a5-b29f-d2e9f3d2a4bc',
            name: 'alex-smith-workspace',
            account: 'a9f1c3b2-64d3-47a1-bf10-c9b3f7e1234d',
            member_group: 'development',
            status: 'active',
            stores: [
              {
                object: [
                  {
                    store_id: '19c4b5a7-1f3d-40d4-b2e1-a4d9e2b3a4f1',
                    name: 'workspaces-sample-test',
                    path: 'alex-smith-workspace/',
                    env_var: 'S3_BUCKET_WORKSPACE_TEST',
                    access_point_arn:
                      'arn:aws:s3:eu-west-2:123456789012:accesspoint/sample-test-alex-smith-s3',
                  },
                ],
                block: [
                  {
                    store_id: '3f7a9c1b-0d4e-4f2a-b3d2-c8e9f2d4a7e1',
                    name: 'sample-test-AlexSmith-storage',
                    access_point_id: 'fsap-0123abc456d789012',
                    fs_id: 'fs-1234abcd5678efgh',
                  },
                ],
              },
            ],
            last_updated: '2025-01-15T10:23:45.678901Z',
          },
        ],
      },
    ],
  },
};
