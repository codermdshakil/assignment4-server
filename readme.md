# Library Management API

A Library Management System REST API built with **Express**, **TypeScript**, and **MongoDB (Mongoose)**.

---

## Features

- CRUD operations for books with schema validation
- Borrowing books with availability control and business logic
- Filtering, sorting, and pagination support on book listing
- Aggregated summary of borrowed books using MongoDB aggregation pipeline
- Mongoose static/instance methods and middleware hooks (pre/post save)
- Error handling with clear and consistent response format
- Written fully in TypeScript for type safety


## Tech Stack

- Express.js

- TypeScript

- Mongoose & MongoDB

- Zod for validation



## Setup Instructions

1. **Clone the repository**

```bash
git clone git remote add origin https://github.com/codermdshakil/B2A3.git
```
2. **Switch to project**
```bash
cd B2A3
```

3. **Install dependencies**
```bash
npm install
```

## Credensials
```bash
MONGODB_URI=mongodb+srv://mongodb:mongodb@cluster0.qo2wzoe.mongodb.net/todosDB?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
Server will run on PORT: http://localhost:5000/
```

4. **Start Server**
```bash
npm run dev
```



## API Endpoints

### Books

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/books` | Create a new book |
| GET | `/api/books` | Get list of books with filtering, sorting, limit (query params) |
| GET | `/api/books/:bookId` | Get book by ID |
| PATCH | `/api/books/:bookId` | Update book details |
| DELETE | `/api/books/:bookId` | Delete a book |

### Query Parameters for GET /api/books

- `filter`: Filter by genre (e.g., `SCIENCE`, `FANTASY`)
- `sortBy`: Field to sort by (default: `createdAt`)
- `sort`: `asc` or `desc` (default: `asc`)
- `limit`: Number of results to return (default: 10)

---

### Borrowing

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/borrow` | Borrow a book (with business logic enforcement) |
| GET | `/api/borrow` | Get borrowed books summary with total quantity and book details (aggregation) |



## Live Demo

[🔗 Live API Link](https://b2-a3-server.vercel.app/)

## Video Walkthrough

[🎥 Watch Video Demo](https://your-public-video-link.com)

## 🙏 Acknowledgments

- Instructor: Rabi Bhai
- Senior Mentor Programming Hero
