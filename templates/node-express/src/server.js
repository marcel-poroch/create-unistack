import express from "express";
import homeRoutes from "./routes/home.js";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/", homeRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

