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
    workspace: string;
    name: string;
    scope: string;
    created: string;
    expiry: string;
  };

  type CreateDataHubToken = {
    name: string;
    scope: string;
    expires: int;
  };

  type S3Credentials = {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken: string;
    expiration: string;
  };
}
