export type Workspace = {
  id: string;
  name: string;
  account: string;
  member_group: string;
  status: string;
  stores: Store[];
  last_updated: string;
};

type Store = {
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
  fs_id: string;
};

export type Account = {
  id: string;
  name: string;
  accountOwner: string;
  workspaces: Workspace[];
};
