import express, { Request, Response } from "express";
import { SortOrder } from "mongoose";
import z from "zod";
import { Book } from "../models/book.model";
import { BorrowBook } from "../models/borrow_book.model";

// book router
const bookRouter = express.Router();

// book zod validation
const CreateBookZodSchema = z.object({
  title: z.string(),
  author: z.string(),
  genre: z.string(),
  isbn: z.string(),
  description: z.string().optional(),
  copies: z.number(),
  available: z.boolean(),
});

//1. create a book
bookRouter.post("/books", async (req: Request, res: Response) => {
  try {
    // validate data using zod
    const validatedBook = await CreateBookZodSchema.parseAsync(req.body);

    // save data to mongoDB
    const data = await Book.create(validatedBook);

    // response
    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: data,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

// 2. get all books
bookRouter.get("/books", async (req: Request, res: Response) => {
  //get query values
  const { filter, sortBy, sort, limit } = req.query;

  // filter condition
  const condition = filter ? { genre: filter } : {};

  // flag
  const flagOrder: SortOrder =
    sort === "asc" || sort === "ASC" || sort === "1" ? 1 : -1;

  // sort condition based on flag and filer condition
  const sortCondition: { [key: string]: SortOrder } = {
    [sortBy as string]: flagOrder,
  };

  // LimitNumber condition
  // const limitNumber = limit ? parseInt(limit as string) : 10;

  try {
    const data = await Book.find(condition)
      // .sort(sortCondition)
      // .limit(limitNumber);

    // responses
    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: data,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

// 3. get book by id
bookRouter.get("/books/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;

  try {
    const book = await Book.findById(bookId);

    // response
    res.json({
      success: true,
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

// 4. update book by its id
bookRouter.patch("/books/:bookId", async (req: Request, res: Response) => {
  // get book id
  const bookId = req.params.bookId;

  try {
    // update book with new data
    const updatedBook = await Book.findByIdAndUpdate(bookId, req.body, {
      new: true,
    });

    // response
    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

// 4. delete book by its id
bookRouter.delete("/books/:bookId", async (req: Request, res: Response) => {
  // get book id
  const bookId = req.params.bookId;

  try {
    // update book with new data
    const deleteBook = await Book.findByIdAndDelete(bookId);

    // response
    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

// Borrow book section here

// Zod validation for Borrow Book
const borrowBookZodValidation = z.object({
  book: z.string(),
  quantity: z.number(),
  dueDate: z.string(),
});

// create borrow book
bookRouter.post("/borrow", async (req: Request, res: Response) => {
  try {
    // zod Validation
    const zodBody = borrowBookZodValidation.parse(req.body);
    const { book, quantity, dueDate } = zodBody;

    // find book
    const findedBook = await Book.findById(book);
    if (!findedBook) {
      return res.status(404).json({
        success: false,
        message: "Book Not Found",
      });
    }

    // is available
    if (findedBook.copies < quantity) {
      return res.status(400).json({
        success: false,
        message: "Not Enough Copies!!",
      });
    }

    // reduce copies
    findedBook.copies -= quantity;

    // If copies 0 then make available false
    if (findedBook.copies === 0) {
      await Book.makeAvailableFalse(findedBook);
    }

    // save book
    await findedBook.save();

    // create borrow book
    const borrowBook = await BorrowBook.create({
      book: findedBook._id,
      quantity,
      dueDate,
    });

    return res.status(200).json({
      success: true,
      message: "Book borrowed successfully",
      data: borrowBook,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Borrowing Failed",
      error: error.message || error,
    });
  }
});

// borrowed book summary
bookRouter.get("/borrow", async (req: Request, res: Response) => {
  try {
    const result = await BorrowBook.aggregate([
      {
        // group borrowedBook using book ID
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        // get book using book _id from books collection ans save as bookInfo 
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookInfo",
        },
      },
      // convert array of object to object
      { $unwind: "$bookInfo" },
      {
        // show using this format 
        $project: {
          _id: 0, // 0 means remove it 
          totalQuantity: 1, // 1 means keep it 
          book: {
            title: "$bookInfo.title",
            isbn: "$bookInfo.isbn",
          },
        },
      },
    ]);
    

    res.status(200).json({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data: result,
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch borrowed books summary",
      error: error.message,
    });
  }

});

export default bookRouter;
