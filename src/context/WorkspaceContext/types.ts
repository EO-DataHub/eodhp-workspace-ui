export type Workspace = {
  id: string;
  name: string;
  account: string;
  member_group: string;
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
  name: string;
  accountOwner: string;
  workspaces: Workspace[];
  last_updated: string;
};
