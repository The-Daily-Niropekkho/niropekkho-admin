export interface Contact {
  id?: string;
  editor_name: string;
  content: string;
  address: string;
  phone: string;
  phoneTwo: string;
  email: string;
  website: string;
  latitude?: number;
  longitude?: number;
  map?: string;
  rights?: string;
}