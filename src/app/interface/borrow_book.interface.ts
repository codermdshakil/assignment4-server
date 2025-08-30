import mongoose from "mongoose";

export interface IBorrowBook {
  book: mongoose.Schema.Types.ObjectId;
  quantity: number;
  dueDate: string;
}
