export type Gender = 'male' | 'female' | 'other';

export interface Entry {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  email: string;
  acceptedTnC: true;
  imageBase64?: string;
  country: string;
  source: 'uncontrolled' | 'rhf';
  createdAt: number;
}
