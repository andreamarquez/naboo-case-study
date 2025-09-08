export interface City {
  nom: string;
  code: string;
  departement?: {
    nom: string;
    code: string;
  };
  population?: number;
}
