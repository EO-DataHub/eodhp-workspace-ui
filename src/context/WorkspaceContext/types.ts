export type Workspace = {
  id: string;
  name: string;
  account: string;
  member_group: string;
  owner: string;
  status: string;
  stores: Store[];
  last_updated: string;
};

export type Store = {
  object: ObjectStore[];
  block: Block[];
};

type ObjectStore = {
  store_id: string;
  name: string;
  path: string;
  env_var: string;
  access_point_arn: string;
};

type Block = {
  store_id: string;
  name: string;
  access_point_id: string;
  mount_point: string;
};

export type Account = {
  id: string;
  createdAt: string;
  name: string;
  accountOwner: string;
  billingAddress: string;
  organizationName: string | null;
  accountOpeningReason: string | null;
  status: 'Approved' | 'Rejected' | 'Pending' | string;
  workspaces: Workspace[];
  last_updated: string;
};

export type SKU = {
  uuid: string;
  event_start: string;
  event_end: string;
  item: string;
  workspace: string;
  quantity: number;
  user?: string;
};

export type SKUDefinition = {
  uuid: string;
  sku: string;
  name: string;
  unit: string;
};
