import { Router } from "express";
import authRoutes from "./auth.routes.js";
import productRoutes from "./product.routes.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Viral Market API v1" });
});

router.use("/auth", authRoutes);
router.use("/products", productRoutes);

export default router;
