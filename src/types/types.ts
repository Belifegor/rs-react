export type Gender = 'male' | 'female';

export interface User {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  email: string;
  acceptedTnC: boolean;
  imageBase64: string;
  country: string;
  source: 'uncontrolled' | 'rhf';
}
