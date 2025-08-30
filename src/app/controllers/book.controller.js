"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = __importDefault(require("zod"));
const book_model_1 = require("../models/book.model");
const borrow_book_model_1 = require("../models/borrow_book.model");
// book router
const bookRouter = express_1.default.Router();
// book zod validation
const CreateBookZodSchema = zod_1.default.object({
    title: zod_1.default.string(),
    author: zod_1.default.string(),
    genre: zod_1.default.string(),
    isbn: zod_1.default.string(),
    description: zod_1.default.string().optional(),
    copies: zod_1.default.number(),
    available: zod_1.default.boolean(),
});
//1. create a book
bookRouter.post("/books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validate data using zod
        const validatedBook = yield CreateBookZodSchema.parseAsync(req.body);
        // save data to mongoDB
        const data = yield book_model_1.Book.create(validatedBook);
        // response
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: data,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
            error,
        });
    }
}));
// 2. get all books
bookRouter.get("/books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //get query values
    const { filter, sortBy, sort, limit } = req.query;
    // filter condition
    const condition = filter ? { genre: filter } : {};
    // flag
    const flagOrder = sort === "asc" || sort === "ASC" || sort === "1" ? 1 : -1;
    // sort condition based on flag and filer condition
    const sortCondition = {
        [sortBy]: flagOrder,
    };
    // LimitNumber condition
    const limitNumber = limit ? parseInt(limit) : 10;
    try {
        const data = yield book_model_1.Book.find(condition)
            .sort(sortCondition)
            .limit(limitNumber);
        // responses
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: data,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
            error,
        });
    }
}));
// 3. get book by id
bookRouter.get("/books/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    try {
        const book = yield book_model_1.Book.findById(bookId);
        // response
        res.json({
            success: true,
            message: "Book retrieved successfully",
            data: book,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
            error,
        });
    }
}));
// 4. update book by its id
bookRouter.patch("/books/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get book id
    const bookId = req.params.bookId;
    try {
        // update book with new data
        const updatedBook = yield book_model_1.Book.findByIdAndUpdate(bookId, req.body, {
            new: true,
        });
        // response
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: updatedBook,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
            error,
        });
    }
}));
// 4. delete book by its id
bookRouter.delete("/books/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get book id
    const bookId = req.params.bookId;
    try {
        // update book with new data
        const deleteBook = yield book_model_1.Book.findByIdAndDelete(bookId);
        // response
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
            error,
        });
    }
}));
// Borrow book section here
// Zod validation for Borrow Book
const borrowBookZodValidation = zod_1.default.object({
    book: zod_1.default.string(),
    quantity: zod_1.default.number(),
    dueDate: zod_1.default.string(),
});
// create borrow book
bookRouter.post("/borrow", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // zod Validation
        const zodBody = borrowBookZodValidation.parse(req.body);
        const { book, quantity, dueDate } = zodBody;
        // find book
        const findedBook = yield book_model_1.Book.findById(book);
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
            yield book_model_1.Book.makeAvailableFalse(findedBook);
        }
        // save book
        yield findedBook.save();
        // create borrow book
        const borrowBook = yield borrow_book_model_1.BorrowBook.create({
            book: findedBook._id,
            quantity,
            dueDate,
        });
        return res.status(200).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrowBook,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Borrowing Failed",
            error: error.message || error,
        });
    }
}));
// borrowed book summary
bookRouter.get("/borrow", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield borrow_book_model_1.BorrowBook.aggregate([
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch borrowed books summary",
            error: error.message,
        });
    }
}));
exports.default = bookRouter;
