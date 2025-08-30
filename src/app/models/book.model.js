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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    genre: {
        type: String,
        required: true,
        uppercase: true,
        enum: [
            "FICTION",
            "NON-FICTION",
            "SCIENCE",
            "HISTORY",
            "BIOGRAPHY",
            "FANTASY",
        ],
    },
    isbn: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        trim: true,
    },
    copies: {
        type: Number,
        required: true,
        min: [0, "Copies must be a positive number"],
        validate: {
            validator: function (value) {
                return value >= 0;
            },
            message: "Copies must be a positive number",
        },
    },
    available: {
        type: Boolean,
        default: true,
    },
}, {
    versionKey: false,
    timestamps: true,
});
// using static method make available false if copies === 0
bookSchema.static("makeAvailableFalse", function makeAvailableFalse(book) {
    return __awaiter(this, void 0, void 0, function* () {
        book.available = false;
    });
});
// implement pre save hook
bookSchema.pre("save", function (next) {
    if (this.copies < 0) {
        console.log('Copies must be Non-negative Integer Number!');
        return next(new Error("Copies must be non-negative"));
    }
    next();
});
// post save hook
bookSchema.post("save", function (doc) {
    console.log(`Book titled '${doc.title}' Successfully Created!`);
});
exports.Book = (0, mongoose_1.model)("Book", bookSchema);
