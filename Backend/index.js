const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const Routes = require("./routes/index.js"); // <-- FIX: Import the new main router
const errorHandler = require("./middleware/errorHandler.js"); // <-- FIX: Import global error handler

const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json({ limit: '10mb' }));

// FIX: Configure CORS for your specific frontend
const corsOptions = {
  origin: 'http://localhost:8080', // From your frontend vite.config.ts
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));

// FIX: Remove deprecated Mongoose options
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("NOT CONNECTED TO NETWORK", err));

// Use the new main router
app.use('/', Routes);

// FIX: Add the global error handler as the LAST middleware
// This must be after app.use('/', Routes);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server started at port no. ${PORT}`);
});