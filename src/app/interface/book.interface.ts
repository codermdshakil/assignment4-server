import { Model } from "mongoose";

export interface IBook {
  title: string;
  author: string;
  genre:
    | "FICTION"
    | "NON-FICTION"
    | "SCIENCE"
    | "HISTORY"
    | "BIOGRAPHY"
    | "FANTASY";
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
}

// Static method
export interface UserStaticMethod extends Model<IBook> {
  makeAvailableFalse(book: object): void;
}
