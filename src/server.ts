import mongoose from "mongoose";
import app from "./app";

let server;

const PORT = 5000;

const main = async () => {
  try {

    await mongoose.connect("mongodb+srv://mongodb:mongodb@cluster0.qo2wzoe.mongodb.net/assignment3?retryWrites=true&w=majority&appName=Cluster0");
    console.log("Connected to Mongodb!");
    
    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    
  } catch (error) {

    console.log(error);

  }
};

main();
