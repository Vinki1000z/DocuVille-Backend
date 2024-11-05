const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const fs = require("fs/promises");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");

// Create an Express application
const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: '*', // Allow requests from any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
  })
);


app.use(express.json({ limit: "10mb" })); // Use Express's built-in method directly
app.use(express.urlencoded({ limit: "10mb", extended: true })); // Use Express's built-in method directly

// mongoose connection
mongoose
  .connect("mongodb+srv://vikrantchauhancf2021:OSHT62ec2XkLTbKl@docuville.obwio.mongodb.net/?retryWrites=true&w=majority&appName=DocuVille")
  .then(() => console.log("MongoDB connected directly"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));


// Route
console.log("here before")
const userRoutes = require("./routes/userRoute"); // No need for .js extension
const docRoutes = require("./routes/docRoute"); // No need for .js extension
console.log("here after");
app.get("/", (req, res) => {
  res.send("Hello there");
});

app.use("/api", userRoutes);
app.use("/api/doc", docRoutes);

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
server.setTimeout(60000);
