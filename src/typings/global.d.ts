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
}
