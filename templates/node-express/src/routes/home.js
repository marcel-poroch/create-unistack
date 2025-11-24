import express from "express";
import { getHomeMessage } from "../services/homeService.js";

const router = express.Router();

router.get("/", (req, res) => {
  const message = getHomeMessage();
  res.json({ message });
});

export default router;
