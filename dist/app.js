"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const book_controller_1 = __importDefault(require("./app/controllers/book.controller"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api", book_controller_1.default);
app.get("/", (req, res) => {
    res.send("Hello world");
});
app.get("/health", (req, res) => {
    res.send("OK!");
});
// Allow requests from your frontend
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // allow only frontend
    credentials: true
}));
// 404 page error handle
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found!" });
});
// global error handler
app.use((error, req, res, next) => {
    if (error) {
        res.status(400).json({ message: "Something want wrong!", error: error });
    }
});
exports.default = app;
