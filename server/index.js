import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/dbConnect.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import projectRoutes from "./routes/projectRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import purchaseProjectRoute from "./routes/projectPurchaseRoute.js";


dotenv.config({});

// Connect to the database
connectDB();

const app = express();

// Middleware to parse JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

// const requestLogger = (req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//   next(); // Pass control to the next middleware
// };

// app.use(requestLogger);


app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/purchase",purchaseProjectRoute);

const PORT = process.env.PORT || 8010;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
