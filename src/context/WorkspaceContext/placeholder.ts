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
                    access_point_arn:
                      'arn:aws:s3:us-east-1:804469581367:accesspoint/df8d1c-boeing-s3',
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
    uuid: '4e973748-f095-5103-a1bb-4cae790e85dc',
    event_start: '2025-04-25T10:00:00Z',
    event_end: '2025-04-25T11:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 100000,
  },
  {
    uuid: 'dd26e66e-2e65-5f2e-8120-95536a21b411',
    event_start: '2025-04-25T11:00:00Z',
    event_end: '2025-04-25T12:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.00000000000001573044040559338,
  },
  {
    uuid: 'f9ea873b-b3d9-564a-92f4-efc076ad98fb',
    event_start: '2025-04-25T12:00:00Z',
    event_end: '2025-04-25T13:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 1000.015721,
  },
  {
    uuid: '1ea4c2c6-2438-5e96-a000-f9c3945fc53b',
    event_start: '2025-04-25T13:00:00Z',
    event_end: '2025-04-25T14:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015711907219215053,
  },
  {
    uuid: 'b8744888-93b4-5641-8d3e-59754913f019',
    event_start: '2025-04-25T14:00:00Z',
    event_end: '2025-04-25T15:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015702640626025888,
  },
  {
    uuid: '9095c252-5a0e-59ef-b488-dc326982ade7',
    event_start: '2025-04-25T15:00:00Z',
    event_end: '2025-04-25T16:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015693374032836722,
  },
  {
    uuid: '051e664d-736d-5d20-ac87-20381974f6df',
    event_start: '2025-04-25T16:00:00Z',
    event_end: '2025-04-25T17:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.01568410743964756,
  },
  {
    uuid: '4fac5475-6cc1-5f4c-95b5-96c0028e7b06',
    event_start: '2025-04-25T17:00:00Z',
    event_end: '2025-04-25T18:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015674840846458395,
  },
  {
    uuid: '7eb35e86-1102-58b9-a310-5476020cd265',
    event_start: '2025-04-25T18:00:00Z',
    event_end: '2025-04-25T19:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015665574253269234,
  },
  {
    uuid: '334b2e01-2234-5812-9088-5efba85ea3ff',
    event_start: '2025-04-25T19:00:00Z',
    event_end: '2025-04-25T20:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.01565630766008007,
  },
  {
    uuid: '7eb4ee8e-ffe2-5d89-80a9-3577d9774788',
    event_start: '2025-04-25T20:00:00Z',
    event_end: '2025-04-25T21:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015647041066890906,
  },
  {
    uuid: '298643b4-424e-5dd8-949e-64275697ddc1',
    event_start: '2025-04-25T21:00:00Z',
    event_end: '2025-04-25T22:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015637774473701745,
  },
  {
    uuid: 'de9267ae-0d8f-5081-9947-ea4a83895ad8',
    event_start: '2025-04-25T22:00:00Z',
    event_end: '2025-04-25T23:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.01562850788051258,
  },
  {
    uuid: 'e62768a8-0cd4-56d7-bceb-9234126f9f42',
    event_start: '2025-04-25T23:00:00Z',
    event_end: '2025-04-26T00:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015619241287323416,
  },
  {
    uuid: 'd51b18d8-bcdd-5f07-9700-ed24b4d606b3',
    event_start: '2025-04-26T00:00:00Z',
    event_end: '2025-04-26T01:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.01560997469413425,
  },
  {
    uuid: '2caa9139-f31a-5cb7-b5b5-c418f69a9725',
    event_start: '2025-04-26T01:00:00Z',
    event_end: '2025-04-26T02:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015600708100945087,
  },
  {
    uuid: 'c9934076-1c91-5554-b389-a35b8ea20fe8',
    event_start: '2025-04-26T02:00:00Z',
    event_end: '2025-04-26T03:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015591441507755923,
  },
  {
    uuid: 'ad670c3d-79a6-521c-8c37-655bfb713c17',
    event_start: '2025-04-26T03:00:00Z',
    event_end: '2025-04-26T04:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015582174914566762,
  },
  {
    uuid: 'cd4367fd-add7-5f7a-8e3a-87b01a96c391',
    event_start: '2025-04-26T04:00:00Z',
    event_end: '2025-04-26T05:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015572908321377598,
  },
  {
    uuid: '09eff108-ded3-574f-8ca7-ddeb33b0821a',
    event_start: '2025-04-26T05:00:00Z',
    event_end: '2025-04-26T06:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015563641728188434,
  },
  {
    uuid: '1fff3107-ad29-5144-9087-096cf3120ee4',
    event_start: '2025-04-26T06:00:00Z',
    event_end: '2025-04-26T07:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015554375134999271,
  },
  {
    uuid: '76f4e1e6-be9c-5d02-bc24-30a543f3b458',
    event_start: '2025-04-26T07:00:00Z',
    event_end: '2025-04-26T08:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015545108541810107,
  },
  {
    uuid: '513b7383-de77-58c7-8a14-e5be37f14176',
    event_start: '2025-04-26T08:00:00Z',
    event_end: '2025-04-26T09:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015535841948620942,
  },
  {
    uuid: '9e2f7418-fe10-5a3e-b7cd-3ee6cd6cb114',
    event_start: '2025-04-26T09:00:00Z',
    event_end: '2025-04-26T10:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015526575355431779,
  },
  {
    uuid: 'd3c5ba36-a935-5058-b83f-330eebe36947',
    event_start: '2025-04-26T10:00:00Z',
    event_end: '2025-04-26T11:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015517308762242615,
  },
  {
    uuid: 'dac309b6-fc6c-55bc-b0f0-69f63be8af09',
    event_start: '2025-04-26T11:00:00Z',
    event_end: '2025-04-26T12:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015508042169053451,
  },
  {
    uuid: '730084f1-d92b-5dd9-b1fc-2e3237e3b04f',
    event_start: '2025-04-26T12:00:00Z',
    event_end: '2025-04-26T13:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015498775575864286,
  },
  {
    uuid: 'ce7fefbe-b515-52c6-9336-ac3407329a67',
    event_start: '2025-04-26T13:00:00Z',
    event_end: '2025-04-26T14:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015489508982675126,
  },
  {
    uuid: '5dc34a1a-3b34-5eb9-8bb4-bd88002076c4',
    event_start: '2025-04-26T14:00:00Z',
    event_end: '2025-04-26T15:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015480242389485963,
  },
  {
    uuid: '65889824-86b4-5b77-b2ba-b136406f4728',
    event_start: '2025-04-26T15:00:00Z',
    event_end: '2025-04-26T16:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015470975796296797,
  },
  {
    uuid: 'b92d5a92-de77-53ba-8b25-581beef82d0c',
    event_start: '2025-04-26T16:00:00Z',
    event_end: '2025-04-26T17:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015461709203107634,
  },
  {
    uuid: 'b266c307-4882-53e1-8bd3-9a6bc48e9507',
    event_start: '2025-04-26T17:00:00Z',
    event_end: '2025-04-26T18:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.01545244260991847,
  },
  {
    uuid: '5b8d14a4-0e51-539e-928d-0f42c1387e96',
    event_start: '2025-04-26T18:00:00Z',
    event_end: '2025-04-26T19:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015443176016729307,
  },
  {
    uuid: 'ff9da5d3-4b7e-526b-9a0d-0a72f0a5db59',
    event_start: '2025-04-26T19:00:00Z',
    event_end: '2025-04-26T20:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015433909423540141,
  },
  {
    uuid: '449915f9-f471-56e3-b7d6-aeebed1b9c19',
    event_start: '2025-04-26T20:00:00Z',
    event_end: '2025-04-26T21:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015424642830350978,
  },
  {
    uuid: '786a18b3-4fbc-5114-a5c4-8500939c5000',
    event_start: '2025-04-26T21:00:00Z',
    event_end: '2025-04-26T22:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015415376237161818,
  },
  {
    uuid: '7cb4cf2d-c32c-5f99-a3f0-85cf89c2fa0e',
    event_start: '2025-04-26T22:00:00Z',
    event_end: '2025-04-26T23:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015406109643972654,
  },
  {
    uuid: 'ba3750dc-3dac-5e5a-a353-18d6c14fee57',
    event_start: '2025-04-26T23:00:00Z',
    event_end: '2025-04-27T00:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015396843050783489,
  },
  {
    uuid: 'c5076fd9-e6bd-55c0-a7a3-6017d871df65',
    event_start: '2025-04-27T00:00:00Z',
    event_end: '2025-04-27T01:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015387576457594325,
  },
  {
    uuid: '34f7ebef-3b51-551e-95b4-3617e2ddfaa7',
    event_start: '2025-04-27T01:00:00Z',
    event_end: '2025-04-27T02:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015378309864405162,
  },
  {
    uuid: '3ec3db6c-afd8-5c63-919c-54db8c6b7351',
    event_start: '2025-04-27T02:00:00Z',
    event_end: '2025-04-27T03:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015369043271215998,
  },
  {
    uuid: 'ed12988e-5073-5d9c-945d-5d345573f301',
    event_start: '2025-04-27T03:00:00Z',
    event_end: '2025-04-27T04:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015359776678026833,
  },
  {
    uuid: '14f9a548-85e2-57b1-bb75-778ba0e132d2',
    event_start: '2025-04-27T04:00:00Z',
    event_end: '2025-04-27T05:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.01535051008483767,
  },
  {
    uuid: 'ac1257d8-5952-5f25-ba36-7284db8cd1f9',
    event_start: '2025-04-27T05:00:00Z',
    event_end: '2025-04-27T06:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015341243491648506,
  },
  {
    uuid: '58d753ab-348f-52d5-bba0-cd3dec3075b4',
    event_start: '2025-04-27T06:00:00Z',
    event_end: '2025-04-27T07:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015331976898459342,
  },
  {
    uuid: '4ae3c787-b6bb-5882-ba4f-3d6fda44810f',
    event_start: '2025-04-27T07:00:00Z',
    event_end: '2025-04-27T08:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.01532271030527018,
  },
  {
    uuid: 'cbcff7d5-9608-5cea-8962-ba6875baac29',
    event_start: '2025-04-27T08:00:00Z',
    event_end: '2025-04-27T09:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015313443712081017,
  },
  {
    uuid: 'b95042f6-5d1b-545c-a6dc-277b81f99af3',
    event_start: '2025-04-27T09:00:00Z',
    event_end: '2025-04-27T10:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015304177118891853,
  },
  {
    uuid: '496314a6-d471-53d4-9d42-16aac81f35b2',
    event_start: '2025-04-27T10:00:00Z',
    event_end: '2025-04-27T11:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015294910525702688,
  },
  {
    uuid: '7ef3f32a-5a93-5bf0-8b58-313923ca517f',
    event_start: '2025-04-27T11:00:00Z',
    event_end: '2025-04-27T12:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015285643932513525,
  },
  {
    uuid: '8003ded8-8545-52e7-a274-dd9018c5eaaa',
    event_start: '2025-04-27T12:00:00Z',
    event_end: '2025-04-27T13:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015276377339324361,
  },
  {
    uuid: '899c9d79-0ae4-5f8f-81a4-fa20d0cdfd85',
    event_start: '2025-04-27T13:00:00Z',
    event_end: '2025-04-27T14:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015267110746135197,
  },
  {
    uuid: '4705aaa1-094e-5729-92ea-e483f2b7e5df',
    event_start: '2025-04-27T14:00:00Z',
    event_end: '2025-04-27T15:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015257844152946034,
  },
  {
    uuid: '5225de58-a767-548c-85ac-331363d8c4b5',
    event_start: '2025-04-27T15:00:00Z',
    event_end: '2025-04-27T16:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015248577559756872,
  },
  {
    uuid: '7c12e5ca-c549-503a-9bd9-5bbf81f03881',
    event_start: '2025-04-27T16:00:00Z',
    event_end: '2025-04-27T17:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015239310966567709,
  },
  {
    uuid: 'f71e3585-140c-5571-b171-7cd74a29a060',
    event_start: '2025-04-27T17:00:00Z',
    event_end: '2025-04-27T18:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015230044373378545,
  },
  {
    uuid: 'b1711807-f1d6-5089-8ea5-24e5bb126baf',
    event_start: '2025-04-27T18:00:00Z',
    event_end: '2025-04-27T19:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.01522077778018938,
  },
  {
    uuid: '43a0ad15-9687-5740-8c2b-b1e30e43de5d',
    event_start: '2025-04-27T19:00:00Z',
    event_end: '2025-04-27T20:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015211511187000216,
  },
  {
    uuid: '798847e0-0e18-5b26-b0f8-37f98e04e793',
    event_start: '2025-04-27T20:00:00Z',
    event_end: '2025-04-27T21:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015202244593811053,
  },
  {
    uuid: '80a2eafd-dad6-5971-bb1c-4c8c886ef328',
    event_start: '2025-04-27T21:00:00Z',
    event_end: '2025-04-27T22:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015192978000621889,
  },
  {
    uuid: 'c937ca8a-9a31-50f7-8c3d-30a8b2dc19fc',
    event_start: '2025-04-27T22:00:00Z',
    event_end: '2025-04-27T23:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015183711407432724,
  },
  {
    uuid: '80e0c2d8-c1ac-5c52-bcdc-eb7f5457b8c7',
    event_start: '2025-04-27T23:00:00Z',
    event_end: '2025-04-28T00:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.01517444481424356,
  },
  {
    uuid: '4a2893b2-df5d-58a1-b09c-606b8e2b75e1',
    event_start: '2025-04-28T00:00:00Z',
    event_end: '2025-04-28T01:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015165178221054397,
  },
  {
    uuid: '7cd9b308-b942-5d54-853c-2bb3ff4721b1',
    event_start: '2025-04-28T00:00:00Z',
    event_end: '2025-04-29T00:00:00Z',
    item: 'AWS-S3-API-CALLS',
    workspace: 'new-workspace',
    quantity: 0,
  },
  {
    uuid: 'e9726309-0072-5571-ad8f-8ff9934d6dcd',
    event_start: '2025-04-28T00:00:00Z',
    event_end: '2025-04-29T00:00:00Z',
    item: 'AWS-S3-DATA-TRANSFER-OUT',
    workspace: 'new-workspace',
    quantity: 0,
  },
  {
    uuid: 'c39c030c-43a4-50f9-92bf-a898ceb2fd1b',
    event_start: '2025-04-28T01:00:00Z',
    event_end: '2025-04-28T02:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015155911627865235,
  },
  {
    uuid: 'c46f7047-a6bb-5d9e-87f4-fc1bb678c653',
    event_start: '2025-04-28T02:00:00Z',
    event_end: '2025-04-28T03:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015146645034676071,
  },
  {
    uuid: 'b93fb079-d454-541c-a1ef-45e043636309',
    event_start: '2025-04-28T03:00:00Z',
    event_end: '2025-04-28T04:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015137378441486908,
  },
  {
    uuid: '6361de4b-d1a5-50d1-b3d0-eb0cf126a742',
    event_start: '2025-04-28T04:00:00Z',
    event_end: '2025-04-28T05:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015128111848297744,
  },
  {
    uuid: '66398d9a-ed64-58d9-96c5-e5cc86457414',
    event_start: '2025-04-28T05:00:00Z',
    event_end: '2025-04-28T06:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.01511884525510858,
  },
  {
    uuid: '294d5cd5-d0e0-58e7-9e24-f4a90ca5a919',
    event_start: '2025-04-28T06:00:00Z',
    event_end: '2025-04-28T07:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015109578661919415,
  },
  {
    uuid: 'aea28d0c-9333-564a-9713-a9bbc3ac314b',
    event_start: '2025-04-28T07:00:00Z',
    event_end: '2025-04-28T08:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015100312068730252,
  },
  {
    uuid: '5c25cb80-ff5b-5608-8051-123038a4fb63',
    event_start: '2025-04-28T08:00:00Z',
    event_end: '2025-04-28T09:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015091045475541088,
  },
  {
    uuid: 'eaf89e96-709b-52c7-8229-cefd9f424630',
    event_start: '2025-04-28T09:00:00Z',
    event_end: '2025-04-28T10:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015081778882351926,
  },
  {
    uuid: 'f7b4cb39-738e-5f7f-b024-ca72cb1b92f3',
    event_start: '2025-04-28T10:00:00Z',
    event_end: '2025-04-28T11:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015072512289162763,
  },
  {
    uuid: 'fa9a9189-8726-595c-a1a9-0c9c2f0c812e',
    event_start: '2025-04-28T11:00:00Z',
    event_end: '2025-04-28T12:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.0150632456959736,
  },
  {
    uuid: '37c9ac53-59b1-5186-b91a-43ecf634bf5b',
    event_start: '2025-04-28T12:00:00Z',
    event_end: '2025-04-28T13:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015053979102784436,
  },
  {
    uuid: 'd6c9aa9d-ed2e-58c6-945a-1d7503b924da',
    event_start: '2025-04-28T13:00:00Z',
    event_end: '2025-04-28T14:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.01504471250959527,
  },
  {
    uuid: '4ce94756-de0e-5a27-9b76-4f416028feab',
    event_start: '2025-04-28T14:00:00Z',
    event_end: '2025-04-28T15:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015035445916406107,
  },
  {
    uuid: 'e4c902c7-163f-5a82-95ff-d360094166f7',
    event_start: '2025-04-28T15:00:00Z',
    event_end: '2025-04-28T16:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015026179323216943,
  },
  {
    uuid: '329ac037-951b-5ff3-b8c5-c3fc555208fe',
    event_start: '2025-04-28T16:00:00Z',
    event_end: '2025-04-28T17:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.01501691273002778,
  },
  {
    uuid: '7b22823d-f149-5bba-a84d-db53653ecce8',
    event_start: '2025-04-28T17:00:00Z',
    event_end: '2025-04-28T18:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.015007646136838615,
  },
  {
    uuid: 'dbafab8e-b04d-5c39-b730-cc62f6ebb085',
    event_start: '2025-04-28T18:00:00Z',
    event_end: '2025-04-28T19:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.014998379543649451,
  },
  {
    uuid: '4b56141e-5094-5397-8494-0f962532f751',
    event_start: '2025-04-28T19:00:00Z',
    event_end: '2025-04-28T20:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.014989112950460291,
  },
  {
    uuid: '4e9cb5f4-1997-5fa4-ba2d-479d063a568b',
    event_start: '2025-04-28T20:00:00Z',
    event_end: '2025-04-28T21:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.014979846357271127,
  },
  {
    uuid: '31d3bb3a-9ad5-5c4f-b7c4-b3a00463c8c3',
    event_start: '2025-04-28T21:00:00Z',
    event_end: '2025-04-28T22:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.014970579764081962,
  },
  {
    uuid: '401a6d63-aa1c-5713-8321-57b8bb91c2fe',
    event_start: '2025-04-28T22:00:00Z',
    event_end: '2025-04-28T23:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.014961313170892799,
  },
  {
    uuid: '406bcf75-609b-5fc9-b3f6-8e47fe51858d',
    event_start: '2025-04-28T23:00:00Z',
    event_end: '2025-04-29T00:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.014952046577703635,
  },
  {
    uuid: 'f0f9cd47-2546-5835-9689-580b21e561cc',
    event_start: '2025-04-29T00:00:00Z',
    event_end: '2025-04-29T01:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.014942779984514471,
  },
  {
    uuid: '2fb4438f-27b8-5ee5-af91-adbd6f801d88',
    event_start: '2025-04-29T00:00:00Z',
    event_end: '2025-04-30T00:00:00Z',
    item: 'AWS-S3-DATA-TRANSFER-OUT',
    workspace: 'new-workspace',
    quantity: 0,
  },
  {
    uuid: '8f6a3732-82a5-5c76-804d-06efc4adbccf',
    event_start: '2025-04-29T00:00:00Z',
    event_end: '2025-04-30T00:00:00Z',
    item: 'AWS-S3-API-CALLS',
    workspace: 'new-workspace',
    quantity: 0,
  },
  {
    uuid: 'c563b532-a95d-582c-b6a0-f6615c62916e',
    event_start: '2025-04-29T01:00:00Z',
    event_end: '2025-04-29T02:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.014933513391325306,
  },
  {
    uuid: '1f2f063d-812c-5ebf-bce9-c3c59246cf2a',
    event_start: '2025-04-29T02:00:00Z',
    event_end: '2025-04-29T03:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.014924246798136143,
  },
  {
    uuid: '8d83d56c-f9b3-5f6b-a73b-986afeeeda65',
    event_start: '2025-04-29T03:00:00Z',
    event_end: '2025-04-29T04:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.014914980204946983,
  },
  {
    uuid: 'f28f3c55-da4d-51c1-b92c-bf4901ee809f',
    event_start: '2025-04-29T04:00:00Z',
    event_end: '2025-04-29T05:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.014905713611757817,
  },
  {
    uuid: '67f09814-1a8d-5cbe-87cb-bbb4b6795ffd',
    event_start: '2025-04-29T05:00:00Z',
    event_end: '2025-04-29T06:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.014896447018568654,
  },
  {
    uuid: 'f3cf7e72-3e1a-5057-b3dd-1e50b1b4f757',
    event_start: '2025-04-29T06:00:00Z',
    event_end: '2025-04-29T07:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.01488718042537949,
  },
  {
    uuid: 'aaf79a05-dffb-528a-b0a5-3c35265489c2',
    event_start: '2025-04-29T07:00:00Z',
    event_end: '2025-04-29T08:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.014877913832190327,
  },
  {
    uuid: '9da2f98a-e8cd-583f-ac8d-a8c24398ea21',
    event_start: '2025-04-29T08:00:00Z',
    event_end: '2025-04-29T09:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.014868647239001161,
  },
  {
    uuid: 'b489c5ae-4b5a-5809-a3d4-115069442b64',
    event_start: '2025-04-29T09:00:00Z',
    event_end: '2025-04-29T10:00:00Z',
    item: 'AWS-S3-STORAGE',
    workspace: 'new-workspace',
    quantity: 0.014859380645811998,
  },
];

export const testSkuDefinition = {
  uuid: '352b473a-7ab0-4389-a5b5-dfbc6dd1770a',
  sku: 'testsku',
  name: 'Block storage',
  unit: 's',
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

export const pricesPlaceholder = [
  {
    uuid: '23b8fb77-1fe5-4f79-959d-e7223ee0ae34',
    sku: 'cpu-seconds',
    valid_from: '2025-01-02T00:00:00Z',
    valid_until: null,
    price: 0.0000012,
  },
  {
    uuid: '77fb3dc0-bcbd-4ec0-8e06-ee341af6b1e6',
    sku: 'testsku',
    valid_from: '2025-03-10T15:47:39Z',
    valid_until: null,
    price: 0.1,
  },
  {
    uuid: 'c5b87f3b-5027-4fdf-a618-0189693a2bd0',
    sku: 'testsku2',
    valid_from: '2025-03-10T15:47:58Z',
    valid_until: null,
    price: 4e-8,
  },
  {
    uuid: '23b8fb77-1fe5-4f79-959d-e7223ee0ae34',
    sku: 'AWS-S3-API-CALLS',
    valid_from: '2025-01-02T00:00:00Z',
    valid_until: null,
    price: 0.0000012,
  },
  {
    uuid: '23b8fb77-1fe5-4f79-959d-e7223ee0ae34',
    sku: 'AWS-S3-DATA-TRANSFER-OUT',
    valid_from: '2025-01-02T00:00:00Z',
    valid_until: null,
    price: 0.0000012,
  },
  {
    uuid: '23b8fb77-1fe5-4f79-959d-e7223ee0ae34',
    sku: 'AWS-S3-STORAGE',
    valid_from: '2025-01-02T00:00:00Z',
    valid_until: null,
    price: 0.0000012,
  },
];
