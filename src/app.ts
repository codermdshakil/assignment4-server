import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from "express";
import bookRouter from "./app/controllers/book.controller";


const app: Application = express();
app.use(express.json());

app.use("/api", bookRouter);


app.get("/", (req: Request, res: Response) => {
  res.send("Hello world, from  library management API");
});

app.get("/health", (req: Request, res: Response) => {
  res.send("OK!");
});

// Allow requests from your frontend
app.use(cors({
  origin: "http://localhost:5173",   // allow only frontend
  credentials: true
}));


// 404 page error handle
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Route not found!" });
});

// global error handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error) {
    res.status(400).json({ message: "Something want wrong!", error:error });
  }
});

export default app;
