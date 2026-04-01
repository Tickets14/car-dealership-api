import { Router } from "express";

const placeholder = Router();
placeholder.all("*", (_req, res) => {
  res.json({ message: "auth middleware placeholder" });
});

export default placeholder;
