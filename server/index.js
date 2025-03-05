import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/dbConnect.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import projectRoutes from "./routes/projectRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import purchaseProjectRoute from "./routes/projectPurchaseRoute.js";
import path from "path";

dotenv.config({});

// Connect to the database
connectDB();

const app = express();

const __dirname = path.resolve();


// Middleware to parse JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin:"https://digitalstore-p5is.onrender.com",
    credentials:true
}));

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/purchase",purchaseProjectRoute);

app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
