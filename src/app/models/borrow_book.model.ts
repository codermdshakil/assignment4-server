import mongoose, { model, Schema } from "mongoose";
import { IBorrowBook } from "../interface/borrow_book.interface";

const borrowBookSchema = new Schema<IBorrowBook>(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


// after borrowing a Book 
borrowBookSchema.post("save", async function(doc) {
  console.log(`Book borrowed: ${doc.book} quantity: ${doc.quantity}`);
});


export const BorrowBook = model("BorrowBook", borrowBookSchema);
