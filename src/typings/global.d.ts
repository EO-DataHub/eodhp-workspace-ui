export {};

declare global {
  type Person = {
    firstName: string;
    surname: string;
    dob?: Date;
  };
}
