export {};

declare global {
  type Person = {
    firstName: string;
    surname: string;
    dob?: Date;
  };

  type DataHubToken = {
    id: string;
    user_id: string;
    token: string;
  };

  type S3Credentials = {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken: string;
    expiration: string;
  };
}

export type Account = {
  id: string;
  name: string;
  accountOwner: string;
  workspaces: Workspace[];
};

export type Workspace = {
  id: string;
  name: string;
  account: string;
  status: string;
  stores: Store[];
  last_updated: string;
};

type Store = {
  object: StoreObject[];
  block: Block[];
};

type StoreObject = {
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
