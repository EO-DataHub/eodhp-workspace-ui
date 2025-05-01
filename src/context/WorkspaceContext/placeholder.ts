import { Workspace } from './types';

export const accountsPlaceholder = {
  success: 1,
  data: {
    accounts: [
      {
        id: 'a9f1c3b2-64d3-47a1-bf10-c9b3f7e1234d',
        createdAt: '2025-01-10T15:57:34.172794Z',
        name: 'Sample Test Account',
        accountOwner: 'alex-smith',
        billingAddress: '',
        organizationName: null,
        accountOpeningReason: null,
        status: 'Approved',
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
                    mount_point: 'fs-1234abcd5678efgh',
                  },
                ],
              },
            ],
            last_updated: '2025-01-15T10:23:45.678901Z',
          },
        ],
        last_updated: '2025-01-23T13:54:49.383718Z',
      },
    ],
  },
};

export const workspacesPlaceholder: Workspace[] = [
  {
    id: '5ca33d4a-bfd8-495f-8684-9b157be3f36c',
    name: 'dev-test-workspace',
    account: '382b1c98-eaca-4914-b3f6-f6f979d42683',
    member_group: 'prod',
    status: 'pending',
    stores: [
      {
        object: [
          {
            store_id: '1f5ec48d-1aba-4e91-b552-3bc33a13a0e8',
            name: 'workspaces-9c11f5-dev',
            path: 'lockheed/',
            env_var: 'S3_BUCKET_WORKSPACE',
            access_point_arn: 'arn:aws:s3:us-east-1:804469581367:accesspoint/df8d1c-boeing-s3',
          },
        ],
        block: [
          {
            store_id: 'e8b75974-1e6a-45a9-8384-866724e53815',
            name: '130079-dev-boeing-pv',
            access_point_id: 'fsap-153ef4cc8ff1',
            mount_point: 'fs-07025eb296b5',
          },
        ],
      },
    ],
    last_updated: '2025-01-23T15:08:57.594775Z',
  },
  {
    id: 'd389681e-9df9-44c1-82bf-26563e7b18f1',
    name: 'boeing',
    account: 'd7735edf-1900-43fb-bc2f-408229d3b054',
    member_group: 'prod',
    status: 'ready',
    stores: [
      {
        object: [
          {
            store_id: '87823693-c11c-4fc1-9bfc-09976b7e0357',
            name: 'workspaces-814ff3-dev',
            path: 'lockheed/',
            env_var: 'S3_BUCKET_WORKSPACE',
            access_point_arn: 'arn:aws:s3:us-east-1:759510920928:accesspoint/909a41-spacex-s3',
          },
        ],
        block: [
          {
            store_id: '4627a3ed-d993-4c5c-a495-1723fabad15c',
            name: 'c36544-dev-boeing-pv',
            access_point_id: 'fsap-c575ba00aa90',
            mount_point: 'fs-c38553e7cecd',
          },
        ],
      },
    ],
    last_updated: '2025-01-23T15:08:57.594865Z',
  },
  {
    id: '85b445c0-76cc-452a-9427-cfd7823c8b4c',
    name: 'boeing',
    account: '68c90563-5826-4146-afad-e665c1028602',
    member_group: 'prod',
    status: 'pending',
    stores: [
      {
        object: [
          {
            store_id: '9b35376f-ee9b-4a73-be7f-e8af14f6f79e',
            name: 'datasets-97d66d-dev',
            path: 'spacex/',
            env_var: 'S3_BUCKET_CONFIG',
            access_point_arn: 'arn:aws:s3:ap-south-1:852469417097:accesspoint/4d84fe-spacex-s3',
          },
        ],
        block: [
          {
            store_id: '2c62c753-7ffb-4382-9954-800f9d5d3760',
            name: '98d206-dev-spacex-pv',
            access_point_id: 'fsap-b70640372658',
            mount_point: 'fs-015f11ed7801',
          },
        ],
      },
    ],
    last_updated: '2025-01-23T15:08:57.594953Z',
  },
  {
    id: 'e1752484-cff6-49e7-a56b-0d9d5070f586',
    name: 'lockheed',
    account: 'cf24be86-af59-4e92-a5a6-7872b7eac777',
    member_group: 'dev',
    status: 'failed',
    stores: [
      {
        object: [
          {
            store_id: '0e8b6b28-1bdd-4cfe-9c7a-e7cf7f2e395d',
            name: 'workspaces-9f0235-dev',
            path: 'lockheed/',
            env_var: 'S3_BUCKET_CONFIG',
            access_point_arn: 'arn:aws:s3:eu-west-2:871830845554:accesspoint/bfa3f9-boeing-s3',
          },
        ],
        block: [
          {
            store_id: '0464d934-3645-4cb0-9c85-7f741094d557',
            name: 'cb98ec-dev-spacex-pv',
            access_point_id: 'fsap-cd782a2c4862',
            mount_point: 'fs-ade35c0fc65a',
          },
        ],
      },
    ],
    last_updated: '2025-01-23T15:08:57.595039Z',
  },
  {
    id: 'df13a0ce-08ad-4dd7-90b6-d275b711e879',
    name: 'lockheed',
    account: 'a00ef332-4aff-4071-b3ff-aeb073ee9db2',
    member_group: 'qa',
    status: 'failed',
    stores: [
      {
        object: [
          {
            store_id: 'e906f2f5-7514-4f5f-9e20-8c93b949d411',
            name: 'configs-8b8c27-dev',
            path: 'spacex/',
            env_var: 'S3_BUCKET_WORKSPACE',
            access_point_arn: 'arn:aws:s3:eu-west-2:875338691264:accesspoint/fbdca5-boeing-s3',
          },
          {
            store_id: '756f0d3e-72cd-4455-8caa-37e38ff38136',
            name: 'configs-e5ceb9-dev',
            path: 'lockheed/',
            env_var: 'S3_BUCKET_WORKSPACE',
            access_point_arn: 'arn:aws:s3:us-east-1:263549561627:accesspoint/f9953c-spacex-s3',
          },
        ],
        block: [
          {
            store_id: 'e0d2351f-da11-4a6e-b031-2c6735b061d1',
            name: '508173-dev-spacex-pv',
            access_point_id: 'fsap-c4507ae3ec62',
            mount_point: 'fs-50f097842d05',
          },
          {
            store_id: '8c90e639-4641-43f6-9166-c1a84b860fd2',
            name: '843474-dev-boeing-pv',
            access_point_id: 'fsap-ed7aa5eee7ca',
            mount_point: 'fs-ebd19ab2e3b1',
          },
        ],
      },
    ],
    last_updated: '2025-01-23T15:08:57.595118Z',
  },
];

export const skuPlaceholder = [
  {
    uuid: '603be7c8-73e2-4221-8e2c-b41c0abb31c6',
    event_start: '2025-04-16T06:42:34Z',
    event_end: '2025-04-16T06:48:34Z',
    item: 'testsku',
    workspace: 'test-workspace',
    quantity: 3.14,
    user: 'test_user',
  },
  {
    uuid: 'b5bc9a94-cebb-4d84-a1b8-50c9ad7cda98',
    event_start: '2025-05-17T06:42:34Z',
    event_end: '2025-05-17T06:48:34Z',
    item: 'testsku',
    workspace: 'test-workspace',
    quantity: 7,
    user: 'test_user',
  },
  {
    uuid: '603be7c8-73e2-4221-8e2c-b41c0abb31c6',
    event_start: '2025-04-16T06:42:34Z',
    event_end: '2025-04-16T06:48:34Z',
    item: 'compute',
    workspace: 'test-workspace',
    quantity: 3.14,
    user: 'test_user',
  },
  {
    uuid: 'b5bc9a94-cebb-4d84-a1b8-50c9ad7cda98',
    event_start: '2025-05-17T06:42:34Z',
    event_end: '2025-05-17T06:48:34Z',
    item: 'compute',
    workspace: 'test-workspace',
    quantity: 12.23,
    user: 'test_user',
  },
  {
    uuid: '603be7c8-73e2-4221-8e2c-b41c0abb31c6',
    event_start: '2025-04-16T06:42:34Z',
    event_end: '2025-04-16T06:48:34Z',
    item: 'storage',
    workspace: 'test-workspace',
    quantity: 33.14,
    user: 'test_user',
  },
  {
    uuid: 'b5bc9a94-cebb-4d84-a1b8-50c9ad7cda98',
    event_start: '2025-05-17T06:42:34Z',
    event_end: '2025-05-17T06:48:34Z',
    item: 'storage',
    workspace: 'test-workspace',
    quantity: 9.56,
    user: 'test_user',
  },
];

export const testSkuDefinition = {
  uuid: '352b473a-7ab0-4389-a5b5-dfbc6dd1770a',
  sku: 'testsku',
  name: 'Block storage',
  unit: '',
};

export const tokenPlaceholder = {
  created: '2025-03-07T13:55:56Z',
  expiry: '2025-04-06T13:55:56Z',
  id: '46f39e06-686a-4a35-9394-399ac54633fb',
  name: 'API Token',
  scope: 'offline_access workspace:new-workspace',
  token: '454f44486d4e77ddb5d098107d53e057',
  user_id: '15ccb16f-9fd7-4009-ab87-e977b4c50cda',
  workspace: 'new-workspace',
};
