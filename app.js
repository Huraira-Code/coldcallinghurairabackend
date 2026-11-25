import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import connectDB from "./config/database.js";

import campaignRoute from "./routes/campaignRoutes.js";
import categoryRoute from "./routes/categoryRoutes.js";
import contactRoute from "./routes/contactRoutes.js";
import userRoute from "./routes/userRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "🚀 POS + CRM Server Running"
    });
});

app.use("/api/campaign", campaignRoute);
app.use("/api/category", categoryRoute);
app.use("/api/contact", contactRoute);
app.use("/api/user", userRoute);

// Connect DB
await connectDB();

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://192.168.0.39:${PORT}`);
});

export default app;